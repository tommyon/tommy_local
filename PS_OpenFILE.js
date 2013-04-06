OpenFolder()

function OpenFolder()
{
var filename = activeDocument.name;
try
{
FilePath = activeDocument.path;
//alert(FilePath);
GetFolder = new Folder(FilePath);
GetFolder.execute();
return true;
}
catch(e)
{
alert(filename + " はセーブされていません。");
return false;
}
}