namespace AzureUtil.API.Config
{
     public static class SecretKeys
     {
          // Prerequisites - Azure REST API Credentials
          //public const string TenantId = "ZLTenantId";
          //public const string SubscriptionId = "ZLSubscriptionId";
          //public const string ClientId = "ZLAzureRestClientId";
          //public const string ClientSecret = "ZLAzureRestClientSecret";

          public const string TenantId = "MSTenantId";
          public const string SubscriptionId = "MSSubscriptionId";
          public const string ClientId = "MSAzureRestClientId";
          public const string ClientSecret = "MSAzureRestClientSecret";

          // app insights
          public const string AppInsightsConnString = "ZLAppInsights";
     }
}
