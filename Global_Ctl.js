var oHako = XSIFactory.CreateObject( "XSI.Collection" );
var oHako_NonAnim = XSIFactory.CreateObject( "XSI.Collection" );
var oHako_Get = XSIFactory.CreateObject( "XSI.Collection" );
SetValue("preferences.scripting.cmdlog", false, null);
var oStart = GetValue("PlayControl.In");
var oEnd = GetValue("PlayControl.Out");
var oSel = Getvalue("SelectionList");
var oSel = Getvalue("SelectionList");
DeselectAll();
//////////////////////////////
//グループ作成
var oRoot = ActiveProject.ActiveScene.Root;
var objs = oRoot.groups;
var G_Flag = 0;
for (var g=0;g<objs.count;g++)
{
     if(objs(g).name == "Create_GlobalCtl")
          {
          G_Flag = G_Flag +1
          var Create_G = objs(g);
          }
}
if(G_Flag == 0)
          {
          DeselectAll();
          var Create_G = CreateGroup("Create_GlobalCtl", null, null);
          }

/////////////////////////////
SelectObj(oSel, null, null);//グループ処理の為、再度選択
var rtn = GetKeyboardState();//押されている、キーのステータスを取得           
Key_st = rtn(1);
if (Key_st == 0 )//何も押されていない 時
{
     if (oSel.Count > 0 )
          {
               for (var a=0; a<oSel.Count; a++)
               {
                    var Getimplicit = GetPrim("Cone");
                    var SelName = oSel(a).name;
                    Getimplicit.name = SelName+"_Global";
                    MatchTransform(Getimplicit, oSel(a));
                    ////////////////////////////////////////////////////////////
                    //SRT
                    KeyPos = oSel(a).kinematics.Local.posx.Sources;
                    KeyRot = oSel(a).kinematics.Local.rotx.Sources;
                    KeyScl = oSel(a).kinematics.Local.sclx.Sources;
                    var Check_Pos = Check_key(KeyPos,oSel(a));
                    var Check_Rot = Check_key(KeyRot,oSel(a));
                    var Check_Scl = Check_key(KeyScl,oSel(a));
                    //////////////////////////////////////////////////////////////
                    //コンスト振り分け
                         if(Check_Pos == 0 && Check_Rot == 0 && Check_Scl == 0)//ポーズ
                              {
                                   ApplyCns("Pose", Getimplicit, oSel(a));
                                   SetMarking("kine.local.pos");
                                   AddToMarking("kine.local.ori");
                                   AddToMarking("kine.local.scl");
                                   PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                   ClearMarking();
                                   Inbert(Getimplicit);
                                   Create_G.AddMember(Getimplicit);
                                   oHako.add(Getimplicit);
                              }
                         else if (Check_Pos == 0 && Check_Rot == 0)//ポジション、ロット
                              {
                                   ApplyCns("Position", Getimplicit, oSel(a));
                                   ApplyCns("Orientation", Getimplicit, oSel(a));
                                   SetMarking("kine.local.pos");
                                   AddToMarking("kine.local.ori");
                                   PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                   ClearMarking();
                                   Inbert(Getimplicit);
                                   Create_G.AddMember(Getimplicit);
                                   oHako.add(Getimplicit);
                              }
                         else if (Check_Rot == 0 && Check_Scl == 0)//ロット、スケール
                              {
                                   ApplyCns("Scaling", Getimplicit, oSel(a));
                                   ApplyCns("Orientation", Getimplicit, oSel(a));
                                   SetMarking("kine.local.scl");
                                   AddToMarking("kine.local.ori");
                                   PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                   ClearMarking();
                                   Inbert(Getimplicit);
                                   oHako.add(Getimplicit);
                                   Create_G.AddMember(Getimplicit);
                              }
                         else if (Check_Pos == 0 && Check_Scl == 0)//ポジション、スケール
                              {
                                   ApplyCns("Scaling", Getimplicit, oSel(a));
                                   ApplyCns("Position", Getimplicit, oSel(a));
                                   SetMarking("kine.local.pos");
                                   AddToMarking("kine.local.scl");
                                   PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                   ClearMarking();
                                   Inbert(Getimplicit);
                                   oHako.add(Getimplicit);
                                   Create_G.AddMember(Getimplicit);
                              }
                         else if (Check_Pos == 0)//ポジション
                              {
                                   ApplyCns("Position", Getimplicit, oSel(a));
                                   SetMarking("kine.local.pos");
                                   PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                   ClearMarking();
                                   Inbert(Getimplicit);
                                   oHako.add(Getimplicit);
                                   Create_G.AddMember(Getimplicit);
                              }
                         else if (Check_Rot == 0)//ロット
                              {
                              ApplyCns("Orientation", Getimplicit, oSel(a));
                              SetMarking("kine.local.ori");
                              PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                              ClearMarking();
                              Inbert(Getimplicit);
                              oHako.add(Getimplicit);
                              Create_G.AddMember(Getimplicit);
                              }
                         else if (Check_Scl == 0)//スケール
                              {
                              ApplyCns("Scaling", Getimplicit, oSel(a));
                              SetMarking("kine.local.scl");
                              PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                              ClearMarking();
                              Inbert(Getimplicit);
                              oHako.add(Getimplicit);
                              Create_G.AddMember(Getimplicit);
                              }
                         else//コンスト無し＝アニメーション無し
                              {
                              oHako_NonAnim.add(oSel(a));
                              oHako_Get.add(Getimplicit);
                              }
                         ////////////////////////////////////////////////////////////
                         }//for oSel.Count
                    }//if oSel_0
          else
          {
          var buttonPressed = XSIUIToolkit.Msgbox( "何も選ばれていませんよ", siMsgOkOnly | siMsgQuestion, "注意" );
          }
     }//if(0 & Key_st)
else if(1 & Key_st)//Shift押した時
   {
        if (oSel.Count > 0 )
          {
               var Getimplicit = GetPrim("Cube");
               var SelName = oSel(0).name;
               Getimplicit.name = SelName+"_Global_PO"
                        KeyPos_0 = oSel(0).kinematics.Local.posx.Sources;
                        KeyRot_0 = oSel(0).kinematics.Local.rotx.Sources;
                        KeyPos_1 = oSel(1).kinematics.Local.posx.Sources;
                        KeyRot_1 = oSel(1).kinematics.Local.rotx.Sources;
                              var Check_Pos_0 = Check_key(KeyPos_0,oSel(0));
                              var Check_Rot_0 = Check_key(KeyRot_0,oSel(0));
                              var Check_Pos_1 = Check_key(KeyPos_1,oSel(1));
                              var Check_Rot_1 = Check_key(KeyRot_1,oSel(1));
                                   if (Check_Pos_0 == 0 &&  Check_Rot_1 == 0)
                                        {
                                        ApplyCns("Position", Getimplicit, oSel(0));
                                        ApplyCns("Orientation", Getimplicit, oSel(1));
                                        SetMarking("kine.local.pos");
                                        AddToMarking("kine.local.ori");
                                        PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                        ClearMarking();
                                        Inbert(Getimplicit);
                                                  oHako.add(Getimplicit);
                                        Create_G.AddMember(Getimplicit);
                                        }
                                   else if (Check_Rot_0 == 0 && Check_Pos_1 == 0)
                                        {
                                        ApplyCns("Position", Getimplicit, oSel(1));
                                        ApplyCns("Orientation", Getimplicit, oSel(0));
                                        SetMarking("kine.local.pos");
                                        AddToMarking("kine.local.ori");
                                        PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                                        ClearMarking();
                                        Inbert(Getimplicit);
                                        oHako.add(Getimplicit);
                                        Create_G.AddMember(Getimplicit);
                                        }
          }
          else
          {
          var buttonPressed = XSIUIToolkit.Msgbox( "何も選ばれていませんよ", siMsgOkOnly | siMsgQuestion, "注意" );
          }
     }//else if
else if(2 & Key_st)//コントロール押した時
     {
          if (oSel.Count > 0 )
          {
                    SelectConstrainedObjects();
                    var oSel2 = Getvalue("selectionlist");
                    PlotConstrainedTransformsToActions(oSel2,"plot", oStart, oEnd, 1, 20, 3, false, 0.01, true, true, true, true, false);
                    DeleteObj(oSel);
          }
          else
          {
          var buttonPressed = XSIUIToolkit.Msgbox( "何も選ばれていませんよ", siMsgOkOnly | siMsgQuestion, "注意" );
          }
     }
//////////////////////////////////////////
//PPGでコントローラー作成
if(oHako_NonAnim.Count > 0)
{
               PPG(Getimplicit,oHako,oHako_NonAnim,oHako_Get,oStart,oEnd,Create_G);
}
///////////////////////////////////////////
//選択
if(oHako.Count > 0)
{
SelectObj(oHako);
}
SetValue("preferences.scripting.cmdlog", true, null);



function PPG(Getimplicit,oHako,oHako_NonAnim,oHako_Get,oStart,oEnd,Create_G)
{
     var oP = XSIFactory.CreateObject( "CustomProperty" );
     oP.name = "Global";
     oP.AddParameter2( "oHako", siString, oHako);
     oP.AddParameter2( "oHako_NonAnim", siString, oHako_NonAnim);
     oP.AddParameter2( "oHako_Get", siString, oHako_Get);
     oP.AddParameter2( "oStart", siString, oStart);
     oP.AddParameter2( "oEnd", siString, oEnd);
     oP.AddParameter2( "GetImplicit", siString, Getimplicit);
     oP.AddParameter2( "Create_G", siString, Create_G);
     oP.AddParameter2( "Pos", siBool,true);
     oP.AddParameter2( "Rot", siBool,false);
     oP.AddParameter2( "Scl", siBool,false);
     var oL, oItem;
     oL = oP.PPGLayout;
     oL.AddRow();
     oL.SetAttribute( siUICX, 300 );
          oL.AddGroup( "", true, 300);
          oItem = oL.AddItem( "Pos", "移動値" );
          oItem = oL.AddItem( "Rot", "回転値" );
          oItem = oL.AddItem( "Scl", "スケール" );
          oItem = oL.AddButton( "Set", "作成" );
          oL.EndGroup();
     oL.EndRow();
     ////////////////////////////////////////
     oL.Language = "JScript";
     oL.Logic = Set_OnClicked.toString()+
             Inbert;
     ////////////////////////////////////////
          function Set_OnClicked()
     {    
		  SetValue("preferences.scripting.cmdlog", false, null);
     	  var oHako_Sel = XSIFactory.CreateObject( "XSI.Collection" );
          var POS_Val = PPG.Pos.value;
          var ROT_Val = PPG.Rot.value;
          var SCL_Val = PPG.Scl.value;
     //////////////////////////////////////
     //1→ポジション
     //3→ローテンション
     //4→ポジション+ローテンション
     //5→スケール
     //6→ポジション+スケール
     //8→ローテンション+スケール
     //9→ポーズ
     //////////////////////////////////////
          var CheckFlag = 0 ;
          if(POS_Val == true)
               {
               CheckFlag =  CheckFlag + 1;
               }
          if(ROT_Val == true)
               {
               CheckFlag =  CheckFlag + 3;
               }
          if(SCL_Val == true)
               {
               CheckFlag =  CheckFlag + 5;
               }
//グループ取得
          var oRoot_F = ActiveProject.ActiveScene.Root;
          var objs_F = oRoot_F.groups;
          for (var u=0;u<objs_F.count;u++)
               {
               if(objs_F(u).name == "Create_GlobalCtl")
                    {
                    var Create_G = objs_F(u);
                    }
               }
		var Global = new String(oHako_Get);
		var Target = new String(oHako_NonAnim);
		var Target_Array = Target.split(",");
		var Global_Array = Global.split(",");
		var Hako = new String(oHako);
		var Sel_Array = Hako.split(",");
		if(Sel_Array.length > 0)
		{
			if(Sel_Array[0].length > 2)
			{
				for( var s=0 ; s<Sel_Array.length ; s++ )
					{
					oHako_Sel.add(Sel_Array[s]);
					}
			}
		}
          switch(CheckFlag)
               {
               	case 9:
					for( var k=0 ; k<Target_Array.length ; k++ )
					{
						 var Sel_Con = Target_Array[k];
			             var Impli = Global_Array[k];
                         ApplyCns("Pose", Impli,Sel_Con);
                         SelectObj(Impli);
						 var oSel_PPG = Getvalue("SelectionList");
                         SetMarking("kine.local.pos");
                         AddToMarking("kine.local.ori");
                         AddToMarking("kine.local.scl");
                         PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                         ClearMarking();
                         Inbert(oSel_PPG(0));
                         Create_G.AddMember(oSel_PPG(0));
                         oHako_Sel.add(oSel_PPG(0));
                   }
                    break;
                    case 8:
                         for( var k=0 ; k<Target_Array.length ; k++ )
							{
							var Sel_Con = Target_Array[k];
							var Impli = Global_Array[k];
                      	  	ApplyCns("Orientation", Impli,Sel_Con);
                      	  	ApplyCns("Scaling", Impli,Sel_Con);
                       	  	SelectObj(Impli);
							var oSel_PPG = Getvalue("SelectionList");
                         	SetMarking("kine.local.ori");
                         	AddToMarking("kine.local.scl");
                         	PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                         	ClearMarking();
                         	Inbert(oSel_PPG(0));
                         	Create_G.AddMember(oSel_PPG(0));
                         	oHako_Sel.add(oSel_PPG(0));
                         }
                    break;
                    case 6:
                         for( var k=0 ; k<Target_Array.length ; k++ )
						{
							var Sel_Con = Target_Array[k];
							var Impli = Global_Array[k];
                      	  	ApplyCns("Position", Impli,Sel_Con);
                      	  	ApplyCns("Scaling", Impli,Sel_Con);
                       	  	SelectObj(Impli);
							var oSel_PPG = Getvalue("SelectionList");
                         	SetMarking("kine.local.pos");
                         	AddToMarking("kine.local.scl");
                         	PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                         	ClearMarking();
                         	Inbert(oSel_PPG(0));
                         	Create_G.AddMember(oSel_PPG(0));
                         	oHako_Sel.add(oSel_PPG(0));
                         }
                    break;
                    case 5:
						for( var k=0 ; k<Target_Array.length ; k++ )
						{
							var Sel_Con = Target_Array[k];
							var Impli = Global_Array[k];
							ApplyCns("Scaling",Impli,Sel_Con);
							SelectObj(Impli);
							var oSel_PPG = Getvalue("SelectionList");
							SetMarking("kine.local.scl");
							PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
							ClearMarking();
							Inbert(oSel_PPG(0));
							Create_G.AddMember(oSel_PPG(0));
							oHako_Sel.add(oSel_PPG(0));
						}
                    break;
                    case 4:
						for( var k=0 ; k<Target_Array.length ; k++ )
						{
							var Sel_Con = Target_Array[k];
							var Impli = Global_Array[k];
							ApplyCns("Position", Impli,Sel_Con);
							ApplyCns("Orientation", Impli,Sel_Con);
							SelectObj(Impli);
							var oSel_PPG = Getvalue("SelectionList");
							SetMarking("kine.local.pos");
							AddToMarking("kine.local.ori");
							PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
							ClearMarking();
							Inbert(oSel_PPG(0));
							Create_G.AddMember(oSel_PPG(0));
							oHako_Sel.add(oSel_PPG(0));
						}
                    break;
                    case 3:
					for( var k=0 ; k<Target_Array.length ; k++ )
					{
						var Sel_Con = Target_Array[k];
						var Impli = Global_Array[k];
						ApplyCns("Orientation", Impli,Sel_Con);
						SelectObj(Impli);
						var oSel_PPG = Getvalue("SelectionList");
						SetMarking("kine.local.ori");
						PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
						ClearMarking();
						Inbert(oSel_PPG(0));
						Create_G.AddMember(oSel_PPG(0));
						oHako_Sel.add(oSel_PPG(0));
					}
                   break;
                   case 1:
					for( var k=0 ; k<Target_Array.length ; k++ )
					{
						var Sel_Con = Target_Array[k];
						var Impli = Global_Array[k];
						ApplyCns("Position", Impli,Sel_Con);
						SelectObj(Impli);
						var oSel_PPG = Getvalue("SelectionList");
						SetMarking("kine.local.pos");
						PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
						ClearMarking();
						Inbert(oSel_PPG(0));
						Create_G.AddMember(oSel_PPG(0));
						oHako_Sel.add(oSel_PPG(0));
					}
                    break;
               }//swich
        	if(oHako_Sel.Count > 0)
		{
		SelectObj(oHako_Sel);
		}
        SetValue("preferences.scripting.cmdlog", true, null);
     }//OnClicked()
InspectObj( oP, null, null, siLock );
}//PPG




function Check_key(Key,oSel)
{
var GetModels = oSel.model;
var Key_Count = Key.Count;
if(Key_Count == 2){
     if(Key(0) == GetModels+".Mixer" && Key(1) == "FCurve"){
     var Flag = 0;
     }
     else{
     var Flag = 1;
     }}
if(Key_Count == 1){
     if(Key(0) == GetModels+".Mixer" || Key(0) == "FCurve"){
     var Flag = 0;
     }
     else{
     var Flag = 1;
     }}
if(Key_Count == 0){
     var Flag = 3;
     }
return Flag
}




function Inbert(Getimplicit)
{
   var oConstraints = Getimplicit.Kinematics.Constraints;
   if (oConstraints.Count != 0 )
     {
	var oConst_Value_Saki = new Array();
	var oConst_Value_Moto = new Array();
	var oConst_Type = new Array();
		for (var q=0; q<oConstraints.Count; q++)
			{
			var oConst_info = oConstraints(q).Name;
			var oConstrained = oConstraints(q).Constrained;
			oConst_Value_Moto.push(oConstrained);
			var oConstraining = oConstraints(q).Constraining;
			oConst_Value_Saki.push(oConstraining);
			switch (oConst_info)
                  {
                    case "Position Cns":
                         var oConst_info_after = "Position";
                         DeleteObj(oConstraints(q));
                         oConst_Type.push(oConst_info_after);
                    break;
                    case "Direction Cns":
                         var oConst_info_after = "Direction";
                         DeleteObj(oConstraints(q));
                         oConst_Type.push(oConst_info_after);
                    break;
                    case "Orientation Cns":
                         var oConst_info_after = "Orientation";
                         DeleteObj(oConstraints(q));
                         oConst_Type.push(oConst_info_after);
                    break;
                    case "ScalingCns":
                         var oConst_info_after = "Scaling";
                         DeleteObj(oConstraints(q));
                         oConst_Type.push(oConst_info_after);
                    break;
                    case "Pose Cns":
                         var oConst_info_after = "Pose";
                         DeleteObj(oConstraints(q));
                         oConst_Type.push(oConst_info_after);
                    break;
                    }
        }
     for ( var r = 0; r < oConst_Type.length; ++r )
     {
     ApplyCns(oConst_Type[r],oConst_Value_Saki[r],oConst_Value_Moto[r],true);
     }
  }
}