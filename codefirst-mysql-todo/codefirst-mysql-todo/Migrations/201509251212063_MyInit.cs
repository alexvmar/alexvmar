namespace codefirst_mysql_todo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MyInit : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TagModels",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(unicode: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TaskModels",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(unicode: false),
                        Description = c.String(unicode: false),
                        CreateDate = c.DateTime(nullable: false, precision: 0),
                        FinishDate = c.DateTime(precision: 0),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TaskModelTagModels",
                c => new
                    {
                        TaskModel_Id = c.Guid(nullable: false),
                        TagModel_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.TaskModel_Id, t.TagModel_Id })
                .ForeignKey("dbo.TaskModels", t => t.TaskModel_Id, cascadeDelete: true)
                .ForeignKey("dbo.TagModels", t => t.TagModel_Id, cascadeDelete: true)
                .Index(t => t.TaskModel_Id)
                .Index(t => t.TagModel_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TaskModelTagModels", "TagModel_Id", "dbo.TagModels");
            DropForeignKey("dbo.TaskModelTagModels", "TaskModel_Id", "dbo.TaskModels");
            DropIndex("dbo.TaskModelTagModels", new[] { "TagModel_Id" });
            DropIndex("dbo.TaskModelTagModels", new[] { "TaskModel_Id" });
            DropTable("dbo.TaskModelTagModels");
            DropTable("dbo.TaskModels");
            DropTable("dbo.TagModels");
        }
    }
}
