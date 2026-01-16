using Microsoft.Extensions.Caching.Memory;

namespace AzureUtil.API.Services
{
     public class AIModelService: IAIModelService
     {
          private readonly AzureRestClient _azureRestClient;
          private readonly IMemoryCache _cache;

          // ctor
          public AIModelService(AzureRestClient azureRestClient, IMemoryCache cache)
          {
               _azureRestClient = azureRestClient;
               _cache = cache;
          }

          public async Task<IReadOnlyList<string>> GetModelFormats(string location, CancellationToken ct = default)
          {
               var models = await this.GetModelsByLocationAsync(location, ct);

               // return unique model formats
               return models
                    .Select(m => m.Model.Format)
                    .Distinct()
                    .ToList();
          }

          public async Task<IReadOnlyList<ModelInformation>> GetModelsByLocationAsync(string location, CancellationToken ct = default)
          {
               // use location as cache key
               return await _cache.GetOrCreateAsync(location, async entry =>
               {
                    // Cache for 24 hours - available models rarely change
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24);
                    entry.SetPriority(CacheItemPriority.Normal);

                    return await _azureRestClient.ListModelsByLocationAsync(location, ct);
               }) ?? [];
          }

          public async Task<IReadOnlyList<ModelInformation>> GetModelsByLocationAsync(string location, string modelFormat, CancellationToken ct = default)
          {
               var models = await this.GetModelsByLocationAsync(location, ct);

               // filter models by format 
               // we need also filter the models by kind = "AIService"
               return models
                    .Where(m => string.Equals(m.Model.Format, modelFormat, StringComparison.OrdinalIgnoreCase) &&
                                string.Equals(m.Kind, "AIServices", StringComparison.OrdinalIgnoreCase))
                    .ToList();
          }
     }

     public interface IAIModelService
     {
          Task<IReadOnlyList<ModelInformation>> GetModelsByLocationAsync(string location, CancellationToken ct = default);
          Task<IReadOnlyList<ModelInformation>> GetModelsByLocationAsync(string location, string modelFormat, CancellationToken ct = default);
          Task<IReadOnlyList<string>> GetModelFormats(string location, CancellationToken ct = default);
     }
}
