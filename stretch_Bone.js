NullToBorn(Selection);
function NullToBorn(Sel)
{
	if( 2 > Sel.Count ){var Ed = XSIUIToolkit.Msgbox( "Choose two or more", siMsgOkOnly | siMsgQuestion, "Fin" );return;}
	/////////////////////////////////////////////////////
	//int
	var ohako = XSIFactory.CreateObject( "XSI.Collection" );
	var ohako2 = XSIFactory.CreateObject( "XSI.Collection" );
	var oPos1 = XSIMath.CreateVector3();
	var oPos2 = XSIMath.CreateVector3();
	var oPos3 = XSIMath.CreateVector3(0,0,1);
	Sel(0).Kinematics.Global.Transform.GetTranslation(oPos1);
	Sel(1).Kinematics.Global.Transform.GetTranslation(oPos2);
	var Calc = Calc_Dist(Sel(0),Sel(1));
	//////////////////////////////////////////////////////
	//firstbone
	var oRootChain = ActiveSceneRoot.Add2DChain(oPos1, oPos2, oPos3, si2DChainTop,"Root_stretch");
	var Chain_Name = oRootChain.name;
	var oBone = oRootChain.Bones(0);
	var Eff = oRootChain.Effector;
	Eff.name = "Eff_stretch";
	var Flag = 0 ;
	var Prop = SIAddCustomParameter(oRootChain, "On/Off", siBool, 0, 0, 1, null, 2053, 0, 1, "On/Off");
	var Prop_Name = SetValue(oRootChain+".CustomPSet.Name", Chain_Name+"_switch");
	/////////////////////////////////////////////////////
	//dist_null
	oBone.name = "Born_stretch0";
	var Dist = oRootChain.Addnull("Stretch_dist");
	ToggleVisibility(Dist);
	//////////////////////////////////////
	//addbone
	for(var i=2; i<Sel.Count; i++)
		{
			Sel(i).Kinematics.Global.Transform.GetTranslation(oPos2);
			var AddBone = oRootChain.AddBone(oPos2);
			var Dist_Null = AddBone.Addnull("Dist_null1");
			MatchTransform(Dist_Null, AddBone, siRT, null);
			AddBone.name = "Born_stretch1";
			ohako.add(AddBone);
		}
	var BornArray = new Array;
	for(var j=1; j<Sel.Count; j++)
		{
			if ((j+1) < Sel.Count)
				{
				var Calc_Add = Calc_Dist(Sel(j),Sel(j+1));
				BornArray.push(Calc_Add);
				}
		}
	for(var a=0; a<BornArray.length; a++)
		{
			Calc += BornArray[a];
		}
	////////////////////////////////////////
	//stretch
	var Bone_Count = ohako.Count + BornArray.length;
	var Lengh1 = oBone.length;
	var Len_Value1 = Lengh1.value;

	SetExpr( Lengh1,"Cond("+Dist+".kine.local.posy >"+Calc+", "+Len_Value1+" + ("+Dist+".kine.local.posy - "+Calc+") / "+Bone_Count+", "+Len_Value1+")" );
	////////////////////////////////////////
	//Addstretch
	for(var j=0; j<ohako.Count; j++)
		{
			var Len = ohako(j).length;
			var Len_Value2 = Len.value;
			SetExpr( Len,"Cond("+Dist+".kine.local.posy > "+Calc+", "+Len_Value2+" + ("+Dist+".kine.local.posy - "+Calc+") / "+Bone_Count+", "+Len_Value2+")" );
		}
	//////////////////////////////////////
	//dist
	SetExpr(Dist+".kine.local.posy","cond( "+ oRootChain +"."+Prop_Name+".On_Off == false , ctr_dist("+oRootChain+".kine.global.pos,"+Eff+".kine.global.pos),"+ Calc+")" );
	

var Ed = XSIUIToolkit.Msgbox( "END", siMsgOkOnly | siMsgQuestion, "Fin" );


	
}

function Calc_Dist(Position1 , Position2){
	var Pos1 = Position1.Kinematics.Global.Transform;
	var VBArray1 = new VBArray( Pos1.GetTranslationValues2() ); 
	var Array1 = VBArray1.toArray();

	var Pos2 = Position2.Kinematics.Global.Transform;
	var VBArray2 = new VBArray( Pos2.GetTranslationValues2() ); 
	var Array2 = VBArray2.toArray();

	var x1 = Array1[0];
	var y1 = Array1[1];
	var z1 = Array1[2];
	var x2 = Array2[0];
	var y2 = Array2[1];
	var z2 = Array2[2];

	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var dz = Math.abs(z2 - z1);
	var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
	return dist;
}