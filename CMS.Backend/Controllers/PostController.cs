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
            ModelState.Remove("Category");

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

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                var existingPost = _context.Posts.Find(model.Id);
                if (existingPost == null) return NotFound();

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
                    existingPost.ImageUrl = "/uploads/" + fileName;
                }

                existingPost.Title = model.Title;
                existingPost.Content = model.Content;
                existingPost.CategoryId = model.CategoryId;
                existingPost.CreatedDate = DateTime.Now;

                _context.Posts.Update(existingPost);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
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