using System;
using Dapper.Contrib.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace uwiserApi.Model
{
    [Table("files")]
    public class Files
    {
        [Key]
        public long id { get; set; }
        public string url { get; set; }
        public DateTime created_at { get; set; }
        public long user_id { get; set; }
        public long interpreter_id { get; set; }
        [Write(false)]
        [Computed]
        public virtual UserUwiser UserObject { get; set; }
        [Write(false)]
        [Computed]
        public virtual UserUwiser InterpreterObject { get; set; }
    }
}
