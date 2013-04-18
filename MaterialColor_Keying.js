var oXSI = new ActiveXObject( "XSI.Application" );
var oXSIAPP = oXSI.Application;
oXSIAPP.SetValue("preferences.scripting.cmdlog", false, null);
var oSel = Getvalue("SelectionList");
for( var i =0; i < oSel.count;i++)
{
if(oSel(i).type == "polymsh")
{
	var oCurrent = Getvalue("PlayControl.Current");
	var oIn = Getvalue("PlayControl.In");
	var oOut = Getvalue("PlayControl.Out");
	var Material = oSel(i).Material;
	var Mate_Name = oSel(i).Material.name;
	var Shaders = Material.GetAllShaders();
	var REAL = new Array();
	var OUT = new Array();
	var COLOR = new Array();
		for(var r = 0 ; r < Shaders.Count ; r++)
		{
			if(Shaders(r).name.match(/OGL13Draw.*/) || Shaders(r).name.match(/OGL1Pass.*/) || Shaders(r).name.match(/OGLAlphaTrans.*/))
				{
				REAL.push(Shaders(r))
				}
		}
	var Red_Ori = REAL[0].Shaders(0).Diffuse.red;
	var Green_Ori = REAL[0].Shaders(0).Diffuse.Green;
	var Blue_Ori = REAL[0].Shaders(0).Diffuse.Blue;
	var Alfa_Ori = REAL[0].Shaders(0).Diffuse.alpha;
	var Extrap = oSel(i).NodeAnimatedParameters(1);
	for(var t = 0 ; t < Extrap.Count ; t++)
		{
				var Flag = 0;
				var Anim = Extrap(t).Source;
			if(Anim.Extrapolation == 2)
				{
				Flag += 1 ;
				}
			if(Flag == 1)
				{
					SaveKey(Alfa_Ori, oIn);
					SaveKey(Alfa_Ori, oOut);
				}
					SaveKey(Red_Ori, oIn);
					SaveKey(Green_Ori, oIn);
					SaveKey(Blue_Ori, oIn);
					SaveKey(Red_Ori, oOut);
					SaveKey(Green_Ori, oOut);
					SaveKey(Blue_Ori, oOut);
		}
}
}
oXSIAPP.SetValue("preferences.scripting.cmdlog", true, null);
var Ed = XSIUIToolkit.Msgbox( "おしまい", siMsgOkOnly | siMsgQuestion, "おしまい" );