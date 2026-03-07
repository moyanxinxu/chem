mod msds;
mod reagent;

use crate::api::msds::create_msds_router;
use crate::api::reagent::create_reagent_router;
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
            // .nest("/missions", create_mission_router())
            // .nest("/logs", create_logs_router())
            // .nest("/events", create_event_router())
            // .nest("/incidents", create_incident_router())
            .fallback(async || -> ApiResult<()> { Err(ApiError::NotFound) })
            .layer(cors),
    )
}
