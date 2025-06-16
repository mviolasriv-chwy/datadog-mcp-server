import { client, v2 } from "@datadog/datadog-api-client";

type GetTracesParams = {
  q?: string;
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
                from: "now-15m",
                query: queryStr,
                to: "now",
              },
              options: {
                timezone: "GMT",
              },
              page: {
                limit: 25,
              },
              sort: "timestamp",
            },
            type: "search_request",
          },
        },
      };

      const response = await apiInstance.listSpans(apiParams);
      return response;
    } catch (error) {
      console.error("Error fetching traces:", error);
      throw error;
    }
  }
};
