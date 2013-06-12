LinearToBez();
function LinearToBez()
{
	var oDD = Selection(0);
		if(oDD.type == "crvlist")
			{
			var Dup = SIDuplicate(oDD);
			SelectObj(Dup, null, null);
			var oSel = Selection(0);
			var oGeo = oSel.activeprimitive.geometry;
			var oPoint = oGeo.Points;
			for ( var a = 0 ; a < oPoint.Count ; a++ )
				{
					var Bev = CreateClusterCenterWithNull(oPoint(a), 0);
				}
			var Sel_Null = oSel.FindChildren();
			var oRootPos = XSIMath.CreateVector3();
			var oTipPos = XSIMath.CreateVector3();
			var oCurve = SICreateCurve("", 3, 0);
			oCurve.name = "Bezier_Curve";
			Sel_Null(0).Kinematics.Global.Transform.GetTranslation(oRootPos);
			SIAddPointOnCurveAtEnd(oCurve, oRootPos.x, oRootPos.y, oRootPos.z, false, 3, null);

				for(var i=1; i<Sel_Null.Count; i++){
					Sel_Null(i).Kinematics.Global.Transform.GetTranslation(oTipPos);
					SIAddPointOnCurveAtEnd(oCurve, oTipPos.x, oTipPos.y, oTipPos.z, false, 3, null);
				}
			var Del = SelectObj(oSel, "BRANCH");
			DeleteObj(Del);
			}
		else
			{
			var Ed = XSIUIToolkit.Msgbox( "warning", siMsgOkOnly | siMsgQuestion, "Please choose a curve" );
			return;
			}
}
