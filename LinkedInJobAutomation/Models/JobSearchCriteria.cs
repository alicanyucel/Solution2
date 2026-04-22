namespace LinkedInJobAutomation.Models
{
    public class JobSearchCriteria
    {
        public string Keywords { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public int MaxApplications { get; set; }
    }
}
