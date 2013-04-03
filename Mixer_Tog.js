var oObj = Getvalue("SelectionList");
for (i=0;i<oObj.count;i++)
{
	if (oObj(i).type == "mixeranimclip")
@		{
			if@(GetValue (oObj(i) + ".actionclip.active", true))
					{
						SetValue (oObj(i) + ".actionclip.active", false, null);

					}
			else 
					{
						SetValue (oObj(i) + ".actionclip.active", true, null);
@					}
		}
}