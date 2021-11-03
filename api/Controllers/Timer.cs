using System;
using System.IO;
using Voximplant.API;

namespace Controllers
{
    public class Timer
    {
        private VoximplantAPI _voximplantAPI;

        public static long ULTIMOID = 0;
        public Timer()
        {
            var pathCompleto = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location).ToString(), "resources" + Path.DirectorySeparatorChar + "key-vox.json");
            var config = new ClientConfiguration
            {
                KeyFile = pathCompleto
            };
            //   var api = new VoximplantAPI(config);
            this._voximplantAPI = new VoximplantAPI(config);
        }
        public void initTimer()
        {
            var teste = new System.Threading.Timer(Timeout, "timer", 5 * 1000, 5 * 1000);
        }


        public void Timeout(Object state)
        {

        }
    }
}