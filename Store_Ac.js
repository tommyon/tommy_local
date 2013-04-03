var ohako = XSIFactory.CreateObject( "XSI.Collection" );//   
var oSel = GetValue("SelectionList");

function Value() 
{
	for ( var i=0; i<oSel.count; i++ )
	{
	var oParams = oSel(i).NodeAnimatedParameters();
		for( var a=0 ; a<oParams.Count ; a++ )
		{
			var oTest = oParams(a).value;
			ohako.Add(oParams(a));
		}
	}
}

function Del(Time) 
{
	for ( var i=0; i<oSel.count; i++ )
	{
	var oParams = oSel(i).NodeAnimatedParameters();
		for( var a=0 ; a<oParams.Count ; a++ )
		{
			var oSource = oParams(a).Source;
			if ( oSource.IsClassOf( siFCurveID ) )
					{
					oSource.RemoveKey(Time);
					}
		}
	}
}

var oFlame = XSIInputBox("                           ","StoreAction","." ) ;
var Array = oFlame.split(".");//                      
for( var a=0 ; a<Array.length ; a++ ) //         
{
	Num = Number(Array[a]);
	SetValue("PlayControl.Current", Num, null);//     
	Value();
	StoreAction(null, ohako , 1 ,"store_" + Array[a],false, 1, 5, null, null, null, Num);
	Del(Array[a]);
}
DeselectAll();