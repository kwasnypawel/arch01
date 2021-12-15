var createScene2 = function () {
    var scene = new BABYLON.Scene(engine);

    //Adding a light
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

    //Adding an Arc Rotate Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    // Append glTF model to scene.
    BABYLON.SceneLoader.Append("assets/chloe", "scene.gltf", scene, function (scene) {
        // Create a default arc rotate camera and light.
        scene.createDefaultCameraOrLight(true, true, true);

        // The default camera looks at the back of the asset.
        // Rotate the camera by 180 degrees to the front of the asset.
        scene.activeCamera.alpha += Math.PI;
    });

    return scene;
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    BABYLON.SceneLoader.ImportMesh(
        "",
        "https://models.babylonjs.com/",
        "ExplodingBarrel.glb",
        scene,
        function (meshes) {
            scene.createDefaultCameraOrLight(true, true, true);
            scene.createDefaultEnvironment();
            scene.activeCamera.alpha = -0.5;
        });

    return scene;
};


