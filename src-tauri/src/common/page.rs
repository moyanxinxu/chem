use serde::{Deserialize, Serialize};
use std::fmt::Display;
use std::str::FromStr;

#[derive(Deserialize)]
#[serde(untagged)]
enum StringOrNumber<T> {
    String(String),
    Number(T),
}

fn deserialize_number<'de, T, D>(deserializer: D) -> Result<T, D::Error>
where
    T: FromStr + Deserialize<'de>,
    T::Err: Display,
    D: serde::Deserializer<'de>,
{
    match StringOrNumber::deserialize(deserializer)? {
        StringOrNumber::String(s) => s.parse().map_err(serde::de::Error::custom),
        StringOrNumber::Number(n) => Ok(n),
    }
}

fn default_page() -> u64 {
    return 1;
}

fn default_size() -> u64 {
    return 30;
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page", deserialize_with = "deserialize_number")]
    pub page: u64,

    #[serde(default = "default_size", deserialize_with = "deserialize_number")]
    pub size: u64,
}

#[derive(Debug, Serialize)]
pub struct Page<T> {
    pub page: u64,
    pub size: u64,
    pub total: u64,
    pub items: Vec<T>,
}

impl<T> Page<T> {
    pub fn new(page: u64, size: u64, total: u64, items: Vec<T>) -> Self {
        Self {
            page,
            size,
            total,
            items,
        }
    }

    pub fn from_pagination(pagination: PaginationParams, total: u64, items: Vec<T>) -> Self {
        Self::new(pagination.page, pagination.size, total, items)
    }
}
