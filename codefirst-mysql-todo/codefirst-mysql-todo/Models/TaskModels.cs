using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace codefirst_mysql_todo.Models
{
    public class TaskModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? FinishDate {  get; set; }

        public virtual List<TagModel> Tags { get; set; }
    }

    public class TagModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public virtual List<TaskModel> Tasks { get; set; }
    }

    public class TaskDBContext : DbContext
    {
        public DbSet<TagModel> Tags { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }

        public TaskDBContext() : base("MySqlConnection")
        {

        }

    }
}