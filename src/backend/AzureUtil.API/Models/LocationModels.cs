namespace AzureUtil.API.Models
{
     public sealed class LocationsResponse
     {
          public Location[]? Value { get; set; }
     }

     public sealed class Location
     {
          //public string Id { get; set; } = "";
          public string Name { get; set; } = "";
          public string DisplayName { get; set; } = "";
          public string? RegionalDisplayName { get; set; }
          public LocationMetadata? Metadata { get; set; }
     }

     public sealed class LocationMetadata
     {
          public string? RegionType { get; set; }   // Physical / Logical
          public string? Geography { get; set; }    // e.g. Asia Pacific
          public string? Latitude { get; set; }
          public string? Longitude { get; set; }
          public string? PhysicalLocation { get; set; }
     }
}
