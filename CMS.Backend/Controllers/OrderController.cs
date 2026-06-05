using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context) => _context = context;

        public IActionResult Index() => View(_context.Orders.ToList());

        // --- SỬA (Edit) ---
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            return order == null ? NotFound() : View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order order)
        {
            if (ModelState.IsValid)
            {
                var existingOrder = _context.Orders.Find(order.Id);
                if (existingOrder != null)
                {
                    existingOrder.Status = order.Status; // Ví dụ: Cập nhật trạng thái
                    existingOrder.Notes = order.Notes;
                    _context.SaveChanges();
                }
                return RedirectToAction(nameof(Index));
            }
            return View(order);
        }

        // --- XÓA (Delete) ---
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}