var oPC = Dictionary.GetObject( "PlayControl" );//タイムレンジを取得
DefStart = GetGlobal( "Key_StartFrame" );
DefEnd = GetGlobal( "Key_EndFrame" );
DefStart = oPC.In.value;//インフレームに現状の開始値を代入
DefEnd = oPC.Out.value;//アウトフレームに現状の終了値を代入

var oP = XSIFactory.CreateObject( "CustomProperty" );
oP.name = "オーダーグローバル";//タイトル表示
oP.AddParameter2( "order", siInt4,  3,  0,  6 );
oP.AddParameter2( "Pos", siBool,false);
oP.AddParameter2( "Start", siInt4, DefStart);
oP.AddParameter2( "End", siInt4, DefEnd);
oP.AddParameter2( "Pri", siInt4,  2,  0,  8 );
oP.AddParameter2( "OffSet", siBool,false);
oP.AddParameter2( "posx", siInt4, 80 , -150 , 2000);
oP.AddParameter2( "posy", siInt4, 0 , 0 , 2000);
oP.AddParameter2( "posz", siInt4, 0 , 0 , 2000);

oP.AddParameter2( "circle", siInt4, 20 , 0 , 50);
oP.AddParameter2( "cone_radius", siInt4, 5 , 0 , 50);
oP.AddParameter2( "cone_height", siInt4, 20 , 0 , 50);
oP.AddParameter2( "cube", siInt4, 30 , 0 , 50);
oP.AddParameter2( "cylinder_radius", siInt4, 4 , 0 , 50);
oP.AddParameter2( "cylinder_height", siInt4, 16 , 0 , 50);
oP.AddParameter2( "disc_innerradius", siInt4, 10 , 0 , 50);
oP.AddParameter2( "disc_outerradius", siInt4, 20 , 0 , 50);
oP.AddParameter2( "grid_ulength", siInt4, 20 , 0 , 50);
oP.AddParameter2( "grid_vlength", siInt4, 20 , 0 , 50);
oP.AddParameter2( "sphere", siInt4, 15 , 0 , 50);
oP.AddParameter2( "torus_radius", siInt4, 15 , 0 , 50);
oP.AddParameter2( "torus_sectionradius", siInt4, 7 , 0 , 50);
oP.AddParameter2( "Null", siInt4,  20,  0,  10 );


///////////////////////////////////////////////////////////////////////////////////
var oL, oItem;//空の宣言
oL = oP.PPGLayout;//PPGを追加
oL.AddRow();//タイトル以下にグループを追加
oL.SetAttribute( siUICX, 330 );
     oL.AddGroup( "", true, 330);
          aItems = Array("XYZ", 0, "XZY", 1, "YXZ", 2,
                    "YZX", 3, "ZXY", 4, "ZYX", 5);
          oItem = oL.AddEnumControl ( "order", aItems, "オーダー", siControlRadio );
          oItem = oL.AddItem( "Pos", "ポジションコンスト" );
          oItem = oL.AddItem( "OffSet", "オフセット" );
          oL.AddGroup();
               oL.AddRow()
                    oItem = oL.AddItem( "posx", "posx" );
                    oItem = oL.AddItem( "posy", "posy" );
                    oItem = oL.AddItem( "posz", "posz" );
               oL.EndRow()
          oL.EndGroup();
          oItem = oL.AddItem( "Start", "Start" );
          oItem = oL.AddItem( "End", "End" );
          aItems_Imp = Array("円", 0, "円錐", 1, "立方体", 2,
                                 "円柱", 3, "円盤", 4, "グリッド", 5,
                                 "球", 6, "トーラス", 7, "ヌル", 8);
          oItem = oL.AddEnumControl ( "Pri", aItems_Imp, "形状", siControlCombo );
          oItem = oL.AddItem( "circle", "半径" );//0
          oItem = oL.AddItem( "cone_radius", "半径" );//1
          oItem = oL.AddItem( "cone_height", "高さ" );//1
          oItem = oL.AddItem( "Cube", "長さ" );//2
          oItem = oL.AddItem( "cylinder_radius", "半径" );//3
          oItem = oL.AddItem( "cylinder_height", "高さ" );//3
          oItem = oL.AddItem( "disc_innerradius", "内側" );//4
          oItem = oL.AddItem( "disc_outerradius", "外側" );//4
          oItem = oL.AddItem( "grid_ulength", "Ｕ方向長さ" );//5
          oItem = oL.AddItem( "grid_vlength", "Ⅴ方向長さ" );//5
          oItem = oL.AddItem( "sphere", "半径" );//6
          oItem = oL.AddItem( "torus_radius", "大きさ" );//7
          oItem = oL.AddItem( "torus_sectionradius", "太さ" );//7
          aItems_Null = Array("なし", 0,"ヌル", 1, "環", 2, "矢印円", 3,
                                      "ボックス", 4, "円", 5, "矩形波", 6,
                                      "ダイアモンド", 7, "ピラミッド", 8, "尖ったボックス", 9, "矢印", 10);
          oItem = oL.AddEnumControl ( "Null", aItems_Null, "Null形状", siControlCombo );
          oItem = oL.AddSpacer( 260, 10 );
          oItem = oL.AddButton( "Set", "作成" );
          oItem.SetAttribute( siUICX, 290 );
          oItem.SetAttribute( siUICY, 60 );
    oL.EndGroup();
oL.EndRow();
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////
//実行分
oL.Language = "JScript";
oL.Logic = Set_OnClicked.toString()+
             OnInit.toString()+
             OffSet_OnChanged.toString()+
             Pri_OnChanged.toString();
/////////////////////////////////////
function OnInit()
     {
          Pri_OnChanged();
          OffSet_OnChanged();
     }
function OffSet_OnChanged()
{
var Off = PPG.OffSet.value;
if(Off == true)
     {
     PPG.posx.show(true);
     PPG.posy.show(true);
     PPG.posz.show(true); 
     }
else
     {
     PPG.posx.show(false);
     PPG.posy.show(false);
     PPG.posz.show(false);
     }
}

function Pri_OnChanged()
{
     var oPri = PPG.Pri.value;
          if(oPri == 0)
               {
               var Getobj = "Circle";
               PPG.circle.show(true);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 1)
               {
               var Getobj = "Cone";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(true);//1
               PPG.cone_height.show(true);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 2)
               {
               var Getobj = "Cube";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(true);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 3)
               {
               var Getobj = "Cylinder";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(true);//3
               PPG.cylinder_height.show(true);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 4)
               {
               var Getobj = "Disc";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(true);//4
               PPG.disc_outerradius.show(true);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 5)
               {
               var Getobj = "Grid";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(true);//5
               PPG.grid_vlength.show(true);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 6)
               {
               var Getobj = "Sphere";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(true);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 7)
               {
               var Getobj = "Torus";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(true);//7
               PPG.torus_sectionradius.show(true);//7
               PPG.Null.show(false);//8
               }
          else if (oPri == 8)
               {
               var Getobj = "Null";
               PPG.circle.show(false);//0
               PPG.cone_radius.show(false);//1
               PPG.cone_height.show(false);//1
               PPG.cube.show(false);//2
               PPG.cylinder_radius.show(false);//3
               PPG.cylinder_height.show(false);//3
               PPG.disc_innerradius.show(false);//4
               PPG.disc_outerradius.show(false);//4
               PPG.grid_ulength.show(false);//5
               PPG.grid_vlength.show(false);//5
               PPG.sphere.show(false);//6
               PPG.torus_radius.show(false);//7
               PPG.torus_sectionradius.show(false);//7
               PPG.Null.show(true);//8
               }
}

function Set_OnClicked()
{
var oSel = GetValue("SelectionList");
if(oSel.Count > 0 )
{
               var oHako = XSIFactory.CreateObject( "XSI.Collection" );//箱作成
               var oStart =  PPG.Start.value;
               var oEnd = PPG.End.value;
               var Order = PPG.order.value;
               var oPri = PPG.Pri.value;
               var oNull = PPG.Null.value;
               var Pos_Icon = PPG.Pos.value;
               var Off = PPG.OffSet.value;
               var oPOSX = PPG.posx.value;
               var oPOSY = PPG.posy.value;
               var oPOSZ = PPG.posz.value;
			   
               var oCircle = PPG.circle.value;//0
			   var oCone_Radius = PPG.cone_radius.value;//1
			   var oCone_Height = PPG.cone_height.value;//1
			   var oCube = PPG.cube.value;//2
			   var oCylinder_Radius = PPG.cylinder_radius.value;//3
			   var oCylinder_Height = PPG.cylinder_height.value;//3
			   var oDisc_Innerradius = PPG.disc_innerradius.value;//4
			   var oDisc_Outerradius = PPG.disc_outerradius.value;//4
			   var oGrid_Ulength = PPG.grid_ulength.value;//5
			   var oGrid_Vlength = PPG.grid_vlength.value;//5
			   var oSphere = PPG.sphere.value;//6
			   var oTorus_Radius = PPG.torus_radius.value;//7
			   var oTorus_Sectionradius = PPG.torus_sectionradius.value;//7
////////////////////////////////////////impObj

              
               for (var a=0; a<oSel.Count; a++)
               {	
					if(oPri == 0)
						{
						var Getobj = "Circle";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".circle.radius", oCircle);
						}
					else if (oPri == 1)
						{
						var Getobj = "Cone";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".cone.radius", oCone_Radius);
　　　						SetValue(Getimplicit+".cone.height", oCone_Height);  
						}
					else if (oPri == 2)
						{
						var Getobj = "Cube";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".cube.length", oCube);
						}
					else if (oPri == 3)
						{
						var Getobj = "Cylinder";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".cylinder.radius", oCylinder_Radius);
						SetValue(Getimplicit+".cylinder.height", oCylinder_Height);
						}
					else if (oPri == 4)
						{
						var Getobj = "Disc";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".disc.innerradius", oDisc_Innerradius);
　　　						SetValue(Getimplicit+".disc.outerradius", oDisc_Outerradius);
						}
					else if (oPri == 5)
						{
						var Getobj = "Grid";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".grid.ulength", oGrid_Ulength);
　　　　　					SetValue(Getimplicit+".grid.vlength", oGrid_Vlength);
						}
					else if (oPri == 6)
						{
						var Getobj = "Sphere";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".sphere.radius", oSphere);
						}
					else if (oPri == 7)
						{
						var Getobj = "Torus";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".torus.radius", oTorus_Radius);
　　　　　					SetValue(Getimplicit+".torus.sectionradius", oTorus_Sectionradius);
						}
					else if (oPri == 8)
						{
						var Getobj = "Null";
						var Getimplicit = GetPrim(Getobj);//コントローラー作成
						SetValue(Getimplicit+".null.primary_icon", oNull, null);
						}

                    var SelName = oSel(a).name;//選択した物の名前を取得
                    MatchTransform(Getimplicit, oSel(a));
                    if(Off == true)
                         {
                         var SelPOSX = selection(0).kinematics.global.posx.value;
                         var SelPOSY = selection(0).kinematics.global.posy.value;
                         var SelPOSZ = selection(0).kinematics.global.posz.value;                         oTrans = selection(0).Kinematics.Global.Transform
                              var rePOSX = oTrans.PosX + oPOSX;
                              var rePOSY = oTrans.PosY + oPOSY;
                              var rePOSZ = oTrans.PosZ + oPOSZ;
                              SetValue(selection(0).Kinematics.Global.posx, rePOSX, null);
                              SetValue(selection(0).Kinematics.Global.posy, rePOSY, null);
                              SetValue(selection(0).Kinematics.Global.posz, rePOSZ, null);
                              }
                    switch (Order)
                         {
                         case 0:
                         SetValue(Getimplicit + ".kine.local.rotorder", 0, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_XYZ"
                         break;
                         case 1:
                         SetValue(Getimplicit + ".kine.local.rotorder", 1, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_XZY"
                         break;
                         case 2:
                         SetValue(Getimplicit + ".kine.local.rotorder", 2, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_YXZ"
                         break;
                         case 3:
                         SetValue(Getimplicit + ".kine.local.rotorder", 3, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_YZX"
                         break;
                         case 4:
                         SetValue(Getimplicit + ".kine.local.rotorder", 4, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_ZXY"
                         break;
                         case 5:
                         SetValue(Getimplicit + ".kine.local.rotorder", 5, null);
                         var Order_Name = Getimplicit.name = SelName+"_Order_Global_ZYX"
                         break;
                         }

          //ここまででオーダー変更用のオブジェクト設定完了
          //////////////////////////////////////////////////////////////////////////////

         if ( Pos_Icon == true )
                         {
			 Getimplicit.name = Order_Name+"_POS"
                         ApplyCns("Position", Getimplicit, oSel(a));
                         ApplyCns("Orientation", Getimplicit, oSel(a));
                         SetMarking("kine.local.pos");
                         AddToMarking("kine.local.ori");
                         PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                         ClearMarking();8
                         Inbert();
                         oHako.add(Getimplicit);
                    }
                    else
                    {
                         ApplyCns("Orientation", Getimplicit, oSel(a));
                         SetMarking("kine.local.ori");
                         PlotAndApplyActions("", "plot", oStart, oEnd, null, 20, 3, null, null, null, null, true,true);
                         ClearMarking();
                         Inbert();
                         oHako.add(Getimplicit);
                    }
         }
          SelectObj(oHako);

          function Inbert()
          {
               var oConstraints = Getimplicit.Kinematics.Constraints;//選択中の物のコンストレインとを取得
          if (oConstraints.Count != 0 )//オペレータが「0」じゃない場合下記を実行
               {
               var oConst_Value_Saki = new Array();//空の配列を作成。後で使います。
               var oConst_Value_Moto = new Array();//空の配列を作成。後で使います。
               var oConst_Type = new Array();//空の配列を作成。後で使います。
               for (var i=0; i<oConstraints.Count; i++)//オペレーター数回す                  
               {
               var oConst_info = oConstraints(i).Name;//コンストの種類を取得
               var oConstrained = oConstraints(i).Constrained;//コンスト元を取得
               oConst_Value_Moto.push(oConstrained);
               var oConstraining = oConstraints(i).Constraining;//コンスト先を取得
               oConst_Value_Saki.push(oConstraining);
                    switch (oConst_info)
                         {//コンストの名前別によるスイッチ制御
                         case "Position Cns"://「ポジションコンスト」の場合下記を実行
                              var oConst_info_after = "Position";
                              DeleteObj(oConstraints(i));//オペレータを削除
                              oConst_Type.push(oConst_info_after);
                         break;
                         case "Orientation Cns"://「オリエンテーションコンスト」の場合下記を実行
                              var oConst_info_after = "Orientation";
                              DeleteObj(oConstraints(i));//オペレータを削除
                              oConst_Type.push(oConst_info_after);
                         break;
                         }
               }
                    for ( var i = 0; i < oConst_Type.length; ++i ) //配列にある数の分FORで回す
                         {
                         ApplyCns(oConst_Type[i],oConst_Value_Saki[i],oConst_Value_Moto[i],true);
                         }  
               }
          }
}
else
{
var buttonPressed = XSIUIToolkit.Msgbox( "選択して実行して下さい！", siMsgOkOnly | siMsgQuestion, "警告" );
}
}


InspectObj( oP, null, null, siLock );
