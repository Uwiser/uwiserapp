using System;
using Dapper.Contrib.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace uwiserApi.Model
{
    [Table("user_uwiser")]
    public class UserUwiser
    {
        [Key]
        public long id { get; set; }

        public long idvox { get; set; }
        public string usernamevox { get; set; }
        public string name { get; set; }
        public DateTime created { get; set; }
        public string email { get; set; }
        public string cpf { get; set; }
        public string phone { get; set; }
        public string password { get; set; }
        public DateTime? age { get; set; }
        public string City { get; set; }
        public string Specialty { get; set; }
        [JsonIgnore]
        public DateTime? deleted { get; set; }
        public long user_type_id { get; set; }

        public string language_app { get; set; }
        // [ForeignKey("user_type_id")]
        [Write(false)]
        [Computed]
        public virtual UserType UserTypeObject { get; set; }

        public string email_paypal { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public string country { get; set; }

        public string languages { get; set; }
        [Write(false)]
        [Computed]
        public List<UserAssessment> assessments { get; set; }
        public long credits { get; set; }
        public long balance { get; set; }
        public long enabled { get; set; }
        public string description_pt { get; set; }
        public string description_es { get; set; }
        public string description_en { get; set; }
        public string description_jp { get; set; }
        public string description_fr { get; set; }
    }
}
