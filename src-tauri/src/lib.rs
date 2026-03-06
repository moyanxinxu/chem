use crate::common::state::get_app_state;
use crate::api::create_overall_router;

mod api;
mod common;
mod entity;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let state = get_app_state().await;
    let router = create_overall_router().with_state(state);

    tauri::Builder
        ::default()
        .plugin(tauri_plugin_axum::init(router))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
