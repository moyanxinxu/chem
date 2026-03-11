interface GetTokenSchema {
  username: string;
  password: string;
}

interface GetTokenResponseSchema {
  accessToken: string;
}

export type { GetTokenSchema, GetTokenResponseSchema };
