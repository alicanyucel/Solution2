namespace LinkedInJobAutomation.Models
{
    public class JobListing
    {
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobUrl { get; set; } = string.Empty;
        public bool Applied { get; set; }
        public DateTime? AppliedDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
