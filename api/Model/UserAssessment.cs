using System;
//  using System.ComponentModel.DataAnnotations;
//  using System.ComponentModel.DataAnnotations.Schema;
using Dapper.Contrib.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
// using Dapper.Contrib.Extensions;
namespace uwiserApi.Model
{
    [Table("user_assessment")]
    public class UserAssessment
    {
        [Key]
        public long Id { get; set; }
        public long CallId { get; set; }

        public long UserId { get; set; }
        public long UserIdTranslator { get; set; }
        public string Description { get; set; }
        public int value { get; set; }
    }
}
