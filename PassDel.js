var oHako = XSIFactory.CreateObject( "XSI.Collection" );
var oPasses = ActiveProject.ActiveScene.Passes;
for( i = 1; i < oPasses.Count; i++)
{
oHako.add(oPasses(i));
}
DeleteObj(oHako);
