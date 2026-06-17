using CMS.Data.Entities;

public class HomeViewModel
{
    public List<Product> Products { get; set; } = new List<Product>();
    public List<Post> Posts { get; set; } = new List<Post>();
}