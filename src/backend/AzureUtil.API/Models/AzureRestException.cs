namespace AzureUtil.API.Models
{
     public sealed class AzureRestException : Exception
     {
          public int StatusCode { get; }
          public string ArmResponse { get; }

          public AzureRestException(int statusCode, string armResponse)
              : base($"Azure REST request failed with status code {statusCode}.")
          {
               StatusCode = statusCode;
               ArmResponse = armResponse;
          }
     }
}
