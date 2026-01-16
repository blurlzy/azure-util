using AzureUtil.API.Models;
using AzureUtil.API.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace AzureUtil.Tests
{
    public class LocationServiceTests
    {
        private readonly Mock<AzureRestClient> _mockAzureRestClient;
        private readonly IMemoryCache _memoryCache;
        private readonly LocationService _sut; // System Under Test

        // ctor
        public LocationServiceTests()
        {
            // Setup in-memory cache (use real implementation for testing)
            _memoryCache = new MemoryCache(new MemoryCacheOptions());

            // Mock AzureRestClient
            var mockOptions = new Mock<IOptions<AzureOptions>>();

            // load test config from azure key vault or appsettings
            mockOptions.Setup(x => x.Value).Returns(new AzureOptions
            {
                TenantId = "test-tenant",
                SubscriptionId = "test-subscription",
                ClientId = "test-client",
                ClientSecret = "test-secret"
            });

            var mockHttpClient = new HttpClient();
            _mockAzureRestClient = new Mock<AzureRestClient>(mockOptions.Object, mockHttpClient);

            _sut = new LocationService(_mockAzureRestClient.Object, _memoryCache);
        }



        [Fact]
        public async Task GetLocationsAsync_WhenCacheIsEmpty_ShouldCallAzureRestClient()
        {
            // Arrange
            var expectedLocations = CreateTestLocations();
            _mockAzureRestClient
                .Setup(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedLocations);

            // Act
            var result = await _sut.GetLocationsAsync();

            // Assert
            
            _mockAzureRestClient.Verify(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetLocationsAsync_WhenCacheIsPopulated_ShouldNotCallAzureRestClient()
        {
            // Arrange
            var expectedLocations = CreateTestLocations();
            _mockAzureRestClient
                .Setup(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedLocations);

            // First call to populate cache
            await _sut.GetLocationsAsync();

            // Act - Second call should use cache
            var result = await _sut.GetLocationsAsync();

            // Assert
            //result.Should().NotBeNull();
            //result.Should().HaveCount(3);
            //result.Should().BeEquivalentTo(expectedLocations);
            // Should only be called once (from first call)
            _mockAzureRestClient.Verify(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        private static IReadOnlyList<Location> CreateTestLocations()
        {
            return new List<Location>
            {
                new()
                {
                    Id = "/subscriptions/test/locations/eastus",
                    Name = "eastus",
                    DisplayName = "East US",
                    RegionalDisplayName = "(US) East US",
                    Metadata = new LocationMetadata
                    {
                        RegionType = "Physical",
                        //RegionCategory = "Recommended"
                    }
                },
                new()
                {
                    Id = "/subscriptions/test/locations/westus",
                    Name = "westus",
                    DisplayName = "West US",
                    RegionalDisplayName = "(US) West US",
                    Metadata = new LocationMetadata
                    {
                        RegionType = "Physical",
                        //RegionCategory = "Recommended"
                    }
                },
                new()
                {
                    Id = "/subscriptions/test/locations/centralus",
                    Name = "centralus",
                    DisplayName = "Central US",
                    RegionalDisplayName = "(US) Central US",
                    Metadata = new LocationMetadata
                    {
                        RegionType = "Physical",
                        //RegionCategory = "Recommended"
                    }
                }
            };
        }
    }
}
