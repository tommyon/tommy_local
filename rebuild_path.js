var fs = new ActiveXObject( "Scripting.FileSystemObject" );
var oProject = ActiveProject;
var oScene = oProject.ActiveScene;
var ImageClips = oScene.ImageClips;
var folder = fs.GetFolder( oProject+"\\"+"Pictures" );
var Hako = new Array();
var Hako_S = new Array();
for(var i = 0; i<ImageClips.count; i++)
{
	var Flag = 0;
	var oImageClip = ImageClips(i);
	var oSource = oImageClip.Source;
	var oName = oSource.Name;
	var oFileName = oSource.Parameters("FileName").Value;
	var OrignalPath = oSource.Parameters("Path").Value;
	var IndexNumber = oFileName.indexOf("Pictures");
	if(oSource.Name != "noIcon_pic")
	{
		if(IndexNumber != 0)
			{
			var strtemp = OrignalPath.lastIndexOf("Pictures");
			var NewRelativePath = OrignalPath.substring(strtemp,OrignalPath.length);
			oSource.Parameters("FileName").Value = NewRelativePath;
			}//IndexNumber != 0
		if( !fs.FileExists(OrignalPath) )
			{
				var RelativePath = oSource.Parameters("FileName").Value;
				var strtemp = RelativePath.lastIndexOf("\\")+1;
				var oName = RelativePath.substring(strtemp,RelativePath.Length);
				var FilePath = folder.path+"\\"+ oName;
				if(fs.FileExists(FilePath))
				{
						var NewFilePath = FilePath;
						var strtemp = NewFilePath.lastIndexOf("Pictures");
						var NewRelativePath = NewFilePath.substring(strtemp,NewFilePath.length);
						oSource.Parameters("FileName").Value = NewRelativePath
				}
				else
				{
					var tex = "\\[";
					if(oFileName.match(tex))
						{
							Flag = 1 ;
							Hako.length = 0;
							var kako_index1 = oFileName.indexOf("[");
							var kako_index2 = oFileName.indexOf(".");
							var kako_index3 = oFileName.indexOf(";");
							var kako_index4 = oFileName.indexOf("]");
							var kako_index5 = oFileName.lastIndexOf("\\")+1;
							var First = oFileName.substring(kako_index1+1,kako_index2);
							var End = oFileName.substring(kako_index1+4,kako_index3);
							var Count = oFileName.substring(kako_index3+1,kako_index4);
							var RE = oFileName.substring(kako_index5,kako_index1);
							var Set = End-First+1;
								for(var g = 0; g<Set; g++)
								{
									Change = oFileName.split("[");
									First_Time = new Number(First);
									Change[1] = First_Time + g ;
									var String_Time = new String(Change[1]);
									for(var x = 0; x<Count; x++)
										{	
											if(String_Time.length<Count)
												{
													String_Time = "0" + String_Time;
												}
										}
								var extension = String_Time+ ".tga";
								var File_Rename = RE + extension;
								Hako.push(RE + extension);
								Hako_S.push(oSource);
								}
						}//match(tex)
					else
						{
						Logmessage("サーチ対処"+oSource);
						search(folder,oName,oSource);
						}
					if(Flag == 1)
						{
							if(Hako.length>0)
							{
								Logmessage("連番サーチ対処"+oSource);
								search_renban(folder,Hako,oSource,oName);				
							}		
						}
				}//fileExits
			}//FileExists
	}//noIcon_pic
}//for
var Ed = XSIUIToolkit.Msgbox( "おしまい", siMsgOkOnly | siMsgQuestion, "おしまい" );



function search(data,data2,oSource)
{
	var oChildren = data.SubFolders;
	var emfolders = new Enumerator( oChildren );
	var FileName2 = data2; 
	for( emfolders.moveFirst(); !emfolders.atEnd(); emfolders.moveNext() )
	{
		var oChildFolder = emfolders.item();
		if(oChildFolder.Name == "thumbnail")
		{
			continue;
		}

		if( fs.FileExists(oChildFolder.Path+"\\"+data2) )
		{
			var File = fs.GetFile(oChildFolder.Path+"\\"+data2);
			var NewFilePath = File.Path;
			var strtemp = NewFilePath.lastIndexOf("Pictures");
			var NewRelativePath = NewFilePath.substring(strtemp,NewFilePath.length);
			oSource.Parameters("FileName").Value = NewRelativePath;
		}
		search(oChildFolder,data2,oSource)
	}
}

function search_renban(data,data2,oSource,Name)
{
	var oChildren = data.SubFolders;//subfloder_GET
	var emfolders = new Enumerator( oChildren );
	for( emfolders.moveFirst(); !emfolders.atEnd(); emfolders.moveNext() )
	{
		var oChildFolder = emfolders.item();
		if(oChildFolder.Name == "thumbnail")
		{
			continue;
		}
		var Length_Check = 0;
		for(var r = 0; r<data2.length; r++)
			{
			if(fs.FileExists(oChildFolder.Path+"\\"+data2[r]))
				{
				Length_Check =+ r;
				}
			}
		Logmessage(oChildFolder.Path);
		Logmessage(Length_Check+1 +"は"+ data2.length);
		if(Length_Check+1 == data2.length)
				{
				//Logmessage("OK");
				var NewFilePath = oChildFolder.Path+"\\"+oName;
				var strtemp = NewFilePath.lastIndexOf("\\\\Pictures\\\\");
				var NewRelativePath = NewFilePath.substring(strtemp,NewFilePath.length);
				//Logmessage(NewFilePath);
				//Logmessage("先頭から"+strtemp+"文字目");
				oSource.Parameters("FileName").Value = NewRelativePath;
				//Logmessage("最終形"+oSource.Parameters("FileName").Value);
				}
		else
				{
				//gmessage("無し次！");
				search_renban(oChildFolder,data2,oSource);
				}
	}
}
