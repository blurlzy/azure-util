using AzureUtil.API.Services;
using Microsoft.OpenApi;

namespace AzureUtil.API
{
     public static class Startup
     {
          public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
          {
               var tenantId = configuration[SecretKeys.TenantId] ?? throw new ArgumentNullException("Azure:TenantId");
               var subscriptionId = configuration[SecretKeys.SubscriptionId] ?? throw new ArgumentNullException("Azure:SubscriptionId");
               var clientId = configuration[SecretKeys.ClientId] ?? throw new ArgumentNullException("Azure:ClientId");
               var clientSecret = configuration[SecretKeys.ClientSecret] ?? throw new ArgumentNullException("Azure:ClientSecret");

               services.Configure<AzureOptions>(_ =>
               {
                    _.TenantId = tenantId;
                    _.SubscriptionId = subscriptionId;
                    _.ClientId = clientId;
                    _.ClientSecret = clientSecret;
               });

               // HttpClient for Azure REST API calls
               services.AddHttpClient(ApiEndpoints.HttpClientName, c =>
               {
                    //c.BaseAddress = new Uri("https://management.azure.com/");
                    c.DefaultRequestHeaders.Add("Accept", "application/json");
                    // You can add a custom User-Agent if you want
               })
               .ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
               {
                    PooledConnectionLifetime = TimeSpan.FromMinutes(2), // Prevents DNS issues
                    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(1),
                    //MaxConnectionsPerServer = 10
               });

            // in memeory cache
            services.AddMemoryCache();
            // register services           
            services.AddSingleton<AzureRestClient>();
            services.AddScoped<ILocationService, LocationService>();
        }


          public static void ConfigureCors(this IServiceCollection services, string corsPolicy)
          {
               string[] allowedOrigins = new[]
               {
                                "http://localhost:4200"
                        };

               // cors policy
               services.AddCors(
                       opt =>
                       {
                            opt.AddPolicy(corsPolicy,
                     builder => builder.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod());
                       });
          }

          public static void ConfigureSwagger(this IServiceCollection services)
          {
               services.AddEndpointsApiExplorer();
               services.AddSwaggerGen(options =>
               {
                    options.SwaggerDoc("v1", new OpenApiInfo
                    {
                         Title = "Azure Util APIs",
                         Description = "Azure Utils",
                         Version = "v1.0",
                    });
                    //options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
                    //{
                    //     Type = SecuritySchemeType.Http,
                    //     Scheme = "bearer",
                    //     BearerFormat = "JWT",
                    //     Description = "JWT Authorization header using the Bearer scheme."
                    //});
                    //options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                    //{
                    //     [new OpenApiSecuritySchemeReference("bearer", document)] = []
                    //});
               });

          }
     }
}
