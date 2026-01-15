namespace AzureUtil.API.Models
{
     public sealed class AzureOptions
     {
          public string TenantId { get; set; } = "";
          public string SubscriptionId { get; set; } = "";
          public string ClientId { get; set; } = "";
          public string ClientSecret { get; set; } = "";
     }
}
