using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using UserManagement.Models;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Collections;
using String = System.String;




namespace UserManagement.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;
        
        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }

        private List<User> ReadUsersFromFile()
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "data.json");
            if (!System.IO.File.Exists(filePath))
            {
                return new List<User>();
            }
            var jsonData = System.IO.File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<List<User>>(jsonData);
        }

        private void WriteUsersToFile(List<User> users)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "data.json");
            var jsonData = JsonConvert.SerializeObject(users, Formatting.Indented);
            System.IO.File.WriteAllText(filePath, jsonData);
        }




        [HttpGet("home/fetch")]
        public IActionResult GetItems(int page , int pageSize )
        {

            var users = ReadUsersFromFile();
            var paginatedItems = users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

            var totalItems = users.Count;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return Ok(new
            {
                Data = paginatedItems,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            });

        }

        [HttpGet("home/search")]
        public IActionResult Search(int page , int pageSize ,string input )
        {

            var totalUsers = ReadUsersFromFile();


            List<User> users = [];
            
            
            totalUsers.ForEach(e => {
                if(e.FirstName.StartsWith(input) || e.LastName.StartsWith(input)|| e.Phone.StartsWith(input)|| e.State.StartsWith(input)|| e.City.StartsWith(input)|| e.Group.StartsWith(input)) 
                { users.Add(e); } 
            });
            
            
            var paginatedItems = users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

            var totalItems = users.Count;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return Ok(new
            {
                Data = paginatedItems,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            });

        }
        
        
        [HttpPost("home/add")]
        public IActionResult PostUser([FromBody] User user)
        {

            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }
            var users = ReadUsersFromFile();
            var existingUser = users.FirstOrDefault(u => u.ID == user.ID);
            if (existingUser != null)
            {
                return Conflict(new { Message = false });
            }

            // Add the new user
            users.Add(user);

            WriteUsersToFile(users);

            return Ok(new { Message = true, User = user });
        }




        [HttpPost("home/edit/{id}")]
        public IActionResult EditUser([FromBody] User user , [FromRoute] string id)
        {

            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }
            var users = ReadUsersFromFile();
            User existingUser = users.FirstOrDefault(u => u.ID == user.ID);
            

            if (user.ID != id)
            { 
                if (existingUser != null)
                {
                    return Conflict(new { Message = false });
                }

            }



            foreach (User obj in users)
            {
                if (obj.ID == id)
                {
                    obj.ID = user.ID;
                    obj.FirstName = user.FirstName;
                    obj.LastName = user.LastName;
                    obj.Phone = user.Phone;
                    obj.State = user.State;
                    obj.Group = user.Group;
                    obj.City = user.City;
                    break;
                }
            }

            Console.WriteLine(users);

            WriteUsersToFile(users);

            return Ok(new { Message = true, User = user });
        }
        
        
        [HttpPost("home/remove/{id}")]
        public IActionResult DeleteUser([FromRoute] string id)
        {

            var users = ReadUsersFromFile();
            User existingUser = users.FirstOrDefault(u => u.ID == id);
            

            
            if (existingUser != null)
            {
                users.Remove(existingUser);

                WriteUsersToFile(users);

                return Ok();
            }

            return Error();

        }


        [HttpPost("home/removeList")]
        public IActionResult DeleteUsers([FromBody] List<int> numbers)
        {

            var users = ReadUsersFromFile();

            // Filter out the users that need to be removed
            var usersToRemove = users.Where(u => numbers.Contains(int.Parse(u.ID))).ToList();

            foreach (var user in usersToRemove)
            {
                users.Remove(user);
            }

            WriteUsersToFile(users);
            return Ok();
        }


        [HttpPost("home/save")]
        public IActionResult SaveData([FromBody] List<User> data)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "data.json");
            var jsonData = JsonConvert.SerializeObject(data, Formatting.Indented);
            System.IO.File.WriteAllText(filePath, jsonData);

            return Ok();
        }
        
        [HttpPost("home/download")]
        public IActionResult download()
        {
            var users = ReadUsersFromFile();
            return Ok(new { Data = users});
        }




        public IActionResult Index()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Group { get; set; }
        public string ID { get; set; }
    }
}
