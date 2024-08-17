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



        [HttpGet("group/fetch-table")]
        public IActionResult GetItems(int page, int pageSize)
        {

            var groups = ReadGroupsFromFile();
            var paginatedItems = groups
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

            var totalItems = groups.Count;
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            return Ok(new
            {
                Data = paginatedItems,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            });

        }


        [HttpPost("user/add-new-group")]
        public IActionResult AddNewGroup([FromBody] Group group)
        {

            if (group == null)
            {
                return BadRequest("Invalid user data.");
            }
            var groups = ReadGroupsFromFile();


            string currentDateTime = DateTime.Now.ToString();
            Guid id = Guid.NewGuid();

            groups.Add(new Group (group.GroupName , group.GroupDiscription , currentDateTime , id  ));

            WriteGroupsToFile(groups);

            return Ok(new { Message = true, groups = group });
        }

        [HttpPost("group/single-delete/{id}")]
        public IActionResult DeleteGroup([FromRoute] string id)
        {

            var groups = ReadGroupsFromFile();
            Group existingGroup = groups.FirstOrDefault(u => u.ID.ToString() == id);



            if (existingGroup != null)
            {
                groups.Remove(existingGroup);

                WriteGroupsToFile(groups);

                return Ok();
            }

            return Conflict();

        }

        [HttpPost("group/group-list-delete")]
        public IActionResult DeleteSelectedGroup([FromBody] List<Guid> numbers)
        {

            var groups = ReadGroupsFromFile();

            // Filter out the groups that need to be removed
            var groupsToRemove = groups.Where(g => numbers.Contains(g.ID)).ToList();

            foreach (var user in groupsToRemove)
            {
                groups.Remove(user);
            }

            WriteGroupsToFile(groups);
            return Ok();
        }


        public IActionResult Index()
        {
            return View();
        }
    }

    public class Group
    {
        public Group(string groupName, string groupDiscription, string createdDate, Guid iD)
        {
            GroupName = groupName;
            GroupDiscription = groupDiscription;
            CreatedDate = createdDate;
            ID = iD;
        }

        public string GroupName { get; set; }
        public string GroupDiscription { get; set; }
        public string CreatedDate { get; set; }
        public Guid ID { get; set; }
    }
}
