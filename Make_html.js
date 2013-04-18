MakeHTML();
function MakeHTML(){

var fsoObj = new ActiveXObject("Scripting.FileSystemObject");
var Shell = new ActiveXObject("Shell.Application");
var sh = new ActiveXObject( "WScript.Shell" );

    var objFolder = Shell.BrowseForFolder( 0, "フォルダ選択\nImage_Captureを選択して下さい。",  512, "D:\\Image_Capture" );
    if(!objFolder)
    {
        var Ed = XSIUIToolkit.Msgbox( "警告", siMsgOkOnly | siMsgQuestion, "フォルダを選択してください" );
        return;
    }

var BasePath = objFolder.Items().Item().Path;
var Folder_IDs = objFolder.Items();
var ARRAY = new Array();
var ARRAY_AVI = new Array();
var ID,ID_Path;

    for (var a=0; a<Folder_IDs.Count; a++)
        {
             var CheckItem = Folder_IDs.Item(a).name;
             var Name_Check = new RegExp("etc");
                        if (! CheckItem.match(Name_Check))
                        {
                            var ID_Folder = Folder_IDs.Item(a);
                            var GetScenesF = fsoObj.GetFolder(ID_Folder.path);
                            ID = ID_Folder;
                            ID_Path = GetScenesF;
                            var GetScenes = new Enumerator( GetScenesF.Files );
                                for( GetScenes.moveFirst(); !GetScenes.atEnd(); GetScenes.moveNext() )
                                    {
                                    var objItem = GetScenes.item();
                                        if (fsoObj.GetExtensionName(objItem) == "jpg")
                                               {
                                                    var strItems_P = fsoObj.GetBaseName(objItem);
                                                    var Jpeg = strItems_P+".jpg";
                                                    var Push_Ma = "<tr bgcolor='#fffff0'><td>" + strItems_P + "</td><td><p><img src='"+Jpeg+"' alt='説明文'></p></td><td><a href='"+ID_Path+"\\MOVIE\\"+strItems_P+"_CAP.html'>動画</a></td><td><button onclick='ExecBat()'>フォルダ開く(IEのみ)</button></td></tr>";
                                                    ARRAY.push(Push_Ma);
                                                }
                                        else if(fsoObj.GetExtensionName(objItem) == "avi")
                                                {
                                                    var strItems_AVI = fsoObj.GetBaseName(objItem);                                                    
                                                    ARRAY_AVI.push(strItems_AVI);
                                                }
                                    }
                        }
                        else
                        {
                            var ETC = Folder_IDs.Item(a);
                            var ETC_Folder = Folder_IDs.Item(a).path;
                            if (!fsoObj.FolderExists(ETC_Folder))
                                {
                                    var a = fsoObj.CreateFolder(ETC_Folder);
                                }
                            var oFolder = fsoObj.GetFolder(ETC_Folder);
                            var RE_PATH = ETC_Folder+"\\"+ID+".bat";
                            var BATFILE_HTML = new String(RE_PATH);
                            BATFILE_HTML = BATFILE_HTML.replace(/\\/g,"\\\\");
                        }
        //////////////////////////////////////////////////////////////////////////////////////////////
        //HTML
        var TextFile = fsoObj.BuildPath(ID_Path, ID+".html");
        fsoObj.CreateTextFile(TextFile);
        var OpenFile = fsoObj.BuildPath(ID_Path, ID+".html");
        var objWrite = fsoObj.OpenTextFile(OpenFile, 2, true);
        objWrite.WriteLine("<html>");
        objWrite.WriteLine("<head>");
        objWrite.WriteLine("<meta http-equiv='Content-Type' Content='text/html; charset=shift_jis'>");
        objWrite.WriteLine("<title>カット説明</title>");
        objWrite.WriteLine("<script type='text/javascript'>");
        objWrite.WriteLine("function ExecBat() {");
        objWrite.WriteLine("var WshShell = new ActiveXObject('WScript.Shell');");
        objWrite.WriteLine("WshShell.run('" +BATFILE_HTML + "');");
        objWrite.WriteLine("</script>");
        objWrite.WriteLine("</head>");
        objWrite.WriteLine("<body bgcolor='#c0c0c0'>");
        objWrite.WriteLine("<table border='1'>");
        objWrite.WriteLine("<caption ><h1 align='center'><font color='#dc143c'>" + ID + "</font></h1></caption>");
        objWrite.WriteLine("<tr><td align='center' bgcolor='#ffefd5'>シーン名</td><td  align='center'  bgcolor='#ffefd5'>イメージ</td><td  align='center'  bgcolor='#ffefd5'>注釈</td><td  align='center'  bgcolor='#ffefd5'>フォルダ</td></tr>");
        for (var b=0; b<ARRAY.length; b++)
            {
               objWrite.WriteLine(ARRAY[b]);
            }
        objWrite.WriteLine("</table>");
        objWrite.WriteLine("<h1 align='center'><a href='D:\\Image_Capture\\Top.html'>TOP</a></h1>");
        objWrite.WriteLine("</body>");
        objWrite.WriteLine("</html>");
        objWrite.Close();
        objWrite = null;
        ///////////////////////////////////////////////////////////////////////////////////////////////
        var ARRAY = new Array();
        var ARRAY_AVI = new Array();
    }
fsoObj = null;
WScript.Echo("終わり");
}