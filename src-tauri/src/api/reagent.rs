use axum::Router;
use axum::extract::{Json, Path, Query, State};
use axum::routing::{delete, get, post, put};

use serde::{Deserialize, Serialize};

use sea_orm::entity::prelude::*;
use sea_orm::{ActiveValue, FromQueryResult};

use crate::common::page::{Page, PaginationParams};
use crate::common::response::ApiResponse;
use crate::common::result::ApiError;
use crate::common::result::ApiResult;
use crate::common::state::AppState;

use crate::entity::prelude::Reagents;
use crate::entity::reagents::{self, ActiveModel as ReagentActivateModel, Model};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AddReagentBody {
    chem_lab: String,
    chem_name: String,
    reagent_num: i64,
    chem_cas: Option<String>,
    stock: i64,
    producer: Option<String>,

    cabinet: Option<String>,
    place: Option<String>,

    mfg_date: Option<String>,
    unit: String,
    msds_url: Option<String>,
    other: Option<String>,
}

async fn add_reagent(
    State(AppState { db }): State<AppState>,
    Json(body): Json<AddReagentBody>,
) -> ApiResult<ApiResponse<Model>> {
    let id = xid::new().to_string();
    let reagent = ReagentActivateModel {
        id: ActiveValue::set(id.clone()),
        chem_lab: ActiveValue::set(body.chem_lab),
        chem_name: ActiveValue::set(body.chem_name),
        chem_cas: ActiveValue::set(body.chem_cas),
        reagent_num: ActiveValue::set(body.reagent_num),
        stock: ActiveValue::set(body.stock),
        producer: ActiveValue::set(body.producer),
        place: ActiveValue::set(body.place),
        cabinet: ActiveValue::set(body.cabinet),
        mfg_date: ActiveValue::set(body.mfg_date),
        msds_url: ActiveValue::set(body.msds_url),
        unit: ActiveValue::set(body.unit),
        other: ActiveValue::set(body.other),
        ..Default::default()
    };

    match reagent.insert(&db).await {
        Ok(_) => {
            let reagent = Reagents::find_by_id(id).one(&db).await.unwrap();
            if let Some(reagent) = reagent {
                Ok(ApiResponse::ok("ok", Some(reagent)))
            } else {
                Err(ApiError::Biz("添加试剂失败".into()))
            }
        }
        Err(e) => Err(ApiError::Biz(format!("添加试剂失败: {}", e))),
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GetReagentQuery {
    #[serde(flatten)]
    pagination: PaginationParams,
}

#[derive(Debug, Serialize, DerivePartialModel, FromQueryResult)]
#[sea_orm(entity = "reagents::Entity")]
#[serde(rename_all = "camelCase")]
struct GetReagentResponse {
    id: String,
    chem_lab: String,
    chem_name: String,
    chem_cas: Option<String>,
    reagent_num: i64,
    stock: i64,
    producer: Option<String>,
    place: Option<String>,
    cabinet: Option<String>,
    msds_url: Option<String>,
    mfg_date: Option<String>,
    unit: String,
    other: Option<String>,
}

async fn get_reagent(
    State(AppState { db }): State<AppState>,
    Query(GetReagentQuery { pagination }): Query<GetReagentQuery>,
) -> ApiResult<ApiResponse<Page<GetReagentResponse>>> {
    let paginator = Reagents::find()
        .filter(reagents::Column::Status.eq(1))
        .into_partial_model::<GetReagentResponse>()
        .paginate(&db, pagination.size);
    let total = paginator.num_items().await?;

    match paginator.fetch_page(pagination.page - 1).await {
        Ok(reagents) => {
            let page = Page::from_pagination(pagination, total, reagents);
            Ok(ApiResponse::ok("获取试剂列表成功", Some(page)))
        }
        Err(e) => Err(ApiError::Biz(format!("获取试剂列表失败: {}", e))),
    }
}

async fn delete_reagent(
    State(AppState { db }): State<AppState>,
    Path(id): Path<String>,
) -> ApiResult<ApiResponse<Model>> {
    let reagent = Reagents::find_by_id(id).one(&db).await.unwrap();

    if let Some(reagent) = reagent {
        reagent.delete(&db).await.unwrap();
        Ok(ApiResponse::ok("删除试剂信息成功", None))
    } else {
        Err(ApiError::Biz("试剂不存在".into()))
    }
}

// {
//     "status": "1",
//     "chemName": "",
//     "chemCas": "108-90-7",
//     "chemEnglishName": "",
//     "isFuzzy": "1",
//     "page": {
//         "current": "1",
//         "size": 10
//     }
// }

pub fn create_reagent_router() -> Router<AppState> {
    Router::new()
        .route("/base", post(add_reagent))
        .route("/base", get(get_reagent))
        .route("/base/{id}", delete(delete_reagent))
}
