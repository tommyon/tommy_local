Use_tex();

function Use_tex(){
var oXSI = new ActiveXObject( "XSI.Application" );
var oXSIAPP = oXSI.Application;
var oXSIUIT = new ActiveXObject( "XSI.UIToolkit" );
var oXSIFactory = new ActiveXObject( "XSI.Factory" );
var ohako = oXSIFactory.CreateObject( "XSI.Collection" );
var oSources = oXSIAPP.ActiveProject.ActiveScene.NestedObjects("Sources") ;
var oSouImg = oSources.NestedObjects("Images");
for ( var i=0, a = oSouImg.NestedObjects.Count; i < a; i++ ) 
		{
		var Image = oSouImg.NestedObjects(i);
		var Str_Image = new String(Image.filename.value);
		var Cut_Path = Str_Image.lastIndexOf("\\");
		var New_Path = Str_Image.substring(Cut_Path+1,Str_Image.length);
		var Image_Set = new String(New_Path);
		ohako.add(Image_Set)
		} 
	var fs = new ActiveXObject('Scripting.FileSystemObject');
	var scenePath = ActiveProject.ActiveScene.Parameters('Filename').Value;
	var BaseName = fs.GetBaseName(scenePath);
	var FolderPath = fs.GetParentFolderName(scenePath);
	var TextFilePath = FolderPath + '/' + BaseName + '_USE_TEX.txt';
	var TextCode = fs.CreateTextFile("Z:\\" +BaseName + '_USE_TEX.txt', true, false);
	for ( u=0 ; u <ohako.count ;  u++)
 		{
 		TextCode.WriteLine(ohako(u));
		}
	TextCode.Close();
	var Ed = XSIUIToolkit.Msgbox( "おしまい", siMsgOkOnly | siMsgQuestion, "おしまい" );
}