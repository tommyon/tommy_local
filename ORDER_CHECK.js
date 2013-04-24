Order_Check();
function Order_Check(){
var oSel = Getvalue("SelectionList");
var ohako = XSIFactory.CreateObject("XSI.Collection");
var ohako2 = XSIFactory.CreateObject("XSI.Collection");
var oAOrder = new Array();
var oAOrder2= new Array();
if(oSel.Count > 0)
	{
	var Order_No = XSIInputBox("オーダを数字入力してください。\nXYZ→0\nXZY→1\nYXZ→2\nYZX→3\nZXY→4\nZYX→5","番号入力" );
	if(Order_No == "")
	{
				XSIUIToolkit.Msgbox( "キャンセルされました。", siMsgOkOnly,"えんど");
	return;
	}
	else if(Order_No < 6)
	{
		for (var i = 0; i < oSel.Count ; i++ )
			{
		     var Order = Getvalue(oSel(i)+".kine.local.rotorder")
	    	    if (Order != Order_No)
	        		{
				        ohako.Add(oSel(i));
	     			}
	    	    else
	     		   {
	     			   ohako2.Add(oSel(i));
	     		   }
			}
		if(ohako.Count == 0 )
			{
				var buttonPressed = XSIUIToolkit.Msgbox( "全て差異無し。\n( ｀ш´)", siMsgOkOnly , "確認" ) 
			}
		else
			{
				var buttonPressed = XSIUIToolkit.Msgbox( "下記のこいつらのオーダーに差異が発見されました↓↓↓↓↓↓\n"+ ohako, 
					siMsgOkOnly , "確認" ) 
			}
		}
	else if(Order_No >= 6)
		{
			XSIUIToolkit.Msgbox( "5以下で指定してください", siMsgOkOnly ,"注意");
		}	
	}
else
	{
	XSIUIToolkit.Msgbox( "選択して実行ください", siMsgOKCancel | siMsgDefaultButton2 ,"注意");
	}
}