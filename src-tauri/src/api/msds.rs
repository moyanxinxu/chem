use axum::Router;
use axum::extract::{Json, Query};
use axum::routing::post;
use reqwest;

use serde::Deserialize;

use crate::common::response::ApiResponse;
use crate::common::result::ApiResult;
use crate::common::state::AppState;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GetChemAlisaBody {
    chem_cas: String,
}

// 从国家危险化学品目录查询化学品信息
async fn get_chem_name_by_cas(
    Json(GetChemAlisaBody { chem_cas }): Json<GetChemAlisaBody>,
) -> ApiResult<ApiResponse<serde_json::Value>> {
    let url = "https://whpdj.mem.gov.cn/internet/common/chemical/queryChemicalList";

    let payload = serde_json::json!({
      // "status": "1",
      // "chemName": "",
      "chemCas": chem_cas,
      // "chemEnglishName": "",
      // "isFuzzy": "0",
      // "page": serde_json::json!({
      //   "current": "1",
      //   "size": 10
      // })
    });

    let client = reqwest::Client::new();
    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert("content-type", "application/json".parse().unwrap());

    let response = client
        .post(url)
        .headers(headers)
        .json(&payload)
        .send()
        .await;

    let results = response.unwrap().json::<serde_json::Value>().await.unwrap();

    Ok(ApiResponse::ok("获取化学品名称成功", Some(results)))
}

pub fn create_msds_router() -> Router<AppState> {
    Router::new().route("/chem", post(get_chem_name_by_cas))
}
