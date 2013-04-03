var oSel = GetValue("SelectionList");
	for (i=0; i<oSel.Count;i++)
{	
		Logmessage("              "+oSel(i));
		var CONTS = SelectConstrainedObjects(oSel(i));//        
		var oSel02 = Selection(0);//                       
			var oConstraints = oSel02.Kinematics.Constraints;//                 
			var Const_Moto_name = oSel02.name;//           
			Logmessage("             "+Const_Moto_name);//  
		oSel(i).name = Const_Moto_name+"_Const";
}