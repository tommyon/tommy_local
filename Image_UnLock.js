//////////////////////////////////////////////////////////////////////
//Unlock
var oXSI = new ActiveXObject( "XSI.Application" );
var oXSIAPP = oXSI.Application;
var oXSIFactory = new ActiveXObject( "XSI.Factory" );
oXSIAPP.SetValue("preferences.scripting.cmdlog", false, null);
var oSources = oXSIAPP.ActiveProject.ActiveScene.NestedObjects("Sources") ;
var oSouImg = oSources.NestedObjects("Images");
var oLock_hako = oXSIFactory.CreateObject( "XSI.Collection" );
for ( var i=0, a = oSouImg.NestedObjects.Count; i < a; i++ ) { 
	if(oSouImg.NestedObjects(i).Locktype == 2)
				{
				oXSIAPP.Unlock(oSouImg.NestedObjects(i), "siLockLevelAll");
				}
	}
oXSIAPP.SetValue("preferences.scripting.cmdlog", true, null);