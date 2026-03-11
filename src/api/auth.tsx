import { fetch } from "@mcitem/tauri-plugin-axum/fetch";

import {
  ApiBody,
  ApiUrl,
  Method,
  UrlBuilder,
  apiHeaders,
  getResponseJson,
} from "@/api/common";

import { ApiResponseSchema } from "@/schema/common";
import { GetTokenResponseSchema, GetTokenSchema } from "@/schema/auth";

const authUrl = ApiUrl.AuthUrl;

const getToken = async (data: GetTokenSchema) => {
  const url = new UrlBuilder(authUrl).endpint("/login").build();
  const method = Method.POST;
  const body = new ApiBody({ ...data }).toJson();
  const headers = apiHeaders();

  const response = await fetch(url, { method, headers, body });

  if (!response) {
    throw new Error("获取Token失败!");
  }

  const apiResponse =
    await getResponseJson<ApiResponseSchema<GetTokenResponseSchema>>(response);

  return apiResponse.data;
};

const getUserInfo = async (token: string) => {
  const url = new UrlBuilder(authUrl).endpint("user_info").build();
  const method = Method.GET;
  const headers = { Authorization: "Bearer " + token };

  const response = await fetch(url, { method, headers });

  if (!response.ok) throw new Error("获取用户信息失败！");

  const apiResponse = await response.json();

  if (!apiResponse.data.accessToken) return null;

  return apiResponse.data;
};

export { getToken, getUserInfo };
