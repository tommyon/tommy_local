var oSelection = Selection;
if(oSelection.count != 0)
{
for ( var i = 0; i < oSelection.count; ++i ) {

               if(oSelection(i).type != siModelType){var oSel = oSelection(i).model;}
               else{var oSel =oSelection(i);}
               var date = new Date();
               var year = date.getYear();
               var month = date.getMonth() + 1;
               var day = date.getDate();
               if (month < 10) { month = "0" + month; }
               if (day < 10) { day = "0" + day; }
                    var today = year+"/"+month+"/"+day;
                    var oStart = Getvalue("PlayControl.In");
                    var oEnd = Getvalue("PlayControl.Out");
                    var fso = new ActiveXObject("Scripting.FileSystemObject");
                    var oXSIAPP = new ActiveXObject( "XSI.Application").Application;
                    var oPass = "D:\\";

                    var oMessage = new Array();
                    var oScene_Name = ActiveProject.ActiveScene;
                    var oScene = ActiveProject2.Path + "\\Scenes\\" + oScene_Name +".scn";
                    var oProject = ActiveProject2.name;
                    var Created = fso.GetFile(oScene).dateCreated;
                    var oFolder = fso.GetFolder(oPass);
                    var oEFiles = new Enumerator(oFolder.Files);
                    while(!oEFiles.atEnd()){oMessage.push( oEFiles.item().Name );oEFiles.moveNext();}
                              for ( var m = 0; m < oMessage.length; ++m ) 
                              {
                                 if( oMessage[m] == oProject+".xls"  || oMessage[m] == oProject+".xlsx")
                                   {
                                        var oStr_Pass = oPass + "\\" + oMessage[m];
                                        var xlApp = new ActiveXObject("Excel.Application");
                                        xlApp.Visible = false;
                                        var xlWorkBook = xlApp.Workbooks.Open(oStr_Pass);
                                        var xlSheet = xlWorkBook.WorkSheets(1);
                                        	if(oSelection.count > 0)
                                        		{
                                        			var Kind = 0;
                                        			var Flag = 0;
                                        		}
                                        	else
                                        		{
                                        			var Kind = 1;
                                        			var Flag = 1;
                                        		}
                                        		Excel(Kind,Flag,oScene,oStart,oEnd,Created,today);
                                        		xlWorkBook.Save;
                                        		xlApp.quit();
                                        		xlWorkBook = null;
                                        		xlApp = null;
                                   }
                              }   
                    delete oFolder;
                    delete fso;
               }
     }
{
var Ed = XSIUIToolkit.Msgbox( "‚¨‚µ‚Ü‚¢", siMsgOkOnly | siMsgQuestion, "‚¨‚µ‚Ü‚¢" );
}


function Excel(kind,Flag,oScene,oStart,oEnd,Created,today)
{
		var used = xlSheet.UsedRange;
		var lastrow = used.Cells(used.Count).Row;
		var type = kind;
		var color = Flag;
		xlSheet.Cells(lastrow+1, 6).Value = oScene;
		xlSheet.Cells(lastrow+1, 7).Value = oStart;
		xlSheet.Cells(lastrow+1, 8).Value = oEnd;
		xlSheet.Cells(lastrow+1, 9).Value = Created;
		xlSheet.Cells(lastrow+1, 10).Value = today;
                Border(color,lastrow);
                CellColor(type,lastrow);
		xlWorkBook.Save;
}




function Border(color,lastrow)
{
	if(color == 0)
	{
			xlSheet.Cells(lastrow+1, 6).Borders.LineStyle = 1;
			xlSheet.Cells(lastrow+1, 7).Borders.LineStyle = 1;
			xlSheet.Cells(lastrow+1, 8).Borders.LineStyle = 1;
			xlSheet.Cells(lastrow+1, 9).Borders.LineStyle = 1;
			xlSheet.Cells(lastrow+1, 10).Borders.LineStyle = 1;
			xlSheet.Cells(lastrow+1, 6).Borders.Weight = 2;
			xlSheet.Cells(lastrow+1, 7).Borders.Weight = 2;
			xlSheet.Cells(lastrow+1, 8).Borders.Weight = 2;
			xlSheet.Cells(lastrow+1, 9).Borders.Weight = 2;
			xlSheet.Cells(lastrow+1, 10).Borders.Weight = 2;
	}
	if(color == 1)
	{
			xlSheet.Cells(lastrow+1, 6).Borders.LineStyle = 2;
			xlSheet.Cells(lastrow+1, 7).Borders.LineStyle = 2;
			xlSheet.Cells(lastrow+1, 8).Borders.LineStyle = 2;
			xlSheet.Cells(lastrow+1, 9).Borders.LineStyle = 2;
			xlSheet.Cells(lastrow+1, 10).Borders.LineStyle = 2;
			xlSheet.Cells(lastrow+1, 6).Borders.Weight = 1;
			xlSheet.Cells(lastrow+1, 7).Borders.Weight = 1;
			xlSheet.Cells(lastrow+1, 7).Borders.Weight = 1;
			xlSheet.Cells(lastrow+1, 8).Borders.Weight = 1;
			xlSheet.Cells(lastrow+1, 9).Borders.Weight = 1;
			xlSheet.Cells(lastrow+1, 10).Borders.Weight = 1;
	}
}


function CellColor(type,lastrow)
{
	switch (type)
	{
	case 0: 
			xlSheet.Cells(lastrow+1, 6).Interior.ColorIndex = 36;
			xlSheet.Cells(lastrow+1, 7).Interior.ColorIndex = 36;
			xlSheet.Cells(lastrow+1, 8).Interior.ColorIndex = 36;
			xlSheet.Cells(lastrow+1, 9).Interior.ColorIndex = 36;
			xlSheet.Cells(lastrow+1, 10).Interior.ColorIndex = 36;
	break;
	case 1:
			xlSheet.Cells(lastrow+1, 6).Interior.ColorIndex = 38;
			xlSheet.Cells(lastrow+1, 7).Interior.ColorIndex = 38;
			xlSheet.Cells(lastrow+1, 8).Interior.ColorIndex = 38;
			xlSheet.Cells(lastrow+1, 9).Interior.ColorIndex = 38;
			xlSheet.Cells(lastrow+1, 10).Interior.ColorIndex = 38;
	break;
	}
}


//	Excel‚Ì’è‹`
//	xlCellTypeLastCell	=	11
//	xlEdgeBottom		=	9
//	xlContinuous		=	1
//	xlMedium		=	-4138
//	xlAutomatic		=	-4105