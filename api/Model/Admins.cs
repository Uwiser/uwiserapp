using System;
using Dapper.Contrib.Extensions;

namespace uwiserApi.Model
{
    [Table("admins")]
    public class Admins
    {
        [Key]
        public long id { get; set; }
        public string name { get; set; }
        public DateTime created_at { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }
}
