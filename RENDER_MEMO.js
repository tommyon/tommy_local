var oPasses = ActiveProject.ActiveScene.Passes;
//var oP = XSIFactory.CreateObject( "CustomProperty" );
//oP.name = "Render_Memo";//タイトル表示
//var OutPath = GetValue("Passes.RenderOptions.OutputDir");
var OutPath_A = oPasses(1).GetResolvedArchivePath("");
var Out = OutPath_A.substring(OutPath_A.lastIndexOf("\\")+1);//パスから最後に記載されている「\\」を削
var OutPath = OutPath_A.replace(Out, "");
var oP = ActiveSceneRoot.AddProperty('CustomProperty',false,"Render_Memo" );

//////////////////////////////////////////////////////////////////////////////

var Pass_OutPath =  oP.AddParameter2("Pick_OutPath",siString,OutPath);
var Pass_COUNT = oP.AddParameter3('Pass_Count',siInt4,oPasses.count);//パス数取得パラメータ


for (i=0; i<oPasses.Count; i++)
     {
          var Pass_On = oP.AddParameter2 ( oPasses(i).name, siBool, true);
     }
   
//////////////////////////////////////////////////////////////////////////////
var oL, oItem;
oL = oP.PPGLayout;
oL.AddGroup("パスの選択");
          oL.AddRow();
               var oItem = oL.AddButton("AllPassOn","All_Pass_On");
                   oItem.SetAttribute(siUICX,140);
                   oItem.SetAttribute(siUICY,30);
               var oItem = oL.AddButton("AllPassOff","All_Pass_Off");
                   oItem.SetAttribute(siUICX,140);
                   oItem.SetAttribute(siUICY,30);
          oL.EndRow();
                  var column = Math.round(oPasses.count /2);
          oL.AddRow();
               oL.AddGroup("");
                    for (j=0; j<column; j++)
                    {
                         var oItem = oL.AddItem(oPasses(j).name);
                    }
               oL.EndGroup();
               oL.AddGroup("");
                    for (j=column; j<oPasses.count; j++)
                    {
                         var oItem = oL.AddItem(oPasses(j).name);
                    }
               oL.EndGroup();
          oL.EndRow();
oL.EndGroup();

oL.AddGroup("テキストを出力するパスを指定して下さい。");
     oL.AddRow();
               oItem = oL.AddItem ("Pick_OutPath","Pick_OutPath",siControlFolder);
               oItem.SetAttribute(siUINolabel,true);
    oL.EndRow();
oL.EndGroup();


oL.AddGroup("レンダー(テキストが上記のパスに書き出されます)");
     oL.AddRow();
        oItem = oL.AddButton( "Set", "開始" );
        oItem.SetAttribute( siUICX, 280 );
        oItem.SetAttribute( siUICY, 80 );
    oL.EndRow();
oL.EndGroup();

///////////////////////////////////////////////////////////////////////////////////////////
//ロジック
     oL.Logic =       AllPassOn_OnClicked.toString()+
                      AllPassOff_OnClicked.toString()+
                      Set_OnClicked.toString();
     oL.Language = "JScript" ;
   
///////////////////////////////////////////////////////////////////////////////////////////////////

function AllPassOn_OnClicked(){
          var oPasses = ActiveProject.ActiveScene.Passes;
          for (h=0; h<Pass_Count; h++)
          {     
               var oCs = PPG.Inspected.Item(0);
               var PassName = oPasses(h).name;
               var Pass_FullName = oCs+"."+PassName;
               var PPG_Check = Getvalue(Pass_FullName);
               //Logmessage(PPG_Check);
               SetValue(Pass_FullName, true, null);
               }
     }


////////////////////////////////////////////////////////////////////////////////////////////////////////

function AllPassOff_OnClicked(){
          var oPasses = ActiveProject.ActiveScene.Passes;
          for (h=0; h<Pass_Count; h++)
          {     
               var oCs = PPG.Inspected.Item(0);
               var PassName = oPasses(h).name;
               var Pass_FullName = oCs+"."+PassName;
               var PPG_Check = Getvalue(Pass_FullName);
               //Logmessage(PPG_Check);
               SetValue(Pass_FullName, false, null);
          }
     }

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function Set_OnClicked()
{
     var oFso = new ActiveXObject( "Scripting.FileSystemObject" ) ;
     var oPasses = ActiveProject.ActiveScene.Passes;
     var oCs = PPG.Inspected.Item(0).name;
     var oScene_Name = ActiveProject.ActiveScene ;
     //LogMessage(oScene_Name);//シーン名
     for (h=0; h<Pass_Count; h++)
     {
            var Pick_Path = PPG.Pick_OutPath.value
            //Logmessage(Pick_Path);//パス確認
            //Logmessage(Pick_Path+"/"+oScene_Name+"_Info.txt");//最終確認
            //var oTxt = oFso.CreateTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",true, false);
          date = new Date();
          year = date.getYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          if (year < 2000) { year += 1900; }
          if (month < 10) { month = "0" + month; }
          if (day < 10) { day = "0" + day; }
          hours = date.getHours();
          minutes = date.getMinutes();
          second = date.getSeconds();
            
          var PassName = oPasses(h).name;
          //Logmessage(PassName);//パス名
          var Pass_FullName = oCs+"."+PassName;
          var PPG_Check = Getvalue(Pass_FullName);
          if(PPG_Check == true)
          {
                              var oPasses = ActiveProject.ActiveScene.Passes;
                              for (i=0; i<oPasses.Count; i++)
                                   {
                                           //Logmessage("Passes."+PassName);//Passes.を追加して比較へ
                                             if("Passes."+PassName ==oPasses(i))
                                                  {
                                                   var oTxt_open = oFso.OpenTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",8,true,0);
                                                   oTxt_open.WriteLine("シーン名：   "+oScene_Name+"\r\nプロジェクトパス:    "+ActiveProject2.Path+"\r\nのレンダリング詳細↓↓↓↓↓↓");
                                                   oTxt_open.Close();
												   var start = new Date();
                                                   var oTime = ("\r\n"+ PassName + " をレンダリングを開始します!     " + year + "年" + month + "月" + day + "日 " + hours + "時" + minutes + "分" + second + "秒に開始！");
                                                   var oTxt_open = oFso.OpenTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",8,true,0);
                                                   oTxt_open.WriteLine(oTime);
                                                   oTxt_open.Close();
                                                   var FREM = oPasses(i).Framebuffers;
                                                   var Ch = FREM.GetAsText();
                                                   var oTxt_open = oFso.OpenTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",8,true,0);
                                                   oTxt_open.WriteLine("\r\n以下のレンダーチャンネルを含んでいます。\r\n["+Ch+"]\r\nでそれらのパスは以下のパスで出力されています\r\n");
                                                   oTxt_open.Close();
                                                                      for (a=0; a<FREM.Count; a++)
                                                                           {
                                                                        var OUTPUT_TEXT_PASS = FREM(a).GetResolvedPath("");
                                                                        
                                                                        //Logmessage("初期のパスは…"+OUTPUT_TEXT_PASS);
                                                                        var Out = OUTPUT_TEXT_PASS.substring(OUTPUT_TEXT_PASS.lastIndexOf("\\")+1);//パスから最後に記載されている「\\」を削
                                                                        //LogMessage("これを削除します。"+Out);
                                                                        var OutPath = OUTPUT_TEXT_PASS.replace(Out, "");
                                                                        //LogMessage("これが最終パス  "+OutPath);
                                                                        var oTxt_open = oFso.OpenTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",8,true,0);
                                                                        oTxt_open.WriteLine(FREM(a)+" のパスが---------------" + OutPath);
                                                                        oTxt_open.Close();
                                                                           }
                                           RenderSelectedPasses("Passes."+PassName);//選択パスレンダリング
                                                      date = new Date();
                                                      year = date.getYear();
                                                      month = date.getMonth() + 1;
                                                      day = date.getDate();
                                                      if (year < 2000) { year += 1900; }
                                                      if (month < 10) { month = "0" + month; }
                                                      if (day < 10) { day = "0" + day; }
                                                      hours = date.getHours();
                                                      minutes = date.getMinutes();
                                                      second = date.getSeconds();
													  var end = new Date();
													  var Time_Count = end.getTime() - start.getTime();
													  var Sec = Time_Count/1000;
													  var Min = Sec/60;
													  var Up = Min * 100;
													  var Time_Ma = Math.round(Up);
													  var Time = Time_Ma / 100;
                                                      var oTime_End = ("\r\n"+ PassName + " をレンダリングを終了しました" + year + "年" + month + "月" + day + "日 " + hours + "時" + minutes + "分" + second + "秒に終了！\r\nって事で……"+Time+"分かかりました");
                                                      var oTxt_open = oFso.OpenTextFile(Pick_Path+"/"+oScene_Name+"_Info.txt",8,true,0);
                                                      oTxt_open.WriteLine(oTime_End+"\r\n\r\n*******************************************************************");
                                                      oTxt_open.Close();
                                                  }
                                   }
          }
     }

}


///////////////////////////////////////////////////////////////////////////////////////////////////
InspectObj( oP, null, null, siLock );