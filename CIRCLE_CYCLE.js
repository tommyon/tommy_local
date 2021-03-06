var oPC = Dictionary.GetObject( "PlayControl" );// タイムレンジを取得
DefStart = GetGlobal( "Key_StartFrame" );
DefEnd = GetGlobal( "Key_EndFrame" );
DefStart = oPC.In.value;
DefEnd = oPC.Out.value;

/////////////////////////////////////////////////
var oP = XSIFactory.CreateObject( "CustomProperty" );
oP.name = "CIRCLE_CYCLE";//タイトル表示
oP.AddParameter2( "Start", siInt4, DefStart);
oP.AddParameter2( "End", siInt4, DefEnd);
oP.AddParameter2 ( "End_Key", siBool, false );
oP.AddParameter2( "Loop", siInt4,  2,  0,  4 );
var oL, oItem;//空の宣言
oL = oP.PPGLayout;//PPGを追加
oL.AddRow();//タイトル以下にグループを追加
            oL.AddGroup( "", true, 100);
                        oItem = oL.AddItem( "Start", "Start" );
                        oItem = oL.AddItem( "End", "End" );
                        oItem = oL.AddItem( "End_Key", "エンドからスタートに" );
                        oItems_Imp = Array("コンスタント", 0, "グラディエント", 1, "サイクル", 2,
                                 "相対サイクル", 3);
                        oItem = oL.AddEnumControl ( "Loop", oItems_Imp, "タイプ", siControlCombo );
            oL.EndGroup();
            oL.AddGroup( "", true, 100 );
                        oItem = oL.AddButton( "Set", "開始" );
                        oItem.SetAttribute( siUICX, 150 );
                        oItem.SetAttribute( siUICY, 80 );
            oL.EndGroup();
oL.EndRow();
//実行分
oL.Language = "JScript";
oL.Logic = Set_OnClicked.toString();
/////////////////////////////////////
function Set_OnClicked()
{
var In =  PPG.Start.value;
var Out = PPG.End.value;
var End = PPG.End_Key.value;
var Loop = PPG.Loop.value;

var oSel = Getvalue("SelectionList");
            if(oSel.Count <= 0)
            {
            Logmessage(" 選択してください。 ");
            }
            for( var i =0; i < oSel.count;i++)
                        {
                        Tan_SET(oSel (i),In,Out);
                        }

function Tan_SET(oSel,In,Out)
            {
        var oAnim = oSel.NodeAnimatedParameters(1);
        for( var i =0; i < oAnim.count;i++)
            {
            var oSource = oAnim(i).Source;
            oSource.BeginEdit();
                switch (Loop)
                         {
                         case 0:
                        oSource.Extrapolation = siConstantExtrapolation;
                         break;
                         case 1:
                         oSource.Extrapolation = siLinearExtrapolation;
                         break;
                         case 2:
                         oSource.Extrapolation = siPeriodicExtrapolation;
                         break;
                         case 3:
                         oSource.Extrapolation = siPeriodicRelativeExtrapolation;
                         break;
                         }
            oSource.AddKey(Out_Key);
            var In_Key = oSource.KeyExists(In);
            var Out_Key = oSource.KeyExists(Out);
            oSource.AddKey(In);
            oSource.AddKey(Out);
            var FirstKey = oSource.GetKey(In);
            var EndKey = oSource.GetKey(Out);
             if(End == false)
      {
                         for (var j=0; j < 2;j++)
                                    {
                                    EndKey.value = FirstKey.value
                                    EndKey.LeftTanX= FirstKey.LeftTanX;
                                    EndKey.LeftTanY = FirstKey.LeftTanY;
                                    EndKey.RightTanX = FirstKey.RightTanX;
                                    EndKey.RightTanY = FirstKey.RightTanY;
                                     }
            }
             else
      {
            for (var j=0; j < 2;j++)
                  {
                  FirstKey.value = EndKey.value
                  FirstKey.LeftTanX= EndKey.LeftTanX;
                  FirstKey.LeftTanY = EndKey.LeftTanY;
                  FirstKey.RightTanX = EndKey.RightTanX;
                  FirstKey.RightTanY = EndKey.RightTanY;
                  }
      }
                oSource.EndEdit();
                }
            }
}
InspectObj( oP, null, null, siLock );
  
