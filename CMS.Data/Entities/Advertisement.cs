using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Advertisement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Subtitle { get; set; }

        public string? ImageUrl { get; set; }

        public string? Icon { get; set; } // Ví dụ: 'bi-cpu'

        public string? Theme { get; set; } // Ví dụ: 'tech' hoặc 'sale'

        public string? CtaText { get; set; }

        public string? CtaLink { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;
    }
}