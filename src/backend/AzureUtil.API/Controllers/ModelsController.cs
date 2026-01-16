

namespace AzureUtil.API.Controllers
{
     [Route("api/[controller]")]
     [ApiController]
     public class ModelsController : ControllerBase
     {
          private readonly IAIModelService _modelService;

          // ctor
          public ModelsController(IAIModelService modelService)
          {
                    _modelService = modelService;
          }

          // return list of models for a location & model format
          [HttpGet]
          public async Task<IActionResult> GetModelsByLocation([FromQuery] string location, string modelFormat, CancellationToken ct = default)
          {
               if (string.IsNullOrWhiteSpace(location))
               {
                    return BadRequest("Location query parameter is required.");
               }

               var models = await _modelService.GetModelsByLocationAsync(location, modelFormat, ct);
               return Ok(models);
          }

          [HttpGet("formats")]
          public async Task<IActionResult> GetModelFormats([FromQuery] string location, CancellationToken ct = default)
          {
               if (string.IsNullOrWhiteSpace(location))
               {
                    return BadRequest("Location query parameter is required.");
               }
               var formats = await _modelService.GetModelFormats(location, ct);
               return Ok(formats);
          }
     }
}
