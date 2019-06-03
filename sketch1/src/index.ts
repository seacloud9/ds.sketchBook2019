import * as BABYLON from "babylonjs";
import "babylonjs-inspector";
import WebFont from "webfontloader";
import {pixiScene} from "./pixi";
import {shaderToyMaterial, shaderToyProcText} from "./shaders";

export const start = () => {
  const canvas: any = document.getElementById("canvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const currentScene = "startScene";
  let sceneItems = [];
  let renderItems = [];

  const disposeScene = () => {
    renderItems = [];
    sceneItems.forEach((inc) => {
      inc.dispose();
    });
    sceneItems = [];
  };

  const babylonEvents = () => {
    const introScene = () => {
        console.log("in babylon introScene");
        disposeScene();
    };
    return {
      introScene,
    };
  };

// scene.debugLayer.show();

//
// Camera
//
  const camera = new BABYLON.FreeCamera(
  "camera1",
  new BABYLON.Vector3(0, 16.972024060235082, -8.47697425921948),
  scene,
);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  camera.inputs.clear();

// Enable VR
// var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
// vrHelper.enableTeleportation({floorMeshes: [environment.ground]});

// start up pixi scene
  const {pixiRenderer, stage} = pixiScene(engine, canvas, babylonEvents);

  const startScene = () => {
    //
    // Lighting
    //
      const light1 = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 5, 0),
        scene,
      );
      light1.intensity = 0.66;
      light1.diffuse = BABYLON.Color3.FromHexString("#D72AEA");
      light1.groundColor = BABYLON.Color3.FromHexString("#7528FB");
      const light2 = new BABYLON.PointLight(
        "Omni",
        new BABYLON.Vector3(0, 5, 0),
        scene,
      );
      sceneItems.push(light1);

      light2.diffuse = BABYLON.Color3.FromHexString("#72CDFF");
      light2.specular = BABYLON.Color3.FromHexString("#FF00D5");
      sceneItems.push(light2);
      const square = BABYLON.MeshBuilder.CreatePlane("output-plane", {width: 40, height: 40}, scene);
      square.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      sceneItems.push(square);
      const customMaterial = shaderToyMaterial(scene);
      const customProcText = shaderToyProcText(scene);
      sceneItems.push(customMaterial);
      sceneItems.push(customProcText);
      customProcText.setVector2("resolution", new BABYLON.Vector2(1, 1));
      customMaterial.diffuseTexture = customProcText;
      square.material = customMaterial;

      const sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 12, 5.0, scene);
      sphereGlass.position = new BABYLON.Vector3(0, 0, 0);
      sceneItems.push(sphereGlass);
        // Create materials
      const glass = new BABYLON.PBRMaterial("glass", scene);
      glass.reflectionTexture = customProcText;
      glass.refractionTexture = customProcText;
      glass.linkRefractionWithTransparency = true;
      glass.indexOfRefraction = 0.52;
      glass.alpha = 0;
      glass.directIntensity = 0.0;
      glass.environmentIntensity = 0.7;
      glass.cameraExposure = 0.66;
      glass.cameraContrast = 1.66;
      glass.microSurface = 1;
      glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
      sphereGlass.material = glass;
      sceneItems.push(glass);
      renderItems.push(() => customProcText.setFloat("time", time));
  };

  const babylonSceneObj = {
    startScene,
  };

  babylonSceneObj[currentScene]();

  let time = 0;
  scene.registerBeforeRender(() => {
      // falseCam.update();
       time += 0.01;
       if (renderItems.length) {
        renderItems.forEach((inc) => {
          inc();
         });
       }

   });
  const loader = document.querySelectorAll(".is-active")[0];
  loader.className = loader.className.replace("is-active", "");
  engine.runRenderLoop(() => {
  scene.render();
  engine.wipeCaches(true);
  pixiRenderer.reset();
  pixiRenderer.render(stage);
});

  window.addEventListener("resize", () => {
  engine.resize();
});
};

const loadAllContent = () => {
  WebFont.load(
    {
    // this event is triggered when the fonts have been rendered, see https://github.com/typekit/webfontloader
    active() {
      // let browser take a breath. #lame anti-pattern
      setTimeout(() => start(), 500);
    },
    // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
    // place loader logic below
    /*eslint no-useless-escape: "error"*/
    fontloading : () => {
      console.log(`
      \n
        _______    _______  ___      ___     ______    ________  ______    _______  _____  ______
      |"      "\  /"     "||"  \    /"  |   /    " \  /"       )/" _  "\  /"     "|(\"   \|"  \  /"     "|
      (.  ___  :)(: ______) \   \  //   |  // ____  \(:   \___/(: ( \___)(: ______)|.\\   \    |(: ______)
      |: \   ) || \/    |   /\\  \/.    | /  /    ) :)\___  \   \/ \      \/    |  |: \.   \\  | \/    |
      (| (___\ || // ___)_ |: \.        |(: (____/ //  __/  \\  //  \ _   // ___)_ |.  \    \. | // ___)_
      |:       :)(:      "||.  \    /:  | \        /  /" \   :)(:   _) \ (:      "||    \    \ |(:      "|
      (________/  \_______)|___|\__/|___|  \"_____/  (_______/  \_______) \_______) \___|\____\) \_______)

        🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮
      `);
    },
    // multiple fonts can be passed here
    google :
    {
      families: [ "Orbitron", "Press Start 2P" ],
    },
  });
};

loadAllContent();
