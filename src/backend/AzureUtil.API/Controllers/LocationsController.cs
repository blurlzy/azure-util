using AzureUtil.API.Services;

namespace AzureUtil.API.Controllers
{
     [Route("api/[controller]")]
     [ApiController]
     public class LocationsController : ControllerBase
     {
          private readonly AzureRestClient _azureRestClient;

          // ctor
          public LocationsController(AzureRestClient azureRestClient)
          {
               _azureRestClient = azureRestClient;
          }

          // return list of locations
          [HttpGet]
          public async Task<IActionResult> GetLocations(CancellationToken ct = default)
          {
               var locations = await _azureRestClient.ListLocationsAsync(ct);
               return Ok(locations);
          }
     }
}
