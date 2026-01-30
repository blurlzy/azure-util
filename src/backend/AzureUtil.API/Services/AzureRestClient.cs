
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;

namespace AzureUtil.API.Services
{
     public sealed class AzureRestClient
     {
          private static readonly string[] Scopes = ["https://management.azure.com/.default"];
          private readonly AzureOptions _opts;
          private readonly HttpClient _httpClient;
          private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

          private const string TokenCacheKey = "AzureAccessToken";
          private readonly IMemoryCache _cache;
          // ctor
          public AzureRestClient(IOptions<AzureOptions> opts, HttpClient httpClient, IMemoryCache cache)
          {
               _opts = opts.Value;
               _httpClient = httpClient;
               _cache = cache;
          }

          public async Task<IReadOnlyList<Location>> ListLocationsAsync(CancellationToken ct = default)
          {
               // Get access token - client credentials flow
               AccessToken token = await GetAccessToken(ct);

               // API endpoint
               var url = string.Format(ApiEndpoints.ListRegions, _opts.SubscriptionId);

               // Set auth header (don't use DefaultRequestHeaders - not thread-safe)
               using var request = new HttpRequestMessage(HttpMethod.Get, url);
               request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);

               // Send request
               using var resp = await _httpClient.SendAsync(request, ct);
               var body = await resp.Content.ReadAsStringAsync(ct);


               if (!resp.IsSuccessStatusCode)
               {
                    // Bubble up the ARM error payload so it's easy to troubleshoot
                    throw new AzureRestException((int)resp.StatusCode, body);
               }

               var parsed = JsonSerializer.Deserialize<LocationsResponse>(body, _jsonOptions);

               IReadOnlyList<Location> locations = (parsed?.Value ?? Array.Empty<Location>())
                   .OrderBy(l => l.Name, StringComparer.OrdinalIgnoreCase)
                   .ToArray();

               // filter out any logical locations
               return locations.Where(m => m.Metadata != null && m.Metadata.RegionType == "Physical").ToArray();
               //return (parsed?.Value ?? Array.Empty<Location>())
               //    .OrderBy(l => l.Name, StringComparer.OrdinalIgnoreCase)
               //    .ToArray();
          }

          public async Task<IReadOnlyList<ModelInformation>> ListModelsByLocationAsync(string locationId, CancellationToken ct = default)
          {
               // Get access token - client credentials flow
               AccessToken token = await GetAccessToken(ct);

               // API endpoint
               var url = string.Format(ApiEndpoints.ListAIModels, _opts.SubscriptionId, locationId);
               // Set auth header (don't use DefaultRequestHeaders - not thread-safe)
               using var request = new HttpRequestMessage(HttpMethod.Get, url);
               request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);
               // Send request
               using var resp = await _httpClient.SendAsync(request, ct);
               var body = await resp.Content.ReadAsStringAsync(ct);

               if (!resp.IsSuccessStatusCode)
               {
                    if(resp.StatusCode == System.Net.HttpStatusCode.NotFound || resp.StatusCode == System.Net.HttpStatusCode.BadRequest)
                    {
                         return Array.Empty<ModelInformation>();
                    }

                    // Bubble up the ARM error payload so it's easy to troubleshoot
                    throw new AzureRestException((int)resp.StatusCode, body);
               }

               var parsed = JsonSerializer.Deserialize<AIModelsResponse>(body, _jsonOptions);

               return (parsed?.Value ?? Array.Empty<ModelInformation>())
                   .OrderBy(m => m.Name, StringComparer.OrdinalIgnoreCase)
                   .ToArray();
          }


          //private async Task<AccessToken> GetAccessToken(CancellationToken ct = default)
          //{
          //     // Get access token - client credentials flow
          //     var credential = new ClientSecretCredential(_opts.TenantId, _opts.ClientId, _opts.ClientSecret);
          //     return await credential.GetTokenAsync(new TokenRequestContext(Scopes), ct);
          //}

          private async Task<AccessToken> GetAccessToken(CancellationToken ct = default)
          {
               return await _cache.GetOrCreateAsync(TokenCacheKey, async entry =>
               {
                    // cache for 30 minutes
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
                    entry.SetPriority(CacheItemPriority.High);

                    // Get fresh token - client credentials flow
                    var credential = new ClientSecretCredential(_opts.TenantId, _opts.ClientId, _opts.ClientSecret);
                    var token = await credential.GetTokenAsync(new TokenRequestContext(Scopes), ct);

                    return token;
               });
          }

     }
}
