using System;
using Dapper.Contrib.Extensions;

namespace uwiserApi.Model
{
    [Table("payment_history")]
    public class PaymentHistory
    {
        [Key]
        public long id { get; set; }
        public long user_id { get; set; }
        public Decimal value { get; set; }
        [Write(false)]
        public DateTime created { get; set; }
        public string currency { get; set; }
        public long seconds { get; set; }
    }
}
