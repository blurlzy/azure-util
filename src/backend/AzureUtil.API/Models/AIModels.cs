using System.Text.Json.Serialization;

namespace AzureUtil.API.Models
{
     public class AIModelsResponse
     {
          public IReadOnlyList<ModelInformation> Value { get; set; } = Array.Empty<ModelInformation>();
     }

     public class ModelInformation
     {
          // public string Id { get; set; } = string.Empty;
          public string Name { get; set; } = string.Empty;
          public string Type { get; set; } = string.Empty;
          public string Location { get; set; } = string.Empty;
          public string Kind { get; set; } = string.Empty;
          public string SkuName { get; set; } = string.Empty;

          public AIModel Model { get; set; } = new();
     }

     public sealed class AIModel
     {
          public string Format { get; set; } = string.Empty;

          public string Name { get; set; } = string.Empty;

          public string Version { get; set; } = string.Empty;

          public bool IsDefaultVersion { get; set; }

          public List<ModelSku> Skus { get; set; } = new();

          public int MaxCapacity { get; set; }

          public ModelCapabilities Capabilities { get; set; } = new();

          public ModelDeprecation Deprecation { get; set; } = new();

          public string LifecycleStatus { get; set; } = string.Empty;

          public SystemData SystemData { get; set; } = new();
     }

     public sealed class ModelSku
     {
          [JsonPropertyName("name")]
          public string Name { get; set; } = string.Empty;

          [JsonPropertyName("usageName")]
          public string UsageName { get; set; } = string.Empty;

          [JsonPropertyName("capacity")]
          public ModelCapacity Capacity { get; set; } = new();

          [JsonPropertyName("deprecationDate")]
          public DateTimeOffset? DeprecationDate { get; set; }

          [JsonPropertyName("rateLimits")]
          public List<RateLimit> RateLimits { get; set; } = new();
     }

     public sealed class ModelCapacity
     {
          public int Maximum { get; set; }

          public int Default { get; set; }
     }

     public sealed class RateLimit
     {
          public string Key { get; set; } = string.Empty;

          public int RenewalPeriod { get; set; }

          public int Count { get; set; }
     }

     public sealed class ModelCapabilities
     {
          // kept as string because ARM sometimes returns "true"/"false" as strings
          public string Inference { get; set; } = string.Empty;

          public string ImageGenerations { get; set; } = string.Empty;
     }

     public sealed class ModelDeprecation
     {
          public DateTimeOffset? Inference { get; set; }
     }

     public sealed class SystemData
     {
          public string CreatedBy { get; set; } = string.Empty;

          public DateTimeOffset CreatedAt { get; set; }

          public string LastModifiedBy { get; set; } = string.Empty;

          public DateTimeOffset LastModifiedAt { get; set; }
     }
}
