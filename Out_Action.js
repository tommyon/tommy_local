function XSILoadPlugin( in_reg )
{
	in_reg.Author = "t.takeda";
	in_reg.Name = "OutAction";
	in_reg.Email = "";
	in_reg.URL = "";
	in_reg.Major = 1;
	in_reg.Minor = 0;

	in_reg.RegisterCommand("OutAction","OutAction");
	in_reg.RegisterMenu(siMenuSEGeneralContextID,"OutAction_Menu",false,false);
	//RegistrationInsertionPoint - do not remove this line

	return true;
}

function XSIUnloadPlugin( in_reg )
{
	var strPluginName;
	strPluginName = in_reg.Name;
	Application.LogMessage(strPluginName + " has been unloaded.",siVerbose);
	return true;
}

function MixDel_Init( in_ctxt )
{
	var oCmd;
	oCmd = in_ctxt.Source;
	oCmd.Description = "";
	oCmd.ReturnValue = true;

	return true;
}

function OutAction_Execute(  )
{

var oSel = Selection(0);
ExportAction(oSel, null);
}

function OutAction_Menu_Init( in_ctxt )
{
	var oMenu;
	oMenu = in_ctxt.Source;
	oMenu.AddCommandItem("OutAction","OutAction");
	return true;
}