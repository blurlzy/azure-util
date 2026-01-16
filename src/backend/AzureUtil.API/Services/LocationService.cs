using Microsoft.Extensions.Caching.Memory;

namespace AzureUtil.API.Services
{
    public class LocationService : ILocationService
    {
        private readonly AzureRestClient _azureRestClient;
        private readonly IMemoryCache _cache;
        private const string LocationsCacheKey = "azurelocations";

        // ctor
        public LocationService(AzureRestClient azureRestClient, IMemoryCache cache)
        {
            _azureRestClient = azureRestClient;
            _cache = cache;
        }

        public async Task<IReadOnlyList<Location>> GetLocationsAsync(CancellationToken ct = default)
        {
            return await _cache.GetOrCreateAsync(LocationsCacheKey, async entry =>
            {
                // Cache for 24 hours - locations rarely change
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24);
                entry.SetPriority(CacheItemPriority.Normal);

                return await _azureRestClient.ListLocationsAsync(ct);
            }) ?? [];
        }
    }

    public interface ILocationService
    {
        Task<IReadOnlyList<Location>> GetLocationsAsync(CancellationToken ct = default);
    }
}
