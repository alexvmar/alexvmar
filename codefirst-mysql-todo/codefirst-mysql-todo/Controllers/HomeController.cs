using codefirst_mysql_todo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace codefirst_mysql_todo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        [Authorize]
        public ActionResult List()
        {
            var list = new List<TaskModel>();

            using (var db = new TaskDBContext())
            {
                if (db.Tasks.Count() == 0)
                {
                    db.Tags.Add(new TagModel() { Id = Guid.NewGuid(), Title = "First" });
                    db.Tags.Add(new TagModel() { Id = Guid.NewGuid(), Title = "Second" });

                    db.Tasks.Add(new TaskModel()
                    {
                        Id = Guid.NewGuid(),
                        Title = "Test task",
                        Description = "Description is here",
                        CreateDate = DateTime.Now
                    });
                    db.SaveChanges();                    
                }
                list = db.Tasks.Include("Tags").ToList();
            }
            return View(list);
        }
    }
}
