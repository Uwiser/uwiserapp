using System;
using System.Net;
using System.Net.Mail;

namespace uwiserApi.Utils
{
    public class EmailUtils
    {
        private SmtpClient client;
        private String emailFrom;
        private String password;

        public EmailUtils()
        {
            this.emailFrom = "welcome@uwiser.jp";
            this.password = "uwiser@111213";

            Console.WriteLine("Criando client smtp");
            client = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(this.emailFrom, this.password)
            };
        }

        public string SendEmail(string subject, string body, string emailTo)
        {
            try
            {
                Console.WriteLine("Criando email");
                using (var mail = new MailMessage(this.emailFrom, emailTo)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                })
                {
                    if (this.client != null)
                    {
                        Console.WriteLine("Enviando email para: " + emailTo);
                        this.client.Send(mail);
                        Console.WriteLine("Email enviado");
                    }
                };

                return "Enviado com sucesso";
            }
            catch (SmtpFailedRecipientException smtpfEx)
            {
                Console.WriteLine("SmtpFailedRecipientException: " + smtpfEx.Message + " - " + smtpfEx);
                return smtpfEx.Message;
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine("SmtpException: " + smtpEx.Message + " - " + smtpEx);
                return smtpEx.Message;
            }
            catch (Exception erro)
            {
                Console.WriteLine("Exception: " + erro.Message);
                return erro.Message;
            }
        }

        public void Dispose()
        {
            this.client.Dispose();
        }
    }
}