Root = ActiveSceneRoot;
oSel = Selection(0);
CamRig = Root.AddCameraRig("Camera","Add_Camera");
Cam = CamRig.children(0);
SetValue(Cam+".camera.fov", 34.4, null);
SetValue(Cam+".camdisp.culbackface", true, null);
SetValue(Cam+".camdisp.vcdisplay", 0, null);
SetValue(Cam+".camdisp.transparent", false, null);
SetValue(Cam+".camdisp.headlight", true, null);
SetValue(Cam+".camdisp.headlight_intensity", 0.84, null);
SetValue(Cam+".camdisp.headlight_azimuth", -30.35, null);
SetValue(Cam+".camdisp.headlight_elevation", 30, null);
SetValue(Cam+".camdisp.statsel", 1, null);
SetValue(Cam+".camdisp.statunselnear", 1, null);
SetValue(Cam+".camdisp.intsel", 1, null);
SetValue(Cam+".camdisp.intunselnear", 1, null);
SetValue(Cam+".camdisp.playbacksel", 1, null);
SetValue(Cam+".camdisp.playbackunselnear", 1, null);
CamIns = CamRig.children(1);
Cam.name = "New_Camera";
Logmessage(Cam); 

View = GetFocusedViewport( );
Logmessage(View)
if (View == "A"){
     View = 0
	 }
else if (View == "B"){
     View = 1
	 }
else if (View == "C"){
     View = 2
	 }
else if (View == "D"){
     View = 3
	 }
Logmessage(View)         
SetViewCamera(Cam, View);
ApplyCns("Position", CamRig, oSel, null);
SelectObj(Cam);
Translate(Cam, 50, 50, 50, siRelative, siView, siObj, siX, null, null, null, null, null, null, null, null, null, 0, null);
