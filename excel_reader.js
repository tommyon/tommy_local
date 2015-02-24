//指定ファイルのエクセル、セルB2[コピー元]H2[コピー先]に記載されているパスを元に
//フォルダをコピーするツール。
//現在はコピー先のフォルダ、ファイルを一旦削除しています。
//要はフォルダ間を同期する感じです。
//エクセルのセルを増やせばコピーするフォルダが増えます。
//フォルダがなければ、強制的にフォルダを作成します。
//以下注意事項があります。
//１．B2、H2のセルは必ず列で埋めて下さい。間があるとエラーになります。
//２．列に空白は作らないください。これもエラーになります。
//３．一個上のフォルダまで有無は確認しますが、それ以上はエラーとなります。

var fso = new ActiveXObject("Scripting.FileSystemObject");
var Shell = new ActiveXObject("Shell.Application");
var excelApp = WScript.CreateObject("Excel.Application");
var Book = excelApp.Workbooks.Open("C:\\Users\\tommy_on\\Desktop\\Sound_Copypath.xls");
var Sheet = Book.WorkSheets("Sheet1");
var usedRange	= Sheet.UsedRange;
var bottom	= usedRange.Rows(usedRange.Rows.Count).Row;//列の一番下取得

for (var i=2; i<bottom+1; i++)
{
	var end_B_cells = Sheet.Cells(i,2).value;
	var end_H_cells = Sheet.Cells(i,8).value;
	var Floder = Shell.NameSpace(end_H_cells);
	if(!fso.FolderExists(end_H_cells))
		{
			ParentFolder(end_H_cells);
		}
	else
		{
		var DelItems = Floder.Items();
		for(var j = 0 ; j<DelItems.count; j++)
			{
				var SetItem = DelItems.Item(j);
				if(SetItem.IsFolder == true)
					{
					fso.DeleteFolder(SetItem,true);
					}
				else if(SetItem.IsFile == true)
					{
					fso.DeleteFile(SetItem,true);
					}
			}
		}
	fso.CopyFolder(end_B_cells, end_H_cells);
}

function ParentFolder(end_H_cells) 
	{
    if (!fso.FolderExists(end_H_cells))
    	{
			if (fso.GetParentFolderName(end_H_cells))
				{
				// フォルダが存在しなかったので、親フォルダ生成
				createFolder(fso.GetParentFolderName(end_H_cells));
				fso.CreateFolder(end_H_cells);
				}
        }
    }
Book.Close();
fso = null;
excelApp.Quit();
excelApp = null;