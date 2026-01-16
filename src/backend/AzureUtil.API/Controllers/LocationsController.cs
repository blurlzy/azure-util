using AzureUtil.API.Services;

namespace AzureUtil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        //private readonly AzureRestClient _azureRestClient;
        private readonly ILocationService _locationService;

        // ctor
        public LocationsController(ILocationService locationsService)
        {
            _locationService = locationsService;
        }

        // return list of locations
        [HttpGet]
        public async Task<IActionResult> GetLocations(CancellationToken ct = default)
        {
            var locations = await _locationService.GetLocationsAsync(ct);
            return Ok(locations);
        }
    }
}
