use crate::common::auth::encode_password;
use crate::common::page::{Page, PaginationParams};
use crate::common::response::ApiResponse;
use crate::common::result::{ApiError, ApiResult};
use crate::common::state::AppState;
use crate::entity::prelude::*;
use crate::entity::users;
use crate::entity::users::{ActiveModel as UserActivateModel, Model as UserModel};

use axum::extract::{Json, Query, State};
use axum::routing::{get, post};
use axum::{Router, debug_handler};
use sea_orm::prelude::*;
use sea_orm::{ActiveValue, QueryOrder};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserQueryParams {
    #[serde(flatten)]
    pagination: PaginationParams,
}

#[debug_handler]
async fn get_users(
    State(AppState { db }): State<AppState>,
    Query(UserQueryParams { pagination }): Query<UserQueryParams>,
) -> ApiResult<ApiResponse<Page<UserModel>>> {
    let paginator = Users::find()
        .order_by_desc(users::Column::Name)
        .paginate(&db, pagination.size);

    let total = paginator.num_items().await?;
    let items = paginator.fetch_page(pagination.page - 1).await?;
    let page = Page::from_pagination(pagination, total, items);

    Ok(ApiResponse::ok("ok", Some(page)))
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserParams {
    pub name: String,
    pub username: String,
    pub password: String,
    #[serde(default)]
    pub enabled: bool,
}

async fn create_user(
    State(AppState { db }): State<AppState>,
    Json(params): Json<UserParams>,
) -> ApiResult<ApiResponse<UserModel>> {
    if params.password.is_empty() {
        return Err(ApiError::Biz(String::from("密码不能为空")));
    }

    let id = xid::new().to_string();

    let user = UserActivateModel {
        id: ActiveValue::Set(id),
        name: ActiveValue::Set(params.name),
        username: ActiveValue::Set(params.username),
        password: ActiveValue::Set(encode_password(&params.password).unwrap()),
        enabled: ActiveValue::Set(params.enabled),
    };

    let result = user.insert(&db).await?;

    Ok(ApiResponse::ok("ok", Some(result)))
}

// #[debug_handler]
// async fn update_user(
//     State(AppState { db }): State<AppState>,
//     Path(id): Path<String>,
//     Json(params): Json<UserParams>,
// ) -> ApiResult<ApiResponse<Model>> {
//     let existed_user = Users::find_by_id(&id)
//         .one(&db)
//         .await?
//         .ok_or_else(|| ApiError::Biz(String::from("待修改的用户不存在")))?;

//     let old_password = existed_user.password.clone();
//     let password = params.password.clone();
//     let mut existed_active_model = existed_user.into_active_model();
//     let mut active_model = params.into_active_model();
//     existed_active_model.clone_from(&active_model);
//     existed_active_model.id = ActiveValue::Unchanged(id);
//     if password.is_empty() {
//         existed_active_model.password = ActiveValue::Unchanged(old_password);
//     } else {
//         existed_active_model.password =
//             ActiveValue::Set(encode_password(&active_model.password.take().unwrap())?);
//     }

//     let result = existed_active_model.update(&db).await?;

//     Ok(ApiResponse::ok("ok", Some(result)))
// }

// #[debug_handler]
// async fn delete(
//     State(AppState { db }): State<AppState>,
//     Path(id): Path<String>,
// ) -> ApiResult<ApiResponse<()>> {
//     let existed_user = SysUser::find_by_id(&id)
//         .one(&db)
//         .await?
//         .ok_or_else(|| ApiError::Biz(String::from("待删除的用户不存在")))?;
//     let result = existed_user.delete(&db).await?;
//     tracing::info!(
//         "Deleted user: {}, affected rows: {}",
//         id,
//         result.rows_affected
//     );

//     Ok(ApiResponse::ok("ok", None))
// }

pub fn create_user_router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_users))
        .route("/", post(create_user))
}
