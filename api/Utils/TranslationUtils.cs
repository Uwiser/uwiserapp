using Google.Api.Gax.ResourceNames;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Storage.V1;
using Google.Cloud.Translate.V3;
using Grpc.Auth;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.IO;

namespace uwiserApi.Utils
{
    public class TranslationUtils
    {
        public string Translate(string text, string sourceLanguage, string targetLanguage)
        {
            var request = WebRequest.CreateHttp("https://translation.googleapis.com/language/translate/v2?key=AIzaSyA52FPZV_tS-L4HT6wQOP9XvuKN6jYXDL4&q=" + text + "&target=" + targetLanguage + "&source=" + sourceLanguage + "&format=text");
            request.Method = "GET";

            using (var response = request.GetResponse())
            {
                var streamDados = response.GetResponseStream();
                StreamReader reader = new StreamReader(streamDados);
                object objResponse = reader.ReadToEnd();
                streamDados.Close();
                response.Close();

                dynamic json = JsonConvert.DeserializeObject(objResponse.ToString());
                Console.WriteLine(json.data.translations[0].translatedText);
                return json.data.translations[0].translatedText;
            }
        }
    }
}