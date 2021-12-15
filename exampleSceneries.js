var createScene = function () {
    let scene = new BABYLON.Scene(engine);
    // scene.useRightHandedSystem = true;

    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    return createScene2(scene);
}


var createScene2 = function (scene) {
    const cameraStartPosition = new BABYLON.Vector3(0, 100, -500);
    let camera = new BABYLON.UniversalCamera("Camera", cameraStartPosition, scene);
    camera.attachControl(canvas, true);
    camera.speed = 10;
    camera.angularSpeed = 100;

    camera.keysUp = [38, 87];
    camera.keysDown = [40, 83];
    camera.keysLeft = [37, 65];
    camera.keysRight = [39, 68];

    camera.keysUpward = [32];
    camera.keysDownward = [16];
    camera.keysRotateLeft = [81];
    camera.keysRotateRight = [69];

    chloeWithFurnitureOnGroundScene(scene);

    setTimeout(function(){
        log(scene.meshes.length + (typeof scene.meshes));
        optimizeMesh(scene.meshes);
    },2000);

    // // złącz meshes i zapisz
    // let meshes = scene.meshes;
    // let mesh = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
    //
    // BABYLON.GLTF2Export.GLBAsync(scene, "sowa").then((glb) => {
    //     glb.downloadFiles();
    // });


    setTimeout(function(){
        BABYLON.GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
            glb.downloadFiles();
        });
    },100000);

    return scene;
};


var chloeWithFurnitureOnGroundScene = function (scene) {

    let parent = new BABYLON.Mesh("parent", scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 1000, width: 1000}, scene);
    ground.position = BABYLON.Vector3.Zero();
    ground.checkCollisions = true;
    ground.parent = parent;

    // Kula
    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 500, 200, scene);
    // sphere.position = new BABYLON.Vector3(250, 100, 0);
    // sphere.parent = parent;

    importModel('', 'ee7a2114e6df4d6098264ff1c5087c8a.glb', scene, parent, 100, 0, 0, 0);
    importModel('', 'chloe.glb', scene, parent, 165, -150, 0, 0);


    setTimeout(function(){
        log(scene.meshes.length + (typeof scene.meshes));
        optimizeMesh(scene.meshes);
    },2000);


    importModel('Armchair Ligne Roset N101121/', 'Armchair Ligne Roset N101121.glb', scene, parent, 100, 150, 0, 0);
    // importModel('', 'Armchair Ligne Roset N101121.glb', scene, parent, 165, 150, 0, 0);

    parent.setBoundingInfo(totalBoundingInfo(parent.getChildren()));
    parent.showBoundingBox = true;
}


var createScene3 = function (scene) {

    //Add the camera, to be shown as a cone and surrounding collision volume
    var camera = new BABYLON.UniversalCamera("MyCamera", new BABYLON.Vector3(0, 1, 0), scene);

    camera.minZ = 0.0001;
    camera.attachControl(canvas, true);
    camera.speed = 0.02;
    camera.angularSpeed = 0.05;
    camera.angle = Math.PI / 2;
    camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));

    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
    addElipsedObserwer(camera, scene);


    //Add viewCamera that gives first person shooter view
    var viewCamera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 3, -3), scene);
    viewCamera.parent = camera;
    viewCamera.setTarget(new BABYLON.Vector3(0, -0.0001, 1));

    //Add two viewports
    camera.viewport = new BABYLON.Viewport(0, 0.5, 1.0, 0.5);
    viewCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 0.5);

    //Dummy camera as cone
    var cone = BABYLON.MeshBuilder.CreateCylinder("dummyCamera", {
        diameterTop: 0.01, diameterBottom: 0.2, height: 0.2
    }, scene);
    cone.parent = camera;
    cone.rotation.x = Math.PI / 2;


    twoGroundAndCollisionBoxesScene(scene);

    //Activate both cameras
    scene.activeCameras.push(viewCamera);
    scene.activeCameras.push(camera);

    // useMyInputManager(camera);


    return scene;
}

var twoGroundAndCollisionBoxesScene = function (scene) {

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;

    var lowerGround = ground.clone("lowerGround");
    lowerGround.scaling.x = 4;
    lowerGround.scaling.z = 4;
    lowerGround.position.y = -16;
    lowerGround.material = ground.material.clone("lowerMat");
    lowerGround.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

    ground.checkCollisions = true;
    lowerGround.checkCollisions = true;

    var randomNumber = function (min, max) {
        if (min === max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    var box = new BABYLON.MeshBuilder.CreateBox("crate", {size: 2}, scene);
    box.material = new BABYLON.StandardMaterial("Mat", scene);
    box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
    box.checkCollisions = true;

    var boxNb = 6;
    var theta = 0;
    var radius = 6;
    box.position = new BABYLON.Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

    var boxes = [box];
    for (var i = 1; i < boxNb; i++) {
        theta += 2 * Math.PI / boxNb;
        var newBox = box.clone("box" + i);
        boxes.push(newBox);
        newBox.position = new BABYLON.Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));
    }

}
