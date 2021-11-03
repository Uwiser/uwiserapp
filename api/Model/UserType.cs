using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uwiserApi.Model
{
    [Table("user_type")]
    public class UserType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
