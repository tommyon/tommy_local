//�w��t�@�C���̃G�N�Z���A�Z��B2[�R�s�[��]H2[�R�s�[��]�ɋL�ڂ���Ă���p�X������
//�t�H���_���R�s�[����c�[���B
//���݂̓R�s�[��̃t�H���_�A�t�@�C������U�폜���Ă��܂��B
//�v�̓t�H���_�Ԃ𓯊����銴���ł��B
//�G�N�Z���̃Z���𑝂₹�΃R�s�[����t�H���_�������܂��B
//�t�H���_���Ȃ���΁A�����I�Ƀt�H���_���쐬���܂��B
//�ȉ����ӎ���������܂��B
//�P�DB2�AH2�̃Z���͕K����Ŗ��߂ĉ������B�Ԃ�����ƃG���[�ɂȂ�܂��B
//�Q�D��ɋ󔒂͍��Ȃ����������B������G���[�ɂȂ�܂��B
//�R�D���̃t�H���_�܂ŗL���͊m�F���܂����A����ȏ�̓G���[�ƂȂ�܂��B

var fso = new ActiveXObject("Scripting.FileSystemObject");
var Shell = new ActiveXObject("Shell.Application");
var excelApp = WScript.CreateObject("Excel.Application");
var Book = excelApp.Workbooks.Open("C:\\Users\\tommy_on\\Desktop\\Sound_Copypath.xls");
var Sheet = Book.WorkSheets("Sheet1");
var usedRange	= Sheet.UsedRange;
var bottom	= usedRange.Rows(usedRange.Rows.Count).Row;//��̈�ԉ��擾

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
				// �t�H���_�����݂��Ȃ������̂ŁA�e�t�H���_����
				createFolder(fso.GetParentFolderName(end_H_cells));
				fso.CreateFolder(end_H_cells);
				}
        }
    }
Book.Close();
fso = null;
excelApp.Quit();
excelApp = null;