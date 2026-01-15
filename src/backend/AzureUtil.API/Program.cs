using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Security.KeyVault.Secrets;

var builder = WebApplication.CreateBuilder(args);

// register secret client
SecretClient secretClient = new SecretClient(new Uri($"https://{builder.Configuration["Azure:KeyVault"]}.vault.azure.net"),
                                              new DefaultAzureCredential(new DefaultAzureCredentialOptions
                                              {
                                                   ExcludeEnvironmentCredential = true,
                                                   ExcludeVisualStudioCodeCredential = true,
                                                   //ExcludeSharedTokenCacheCredential = true,
                                                   ExcludeInteractiveBrowserCredential = true,
                                              }));

// loads secrets into configuration. ## it requres Azure.Extensions.AspNetCore.Configuration.Secrets package
builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());

// Add services to the container.
// register azure rest api clients
builder.Services.ConfigureServices(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();
builder.Services.ConfigureSwagger();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
     // Configure the HTTP request pipeline.
     if (app.Environment.IsDevelopment())
     {
          //app.MapOpenApi();
          app.UseSwagger();
          app.UseSwaggerUI(options => {
               options.DefaultModelsExpandDepth(-1);
          });
     }

     //app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
