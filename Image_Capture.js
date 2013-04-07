Image_Capture();
function Image_Capture(){
	SetValue("preferences.scripting.cmdlog", false, null);
	var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	var Shell = new ActiveXObject("Shell.Application")
	var objFolder = Shell.BrowseForFolder( 0, "フォルダ選択",  512, "D:\\" );
	if(!objFolder)
	{
    	var Ed = XSIUIToolkit.Msgbox( "警告", siMsgOkOnly | siMsgQuestion, "フォルダを選択してください" );
    	return;
	}
	var Folder_Create = "D:\\Image_Capture";
	if (!objFSO.FolderExists(Folder_Create))
		{
		var Create = objFSO.CreateFolder(Folder_Create);
		}
//var BasePath = objFolder.Items().Item().Path;//フルパス
var objFolderItems = objFolder.Items();
for (var a=0; a<objFolderItems.Count; a++)
{
	var objItem = objFolderItems.Item(a).Path;//プロジェクトフォルダGET();
	var objF =Shell.NameSpace(objItem);
	var FolderItem = objF.items();
	for(j=0; j < FolderItem.Count; j++)
	{
	var CheckItem = FolderItem.Item(j).name;
	var Name_Check = new RegExp("Scenes")
		if (CheckItem.match(Name_Check))
			{
			var Scene_Folder = FolderItem.Item(j);
			var GetScenesF = objFSO.GetFolder(Scene_Folder.path);
			var GetScenes = new Enumerator( GetScenesF.Files );
			for( GetScenes.moveFirst(); !GetScenes.atEnd(); GetScenes.moveNext() )
			{
				var Name = GetScenes.item().Name;
				var Base_Name = objFSO.GetBaseName(Name);
				if (objFSO.GetExtensionName(Name) == "scn")
							{
								var Out_Files = Folder_Create + "//" + objFolderItems.Item(a);
								if (!objFSO.FolderExists(Out_Files))
									{
									var Create = objFSO.CreateFolder(Out_Files);
									}
								var oFolder = objFSO.GetFolder(Out_Files);
								OpenScene(GetScenesF+"\\"+Name,false);
								var oProject = ActiveProject;
								var oScene = oProject.ActiveScene;
								var oStart = GetValue("PlayControl.In");
								var oEnd = GetValue("PlayControl.Out");
								var Cell = Math.ceil(oEnd/2);
								SetValue( "ViewportCapture.Filename",  oFolder.Path + "\\" + Base_Name +".jpg" );//保存ディレクトリ
								SetValue( "ViewportCapture.IsMovie", true );
								SetValue( "ViewportCapture.FrameRate", 30 );
								SetValue( "ViewportCapture.WriteAlpha", false );
								SetValue( "ViewportCapture.Start", Cell );
								SetValue( "ViewportCapture.End", Cell );
								SetValue("ViewportCapture.LaunchFlipbook", false, null);
								CaptureViewport(2.1);
							}
				}
			
							
				}
			}
		}
var Ed = XSIUIToolkit.Msgbox( "おしまい", siMsgOkOnly | siMsgQuestion, "おしまい" );
SetValue("preferences.scripting.cmdlog", true, null);
}