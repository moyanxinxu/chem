use sea_orm::Database;
use sea_orm::DatabaseConnection;

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
}

impl AppState {
    pub fn new(db: DatabaseConnection) -> Self {
        AppState { db }
    }
    pub fn db(&self) -> &DatabaseConnection {
        &self.db
    }
}

pub async fn get_app_state() -> AppState {
    let home_dir = dirs::home_dir().unwrap();
    let db_path = home_dir.join("./chem/chem.db");
    let db = Database::connect("sqlite://".to_string() + db_path.to_str().unwrap()).await.unwrap();

    AppState::new(db)
}
