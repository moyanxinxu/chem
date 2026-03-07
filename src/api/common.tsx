enum ApiUrl {
  ReagentUrl = "/api/reagent",
  MsdsUrl = "/api/msds",
}

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const apiHeaders = () => {
  return { "Content-Type": "application/json" };
};

class ApiBody<T extends object> {
  constructor(private body: T) {}

  toJson(): string {
    return JSON.stringify(this.body);
  }
}

/**
 * 获取响应中的JSON数据
 * @param response fetch请求的响应对象
 * @returns 响应中的JSON数据
 */
const getResponseJson = async <T,>(response: Response): Promise<T> => {
  const apiResponse: T = await response.json();
  return apiResponse;
};

class UrlBuilder {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  query(params: Record<string, unknown> | object): UrlBuilder {
    const urlSearchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        urlSearchParams.append(k, String(v));
      }
    }
    this.url += "?" + urlSearchParams.toString();
    return this;
  }

  path(Parmas: Record<string, unknown> | object): UrlBuilder {
    for (const [key, value] of Object.entries(Parmas)) {
      this.url = this.url.replace(`{${key}}`, String(value));
    }
    return this;
  }

  build(): string {
    return this.url;
  }
}

export { UrlBuilder };
export { ApiBody, ApiUrl, Method };
export { apiHeaders, getResponseJson };
