mod auth;
mod msds;
mod reagent;
mod user;

use crate::api::auth::create_auth_router;
use crate::api::msds::create_msds_router;
use crate::api::reagent::create_reagent_router;
use crate::api::user::create_user_router;

use crate::common::middleware::get_auth_layer;
use crate::common::result::{ApiError, ApiResult};
use crate::common::state::AppState;

use axum::Router;
use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};

pub fn create_overall_router() -> Router<AppState> {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_origin(Any)
        .allow_headers(Any);

    Router::new().nest(
        "/api",
        Router::new()
            .nest("/reagent", create_reagent_router())
            .nest("/msds", create_msds_router())
            .nest("/users", create_user_router())
            .route_layer(get_auth_layer())
            .nest("/auth", create_auth_router())
            .fallback(async || -> ApiResult<()> { Err(ApiError::NotFound) })
            .layer(cors),
    )
}
