using System;
using System.ComponentModel.DataAnnotations;

namespace Model.Timer
{
    public class TimerAsync<T>
    {
        [Key]
        private string name { get; set; }

        public System.Threading.Timer timer { get; set; }

        public readonly object _threadLock = new object();

        public T dto { get; set; }

        public TimerAsync(string _name, T dto)
        {
            this.name = _name;
            this.dto = dto;
        }
        public void stop()
        {
            if (timer != null)
            {
                Console.WriteLine("Encerrando timer " + name);
                timer.Dispose();
            }

        }
    }
}