using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using LinkedInJobAutomation.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace LinkedInJobAutomation.Services
{
    public class LinkedInAutomationService : IDisposable
    {
        private IWebDriver _driver;
        private readonly LinkedInCredentials _credentials;
        private readonly AutomationSettings _settings;
        private readonly List<JobListing> _appliedJobs;

        public LinkedInAutomationService(LinkedInCredentials credentials, AutomationSettings settings)
        {
            _credentials = credentials;
            _settings = settings;
            _appliedJobs = new List<JobListing>();
            InitializeDriver();
        }

        private void InitializeDriver()
        {
            var options = new ChromeOptions();
            
            if (_settings.HeadlessMode)
            {
                options.AddArgument("--headless");
            }
            
            options.AddArgument("--start-maximized");
            options.AddArgument("--disable-blink-features=AutomationControlled");
            options.AddExcludedArgument("enable-automation");
            options.AddArgument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

            _driver = new ChromeDriver(options);
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
        }

        public bool Login()
        {
            try
            {
                Console.WriteLine("LinkedIn'e giriş yapılıyor...");
                _driver.Navigate().GoToUrl("https://www.linkedin.com/login");
                
                Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds));

                var emailField = _driver.FindElement(By.Id("username"));
                var passwordField = _driver.FindElement(By.Id("password"));
                
                emailField.SendKeys(_credentials.Email);
                passwordField.SendKeys(_credentials.Password);
                
                var loginButton = _driver.FindElement(By.XPath("//button[@type='submit']"));
                loginButton.Click();
                
                Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds * 2));

                if (_driver.Url.Contains("feed") || _driver.Url.Contains("checkpoint"))
                {
                    if (_driver.Url.Contains("checkpoint"))
                    {
                        Console.WriteLine("⚠️ LinkedIn güvenlik kontrolü gerekiyor. Lütfen manuel olarak tamamlayın...");
                        Console.WriteLine("Devam etmek için bir tuşa basın...");
                        Console.ReadKey();
                    }
                    
                    Console.WriteLine("✓ Giriş başarılı!");
                    return true;
                }
                
                Console.WriteLine("✗ Giriş başarısız!");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Giriş hatası: {ex.Message}");
                return false;
            }
        }

        public List<JobListing> SearchJobs(JobSearchCriteria criteria)
        {
            var jobs = new List<JobListing>();
            
            try
            {
                Console.WriteLine($"\nİş aranıyor: {criteria.Keywords} - {criteria.Location}");
                
                var searchUrl = BuildSearchUrl(criteria);
                _driver.Navigate().GoToUrl(searchUrl);
                
                Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds * 2));

                ScrollToLoadJobs();

                var jobCards = _driver.FindElements(By.CssSelector("li.jobs-search-results__list-item"));
                Console.WriteLine($"✓ {jobCards.Count} iş ilanı bulundu");

                foreach (var card in jobCards.Take(criteria.MaxApplications))
                {
                    try
                    {
                        card.Click();
                        Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds));

                        var job = ExtractJobDetails();
                        if (job != null)
                        {
                            jobs.Add(job);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"İlan detayı alınırken hata: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ İş arama hatası: {ex.Message}");
            }

            return jobs;
        }

        private string BuildSearchUrl(JobSearchCriteria criteria)
        {
            var baseUrl = "https://www.linkedin.com/jobs/search/?";
            var keywords = Uri.EscapeDataString(criteria.Keywords);
            var location = Uri.EscapeDataString(criteria.Location);
            
            var url = $"{baseUrl}keywords={keywords}&location={location}";
            
            if (!string.IsNullOrEmpty(criteria.JobType))
            {
                url += $"&f_JT={GetJobTypeCode(criteria.JobType)}";
            }
            
            if (!string.IsNullOrEmpty(criteria.ExperienceLevel))
            {
                url += $"&f_E={GetExperienceLevelCode(criteria.ExperienceLevel)}";
            }

            url += "&f_AL=true";
            
            return url;
        }

        private string GetJobTypeCode(string jobType)
        {
            return jobType.ToLower() switch
            {
                "full-time" => "F",
                "part-time" => "P",
                "contract" => "C",
                "temporary" => "T",
                "internship" => "I",
                _ => "F"
            };
        }

        private string GetExperienceLevelCode(string experienceLevel)
        {
            return experienceLevel.ToLower() switch
            {
                "internship" => "1",
                "entry level" => "2",
                "associate" => "3",
                "mid-senior level" => "4",
                "director" => "5",
                "executive" => "6",
                _ => "2"
            };
        }

        private void ScrollToLoadJobs()
        {
            try
            {
                var jobsList = _driver.FindElement(By.CssSelector("ul.jobs-search-results__list"));
                
                for (int i = 0; i < 3; i++)
                {
                    ((IJavaScriptExecutor)_driver).ExecuteScript(
                        "arguments[0].scrollTop = arguments[0].scrollHeight", jobsList);
                    Thread.Sleep(TimeSpan.FromSeconds(2));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Scroll hatası: {ex.Message}");
            }
        }

        private JobListing ExtractJobDetails()
        {
            try
            {
                var titleElement = _driver.FindElement(By.CssSelector("h1.job-title"));
                var companyElement = _driver.FindElement(By.CssSelector("a.job-card-container__company-name"));
                var locationElement = _driver.FindElement(By.CssSelector("span.job-card-container__metadata-item"));

                return new JobListing
                {
                    Title = titleElement.Text,
                    Company = companyElement.Text,
                    Location = locationElement.Text,
                    JobUrl = _driver.Url,
                    Applied = false
                };
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool ApplyToJob(JobListing job)
        {
            try
            {
                Console.WriteLine($"\n🔄 Başvuru yapılıyor: {job.Title} - {job.Company}");

                var easyApplyButton = FindEasyApplyButton();
                
                if (easyApplyButton == null)
                {
                    Console.WriteLine("✗ Easy Apply bulunamadı (dış site başvurusu)");
                    job.Status = "External Application";
                    return false;
                }

                easyApplyButton.Click();
                Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds));

                bool applicationCompleted = ProcessApplicationSteps();

                if (applicationCompleted)
                {
                    job.Applied = true;
                    job.AppliedDate = DateTime.Now;
                    job.Status = "Applied";
                    _appliedJobs.Add(job);
                    Console.WriteLine($"✓ Başvuru başarılı: {job.Title}");
                    
                    if (_settings.SaveScreenshots)
                    {
                        TakeScreenshot($"applied_{DateTime.Now:yyyyMMdd_HHmmss}");
                    }
                    
                    return true;
                }
                else
                {
                    job.Status = "Application Failed";
                    Console.WriteLine($"✗ Başvuru tamamlanamadı: {job.Title}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Başvuru hatası: {ex.Message}");
                job.Status = $"Error: {ex.Message}";
                return false;
            }
        }

        private IWebElement FindEasyApplyButton()
        {
            try
            {
                var buttons = _driver.FindElements(By.TagName("button"));
                
                foreach (var button in buttons)
                {
                    var buttonText = button.Text.ToLower();
                    if (buttonText.Contains("easy apply") || buttonText.Contains("kolay başvuru"))
                    {
                        return button;
                    }
                }
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private bool ProcessApplicationSteps()
        {
            try
            {
                int maxSteps = 10;
                int currentStep = 0;

                while (currentStep < maxSteps)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds));

                    if (IsApplicationComplete())
                    {
                        return true;
                    }

                    var nextButton = FindNextButton();
                    
                    if (nextButton != null && nextButton.Enabled)
                    {
                        try
                        {
                            FillCurrentPage();
                            nextButton.Click();
                            currentStep++;
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Next button tıklama hatası: {ex.Message}");
                            return false;
                        }
                    }
                    else
                    {
                        var submitButton = FindSubmitButton();
                        
                        if (submitButton != null && submitButton.Enabled)
                        {
                            submitButton.Click();
                            Thread.Sleep(TimeSpan.FromSeconds(_settings.WaitTimeSeconds));
                            return true;
                        }
                        else
                        {
                            Console.WriteLine("⚠️ Başvuru formu tamamlanamadı (ek bilgi gerekiyor)");
                            CloseApplicationModal();
                            return false;
                        }
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Başvuru adımları hatası: {ex.Message}");
                CloseApplicationModal();
                return false;
            }
        }

        private void FillCurrentPage()
        {
            try
            {
                var inputs = _driver.FindElements(By.TagName("input"));
                
                foreach (var input in inputs)
                {
                    try
                    {
                        var inputType = input.GetAttribute("type");
                        var isRequired = input.GetAttribute("required") != null;

                        if (isRequired && string.IsNullOrEmpty(input.GetAttribute("value")))
                        {
                            if (inputType == "text" || inputType == "tel" || inputType == "email")
                            {
                                var placeholder = input.GetAttribute("placeholder")?.ToLower() ?? "";
                                
                                if (placeholder.Contains("phone") || placeholder.Contains("telefon"))
                                {
                                    input.SendKeys("+90 555 555 5555");
                                }
                            }
                        }
                    }
                    catch (Exception)
                    {
                    }
                }
            }
            catch (Exception)
            {
            }
        }

        private IWebElement FindNextButton()
        {
            try
            {
                var buttons = _driver.FindElements(By.TagName("button"));
                
                foreach (var button in buttons)
                {
                    var buttonText = button.Text.ToLower();
                    if (buttonText.Contains("next") || buttonText.Contains("sonraki") || 
                        buttonText.Contains("continue") || buttonText.Contains("devam"))
                    {
                        return button;
                    }
                }
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private IWebElement FindSubmitButton()
        {
            try
            {
                var buttons = _driver.FindElements(By.TagName("button"));
                
                foreach (var button in buttons)
                {
                    var buttonText = button.Text.ToLower();
                    if (buttonText.Contains("submit") || buttonText.Contains("gönder") || 
                        buttonText.Contains("apply") || buttonText.Contains("başvur"))
                    {
                        return button;
                    }
                }
            }
            catch (Exception)
            {
            }
            
            return null;
        }

        private bool IsApplicationComplete()
        {
            try
            {
                var successMessages = _driver.FindElements(By.XPath("//*[contains(text(), 'Application sent') or contains(text(), 'Başvuru gönderildi')]"));
                return successMessages.Count > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private void CloseApplicationModal()
        {
            try
            {
                var closeButtons = _driver.FindElements(By.CssSelector("button[aria-label='Dismiss']"));
                if (closeButtons.Count > 0)
                {
                    closeButtons[0].Click();
                    Thread.Sleep(TimeSpan.FromSeconds(1));
                }
            }
            catch (Exception)
            {
            }
        }

        private void TakeScreenshot(string filename)
        {
            try
            {
                var screenshot = ((ITakesScreenshot)_driver).GetScreenshot();
                var directory = "Screenshots";
                
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                
                screenshot.SaveAsFile($"{directory}/{filename}.png");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Screenshot hatası: {ex.Message}");
            }
        }

        public List<JobListing> GetAppliedJobs()
        {
            return _appliedJobs;
        }

        public void Dispose()
        {
            _driver?.Quit();
            _driver?.Dispose();
        }
    }
}
