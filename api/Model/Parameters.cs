using System;
using Dapper.Contrib.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace uwiserApi.Model
{
    [Table("parameters")]
    public class Parameters
    {
        [Key]
        public long id { get; set; }
        public string parameter_name { get; set; }
        public string parameter_value { get; set; }
    }
}
