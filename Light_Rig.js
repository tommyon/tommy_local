//--------------------------------------------//
//     MAIN FUNCTION                          //
//--------------------------------------------//
function createAmbientLights(){

     //選択し、且つポリゴンメッシュか調べます
     var createRig = false;//Falseを代入
     var object;//空変数
     if (selection.count>0 && selection(0).type=="polymsh"){//選択が１つ以上で且つタイプがポリゴンメッシュなら実行
      
          createRig = true;//trueを代入
          object = selection(0);//はじめに選択した物を取得
          SetValue(object.fullname+".visibility.rendvis", false, null)//名前を取得しレンダリング不可に設定
          SetValue(object.fullname+".visibility.primray", false, null);//同様にプライマリをOFF
          SetValue(object.fullname+".visibility.shdwcast", false, null);//影を落とすをOFF
          object_pts = object.activeprimitive.geometry.points.count;//頂点数をカウント
      
          var modelName = XSIInputBox(
                     "カスタムプロパティの名前を決定してください。※後で変えれませんよ)",
                     "Light Rig - Model Name",
                     "Light_Rig" ) ;


          //選択物にテクスチャープロジェクションがあるか確認
          var txtProjectionName = "Texture_projection";//テクスチャープロジェクションという名を登録
          var sampleClusterName = "Texture_Coordinates_AUTO";//オート…という名を登録
          var clusters = object.activeprimitive.geometry.clusters;//セレクションのクラスターを取得
          var hasTxtProjection = false;//Falseを代入
          var aProjections = new Array();//空の配列を取得
          var aProjectionsStr = "";//空の変数を取得
          var sampleClusterindex = 0;//
          for (i=0;i<clusters.count;i++){
               if (clusters(i).type=="sample" && clusters(i).properties.count>0){//選択したクラスターのタイプが「サンプル」で且つクラスターが１つ以上あれば実行
                    txtProjectionName = clusters(i).properties(0).name;//クラスタープロパティの１つ目の名前を取得
                    hasTxtProjection = true;//trueを代入
                    sampleClusterindex = i;//クラスターインデックスに変数(i )を代入
                    sampleClusterName = clusters(i).name;//クラスターの名前を取得
                    for (j=0;j<clusters(i).properties.count;j++){//プロパティ分を回す

               aProjections[j] =modelName+"."+clusters(i).fullname+"."+clusters(i).properties(j).name;
                         //先ほど作った空変数に取得したプロパティの名前を代入
                         aProjectionsStr+="In"+clusters(i).properties(j).name+",";//変数「aProjectionsStr+」にプロパティの名前と最後にカンマを代入
                    }
                    break;//終了させます
               }
          } 
      
          if (!hasTxtProjection){
           
               // 新しくプロジェクションを作成します
               var aTP = new Array();
               aTP[0] = "XY平面";
               aTP[1] = "XZ平面";
               aTP[2] = "YZ平面";
               aTP[3] = "円柱状";//オブジェクトが円柱で包まれているかのようにテクスチャを投影します。
               aTP[4] = "球状";//テクスチャを極でまとめた球状パターンに投影します。
               aTP[5] = "空間的";//テクスチャを3Dのオブジェクトを通して投影します。
               aTP[6] = "カメラプロジェクション";//カメラからのプロジェクションをシーン内の要素に投影します。
               aTP[7] = "UV";//NURBS サーフェスの U および V パラメータに沿ってテクスチャを投影します。
               aTP[8] = "ロリポップ";//棒付きキャンディの包紙のように、オブジェクトの上部を覆い、端が下部で集まるようにテクスチャを配置します。
               aTP[9] = "インプリシット";//補間された UV 座標ではなく、数式に基づいて計算されるテクスチャ プロジェクションを作成します。
               aTP[10] = "キュービック";//仮想キューブの面に対する法線の方向または近接度に基づいてテクスチャのさまざまな部分にポリゴンを割り当てます。
               aTP[11] = "ユニークUVs";
               var oDialTP = new ActiveXObject( "XSIDial.XSIDialog" );
               var TPindex = oDialTP.Combo( "このモデルにUVが無いんで追加して下さい。", aTP);
               var cameraForProj = null;
               CreateProjection(object.fullname, TPindex, "", "Texture_Support", "Texture_Projection", null, null, null);
               txtProjectionName = object.activeprimitive.geometry.clusters(sampleClusterindex).properties(0).name;
               aProjections[0] = modelName+"."+object.activeprimitive.geometry.clusters(sampleClusterindex).properties(0).fullname;
               aProjectionsStr+="In"+object.activeprimitive.geometry.clusters(sampleClusterindex).properties(0).name+",";
               hasTxtProjection = true;
          }
      
     }else{
          XSIUIToolkit.MsgBox("Select a polygon mesh to apply the rig", siMsgExclamation, "注意");
      
     }


     if (createRig){
      
          logMessage("ライトリグ作成中…");
          var dt1 = new Date();
          toggleLog(false);

          progressBar = XSIUIToolkit.ProgressBar;
          progressBar.caption = "ライトリグ作成中…";
          progressBar.cancelEnabled = false;
          progressBar.visible = true;

          //セレクションに対しての初期設定
          var factoryPath = Application.GetInstallationPath2(siFactoryPath);//インストールパス取得
          var init_light_size = 0.2;//ライトのサイズ設定
          var init_image_sequence = factoryPath+"\\Application\\rsrc\\noIcon.pic";//テクスチャーとして、ノーアイコンマップを取得
          var init_shader_preset = "";//シェーダープリセットを空に※設定なし
          var init_shader_type = "Phong";//フォンを代入
          var init_shader_texture_channel_Name = "Diffuse";//ディフューズを代入

          progressBar.caption = "モデル作成中…";

          //以下モデル作成
          sceneRoot = ActiveSceneRoot;//シーンルート取得
          CreateModel(object, modelName, null, null);//モデル作成
          model = selection(0);//１番目に選択した物を取得
                     
          //プログレッシブバーの設定
          progressBar.maximum = object_pts + 8;
          progressBar.increment();//プログレッシブバーを増加
          progressBar.caption = "マテリアル作成中…";
           
               //マテリアル設定
               SelectObj(object.fullname);//名前を取得
               ApplyShader(init_shader_preset, "", null, "", siLetLocalMaterialsOverlap);//シェーダーを割り当て
               CopyPaste(null, "Shaders\\Texture\\Image.Preset", "TransientObjectContainer", null);//
               object.material.name = "Light_Rig_Material";//マテリアルの名前を指定
               var imgPreset = CreateShaderFromPreset ("Shaders\\Texture\\Image.preset", object.material.fullname);//イメージプリセットを代入
               SIConnectShaderToCnxPoint(imgPreset.fullname, object.fullname+".Material."+init_shader_type+"."+init_shader_texture_channel_Name, false);//マテリアルを接続
               var imageClip = SICreateImageClip2(init_image_sequence, "Light_Rig_Image_Clip").items(0);//先ほど読み込んだイメージを代入
               SIConnectShaderToCnxPoint("Clips."+imageClip.name, object.fullname+".Material."+init_shader_type+".Image.Tex", false);//接続
               SetInstanceDataValue(object.fullname, object.material.shaders(0).shaders(0).parameters("tspace_id").fullname, txtProjectionName);//パラメータを共有化する。
           
               progressBar.increment();//パラメーターを増加
      
               //モデルをワイヤー化
               MakeLocal(object.fullname+".display", siNodePropagation);//ディスプレイ設定をローカルに以下設定
               SetValue(object.fullname+".display.staticsel", 0, null);
               SetValue(object.fullname+".display.intsel", 0, null);
               SetValue(object.fullname+".display.playbacksel", 0, null);
               SetValue(object.fullname+".display.staticunselnear", 0, null);
               SetValue(object.fullname+".display.intunselnear", 0, null);
               SetValue(object.fullname+".display.playbackunselnear", 0, null);
               SetValue(object.fullname+".display.staticunselfar", 0, null);
               SetValue(object.fullname+".display.intunselfar", 0, null);
               SetValue(object.fullname+".display.playbackunselfar", 0, null);
      
               progressBar.increment();//パラメーターを増加


          progressBar.caption = "ライト作成中…";
      
          //ライト注視点を作成
          GetPrim("Null", "Lights_Interest", model.fullname, null);
          var interest = selection(0);
          MatchTransform(interest.fullname, object.fullname, siTrn, null);//選択したものに位置あわせ

               //ディスプレイ設定を個々で制御
               SetValue(interest.fullname+".null.primary_icon", 4, null);//ヌルの設定を変更
               MakeLocal(interest.fullname+".display", siNodePropagation);//ディスプレイプロパティをローカルに
               SetValue(interest.fullname+".display.wirecolorr", 0.878, null);
               SetValue(interest.fullname+".display.wirecolorg", 0.251, null);
               SetValue(interest.fullname+".display.wirecolorb", 0, null);
      
               progressBar.increment();//パラメーターを増加


          //ライトを作成
          GetPrim("Null", "Lights", model.fullname, null);//ヌルを取り出す
          var lights_parent = selection(0);//1つ目の選択物を代入
          lights_parent.parameters("primary_icon").value = 2;//ヌルの設定を変更
          SetValue(lights_parent.fullname+".kine.local.sclx", 0.1, null);//ライトのサイズを変更
          SetValue(lights_parent.fullname+".kine.local.scly", 0.1, null);
          SetValue(lights_parent.fullname+".kine.local.sclz", 0.1, null);
          AddProp("Custom_parameter_list", "", "", "Eval_Time_For_Last_Frame", null);
          SIAddCustomParameter(null, "Time", siString, "", 0, 1, null, 6, 0, 1, null, null);//パラメーター追加
          
      
          //----------------------------------//
          //             UI設定               //
          //----------------------------------//

          //カスタムパラメーターを追加します。
          var customProperty = model.AddCustomProperty("Light Rig Options");
          var cpLayout = customProperty.PPGLayout;
          cpLayout.Language = "Jscript";

           
               //タブ作成
               cpLayout.AddTab("ライトリグ");
                
                    cpLayout.AddGroup("全体設定");
                    customProperty.AddParameter3("lightRigMute", siBool, false, 0, 1, false);
                    cpLayout.AddItem("lightRigMute", "スクリプトオペレータをOFF", siControlBoolean);
                    cpLayout.AddSpacer(0,2);
                    var oItem = cpLayout.AddButton("Amb_Off", "シーンアンビエント削除");
                              oItem.SetAttribute( siUICX, 150 );
                              oItem.SetAttribute( siUICY, 30 );
                         cpLayout.AddSpacer(0,2);
                    cpLayout.EndGroup();
                
                    //IBの設定
                    cpLayout.AddGroup("イメージパスの設定");
                         customProperty.AddParameter3("seqFilePath", siString);//上で指定している、ノーアイコンマップを取得
                         cpFilePath = cpLayout.AddItem("seqFilePath", "Path", siControlFilePath);
                         cpFilePath.SetAttribute(siUIOpenFile, true);
                         cpFilePath.SetAttribute(siUIImageFile, true);
                         cpFilePath.SetAttribute(siUIInitialDir, "project");      
                         cpFilePath.SetAttribute(siUISubFolder, "pictures");      
                         customProperty.seqFilePath = init_image_sequence;
                    cpLayout.EndGroup();
      
                    //ビューポートの設定欄の詳細
                    cpLayout.AddGroup("ビューポートの設定");
                         customProperty.AddParameter3("lightRigShowRig", siBool, true, 0, 1, false);
                         cpLayout.AddItem("lightRigShowRig", "モデル表示", siControlBoolean);
                         customProperty.AddParameter3("lightRigShowLights", siBool, true, 0, 1, false);
                         cpLayout.AddItem("lightRigShowLights", "ライト表示", siControlBoolean);
                         cpChangeIconColor = customProperty.AddParameter3("lightRigChangeIconColor", siBool, true, 0, 1, false);
                         cpLayout.AddItem("lightRigChangeIconColor", "ライトのオブジェクトカラーをテクスチャーから", siControlBoolean);
                         customProperty.AddParameter2("lightRigIconSize", siFloat, init_light_size, 0, 100000, 0, 1);
                         cpLayout.AddItem("lightRigIconSize", "Iconサイズ", siControlNumber);
                    cpLayout.EndGroup();
                
                    //インフォメーション
                    cpLayout.AddGroup("Info");
                         cpTotalLights = cpLayout.AddStaticText("");//テキストエリアを作成
                    cpLayout.EndGroup();
           
           
               //タブ作成
               cpLayout.AddTab("編集");
           
                    //ライトとイメージ設定の詳細
                    cpLayout.AddGroup("ライトとイメージ");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigInspectAllLights", "ライト設定");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigInspectImageClip", "イメージ設定");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigOpenTextureEditor", "Texture Editorを開く");
                              cpLayout.AddSpacer(0,2);
                    cpLayout.EndGroup();
                
                    //ライトの影響設定の詳細
                    cpLayout.AddGroup("ライトの影響設定");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigInclusiveOnSelectedObjects", "選択だけ効果適用");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigExclusiveOnSelectedObjects", "選択を反転して効果適用");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigAffectAllObjects", "全てに効果適用");//すべてに効果適用
                              cpLayout.AddSpacer(0,2);
                    cpLayout.EndGroup();
                
                    //group select
                    cpLayout.AddGroup("選択ツール");
                              cpLayout.AddSpacer(0,2);
                         cpLayout.AddButton("lightRigSelectAllLights", "全てのライトを選択");
                         cpLayout.AddButton("lightRigSelectAllLightsShaders", "全てのライトのプロパティを取得");
                              cpLayout.AddSpacer(0,2);
                    cpLayout.EndGroup();
                
           
               //プロットタブ
               cpLayout.AddTab("Plot");
      
                    //プロットオプションの詳細
                    cpLayout.AddGroup("プロット設定");
                         cpLayout.AddRow();
                         customProperty.AddParameter2("plotStartFrame", siInt2, parseInt(GetValue("PlayControl.In")), -30000, 30000, parseInt(GetValue("PlayControl.In")), parseInt(GetValue("PlayControl.Out")));
                         cpPlotStartFrame = cpLayout.AddItem("plotStartFrame", "Start Frame", siControlNumber);
                         cpPlotStartFrame.SetAttribute(siUINoSlider, true); 
                         customProperty.AddParameter2("plotEndFrame", siInt2, parseInt(GetValue("PlayControl.Out")), -30000, 30000, parseInt(GetValue("PlayControl.In")), parseInt(GetValue("PlayControl.Out")));
                         cpPlotEndFrame = cpLayout.AddItem("plotEndFrame", "End Frame", siControlNumber);
                         cpPlotEndFrame.SetAttribute(siUINoSlider, true); 
                         cpLayout.EndRow();
                         cpLayout.AddSpacer(0,10);
                         cpLayout.AddRow();
                         cpLayout.AddButton("plotPlotAllLights", "全てのライトをベイク");//プロットしてスクリプトオペレーターから独立
                         cpLayout.AddButton("plotUnplotAllLights", "スクリプトオペレーターへ再適用");//？？
                         cpLayout.EndRow();
                              cpLayout.AddSpacer(0,10);
                              var Plot_info = "プロットすると処理が早くなりますよ！";
                              cpLayout.AddStaticText(Plot_info);//テキストエリアを作成
                    cpLayout.EndGroup();
                
                    //カーブ処理の詳細
                    cpLayout.AddGroup("カーブ処理");
                         cpLayout.AddRow();
                         cpLayout.AddButton("plotSmoothCurves", "スムースをかける");
                         cpLayout.AddButton("plotFitCurves", "フィットをかける");
                         cpLayout.AddButton("OpenFcEditor", "カーブオプション")
                         cpLayout.EndRow();
                    cpLayout.EndGroup();

          //ロジック

               function OnInit(){
                    //code
               }
           
               function lightRigMute_OnChanged(){
                    ToggleValue("mute", "[LIGHTS_PARENT].null.ColorChangerOp");//スクリプトオペレーターをミュート
               }

               function lightRigInspectAllLights_OnClicked(){//ライト設定の実行文
                    InspectObj("[LIGHTS]", "", "ライト設定", siLock)//ライトの設定ウィンドウを表示
               }
           
               function seqFilePath_OnChanged(){//パス変更の実行分
                
                    path = PPG.seqFilePath.value;//指定されてパスを取得
                    var newSource = AddImageSource(path);//イメージを↑から取得
                    var aSequenceLength = new Array();//空配列を宣言
                
                    path = path.substring(path.lastIndexOf("\\")+1);//パスから最後に記載されている「\\」を削除
                    path = path.substring(path.lastIndexOf("[")+1);//同様に「[」を削除
                    path = path.substring(0, path.lastIndexOf("]"));//同様に「]」を削除
                    if (path.indexOf(";")!=-1){//パスに「;」があったら実行
                         path = path.substring(0,path.indexOf(";"));//パスから「;」を削除
                         }
                    aSequenceLength[0] = path.substring(0,path.indexOf("."));//パスの１文字目からみて、「.」を削除
                    aSequenceLength[1] = path.substring(path.lastIndexOf(".")+1);
                    (aSequenceLength[0]=="" || aSequenceLength[0]==null) ? aSequenceLength[0] = "1" : void(0);
                    (aSequenceLength[1]=="" || aSequenceLength[1]==null) ? aSequenceLength[1] = "1" : void(0);

                    SetValue("Clips.[IMAGE_CLIP].SourceName", newSource.name, null);//ソース名前を取得
                    SetValue("Clips.[IMAGE_CLIP].timectrl.clipin", parseInt(aSequenceLength[0]), null);//ソースクリッピングのイン、アウトを設定
                    SetValue("Clips.[IMAGE_CLIP].timectrl.clipout", parseInt(aSequenceLength[1]), null);
               }
           
               function lightRigShowRig_OnChanged(){//モデルのON/OFFを変更したら実行
                    var val = 0;//0フラグ
                    if (PPG.lightRigShowRig.value){val=2;}//0フラグを2に変更
                    SetValue("[RIG_GROUP].viewvis", val, null);//セット
                    SetValue("[RIG_GROUP].rendvis", val, null);
               }
           
               function lightRigShowLights_OnChanged(){
                    var val = 0;
                    if (PPG.lightRigShowLights.value){val=2;}
                    SetValue("[LIGHTS_GROUP].viewvis", val, null);
               }

               function lightRigInspectImageClip_OnClicked(){
                    InspectObj("[IMAGE_CLIP]", "", "Ambient Light Rig - Image Clip", siLock)//イメージ編集ウィンドウを起動
               }
      
               function lightRigOpenTextureEditor_OnClicked(){
                    SelectObj("[OBJECT]");
                    Application.Desktop.ActiveLayout.CreateViewFromDefinitionFile("[VIEWPATH]", "Texture Editor");//テクスチャーエディタを起動
               }
           
           
               function lightRigInclusiveOnSelectedObjects_OnClicked(){//選択だけ効果適用の実行文
                
                    if (selection.count>0){//選択があれば実行
                
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);
                
                    var lSelectedObjects  = Selection.GetAsText();//GetValue("SelectionList")と同じ処理を追加
                    var nLights = parseInt("[NLIGHTS]");//ライトを選択
                    for (i=0;i<nLights;i++){//ライトの数分グループ設定する
                              SelectObj("[MODEL].light_"+i);//ライト選択
                              var light = selection(0);
                              SelectObj(lSelectedObjects);
                              var associatedModelsGroup = light.primitives(0).NestedObjects(light.primitives(0).NestedObjects.count-3);
                              associatedModelsGroup.RemoveAllMembers();//一旦全てメンバー破棄
                              SIAddToGroup(light.fullname+".light.Associated Models", null, null);//ライトモデルに選択を追加
                              SetValue(light.fullname+".light.SelectiveInclusive", 1, null);//包括的に
                    }
                    SelectObj(lSelectedObjects);
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);
                
                    }

               }
           
               function lightRigExclusiveOnSelectedObjects_OnClicked(){//選択を反転して効果適用の実行文
                
                    if (selection.count>0){//選択があれば実行
                
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);
                
                    var lSelectedObjects  = Selection.GetAsText();//GetValue("SelectionList")と同じ処理を追加
                    var nLights = parseInt("[NLIGHTS]");
                    for (i=0;i<nLights;i++){
                              SelectObj("[MODEL].light_"+i);
                              var light = selection(0);
                              SelectObj(lSelectedObjects);
                              var associatedModelsGroup = light.primitives(0).NestedObjects(light.primitives(0).NestedObjects.count-3);
                              associatedModelsGroup.RemoveAllMembers();
                              SIAddToGroup(light.fullname+".light.Associated Models", null, null);
                              SetValue(light.fullname+".light.SelectiveInclusive", 0, null);
                    }
                    SelectObj(lSelectedObjects);
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);
                
                    }

               }
           
               function lightRigAffectAllObjects_OnClicked(){//全てに効果適用の実行文
                
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);
                
                    var nLights = parseInt("[NLIGHTS]");
                    for (i=0;i<nLights;i++){
                              SelectObj("[MODEL].light_"+i);
                              var light = selection(0);
                              var associatedModelsGroup = light.primitives(0).NestedObjects(light.primitives(0).NestedObjects.count-3);
                              associatedModelsGroup.RemoveAllMembers();
                              SetValue(light.fullname+".light.SelectiveInclusive", 1, null);
                    }
                    DeselectAll();

                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);

               }

               function lightRigSelectAllLights_OnClicked(){//全てのライトを選択の実行文
                    SelectObj("[LIGHTS]");
               }
           
               function lightRigSelectAllLightsShaders_OnClicked(){//全てのライトプロパティを選択の実行文
                    SelectObj("[LIGHTS_SHADERS]");
               }
           
               function lightRigIconSize_OnChanged(){//ライトアイコンサイズの変更の実行文
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);

                    SetUserPref("SI3D_CONSTRAINT_COMPENSATION_MODE", 1);
                    Scale("[LIGHTS]", PPG.lightRigIconSize.value, PPG.lightRigIconSize.value, PPG.lightRigIconSize.value, siAbsolute, siGlobal, siObj, siXYZ, null, null, null, null, null, null, null, 0, null);
                    SetUserPref("SI3D_CONSTRAINT_COMPENSATION_MODE", 0);
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);
               }
           
               function plotPlotAllLights_OnClicked(){//全てのライトをベイクの実行文
                
                    var nLights = parseInt("[NLIGHTS]");
                    startFrame = PPG.plotStartFrame.value;//「開始フレーム」に記載された値を取得
                    endFrame = PPG.plotEndFrame.value;//「終了フレーム」に記載された値を取得
                
                    var oProgressBar = XSIUIToolkit.ProgressBar ;//プログレスバーを表示
                    oProgressBar.Maximum = endFrame-startFrame+1;//いつものやつ
                    oProgressBar.Step = 1;//バーの増加ステップを決定
                    oProgressBar.Caption = "ライトベイク中…";
                    oProgressBar.CancelEnabled = true ;//trueフラグ
                    oProgressBar.Visible = true;//trueフラグ

                    for (i=startFrame;i<=endFrame;i++){//スタートからエンドまで
                         SetValue("PlayControl.Key", i, null);//タイムラインのキーフレームをセット
                         SetValue("PlayControl.Current", i, null);//カレントを移動
                         Application.Commands("Refresh").Execute();//ビューの更新
                         oProgressBar.Caption = "ライトのベイク中…: 現在のフレームは… "+i;
                         oProgressBar.increment();//バー増加
                     
                         //データを軽くする為に、ログをOFFに
                         SetValue("preferences.scripting.cmdlog", false, null);
                         SetValue("preferences.scripting.msglogrealtime", false, null);
                         SetValue("preferences.scripting.msglog", false, null);
                     
                         for (j=0;j<nLights;j++){
                              SaveKey("[MODEL].light_"+j+".light.soft_light.color.red");//ライトのキーフレーム化
                              SaveKey("[MODEL].light_"+j+".light.soft_light.color.green");//
                              SaveKey("[MODEL].light_"+j+".light.soft_light.color.blue");//
                              SaveKey("[MODEL].light_"+j+".light.soft_light.color.alpha");//ライトのキーフレーム化
                              if(oProgressBar.CancelPressed){break;}//キャンセルされたら、とちゅうでブレイク！！
                         }
                         if(oProgressBar.CancelPressed){break;}//キャンセルされたら、とちゅうでブレイク！！
                    }
                
                    PPG.lightRigMute.value = true;//PPGでチェックを付け、→
                    SetValue("[LIGHTS_PARENT].null.ColorChangerOp.mute", true, null);//スクリプトオペレータをOFFに
                    oProgressBar.Visible = false;//バーを削除
                    XSIUIToolkit.MsgBox( "ベイクが完了した為、スクリプトオペレーターはOFFにしています。", siMsgOkOnly, "ライトのベイク" )
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);
               }
           
           
               function plotUnplotAllLights_OnClicked(){//スクリプトオペレーターへ再適用の実行文
                
                    var nLights = parseInt("[NLIGHTS]");//ライトの数を取得
                    var lItems = "";
                    for (i=0;i<nLights;i++){//ライトを変数に足してくいく…
                         lItems+="[MODEL].light_"+i+".light.soft_light.color.red,";
                         lItems+="[MODEL].light_"+i+".light.soft_light.color.green,";
                         lItems+="[MODEL].light_"+i+".light.soft_light.color.blue,";
                         lItems+="[MODEL].light_"+i+".light.soft_light.color.alpha,";
                    }
                    lItems=lItems.substring(0,lItems.length-1);//一文字削除
                    RemoveAnimation(lItems);//アニメーションの削除
                    PPG.lightRigMute.value = false;//PPGでチェックを外し、→
                    SetValue("[LIGHTS_PARENT].null.ColorChangerOp.mute", false, null);//スクリプトオペレータをONに
                    XSIUIToolkit.MsgBox( "キーを消してスクリプトオペレーターを再適用しました。", siMsgOkOnly, "スクリプトオペレーターを再適用" )
                
               }
           
               function plotSmoothCurves_OnClicked(){//スムースの実行文
           
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);

                
                    var nLights = parseInt("[NLIGHTS]");
                    for (i=0;i<nLights;i++){//アニメーションソースに対してガバッとスムースをかける
                         var r_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("red").source;
                         var g_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("green").source;
                         var b_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("blue").source;
                         var a_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("alpha").source;
                         r_fcurve.smooth();//スムース実行
                         g_fcurve.smooth();
                         b_fcurve.smooth();
                         a_fcurve.smooth(); 
                    }
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);

               }
           
               function plotFitCurves_OnClicked(){//フィットの実行文
           
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);

                
                    var nLights = parseInt("[NLIGHTS]");
                    for (i=0;i<nLights;i++){//アニメーションソースに対してガバッとフィットをかける
                         var r_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("red").source;
                         var g_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("green").source;
                         var b_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("blue").source;
                         var a_fcurve = Dictionary.GetObject("[MODEL].light_"+i+".light.soft_light").parameters("color").parameters("alpha").source;
                         r_fcurve.fit();//フィット実行
                         g_fcurve.fit();
                         b_fcurve.fit();
                         a_fcurve.fit(); 
                    }
                
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);

               }
              
               function OpenFcEditor_OnClicked(){//カーブオプションの実行文
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);
                    //Fカーブオプション開く
                         InspectObj("preferences.animation_editor,preferences.fcurve_editor", "all", "FCurveEditor Preferences", ":siLockAndForceNew:siInspectMode", null);
                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);

               }
                
                    function Amb_Off_OnClicked(){//アンビエント削除の実行文
                    //データを軽くする為に、ログをOFFに
                    SetValue("preferences.scripting.cmdlog", false, null);
                    SetValue("preferences.scripting.msglogrealtime", false, null);
                    SetValue("preferences.scripting.msglog", false, null);
                         //アンビエント削除
                    SetValue("Scene_Root.AmbientLighting.ambience.red", 0, null);
                    SetValue("Scene_Root.AmbientLighting.ambience.green", 0, null);
                    SetValue("Scene_Root.AmbientLighting.ambience.blue", 0, null);

                    //ログを開始
                    SetValue("preferences.scripting.msglog", true, null);      
                    SetValue("preferences.scripting.msglogrealtime", true, null);
                    SetValue("preferences.scripting.cmdlog", true, null);

                }

               //----------------------------------//
               //           インターフェースを作成       //
               //----------------------------------//
           
          progressBar.increment();//プログレスバー進行


               //ディスプレイプロパティ設定
               MakeLocal(lights_parent.fullname+".display", siNodePropagation);
               SetValue(lights_parent.fullname+".display.wirecolorr", 0.878, null);
               SetValue(lights_parent.fullname+".display.wirecolorg", 0.251, null);
               SetValue(lights_parent.fullname+".display.wirecolorb", 0, null);
      
               progressBar.increment();//プログレスバー進行

      
          //loop on mesh's vertices
          var changeColorCode = "";//空変数
          var lLights = "";//空変数
          var lightsCreated = 0;//ライト一個目なんで、まずは０を代入

          for (i=0;i<object_pts;i++){//頂点数分処理を回す。
      
               progressBar.caption = "ライト" + (i+1) + "をポイント" + object_pts ;
      
               //コンポーネントを取得
               SelectGeometryComponents(object.fullname+".pnt["+i+"]");
               CreateCluster(null);//クラスター作成
               var cluster = selection(0);//１つ目を選択

               //ライト作成中
               GetPrimLight("Infinite.Preset", "light_"+i, model.fullname, null, null, null);//インフィニットライトを作成
               var light = selection(0);//モデルを取得
               SetValue(light.fullname+".SpecularContribution", false);//ライト寄与のスペキュラをOFFに
               SetValue(light.fullname+".soft_light.intensity", 0.05);//強度を0.05に
               Scale(null, init_light_size, init_light_size, init_light_size, siRelative, siGlobal, siObj, siXYZ, null, null, null, null, null, null, null, 0, null);//アイコンサイズで決めた値でスケーリング
               CopyPaste(light.fullname, null, lights_parent.fullname, 1);//名前をペースト

               //コンスト設定
               ApplyCns("Scaling", light.fullname, object.fullname, true);//スケールコンストレインで大きさ固定
               ApplyCns("ObjectToCluster", light.fullname, object.fullname+".polymsh.cls."+cluster.name, null);//クラスターコンストレインで位置子例
               ApplyCns("Direction", light.fullname, interest.fullname, null);//ディレクションコンストレインで向きを固定
               SetValue(light.fullname+".kine.dircns.dirx", 0, null);
               SetValue(light.fullname+".kine.dircns.diry", 0, null);
               SetValue(light.fullname+".kine.dircns.dirz", -1, null);//ディレクションコンストレインのZ位置を設定※法線の反転
      
               //ワイヤーフレームカラー
               MakeLocal(light.fullname+".display", siDefaultPropagation);//ディスプレイ設定をローカル化
               SetExpr(light.fullname+".display.wirecolorr", "cond("+cpChangeIconColor.fullname+"==true,"+light.fullname+".light.soft_light.color.red, 0.878)", null);//エクスプレッション設定
               SetExpr(light.fullname+".display.wirecolorg", "cond("+cpChangeIconColor.fullname+"==true,"+light.fullname+".light.soft_light.color.green, 0.251)", null);
               SetExpr(light.fullname+".display.wirecolorb", "cond("+cpChangeIconColor.fullname+"==true,"+light.fullname+".light.soft_light.color.blue, 0)", null);      
      
               //スクリプトオペレータを設定
               changeColorCode+="SetValue(\""+light.fullname+".light.soft_light.color.red\", aColors.getItem(0,"+i+"), null);"+"\r\n\t";//ライトのR(赤)を取得し、それを1つ目の変数に割り当て
               changeColorCode+="SetValue(\""+light.fullname+".light.soft_light.color.green\", aColors.getItem(1,"+i+"), null);"+"\r\n\t";// /r/nで改行 /tでタブ作成
               changeColorCode+="SetValue(\""+light.fullname+".light.soft_light.color.blue\", aColors.getItem(2,"+i+"), null);"+"\r\n\t";
      
               lLights += ","+light.fullname;//ライトの名前
               lightsCreated++;//カウントする
               progressBar.increment();

          }

          progressBar.caption = "スクリプトオペレーターを実行中…";
          scopConnections = aProjectionsStr+imageClip.fullname.replace("Clips.", "In");
      
          //スクリプト作成
          var scopCode = "";//空変数
          scopCode+="var aUVs;\r\nvar aPixels;\r\nvar aColors;\r\n\r\n";//空変数に「var aUVs;  var aPixels;  var aColors;を宣言しさらに改行２つを代入
          //↓初期化関数[object_fullname]に選択したものを名前を代入し、さらに[IMAGECLIP_FULLNAME]も[SAMPLE_CLUSTER_NAME]も名前を当て込む最後に改行２つ
          scopCode+=init.toString().replace("[OBJECT_FULLNAME]", object.fullname).replace("[IMAGECLIP_FULLNAME]", imageClip.fullname).replace("[SAMPLE_CLUSTER_NAME]", sampleClusterName)+"\r\n\r\n";
          //↓スクリプトオペレーター内の"CONNECTIONS"を上で指定した名前に変更　さらに//[CODE]をtoggleLog(false);と変更しファンクションを実行する　でさらにさらに改行してタブ作成後　↓
		  //変数T1に現時間を取得、改行タブ化後init()を実行、改行タブ化後上で指定した、ライトのRGBを取得し改行タブ化。
		  //変数T2に現時間を取得、改行タブ化後変数TimeでT2からT1を引いて経過時間を出す。
		  //変数diffにtime/1000を実行して実数化。改行タブ化後カスタムパラメータTime_Speedに「ScriptOperetor Spped: 実時間 sec.」を代入実時間には変数「diff」が入る。　最後に改行タブ化後toggleLog(true);を実行して改行改行タブを入力
          scopCode+=ColorChangerOp_Update.toString().replace("CONNECTIONS", scopConnections).replace("//[CODE]","toggleLog(false);\r\n\tvar t1 = new Date().getTime();\r\n\tinit();\r\n\t"+changeColorCode+"\r\n\tvar t2 = new Date().getTime();\r\n\tvar time = t2-t1;\r\n\tvar diff = time/1000;\r\n\tSetValue(\""+lights_parent.fullname+".Eval_Time_For_Last_Frame.Time\", \"SCOP Eval Time for last frame: \" + diff + \" sec.\", null);\r\n\ttoggleLog(true);")+"\r\n\r\n\t";
          scopCode+=getUVArrayFromObject.toString()+"\r\n\r\n";
          scopCode+=getUVfromPoint.toString()+"\r\n\r\n";
          scopCode+=getImageClipPixelColorArray.toString()+"\r\n\r\n";
          scopCode+=convertUVArrayToPixelArray.toString()+"\r\n\r\n"; 
          scopCode+=toggleLog.toString()+"\r\n\r\n";
      
          var scop = AddScriptedOp(model.fullname+".Lights.null", "", lights_parent.fullname+".null,"+aProjections+","+imageClip.fullname, "ColorChangerOp", "JScript", 0);
          scop.code = scopCode;
          scop.alwaysEvaluate = true; 
      
      
          //create groups
          groupRig = CreateGroup("_RIG", interest.fullname+","+object.fullname, model.fullname);
          groupLights = CreateGroup("_LIGHTS", lLights.substring(1), model.fullname);
          CopyPaste(groupRig.fullname, null, model.fullname, 1);
          CopyPaste(groupLights.fullname, null, model.fullname, 1);
           
          progressBar.caption = "Done.";
          progressBar.increment();
      
      
          progressBar.increment();
          progressBar.caption = "Building Custom Property Layout...";
           
          //INTERFACE LOGIC CODE
          ppgLogic = "";
          ppgLogic += OnInit.toString();
          ppgLogic += lightRigMute_OnChanged.toString().replaceAll("[LIGHTS_PARENT]", lights_parent.fullname);
          ppgLogic += seqFilePath_OnChanged.toString().replaceAll("[IMAGE_CLIP_FULLNAME]", imageClip.fullname).replaceAll("[IMAGE_CLIP]", imageClip.name);
          ppgLogic += lightRigShowRig_OnChanged.toString().replaceAll("[RIG_GROUP]", groupRig.fullname);
          ppgLogic += lightRigShowLights_OnChanged.toString().replaceAll("[LIGHTS_GROUP]", groupLights.fullname);
          ppgLogic += lightRigInspectAllLights_OnClicked.toString().replace("[LIGHTS]", lLights.substring(1));
          ppgLogic += lightRigInspectImageClip_OnClicked.toString().replace("[IMAGE_CLIP]", imageClip.fullname);
          ppgLogic += lightRigOpenTextureEditor_OnClicked.toString().replace("[OBJECT]", object.fullname).replace("[VIEWPATH]", factoryPath.replaceAll("\\", "|").replaceAll("|", "\\\\")+"\\\\Application\\\\views\\\\textureeditor.xsivw");
          ppgLogic += lightRigInclusiveOnSelectedObjects_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname);
          ppgLogic += lightRigExclusiveOnSelectedObjects_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname);
          ppgLogic += lightRigAffectAllObjects_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname);
          ppgLogic += lightRigSelectAllLights_OnClicked.toString().replace("[LIGHTS]", lLights.substring(1));
          ppgLogic += lightRigSelectAllLightsShaders_OnClicked.toString().replace("[LIGHTS_SHADERS]", lLights.substring(1).replaceAll(",","|").replaceAll("|",".light.soft_light,")+".light.soft_light");
          ppgLogic += lightRigIconSize_OnChanged .toString().replace("[LIGHTS]", lLights.substring(1));
          ppgLogic += plotPlotAllLights_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname).replaceAll("[LIGHTS_PARENT]", lights_parent.fullname);
          ppgLogic += plotUnplotAllLights_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname).replaceAll("[LIGHTS_PARENT]", lights_parent.fullname);
          ppgLogic += plotSmoothCurves_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname);
          ppgLogic += plotFitCurves_OnClicked.toString().replaceAll("[NLIGHTS]", object_pts).replaceAll("[MODEL]", model.fullname);
          ppgLogic += OpenFcEditor_OnClicked.toString();
          ppgLogic += Amb_Off_OnClicked.toString();
          cpLayout.logic = ppgLogic;8
      
      
          DeselectAll();
          cpTotalLights.label = "Total: "+object_pts+" lights.";
          InspectObj(customProperty, "", "Ambient Light Rig Options", siLock);
          toggleLog(true);
          var dt2 = new Date();
          var tempo = dt2-dt1;
          LogMessage("DONE! "+lightsCreated+" lights created in "+tempo/1000+" seconds");

     }

}

//--------------------------------------------//
//     HELPER FUNCTIONS                       //
//--------------------------------------------//

//toogle script logs
function toggleLog(bValue){
     if (bValue){
          SetValue("preferences.scripting.msglog", true, null);      
          SetValue("preferences.scripting.msglogrealtime", true, null);
          SetValue("preferences.scripting.cmdlog", true, null);
     }else{
          SetValue("preferences.scripting.cmdlog", false, null);
          SetValue("preferences.scripting.msglogrealtime", false, null);
          SetValue("preferences.scripting.msglog", false, null);
     }
}

//implements replaceAll on String
String.prototype.replaceAll = function(de, para){
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1){
          str = str.replace(de, para);
          pos = str.indexOf(de);
     }
    return (str);
}

//--------------------------------------------//
//     SCRIPTED OPERATOR FUNCTIONS            //
//--------------------------------------------//

function init(){
     var object = Dictionary.GetObject("[OBJECT_FULLNAME]");
     var imageclip = Dictionary.GetObject("[IMAGECLIP_FULLNAME]");
     var sampleClusterName = "[SAMPLE_CLUSTER_NAME]";
     aUVs = getUVArrayFromObject(object, sampleClusterName);
     aPixels = convertUVArrayToPixelArray(aUVs, imageclip);
     aColors = getImageClipPixelColorArray(aPixels, imageclip);
}

function getUVArrayFromObject(object, sampleClusterName){
     var aUV = new Array();//空配列を取得
     var pointcollection = object.activeprimitive.geometry.Points;//頂点を取得(コレクション)
     for (i=0;i<pointcollection.count;i++){//頂点数分まわす
          aUV[i]=i+","+pointcollection(i).index+","+getUVfromPoint(object,pointcollection(i).index,sampleClusterName)[0]+","+getUVfromPoint(object,pointcollection(i).index,sampleClusterName)[1];
		  //pointcollection(i).indexで１つめの頂点のインデック(フラグ)を追加し　ファンクションgetUVfromPointを実行してUVのポイント座標を取得する
     }
     return aUV;
}

function getUVfromPoint(object, pointIndex, sampleClusterName){//UVポイントを取得ファンクション
     var cluster = Dictionary.GetObject(object.fullname+".polymsh.cls."+sampleClusterName); ////サンプルクラスタの名前を文字列として取得
     var samplePointindex = object.activeprimitive.geometry.points(pointIndex).samples(0).index;//サンプル内のインデックスを取得
     var txSpaceId = Dictionary.GetObject(object.fullname+".material").currentUV.name;//現在のUVの名前を文字列として取得
     var u = cluster.properties(txSpaceId).Elements.Array.toArray()[samplePointindex*3];//サンプルクラスタのプロパティからカレントUVを取得し、その頂点を配列として取得　インデックス×3でUを取得
     var v = cluster.properties(txSpaceId).Elements.Array.toArray()[samplePointindex*3+1]; //サンプルクラスタのプロパティからカレントUVを取得し、その頂点を配列として取得　インデックス×3+1でVwo取得
     return Array(u,v);//返り値
}
function getImageClipPixelColorArray(aPixels, imageClip){
     var aPixelsFormatted = new Array();//空配列
     var currentFrame = parseInt(GetValue("PlayControl.Current"))+1;//カレントフレームを取得※プラス１して次のフレームを取得
     var count = 0;//変数に０を代入
     for (i=0;i<aPixels.length;i++){
          var pixelItens = aPixels[i].split(",");
          aPixelsFormatted[count] = parseInt(pixelItens[2]);
          aPixelsFormatted[count+1] = parseInt(pixelItens[3]);
          count+=2;
     } 
     var aPixelColor = new VBArray(imageClip.GetImage(currentFrame).GetPixelArray(aPixelsFormatted));
     return aPixelColor;
}

function convertUVArrayToPixelArray(aUVs, imageClip){
     var Xres = parseInt(imageClip.Source.Parameters("XRes").Value);//イメージのX解像度を取得
     var Yres = parseInt(imageClip.Source.Parameters("YRes").Value);//イメージのY解像度を取得
     var aPixels = new Array();
     for (i=0;i<aUVs.length;i++){//UV頂点数分まわす
          var uvItens = aUVs[i].split(",");//「,」で分割する
          var u = parseFloat(uvItens[2]).toFixed(2);//parseFloatで「uvItens[2]」の値を、文字列を浮動少数に変換し、toFixed(2)で少数点２桁までにして代入
          var v = parseFloat(uvItens[3]).toFixed(2);//parseFloatで「uvItens[3]」の値を、文字列を浮動少数に変換し、toFixed(2)で少数点２桁までにして代入
          xCoord = Math.abs(u%1)*Xres;//(u%1)*Xresで頂点の座標を取得し、Math.absで絶対値に変更
          yCoord = Math.abs(v%1)*Yres;//(v%1)*Yresで頂点の座標を取得し、Math.absで絶対値に変更
          if (u<0){xCoord = Xres-xCoord;}//条件文　0以下ならXCoordにXresからXCoord引いた値を代入
          if (v<0){yCoord = Yres-yCoord;}//条件文　0以下ならYCoordにYresからYCoord引いた値を代入
          (xCoord == Xres) ? xCoord-=1 : void(0);//xCoordとXresが同じ値か確認　その後
          (yCoord == Yres) ? yCoord-=1 : void(0);
          aPixels[i] = uvItens[0]+","+uvItens[1]+","+xCoord+","+yCoord;
     }
     return aPixels;
}

function ColorChangerOp_Update(In_UpdateContext, Out, Innull, CONNECTIONS){
     //[CODE]
}

// CALL MAIN FUNC //
createAmbientLights();