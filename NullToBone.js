NullToBorn(Selection);
function NullToBorn(Sel)
{
	if( 2 > Sel.Count ){var Ed = XSIUIToolkit.Msgbox( "ふたつ以上選んで実行してください。", siMsgOkOnly | siMsgQuestion, "終了" );return;}
	if( Sel(0).type != siNullPrimType ){var Ed = XSIUIToolkit.Msgbox( "「ヌル」を選んでください。", siMsgOkOnly | siMsgQuestion, "終了" );return;}
	var oPos1 = XSIMath.CreateVector3();
	var oPos2 = XSIMath.CreateVector3();
	var oPos3 = XSIMath.CreateVector3(0,0,1);
	Sel(0).Kinematics.Global.Transform.GetTranslation(oPos1);//選択１のSRTを取得
	Sel(1).Kinematics.Global.Transform.GetTranslation(oPos2);//選択２のSRTを取得
	var oRootChain = ActiveSceneRoot.Add2DChain(oPos1, oPos2, oPos3, si2DChainRight);
	//Add2DChain( [RootPos], [EffectorPos], [ChainNormalPlane], [AlignType], [Name] )
	//(ルートポジション,エフェクターのポジション、骨の回転法線、ビュー指定)となる。
	//上記でいうと、(ヌル１のポジション、ヌル２のポジション、Zに対して向いている法線、ライトビュー)となる。
	for(var i=2; i<Sel.Count; i++){
		Sel(i).Kinematics.Global.Transform.GetTranslation(oPos2);
		oRootChain.AddBone(oPos2,siChainBonePin,);
		//２つ以上は骨を親子関係で作成していく。なので、変数iは2足され、AddBornで骨が作成される。
		//AddBornの引数は「ポジション、タイプ、名前」なので、oPos2を代入してる。
	}
}