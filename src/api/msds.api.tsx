import { ApiResponseSchema } from "@/schema/common";
import { ChemInfoSchema } from "@/schema/msds.schema";

import { fetch } from "@mcitem/tauri-plugin-axum/fetch";

const msds_url = "/api/msds";

const getChemInfo = async (chemCas: string) => {
  const url = msds_url + "/chem";
  const method = "POST";
  const body = JSON.stringify({ chemCas });
  const headers = { "Content-Type": "application/json" };

  const response = await fetch(url, { method, body, headers });

  if (!response.ok) {
    throw new Error("获取化学品别名失败！");
  }

  const apiResponse: ApiResponseSchema<ChemInfoSchema> = await response.json();

  return apiResponse.data.obj;
};

export { getChemInfo };
