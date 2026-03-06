interface PageDataSchema<T> {
  page: number;
  size: number;
  total: number;
  items: T[];
}

interface ApiResponseSchema<T> {
  code: number;
  message: string;
  data: T;
}

export type { PageDataSchema, ApiResponseSchema };
