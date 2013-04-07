//////////////////////////////////////////////////////////////////////
//èâä˙èàóù
var oXSI = new ActiveXObject( "XSI.Application" );
var oXSIAPP = oXSI.Application;
var oXSIUIT = new ActiveXObject( "XSI.UIToolkit" );
var oXSIFactory = new ActiveXObject( "XSI.Factory" );
var oProgressBar = oXSIUIT.ProgressBar ;
oProgressBar.Maximum = 6 ;
oProgressBar.Step = 1;
oProgressBar.Caption = "ç°èàóùíÜÅc";
oProgressBar.CancelEnabled = false ;
oProgressBar.Visible = true;
oXSIAPP.SetValue("preferences.scripting.cmdlog", false, null);
////////////////////////////////////////////////////////////////////////////
var scn = ActiveProject.ActiveScene;
var matlibs = scn.MaterialLibraries;
SetCurrentMaterialLibrary(matlibs(0));
var First = matlibs(0).name = "Lib_Def";
for(var i=0; i<matlibs.count;i++)
	{
	var A = matlibs(i).Items;
		if(A.Count > 0)
			{
				var B = SelectObj(A);
				var oSel = Getvalue("SelectionList");
				if(matlibs(i).name != First )
					{
					for(var q=0; q<oSel.count;q++)
						{
						MoveToLibrary(oSel(q), matlibs(0));
						}
					}
			}
	var C = matlibs(i).Items;//return_Sel
	if(C.Count<1)
		{
			DeleteObj(matlibs(i));
		}
	}
DeleteAllUnusedMaterials();
oProgressBar.Increment() ;
DeleteUnusedImageSources();
oProgressBar.Increment() ;
DeleteUnusedImageClips();
oProgressBar.Increment() ;
oProgressBar.Visible = false ;
oXSIAPP.SetValue("preferences.scripting.cmdlog", true, null);
var Ed = XSIUIToolkit.Msgbox( "Ç®ÇµÇ‹Ç¢", siMsgOkOnly | siMsgQuestion, "Ç®ÇµÇ‹Ç¢" );