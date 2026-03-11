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
import { ChemInfoSchema } from "@/schema/msds.schema";

const msdsUrl = ApiUrl.MsdsUrl;

const getChemInfo = async (chemCas: string) => {
  const url = new UrlBuilder(msdsUrl).endpint("/chem").build();
  

  const method = Method.POST;
  const body = new ApiBody({ chemCas }).toJson();
  const headers = apiHeaders();
  const response = await fetch(url, { method, body, headers });

  if (!response.ok) {
    throw new Error("获取化学品别名失败！");
  }

  const apiResponse =
    await getResponseJson<ApiResponseSchema<ChemInfoSchema>>(response);

  return apiResponse.data.obj;
};

export { getChemInfo };
