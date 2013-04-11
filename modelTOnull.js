var oSel = getvalue("selectionlist");
for (var i=0; i<oSel.count ; i++){
	if (oSel(i).type=="#model"){
		var name = oSel(i).name;
		var oChildren = oSel(i).Children;
		var Set = oSel(i).Model;
		var oNull = Set.AddNull(name);
		MatchTransform(oNull, oSel(i), siSRT, null);
		if(oChildren.Count>0){
			oNull.AddChild(oChildren);
		}
		Deleteobj(oSel(i));
		oNull.Name = name+"_Null";
	}
}