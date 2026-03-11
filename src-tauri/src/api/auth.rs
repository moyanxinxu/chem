use axum::extract::{Json, Path, State};
use axum::routing::{get, post};
use axum::{Router, debug_handler};

use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};

use crate::common::auth::{Principal, get_jwt, verify_password};
use crate::common::middleware::get_auth_layer;
use crate::common::response::ApiResponse;
use crate::common::result::{ApiError, ApiResult};
use crate::common::state::AppState;
use crate::entity::prelude::Users;
use crate::entity::users;

#[derive(Debug, Deserialize)]
pub struct LoginParams {
    username: String,
    password: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginResult {
    access_token: String,
}

async fn login(
    State(AppState { db }): State<AppState>,
    Json(params): Json<LoginParams>,
) -> ApiResult<ApiResponse<LoginResult>> {
    let user = Users::find()
        .filter(users::Column::Username.eq(&params.username))
        .one(&db)
        .await?
        .ok_or_else(|| ApiError::Biz(String::from("账号或密码不存在")))?;

    if !verify_password(&params.password, &user.password)? {
        return Err(ApiError::Biz(String::from("账号或密码不正确！")));
    }

    let principal = Principal {
        id: user.id,
        username: user.username,
    };

    let access_token = get_jwt().encode(principal)?;

    Ok(ApiResponse::ok("ok", Some(LoginResult { access_token })))
}

async fn get_user_info() -> ApiResult<ApiResponse<()>> {
    Ok(ApiResponse::ok("ok", None))
}

pub fn create_auth_router() -> Router<AppState> {
    Router::new()
        .route("/user_info", get(get_user_info))
        .route_layer(get_auth_layer())
        .route("/login", post(login))
}
