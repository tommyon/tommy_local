//SetValue("preferences.scripting.cmdlog", false, null);
var oPC = Dictionary.GetObject( "PlayControl" );//タイムレンジを取得
var DefStart = GetGlobal( "Key_StartFrame" );
var DefEnd = GetGlobal( "Key_EndFrame" );
var DefStart = oPC.In.value;
var DefEnd = oPC.Out.value;
var Current = oPC.Current.value;
var ohako = XSIFactory.CreateObject( "XSI.Collection" );

if(Selection.Count > 0)
{
var fso = new ActiveXObject("Scripting.FileSystemObject");
var Path = "C:\\SIClipM";
if (!fso.FolderExists(Path))
	{
	fso.CreateFolder(Path);
	}
var oP = XSIFactory.CreateObject( "CustomProperty" );
oP.name = "Motion_Drop";//タイトル表示

oP.AddParameter2( "FileName", siString,"SIClipM");
oP.AddParameter2( "FilePath", siString,Path);
oP.AddParameter2( "Setting", siInt4,  0,  0,  7 );
oP.AddParameter2( "Time", siBool,false);
oP.AddParameter2( "Start", siInt4, DefStart);
oP.AddParameter2( "End", siInt4, DefEnd);



///////////////////////////////////////////////////////////////////////////////////
var oL, oItem;//空の宣言
oL = oP.PPGLayout;//PPGを追加
	oL.AddRow();
		oL.SetAttribute( siUICX, 300 );     
		oL.AddGroup( "", true, 300);          
			oItem = oL.AddItem( "FileName", "ファイル名" );          
			oItem = oL.AddItem ("FilePath","FilePath",siControlFolder );       
			oItem.SetAttribute(siUINolabel,true);       
			oItem.SetAttribute (siUIWidthPercentage,80);
		oL.EndGroup();
oL.EndRow();
oL.AddRow();
oL.SetAttribute( siUICX, 330 );
	oL.AddGroup( "", true, 330);
		aItems = Array("コピー(モデル)", 0, "コピー(選択)", 1, "コピー(ポーズ(モデル))", 2, "コピー(ポーズ(選択))", 3,
                    "ペースト(元フレーム)", 4, "ペースト(現フレーム)", 5, "ペースト(ポーズ)", 6);
          	oItem = oL.AddEnumControl ( "Setting", aItems, "設定項目", siControlRadio );
	oL.EndGroup();
oL.EndRow();
oL.AddRow();
	oL.AddGroup( "", true, 330);
		oItem = oL.AddItem( "Time", "指定フレーム" );
		oItem = oL.AddItem( "Start", "開始フレーム" );
		oItem = oL.AddItem( "End", "終了フレーム" );
	oL.EndGroup();
oL.EndRow();

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////
//実行分
oL.Language = "JScript";
oL.Logic =   OnInit.toString()+
             Setting_OnChanged.toString()+
             Time_OnChanged.toString();
/////////////////////////////////////
function OnInit()
     {
          Setting_OnChanged();
          Time_OnChanged();
     }

function Setting_OnChanged()
{
var Setting_ON = PPG.Setting.value;
if(Setting_ON == 0 || Setting_ON == 1)
     {
     PPG.Time.show(true);
     }
else
     {
     PPG.Time.show(false);
	 PPG.Start.show(false);
     PPG.End.show(false);
     }
}

function Time_OnChanged()
{
var Time_ON = PPG.Time.value;
if(Time_ON == true)
     {
     PPG.Start.show(true);
     PPG.End.show(true);
     }
else
     {
     PPG.Start.show(false);
     PPG.End.show(false);
     }
}

//////////////////////////////////////////////////////////
//PPG呼び出し
var Inspect = InspectObj( oP, null, null, siModal ,false );

	if (Inspect == false)//実行
		{
		var Setting_Check = oP.Parameters("Setting").Value;
		var FileName_Check = oP.Parameters("FileName").Value;
		var FilePath_Check = oP.Parameters("FilePath").Value;
		var Time_Check = oP.Parameters("Time").Value;
		var Start_Check = oP.Parameters("Start").Value;
		var End_Check = oP.Parameters("End").Value;
//////////////////////////////////////////////////////////
//0→コピー(モデル)
//1→コピー(選択)
//2→コピー(ポーズ)
//3→ペースト(元フレーム)
//4→ペースト(現フレーム)
//5→ペースト(ポーズ)
		switch (Setting_Check)
			{
			case 0://コピー(モデル)
				var oSel;
				var Action_Flag = 2;
				var Flag = 0;
				var Copy_Flag = 0;
				Sel(Flag);
				oSel = Getvalue("SelectionList");
				var Sel_type = 0;
				Copy(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Copy_Flag,Sel_type);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 1://コピー(選択)
				var oSel;
				var Action_Flag = 2;
				var Copy_Flag = 0;
				oSel = Getvalue("SelectionList");
				var Sel_type = 0;
				Copy(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Copy_Flag,Sel_type);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 2://コピー(ポーズ　モデル)
				var oSel;
				var Action_Flag = 1;
				var Flag = 0;
				var Copy_Flag = 1;
				Sel(Flag);
				oSel = Getvalue("SelectionList");
				var Sel_type = 1;
				Copy(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Copy_Flag,Sel_type);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 3://コピー(ポーズ　選択)
				var Action_Flag = 1;
				var Copy_Flag = 1;
				var oSel = Getvalue("SelectionList");
				var Sel_type = 1;
				Copy(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Copy_Flag,Sel_type);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 4://ペースト(元フレーム)
				var oSel;
				var Action_Flag = 1;
				var Flag = 1;
				var Paste_Mode = 0;
				Sel(Flag);
				oSel = Getvalue("SelectionList");
				Paste(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Paste_Mode);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 5://ペースト(現フレーム)
				var oSel;
				var Action_Flag = 1;
				var Flag = 1;
				var Paste_Mode = 1;
				Sel(Flag);
				oSel = Getvalue("SelectionList");
				Paste(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Paste_Mode);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			case 6://ペースト(ポーズ)
				var oSel;
				var Action_Flag = 1;
				var Flag = 1;
				var Paste_Mode = 2;
				Sel(Flag);
				oSel = Getvalue("SelectionList");
				Paste(oSel,Start_Check,End_Check,Action_Flag,ohako,FilePath_Check,FileName_Check,Paste_Mode);
				//SetValue("preferences.scripting.cmdlog", true, null);
			break;
			}
		}
	else
		{
		var buttonPressed = XSIUIToolkit.Msgbox( "キャンセルしますた。", siMsgOkOnly | siMsgQuestion, "報告" );
		//SetValue("preferences.scripting.cmdlog", true, null);
		}

}
else
{
var buttonPressed = XSIUIToolkit.Msgbox( "せめて何か選んで実行してよ。。", siMsgOkOnly | siMsgQuestion, "報告" );
//SetValue("preferences.scripting.cmdlog", true, null);
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////
function Sel(Flag)
{
	if(Flag == 0)
	{
		if(Selection(0).type == siModelType)
			 {
			 SelectBranch();
			 SelectChildNodes();
			 }
		else
			 {
			 var oTop = Selection(0).Model;
			 SelectObj(oTop);
			 SelectBranch();
			 SelectChildNodes();
		 	}
	}
	else if (Flag == 1)
	{
	if(Selection(0).type == siModelType)
			 {
			 }
		else
			 {
			 var oTop = Selection(0).Model;
			 SelectObj(oTop);
		 	}	

	}

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function Copy(oSel,Start,End,mode,ohako,FilePath,FileName,Copy_Flag,Sel_type)
{
if(Copy_Flag == 0)
{
	for ( var i=0; i<oSel.count; i++ )
		{
		var oParams = oSel(i).NodeAnimatedParameters();
			for( var a=0 ; a<oParams.Count ; a++ )
			{
				var oTest = oParams(a).value;
				ohako.Add(oParams(a));
			}
		}
	var Store = StoreAction(null, ohako, mode, "Drop_Clip", false, Start, End, null, null, null, 1);
}
else if(Copy_Flag == 1)
{
for ( var i=0; i<oSel.count; i++ )
	{
	ohako.Add(oSel(i).Kinematics.Local.Parameters("PosX"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("PosY"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("PosZ"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("RotX"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("RotY"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("RotZ"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("SclX"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("SclY"));
	ohako.Add(oSel(i).Kinematics.Local.Parameters("SclZ"));
	}
	var Store = StoreAction(null, ohako, mode, "Drop_Clip", false, Current, Current+4);
}
var Path_Preset = FilePath+"\\" + FileName + ".Preset";
SavePreset(Store,Path_Preset);
DeleteObj(Store);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function Paste(oSel,Start,End,mode,ohako,FilePath,FileName,Paste_Mode)
{
var Path_Preset = FilePath+"\\" + FileName + ".Preset";
var Action = ImportAction(oSel, Path_Preset, FileName);
var In = Action.FrameStart.value;
var Out = Action.FrameEnd.value;
if(Paste_Mode == 1)
	{
	In = In + Current;
	Out = Out + Current;
	ApplyAction(Action, null, true, In, Out);
	}
else if(Paste_Mode == 0)
	{
	ApplyAction(Action, null, true, In, Out);
	}
else if(Paste_Mode == 2)
	{
	ApplyAction(Action);
	}
DeleteObj(Action);
}  