using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // GET: /User
        public IActionResult Index()
        {
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "admin_thai",
                    FullName = "Nguyễn Cao Thái",
                    Role = "Administrator"
                },

                new User
                {
                    Id = 2,
                    Username = "editor_01",
                    FullName = "Trần Văn Biên Tập",
                    Role = "Editor"
                },

                new User
                {
                    Id = 3,
                    Username = "author_minh",
                    FullName = "Lê Quang Minh",
                    Role = "Author"
                },

                new User
                {
                    Id = 4,
                    Username = "member_huy",
                    FullName = "Phạm Quốc Huy",
                    Role = "Member"
                }
            };

            return View(users);
        }

        // GET: /User/Details/1
        public IActionResult Details(int id)
        {
            var user = new User
            {
                Id = id,
                Username = "user_" + id,
                FullName = "Người dùng số " + id,
                Role = "Member"
            };

            return View(user);
        }
    }
}