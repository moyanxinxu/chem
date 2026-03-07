import { fetch } from "@mcitem/tauri-plugin-axum/fetch";
import { ApiResponseSchema, PageSchema } from "@/schema/common";

import {
  ApiBody,
  ApiUrl,
  Method,
  UrlBuilder,
  apiHeaders,
  getResponseJson,
} from "@/api/common";

import {
  DeleteReagentSchema,
  GetReagentsResponseSchema,
  GetReagentsSchema,
  ReagentSchema,
} from "@/schema/reagent.schema";

const reagentUrl = ApiUrl.ReagentUrl;

enum ReagentUrl {
  AddReagent = reagentUrl + "/base",
  GetReagents = reagentUrl + "/base", // ?page={page}&size={size}
  DeleteReagent = reagentUrl + "/base/{id}",
}

const addReagent = async (data: ReagentSchema) => {
  const url = new UrlBuilder(ReagentUrl.AddReagent).build();
  const method = Method.POST;

  const body = new ApiBody({
    ...data,
    stock: Number(data.stock),
    reagentNum: Number(data.reagentNum),
  }).toJson();

  const headers = apiHeaders();

  const response = await fetch(url, { method, headers, body });

  if (!response.ok) {
    throw new Error("添加试剂失败！");
  }

  const apiResponse =
    await getResponseJson<ApiResponseSchema<GetReagentsResponseSchema>>(
      response,
    );
  return apiResponse.data;
};

const getReagents = async (query: GetReagentsSchema) => {
  const url = new UrlBuilder(ReagentUrl.GetReagents).query(query).build();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("获取试剂失败！");
  }

  const apiResponse =
    await getResponseJson<
      ApiResponseSchema<PageSchema<GetReagentsResponseSchema>>
    >(response);
  return apiResponse.data;
};

const deleteReagent = async (query: DeleteReagentSchema) => {
  const url = new UrlBuilder(ReagentUrl.DeleteReagent).path(query).build();

  const method = Method.DELETE;

  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new Error("删除试剂失败！");
  }

  const apiResponse = await getResponseJson<ApiResponseSchema<null>>(response);
  return apiResponse.data;
};

export { addReagent, deleteReagent, getReagents };
