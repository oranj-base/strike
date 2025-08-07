extern crate alloc;

use std::iter::{Skip, Take};

use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Pagination {
    pub page: u32,
    #[serde(rename = "pageSize")]
    pub page_size: u32,
}

#[derive(Clone, Debug, Serialize, CandidType)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub total: u32,
}

pub trait Paginate: Iterator {
    fn paginate(self, params: Pagination) -> Take<Skip<Self>>
    where
        Self: Sized,
    {
        self.skip((params.page.saturating_sub(1) * params.page_size) as usize)
            .take(params.page_size as usize)
    }
}

impl<T> Paginate for T where T: Iterator + ?Sized {}
