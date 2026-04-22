using LinkedInJobAutomation.Models;
using LinkedInJobAutomation.Services;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.IO;

namespace LinkedInJobAutomation
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("╔═══════════════════════════════════════════════════════╗");
                Console.WriteLine("║   LinkedIn İş Başvuru Otomasyonu                     ║");
                Console.WriteLine("║   C# ile Geliştirildi                                 ║");
                Console.WriteLine("╚═══════════════════════════════════════════════════════╝\n");

                var configuration = LoadConfiguration();

                var credentials = configuration.GetSection("LinkedIn").Get<LinkedInCredentials>();
                var criteria = configuration.GetSection("JobSearchCriteria").Get<JobSearchCriteria>();
                var settings = configuration.GetSection("AutomationSettings").Get<AutomationSettings>();

                if (string.IsNullOrEmpty(credentials.Email) || credentials.Email == "your-email@example.com")
                {
                    Console.WriteLine("⚠️  UYARI: appsettings.json dosyasında LinkedIn e-posta ve şifrenizi girin!");
                    Console.WriteLine("Devam etmek için Enter'a basın...");
                    Console.ReadLine();
                    return;
                }

                using (var automationService = new LinkedInAutomationService(credentials, settings))
                {
                    if (!automationService.Login())
                    {
                        Console.WriteLine("\n✗ LinkedIn girişi başarısız. Program sonlandırılıyor...");
                        return;
                    }

                    Console.WriteLine("\n" + new string('─', 60));

                    var jobs = automationService.SearchJobs(criteria);

                    if (jobs.Count == 0)
                    {
                        Console.WriteLine("\n✗ İş ilanı bulunamadı.");
                        return;
                    }

                    Console.WriteLine($"\n{jobs.Count} adet iş ilanı başvuru için hazırlanıyor...\n");
                    Console.WriteLine(new string('─', 60));

                    int successCount = 0;
                    int failedCount = 0;

                    foreach (var job in jobs)
                    {
                        bool applied = automationService.ApplyToJob(job);

                        if (applied)
                        {
                            successCount++;
                        }
                        else
                        {
                            failedCount++;
                        }

                        System.Threading.Thread.Sleep(TimeSpan.FromSeconds(settings.WaitTimeSeconds * 2));
                    }

                    Console.WriteLine("\n" + new string('═', 60));
                    Console.WriteLine("                    ÖZET RAPOR                           ");
                    Console.WriteLine(new string('═', 60));
                    Console.WriteLine($"✓ Başarılı başvurular: {successCount}");
                    Console.WriteLine($"✗ Başarısız başvurular: {failedCount}");
                    Console.WriteLine($"📊 Toplam işlem: {successCount + failedCount}");
                    Console.WriteLine(new string('═', 60));

                    SaveResultsToFile(automationService.GetAppliedJobs());

                    Console.WriteLine("\n✓ Sonuçlar 'applied_jobs.json' dosyasına kaydedildi.");
                    Console.WriteLine("\nProgram tamamlandı. Çıkmak için bir tuşa basın...");
                    Console.ReadKey();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n✗ Beklenmeyen hata: {ex.Message}");
                Console.WriteLine($"Detay: {ex.StackTrace}");
                Console.WriteLine("\nÇıkmak için bir tuşa basın...");
                Console.ReadKey();
            }
        }

        private static IConfiguration LoadConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            return builder.Build();
        }

        private static void SaveResultsToFile(List<JobListing> jobs)
        {
            try
            {
                var json = JsonConvert.SerializeObject(jobs, Formatting.Indented);
                File.WriteAllText("applied_jobs.json", json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Sonuçlar kaydedilemedi: {ex.Message}");
            }
        }
    }
}

