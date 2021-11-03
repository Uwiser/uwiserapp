using System;

namespace uwiserApi.Model
{
    public class Password
    {
        public int Id { get; set; }
        public string Oldpassword { get; set; }
        public string Newpassword { get; set; }
    }
}