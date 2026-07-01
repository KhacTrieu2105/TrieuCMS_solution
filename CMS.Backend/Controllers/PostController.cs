using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index(int? id)
        {
            var query = _context.Posts.Include(p => p.Category).AsQueryable();
            if (id != null) query = query.Where(p => p.CategoryId == id);
            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();
            return View(posts);
        }

        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        [Authorize]
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // Bỏ qua validate Category và ImageUrl vì chúng ta tự xử lý
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }
                    model.ImageUrl = "/uploads/" + fileName;
                }

                model.CreatedDate = DateTime.Now;
                _context.Posts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Nếu có lỗi, log ra console để debug
            var errors = ModelState.Values.SelectMany(v => v.Errors);
            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();

            // Gửi danh sách Category sang View
            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        // 2. Dùng để lưu dữ liệu sau khi sửa (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Post model, IFormFile? uploadImage)
        {
            var post = _context.Posts.FirstOrDefault(x => x.Id == model.Id);

            if (post == null)
                return NotFound();

            post.Title = model.Title;
            post.Content = model.Content;
            post.CategoryId = model.CategoryId;

            // Nếu có chọn ảnh mới thì cập nhật
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string uploadsFolder = Path.Combine(
                    _webHostEnvironment.WebRootPath,
                    "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(uploadImage.FileName);

                string filePath =
                    Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                post.ImageUrl = "/uploads/" + fileName;
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            _context.Posts.Remove(post);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}