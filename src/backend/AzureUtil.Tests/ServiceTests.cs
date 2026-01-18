using AzureUtil.API.Config;
using AzureUtil.API.Models;
using AzureUtil.API.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Moq;
using Xunit.Abstractions;


namespace AzureUtil.Tests
{
     public class ServiceTests
     {
          //private readonly Mock<AzureRestClient> _mockAzureRestClient;
          private readonly IMemoryCache _memoryCache;
          private readonly AzureRestClient _azureRestClient;
          private readonly LocationService _sut; // System Under Test

          // options
          private readonly string _tenantId = SecretManager.GetSecret(SecretKeys.TenantId);
          private readonly string _subId = SecretManager.GetSecret(SecretKeys.SubscriptionId);
          private readonly string _clientId = SecretManager.GetSecret(SecretKeys.ClientId);
          private readonly string _clientSecret = SecretManager.GetSecret(SecretKeys.ClientSecret);

          // output
          private readonly ITestOutputHelper _output;


          // ctor
          public ServiceTests(ITestOutputHelper output)
          {
               // Setup in-memory cache (use real implementation for testing)
               _memoryCache = new MemoryCache(new MemoryCacheOptions());

               // Mock AzureRestClient
               var mockOptions = new Mock<IOptions<AzureOptions>>();

               // load test config from azure key vault or appsettings
               mockOptions.Setup(x => x.Value).Returns(new AzureOptions
               {
                    TenantId = _tenantId,
                    SubscriptionId = _subId,
                    ClientId = _clientId,
                    ClientSecret = _clientSecret
               });

               var mockHttpClient = new HttpClient();

               _azureRestClient = new AzureRestClient(mockOptions.Object, mockHttpClient);
               _sut = new LocationService(_azureRestClient, _memoryCache);

               _output = output;
          }



          [Fact]
          public async Task GetLocationsAsync_WhenCacheIsEmpty_ShouldCallAzureRestClient()
          {
               //// Arrange
               //var expectedLocations = CreateTestLocations();
               //_mockAzureRestClient
               //    .Setup(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()))
               //    .ReturnsAsync(expectedLocations);

               // Act
               var result = await _sut.GetLocationsAsync();

               if(result.Count == 0)
               {
                    throw new Exception("No locations returned from AzureRestClient.");
               }

               Assert.True(result.Count > 0); // Just to use Assert and avoid warnings

               // Assert

               //_mockAzureRestClient.Verify(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()), Times.Once);
          }

          [Theory]
          [InlineData("australiaeast")]
          [InlineData("eastus2")]
          //[InlineData("southeastasia")]
          public async Task Get_Models_By_Location(string location) 
          {
          
               var models = await _azureRestClient.ListModelsByLocationAsync(location);   

               if(models.Count == 0)
               {
                    throw new Exception($"No models returned from AzureRestClient for location: {location}");
               }

               _output.WriteLine($"Total Models in {location}: {models.Count}");

               // get unique model formats
               var modelFormats = models
                    .Select(m => m.Model.Format)
                    .Distinct()
                    .ToList();

               _output.WriteLine($"Total model models: {modelFormats.Count}");

               foreach(var format in modelFormats)
               {                    
                    _output.WriteLine($"Format: {format}");
               }

               // get unique model status
               var modelStatus = models
                    .Select(m => m.Model.LifecycleStatus)
                    .Distinct()
                    .ToList();

               foreach(var status in modelStatus)
               {
                    _output.WriteLine($"Status: {status}");
               }

          }
          //[Fact]
          //public async Task GetLocationsAsync_WhenCacheIsPopulated_ShouldNotCallAzureRestClient()
          //{
          //     // Arrange
          //     var expectedLocations = CreateTestLocations();
          //     _mockAzureRestClient
          //         .Setup(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()))
          //         .ReturnsAsync(expectedLocations);

          //     // First call to populate cache
          //     await _sut.GetLocationsAsync();

          //     // Act - Second call should use cache
          //     var result = await _sut.GetLocationsAsync();

          //     // Assert
          //     //result.Should().NotBeNull();
          //     //result.Should().HaveCount(3);
          //     //result.Should().BeEquivalentTo(expectedLocations);
          //     // Should only be called once (from first call)
          //     _mockAzureRestClient.Verify(x => x.ListLocationsAsync(It.IsAny<CancellationToken>()), Times.Once);
          //}

     }
}
