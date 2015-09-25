using codefirst_mysql_todo.Models;
using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace codefirst_mysql_todo.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<codefirst_mysql_todo.Models.TaskDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;

            SetSqlGenerator("MySql.Data.MySqlClient", new MySql.Data.Entity.MySqlMigrationSqlGenerator());

            SetHistoryContextFactory("MySql.Data.MySqlClient", (conn, schema) => new MySqlHistoryContext(conn, schema)); //here s the thing.

        }

        protected override void Seed(codefirst_mysql_todo.Models.TaskDBContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Tags.Add(new TagModel() { Id = Guid.NewGuid(), Title = "First" });
            context.Tags.Add(new TagModel() { Id = Guid.NewGuid(), Title = "Second" });

            context.Tasks.Add(new TaskModel() { Id = Guid.NewGuid(), 
                Title = "Test task",
                Description = "Description is here",
                CreateDate = DateTime.Now
            });
        }
    }
}
