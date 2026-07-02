using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public PostsController(
            ApplicationDbContext context,
            IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        //==========================
        // GET ALL
        //==========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .Include(x => x.Category)
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.ImageUrl,
                    x.CreatedDate,
                    CategoryName = x.Category.Name
                })
                .ToList();

            return Ok(posts);
        }

        //==========================
        // GET BY CATEGORY
        //==========================
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Where(x => x.CategoryId == categoryId)
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.ImageUrl,
                    x.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        //==========================
        // GET DETAIL
        //==========================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts.FirstOrDefault(x => x.Id == id);

            if (post == null)
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết"
                });

            return Ok(post);
        }

        //==========================
        // CREATE
        //==========================
        [HttpPost]
        public IActionResult Create([FromBody] Post post)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (post.CreatedDate == default)
                post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetDetail),
                new { id = post.Id }, post);
        }

        //==========================
        // UPDATE
        //==========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Post post)
        {
            if (id != post.Id)
                return BadRequest();

            var existing = _context.Posts.Find(id);

            if (existing == null)
                return NotFound();

            existing.Title = post.Title;
            existing.Content = post.Content;
            existing.ImageUrl = post.ImageUrl;
            existing.CategoryId = post.CategoryId;

            _context.SaveChanges();

            return NoContent();
        }

        //==========================
        // DELETE
        //==========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đã xóa thành công"
            });
        }

        //==========================
        // CKEDITOR UPLOAD IMAGE
        //==========================
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
                return BadRequest();

            string uploadFolder = Path.Combine(
                _webHostEnvironment.WebRootPath,
                "uploads");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            string fileName =
                Guid.NewGuid().ToString() +
                Path.GetExtension(upload.FileName);

            string filePath =
                Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }

            return Ok(new
            {
                url = "/uploads/" + fileName
            });
        }
    }
}