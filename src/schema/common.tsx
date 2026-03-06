interface pageDataSchema<T> {
  page: number;
  size: number;
  total: number;
  items: T[];
}

export type { pageDataSchema };
