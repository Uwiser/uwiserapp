using System;
using Dapper.Contrib.Extensions;

namespace uwiserApi.Model
{
    [Table("balance_history")]
    public class BalanceHistory
    {
        [Key]
        public long id { get; set; }
        public long user_id { get; set; }
        public long interpreter_id { get; set; }
        public Decimal value { get; set; }
        public DateTime created { get; set; }
        public long seconds { get; set; }
        public string interpreter_name { get; set; }
        public string user_name { get; set; }
        public string call_id { get; set; }
    }
}
