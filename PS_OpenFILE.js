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
alert(filename + " �̓Z�[�u����Ă��܂���B");
return false;
}
}