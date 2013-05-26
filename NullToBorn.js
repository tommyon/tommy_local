NullToBorn(Selection);
function NullToBorn(Sel)
{
	if( 2 > Sel.Count ){var Ed = XSIUIToolkit.Msgbox( "ふたつ以上選んで実行してください。", siMsgOkOnly | siMsgQuestion, "終了" );return;}
	if( Sel(0).type != siNullPrimType ){var Ed = XSIUIToolkit.Msgbox( "「ヌル」を選んでください。", siMsgOkOnly | siMsgQuestion, "終了" );return;}
	var oPos1 = XSIMath.CreateVector3();
	var oPos2 = XSIMath.CreateVector3();
	var oPos3 = XSIMath.CreateVector3(0,0,1);
	Sel(0).Kinematics.Global.Transform.GetTranslation(oPos1);
	Sel(1).Kinematics.Global.Transform.GetTranslation(oPos2);
	var oRoot = ActiveSceneRoot.Add2DChain(oPos1, oPos2, oPos3, si2DChainRight);
	for(var i=2; i<Sel.Count; i++){
		Sel(i).Kinematics.Global.Transform.GetTranslation(Pos2);
		oRoot.AddBone(Pos2);
	}
}