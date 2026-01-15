using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;

namespace AzureUtil.API.Services
{
     public sealed class AzureRestClient
     {
          private static readonly string[] Scopes = ["https://management.azure.com/.default"];
          private readonly AzureOptions _opts;
          private readonly IHttpClientFactory _httpClientFactory;

          // ctor
          public AzureRestClient(IOptions<AzureOptions> opts, IHttpClientFactory httpClientFactory)
          {
               _opts = opts.Value;
               _httpClientFactory = httpClientFactory;
          }

          public async Task<IReadOnlyList<Location>> ListLocationsAsync(CancellationToken ct = default)
          {
               // Get access token - client credentials flow
               var credential = new ClientSecretCredential(_opts.TenantId, _opts.ClientId, _opts.ClientSecret);
               AccessToken token = await credential.GetTokenAsync(new TokenRequestContext(Scopes), ct);

               // create HTTP client with auth header
               var http = _httpClientFactory.CreateClient(ApiEndpoints.HttpClientName);
               http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);

               // API endpoint
               var url = string.Format(ApiEndpoints.ListRegions, _opts.SubscriptionId);
               using var resp = await http.GetAsync(url, ct);
               var body = await resp.Content.ReadAsStringAsync(ct);

               if (!resp.IsSuccessStatusCode)
               {
                    // Bubble up the ARM error payload so it's easy to troubleshoot
                    throw new AzureRestException((int)resp.StatusCode, body);
               }

               var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
               var parsed = JsonSerializer.Deserialize<LocationsResponse>(body, jsonOptions);

               IReadOnlyList<Location> locations = (parsed?.Value ?? Array.Empty<Location>())
                   .OrderBy(l => l.Name, StringComparer.OrdinalIgnoreCase)
                   .ToArray();

               // filter out any logical locations
               return locations.Where(m => m.Metadata != null && m.Metadata.RegionType == "Physical").ToArray();
               //return (parsed?.Value ?? Array.Empty<Location>())
               //    .OrderBy(l => l.Name, StringComparer.OrdinalIgnoreCase)
               //    .ToArray();
          }

     }
}
