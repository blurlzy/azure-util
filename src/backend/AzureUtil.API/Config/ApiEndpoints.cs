

namespace AzureUtil.API.Config
{
     // Azure REST API Endpoints
     public static class ApiEndpoints
     {
          public const string HttpClientName = "AzureRestClient";

          public const string RootEndpoint = "https://management.azure.com";

          public const string ListRegions = RootEndpoint + "/subscriptions/{0}/locations?api-version=2022-12-01";
          public const string ListAIModels = RootEndpoint + "/subscriptions/{0}/providers/Microsoft.CognitiveServices/locations/{1}/models?api-version=2025-06-01";
     }
}
