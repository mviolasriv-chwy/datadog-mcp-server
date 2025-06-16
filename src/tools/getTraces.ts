import { client, v2 } from "@datadog/datadog-api-client";

type GetTracesParams = {
  q?: string;
  from: string;
  to: string;
  limit: number;
};

let configuration: client.Configuration;

export const getTraces = {
  initialize: () => {
    const configOpts = {
      authMethods: {
        apiKeyAuth: process.env.DD_API_KEY,
        appKeyAuth: process.env.DD_APP_KEY
      }
    };

    configuration = client.createConfiguration(configOpts);

    if (process.env.DD_METRICS_SITE) {
      configuration.setServerVariables({
        site: process.env.DD_METRICS_SITE
      });
    }
  },

  execute: async (params: GetTracesParams) => {
    try {
      const { q } = params;

      const apiInstance = new v2.SpansApi(configuration);

      const queryStr = q || "*";

      const apiParams: v2.SpansApiListSpansRequest = {
        body: {
          data: {
            attributes: {
              filter: {
                from: params.from,
                query: queryStr,
                to: params.to,
              },
              options: {
                timezone: "GMT",
              },
              page: {
                limit: params.limit,
              },
              sort: "timestamp",
            },
            type: "search_request",
          },
        },
      };

      console.log("Error fetching traces:", apiParams);
      
      const response = await apiInstance.listSpans(apiParams);
      return response;
    } catch (error) {
      console.error("Error fetching traces:", error);
      throw error;
    }
  }
};
