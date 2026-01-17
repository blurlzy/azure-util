namespace AzureUtil.API.Config
{
     public static class SecretKeys
     {
          // Prerequisites - Azure REST API Credentials
          public const string TenantId = "ZLTenantId";
          public const string SubscriptionId = "ZLSubscriptionId";
          public const string ClientId = "ZLAzureRestClientId";
          public const string ClientSecret = "ZLAzureRestClientSecret";

          // app insights
          public const string AppInsightsConnString = "ZLAppInsights";
     }
}
