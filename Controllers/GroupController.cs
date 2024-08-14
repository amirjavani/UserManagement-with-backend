using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace UserManagement.Controllers
{
    public class GroupController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

            
        public GroupController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        private List<Group> ReadGroupsFromFile()
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "groups.json");
            if (!System.IO.File.Exists(filePath))
            {
                return new List<Group>();
            }
            var jsonData = System.IO.File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<List<Group>>(jsonData);
        }

        private void WriteGroupsToFile(List<Group> groups)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "groups.json");
            var jsonData = JsonConvert.SerializeObject(groups, Formatting.Indented);
            System.IO.File.WriteAllText(filePath, jsonData);
        }

        [HttpGet("/groups")]
        public IActionResult GetGroups()
        {
            return Ok(new { Data = ReadGroupsFromFile() });
        }



        public IActionResult Index()
        {
            return View();
        }
    }

    public class Group
    {
        public string GroupName { get; set; }
        public string GroupDiscription { get; set; }
        public string CreatedDate { get; set; }
        public string ID { get; set; }
    }
}
