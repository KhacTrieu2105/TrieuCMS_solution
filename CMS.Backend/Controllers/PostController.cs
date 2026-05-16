using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // GET: /Post
        public IActionResult Index()
        {
            var posts = new List<Post>
            {
                new Post
                {
                    Id = 1,
                    Title = "Chào mừng đến với CMS",
                    Content = "Đây là bài viết đầu tiên trong hệ thống CMS.",
                    ImageUrl = "https://picsum.photos/600/400?random=1",
                    CreatedDate = DateTime.Now.AddDays(-1)
                },

                new Post
                {
                    Id = 2,
                    Title = "Hướng dẫn sử dụng hệ thống",
                    Content = "Bài viết này hướng dẫn cách sử dụng các tính năng cơ bản.",
                    ImageUrl = "https://picsum.photos/600/400?random=2",
                    CreatedDate = DateTime.Now.AddDays(-2)
                },

                new Post
                {
                    Id = 3,
                    Title = "Tính năng mới phiên bản 2.0",
                    Content = "Phiên bản mới có nhiều cải tiến quan trọng.",
                    ImageUrl = "https://picsum.photos/600/400?random=3",
                    CreatedDate = DateTime.Now.AddDays(-3)
                }
            };

            return View(posts);
        }

        // GET: /Post/Details/1
        public IActionResult Details(int id)
        {
            var post = new Post
            {
                Id = id,
                Title = "Chi tiết bài viết số " + id,
                Content = "Đây là nội dung chi tiết của bài viết.",
                ImageUrl = "https://picsum.photos/900/500?random=" + id,
                CreatedDate = DateTime.Now.AddDays(-id)
            };

            return View(post);
        }
    }
}