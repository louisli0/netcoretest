using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace bookingsApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using(var scope = host.Services.CreateScope()) {
                var services = scope.ServiceProvider;
                try {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    var context = services.GetRequiredService<BookingContext>();
                    //Seeder Function by passing the context
                    Seed.SeedDatabase(context);
                    logger.LogInformation("DB Data Check");
                } catch (Exception ex) {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Failed to seed DB");
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureLogging(logBuilder => {
                    logBuilder.ClearProviders();
                    logBuilder.AddConsole();
                    logBuilder.AddDebug();
                    logBuilder.AddTraceSource("Information, ActivityTracking");
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
