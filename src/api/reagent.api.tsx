import { fetch } from "@/api/common";
import { pageDataSchema } from "@/schema/common";
import {
  createReagentSchema,
  getReagentsResponseSchema,
  getReagentsSchema,
} from "@/schema/reagent.schema";

const reagent_url = "/api/reagent";

const addReagent = async (data: createReagentSchema) => {
  const url = reagent_url + "/base";

  const method = "POST";
  const body = JSON.stringify(data);
  const headers = { "Content-Type": "application/json" };

  const response = await fetch(url, { method, headers, body });

  if (!response.ok) {
    throw new Error("添加试剂失败！");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};

const getReagents = async (
  query: getReagentsSchema,
): Promise<pageDataSchema<getReagentsResponseSchema>> => {
  const url = reagent_url + "/base?" + `page=${query.page}&size=${query.size}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("获取试剂失败！");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};

const deleteReagent = async (id: string) => {
  const url = reagent_url + `/base/${id}`;
  const method = "DELETE";

  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new Error("删除试剂失败！");
  }

  const apiResponse = await response.json();
  return apiResponse.data;
};

export { addReagent, getReagents, deleteReagent };
