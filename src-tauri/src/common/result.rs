use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};

use super::response::ApiResponse;

pub type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("Not Found")]
    NotFound,
    #[error("数据库异常: {0}")]
    Database(#[from] sea_orm::DbErr),
    #[error("{0}")]
    Biz(String),
    #[error("{0}")]
    Request(#[from] reqwest::Error),
    #[error("错误: {0}")]
    Internal(#[from] anyhow::Error),
    #[error("错误: {0}")]
    JWT(#[from] jsonwebtoken::errors::Error),
    #[error("未授权: {0}")]
    Unauthenticated(String),
    #[error("密码Hash错误: {0}")]
    Bcrypt(#[from] bcrypt::BcryptError),
}

impl ApiError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            ApiError::NotFound => StatusCode::NOT_FOUND,
            ApiError::Biz(_) => StatusCode::OK,
            ApiError::Internal(_) | ApiError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Request(_) => StatusCode::BAD_REQUEST,
            ApiError::JWT(_) | ApiError::Unauthenticated(_) => StatusCode::UNAUTHORIZED,
            ApiError::Bcrypt(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status_code = self.status_code();

        let body = axum::Json(ApiResponse::<()>::err(self.to_string()));

        (status_code, body).into_response()
    }
}

impl From<ApiError> for Response {
    fn from(value: ApiError) -> Self {
        value.into_response()
    }
}
