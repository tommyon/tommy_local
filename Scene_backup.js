date = new Date();
month = date.getMonth() + 1;
day = date.getDate();
if (month < 10) { month = "0" + month; }
if (day < 10) { day = "0" + day; }
hours = date.getHours();
minutes = date.getMinutes();
second = date.getSeconds();
var Time = "__"+month+"th"+day+"day---"+hours+"h"+minutes+"m"+second+"s";
///////////////////////////////////////////////
var Fso = new ActiveXObject( "Scripting.FileSystemObject" );
var Scene_root = ActiveProject.ActiveScene.Filename.Value;
var Scene_Name = ActiveProject.ActiveScene;
var Path = ActiveProject2.Path+"\\Scenes\\ver\\";
if (!Fso.FolderExists(Path))
{
     var a = Fso.CreateFolder(Path);
}
var Rename = Path+Scene_Name+Time+".scn";
///////////////////////////////////////////////
Fso.CopyFile(Scene_root,Rename);
Fso = null;
///////////////////////////////////////////////