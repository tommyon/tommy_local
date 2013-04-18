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

	var Flag = 0;
	var oFolder = Create(Flag,objFolder,objFSO);

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
								OpenScene(GetScenesF+"\\"+Name,false);
								var oStart = GetValue("PlayControl.In");
								var oEnd = GetValue("PlayControl.Out");
								var Cell = Math.ceil(oEnd/2);
								var oProject = ActiveProject.name;
								/*
								var Scene_Name = ActiveProject.ActiveScene.name;
								var Under = Scene_Name.indexOf("_");
								var haifun = Scene_Name.indexOf("-");
									if(Under > -1 )
										{	
											if(Under < haifun);
											{
											var Sce_Index = Scene_Name.indexOf("_");
											}
										}
									if( haifun > -1 )
										{
											if(haifun < Under)
												{
													var Sce_Index = Scene_Name.indexOf("-");
												}
										}
									if(haifun == -1 && Under == -1);
										{
											var Sce_Index = Scene_Name.length;
										}
									Logmessage(Sce_Index);
								var Sce_Base = Scene_Name.slice(0, Sce_Index);
								*/
								///////////////////////////////////////////////////////////////////////////////////////////////////////
								//この範囲でファイル生成
								var Str_Path = new String(GetScenesF+"\\");
								var JS_Path = Str_Path.replace(/\\/g, "\\\\"); 
								var Flag = 1;
								var oFolder = Create(Flag,oProject,objFSO);
								var etc = "etc";
								var js = "js";
								var bat = "bat";
								var oFolder_etc = Create(Flag,"etc",objFSO);
									if (objFSO.FileExists(oFolder_etc.path+"\\"+ oProject +".js") == false)
										{
											Txt(oFolder_etc.path,oProject,objFSO,js,JS_Path);
										}
									if (objFSO.FileExists(oFolder_etc.path+"\\"+ oProject +".bat") == false)
										{
											Txt(oFolder_etc.path,oProject,objFSO,bat,JS_Path);
										}
								///////////////////////////////////////////////////////////////////////////////////////////////////////
								SetValue( "ViewportCapture.Filename",  oFolder.Path + "\\" + Base_Name +".jpg" );//保存ディレクトリ
								SetValue( "ViewportCapture.Start", Cell );
								SetValue( "ViewportCapture.End", Cell );
								//SetValue( "ViewportCapture.Filename",  oFolder.Path + "\\" + Base_Name +".avi" );//保存ディレクトリ
								//SetValue( "ViewportCapture.Start", oStart );
								//SetValue( "ViewportCapture.End", oEnd );
								SetValue( "ViewportCapture.IsMovie", true );
								SetValue( "ViewportCapture.FrameRate", 30 );
								SetValue( "ViewportCapture.WriteAlpha", false );
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



function Create(Flag,oProject,objFSO)
{
	if (Flag == 0)
		{
			var Folder_Create = "D:\\Image_Capture";
		}
	else
		{
			var Folder_Create = "D:\\Image_Capture\\"+oProject;
		}

		if (!objFSO.FolderExists(Folder_Create))
			{
				var Create = objFSO.CreateFolder(Folder_Create);
			}
	var oFolder = objFSO.GetFolder(Folder_Create);	
	return oFolder;
}

function Txt(Folder_Path,oProject,objFSO,Flag_Txt,JS_Path)
{
	if(Flag_Txt == "js")
		{
			var JS1 = "var sh = new ActiveXObject( 'Shell.Application' );";
			var JS2 = "sh.Open('" + JS_Path + "');";//ここだけプロジェクト毎に設定が必要
			var JS3 = "sh = null;";
			if (objFSO.FileExists(Folder_Path+"\\"+ oProject +".js") == true)
				{
					var OUTFILE = objFSO.Getfile(Folder_Path+"\\"+oProject+".js");
					objFSO.DeleteFile( OUTFILE );
				}


			var TextFilePath = Folder_Path + "\\" + oProject + ".txt";
			var TextCode = objFSO.CreateTextFile(TextFilePath, true, true);
			TextCode.WriteLine(JS1);
			TextCode.WriteLine(JS2);
			TextCode.WriteLine(JS3);
			TextCode.Close();
			TextCode = null;
			var FILE_Txt = objFSO.Getfile(TextFilePath);
			var Pre_FIX = objFSO.GetBaseName(FILE_Txt);
			var Re_NAME = Pre_FIX+".js";
			var RE = FILE_Txt.Name = Re_NAME;
		}
	else if(Flag_Txt == "bat")
		{

			var B_txt =  Folder_Path + "\\"  ;
			var BAT1 = "cd  " + Folder_Path;
			var BAT2 = "start " + B_txt + oProject + ".js";	
			if (objFSO.FileExists(Folder_Path+"\\"+ oProject +".bat") == true)
				{
					var OUTFILE = objFSO.Getfile(Folder_Path+"\\"+oProject+".bat");
					objFSO.DeleteFile( OUTFILE );
				}
			//var adTypeBinary = 1; // バイナリ
			var adTypeText   = 2; // テキスト
			var adReadAll  = -1; // 全行
			//var adReadLine = -2; // 一行ごと
			var adWriteChar = 0; // 改行なし
			var adWriteLine = 1; // 改行あり
			//var adSaveCreateNotExist  = 1; // ない場合は新規作成
			var adSaveCreateOverWrite = 2; // ある場合は上書き
			var UTF_Text = new ActiveXObject("ADODB.Stream");
			var TextFilePath = Folder_Path + "\\" + oProject + '.txt';
				UTF_Text.Type = adTypeText;
				UTF_Text.charset = "utf-8";
				UTF_Text.Open();
				UTF_Text.WriteText(BAT1,1)
				UTF_Text.WriteText(BAT2,1);
				UTF_Text.SaveToFile( TextFilePath, adSaveCreateOverWrite );
				UTF_Text.Close();
				UTF_Text = null;
			var FILE_Txt = objFSO.Getfile(TextFilePath);
			var Pre_FIX = objFSO.GetBaseName(FILE_Txt);
			var Re_NAME = Pre_FIX+".bat";
			var RE = FILE_Txt.Name = Re_NAME;
		}
}



