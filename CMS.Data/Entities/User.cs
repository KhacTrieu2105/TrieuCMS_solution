
/*
 * Họ tên: Nguyễn Khắc Triệu
 * MSSV: 2123110466
 * Lớp: CCQ2311D
 */using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}
