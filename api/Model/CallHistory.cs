using System;
using Dapper.Contrib.Extensions;

namespace uwiserApi.Model
{
    [Table("call_history")]
    public class CallHistory
    {
        [Key]
        public long Id { get; set; }
        public long CallId { get; set; }

        public Decimal Cost { get; set; }
        public string CustomData { get; set; }
        public long Duration { get; set; }
        // public bool Incoming { get; set; }
        public string LocalNumber { get; set; }
        public string RemoteNumber { get; set; }
        public string RemoteNumberType { get; set; }
        public DateTime StartTime { get; set; }
        public long UserId { get; set; }

        public long OtherUserId { get; set; }
        public string UrlFile { get; set; }

        public string Type { get; set; }

        public string DisplayName { get; set; }

        public string OtherDisplayName { get; set; }

    }
}
