using System;
using System.Collections.Generic;

namespace KazanControl
{
    class Program
    {
        static void Main(string[] args)
        {
            var arguments = new Dictionary<string, string>();

            foreach (var arg in args)
            {
                if (arg.StartsWith("--") && arg.Contains("="))
                {
                    var parts = arg.Substring(2).Split('=', 2);
                    arguments[parts[0].ToLower()] = parts[1];
                }
            }

            string user = arguments.ContainsKey("user") ? arguments["user"] : "";
            string password = arguments.ContainsKey("password") ? arguments["password"] : "";
            string switchState = arguments.ContainsKey("switch") ? arguments["switch"].ToLower() : "";

            if (user != "bosch" || password != "bosch60")
            {
                Console.WriteLine("Nem megfelelő felhasználónév / jelszó");
                return;
            }


            if (switchState == "on")
            {
                Console.WriteLine("Working");
            }
            else if (switchState == "off")
            {
                Console.WriteLine("System down");
            }
            else
            {
                Console.WriteLine("Hibás bemeneti adat!");
            }
        }
    }
}
