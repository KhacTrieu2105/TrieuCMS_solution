using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/posts
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
               .OrderByDescending(p => p.Id)
               .Select(p => new {
                   p.Id,
                   p.Title,
                   p.ImageUrl,
                   p.CreatedDate, // Đã sửa từ CreatedAt sang CreatedDate
                   CategoryName = p.Category.Name
               })
               .ToList();
            return Ok(posts);
        }

        // GET: api/posts/category/5
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate // Đã sửa từ CreatedAt sang CreatedDate
                })
                .ToList();
            return Ok(posts);
        }

        // GET: api/posts/5
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }
        // POST: api/posts (Thêm mới)
        [HttpPost]
        public IActionResult Create([FromBody] CMS.Data.Entities.Post post)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Gán ngày tạo tự động nếu Frontend chưa gửi lên
            if (post.CreatedDate == default) post.CreatedDate = System.DateTime.Now;

            _context.Posts.Add(post);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetDetail), new { id = post.Id }, post);
        }

        // PUT: api/posts/5 (Sửa)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CMS.Data.Entities.Post post)
        {
            if (id != post.Id) return BadRequest("ID không khớp");

            var existingPost = _context.Posts.Find(id);
            if (existingPost == null) return NotFound();

            // Cập nhật thông tin
            existingPost.Title = post.Title;
            existingPost.ImageUrl = post.ImageUrl;
            existingPost.Content = post.Content;
            existingPost.CategoryId = post.CategoryId;
            // Không cập nhật CreatedDate để giữ nguyên ngày tạo gốc

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/posts/5 (Xóa)
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok(new { message = "Đã xóa bài viết thành công" });
        }
    }
}