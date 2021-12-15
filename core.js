let totalBoundingInfo = function (meshes) {
    let boundingInfo = meshes[0].getBoundingInfo();
    let min = boundingInfo.minimum.add(meshes[0].position);
    let max = boundingInfo.maximum.add(meshes[0].position);
    for (let i = 1; i < meshes.length; i++) {
        boundingInfo = meshes[i].getBoundingInfo();
        min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
        max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
    }
    return new BABYLON.BoundingInfo(min, max);
}

let importModel = function (path, name, scene, parent, sizeY, posX, posY, posZ) {
    log('importModel ' + name);
    // BABYLON.SceneLoader.ImportMesh(null, "assets/", path + name, scene, function (meshes, particleSystems, skeletons) {
    BABYLON.SceneLoader.LoadAssetContainer("assets/" + path, name, scene, function (container) {
        let meshes = container.meshes;
        let mesh = meshes[0];

        mesh.id = name + '_' + mesh.id;

        // mesh.rotation =  new BABYLON.Vector3(0, -180, 0);
        // mesh.scaling = new BABYLON.Vector3(1, 1, -1);
        // mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        // mesh.parent = parent;


        for (let i = 0; i < meshes.length; i++) {
            mesh.rotation = new BABYLON.Vector3.Zero();
            // meshes[i].showBoundingBox = true;
            log(meshes[i].id);
            // log(meshes[i].getBoundingInfo());
        }

        let minV = getMinWorldFromMeshes(meshes);
        let maxV = getMaxWorldFromMeshes(meshes);
        let posV = getPosFromMeshes(meshes);
        let info = totalBoundingInfo(meshes);

        var sizeV = new BABYLON.Vector3(maxV.x - minV.x, maxV.y - minV.y, maxV.z - minV.z);

        if (sizeY !== null) {
            y = sizeY / sizeV.y;
            // log('sizeY' + sizeY + ' / sizeV.y' + sizeV.y + ' = y' + y);
            sizeV = new BABYLON.Vector3(sizeV.x * y, sizeV.y * y, sizeV.z * y);
            mesh.scaling = new BABYLON.Vector3(y, y, y)
            // log(sizeV);
        }

        let centerV = new BABYLON.Vector3(minV.x + sizeV.x / 2, minV.y + sizeV.y / 2, minV.z + sizeV.z / 2);
        let positionV = new BABYLON.Vector3(posX + 0, posY + sizeV.y / 2, posZ + 0);


        var sphere = BABYLON.Mesh.CreateBox("box", 1);
        sphere.scaling = sizeV;
        sphere.position = positionV;
        sphere.visibility = 0.1;
        sphere.parent = parent;
        mesh.position = positionV;
        mesh.setBoundingInfo(sphere.getBoundingInfo());
        sphere.dispose();

        // log([minV, maxV, posV, sizeV, centerV, info]);
        // log(mesh.getBoundingInfo());


        // let m = BABYLON.MeshBuilder.CreateBox("bounds", {
        //     width: sizeV.x,
        //     height: sizeV.y,
        //     depth: sizeV.z
        // }, scene);
        // m.visibility = 0.1;
        // m.showBoundingBox = true;
        // m.parent = parent;

        // let n = BABYLON.MeshBuilder.CreateBox("bounds", {
        //     width: 795,
        //     height: 3033,
        //     depth: 408
        // }, scene);


        // m.position = minV;

        // m.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        // log(m.getBoundingInfo().boundingBox)


        // log(m.getBoundingInfo().boundingBox)

        // var merged = BABYLON.Mesh.MergeMeshes([sphere, mesh], );

        // merged._addToSceneRootNodes()

        for (let i = 0; i < meshes.length; i++) {
            scene.addMesh(meshes[i]);
        }


        // container.addAllToScene();
    });
}

var optimizeMesh = function (meshes) {
<<<<<<< HEAD

=======
    const quality = 0.2;
>>>>>>> origin/main
    if (typeof meshes === 'object') {
        let meshesO = meshes;
        meshes = [];
        for (const [key, value] of Object.entries(meshesO)) {
            meshes.push(value);
        }
    }
    log('Start optimize meshes:' + meshes.length + ' ' + (typeof meshes));
    for (let i = 0; i < meshes.length; i++) {
        if (isRealMesh(meshes[i])) {
            if (typeof meshes[i] === 'undefined') {
                continue;
            }
            if (typeof meshes[i].subMeshes === 'undefined') {
                continue;
            }
            log('Start optimize mesh: ' + meshes[i].id + ' size:' + meshes[i].size);
            meshes[i].simplify([new BABYLON.SimplificationSettings(optimizeQuantity, 0)],
                null, null,
                function (mesh) {
                    log('optimized mesh: ' + (typeof mesh));
                }
                , function () {
                    log('error optimize mesh: ');
                }
            );
        }
    }
}


var getMinWorldFromMeshes = function (meshes) {
    let v = new BABYLON.Vector3.Zero();
    for (let i = 0; i < meshes.length; i++) {
        if (!isRealMesh(meshes[i])) {
            continue;
        }
        let bBox = meshes[i].getBoundingInfo().boundingBox;
        if (v.x > bBox.minimumWorld.x) {
            v.x = bBox.minimumWorld.x;
        }
        if (v.y > bBox.minimumWorld.y) {
            v.y = bBox.minimumWorld.y;
        }
        if (v.z > bBox.minimumWorld.z) {
            v.z = bBox.minimumWorld.z;
        }
    }
    return v;
}

var getMaxWorldFromMeshes = function (meshes) {
    let v = new BABYLON.Vector3.Zero();
    for (let i = 0; i < meshes.length; i++) {
        if (!isRealMesh(meshes[i])) {
            continue;
        }
        let bBox = meshes[i].getBoundingInfo().boundingBox;
        if (v.x < bBox.maximumWorld.x) {
            v.x = bBox.maximumWorld.x;
        }
        if (v.y < bBox.maximumWorld.y) {
            v.y = bBox.maximumWorld.y;
        }
        if (v.z < bBox.maximumWorld.z) {
            v.z = bBox.maximumWorld.z;
        }
    }
    return v;
}


var getPosFromMeshes = function (meshes) {
    let v = new BABYLON.Vector3.Zero();
    for (let i = 0; i < meshes.length; i++) {
        if (!isRealMesh(meshes[i])) {
            continue;
        }
        let bBox = meshes[i].getBoundingInfo().boundingBox;
        if (v.x < bBox.center.x) {
            v.x = bBox.center.x;
        }
        if (v.y < bBox.center.y) {
            v.y = bBox.center.y;
        }
        if (v.z < bBox.center.z) {
            v.z = bBox.center.z;
        }
    }
    return v;
}

var isRealMesh = function (mesh) {
    let bBox = mesh.getBoundingInfo().boundingBox;
    if ((bBox.maximumWorld.x - bBox.minimumWorld.x) + (bBox.maximumWorld.y - bBox.minimumWorld.y) + (bBox.maximumWorld.z - bBox.minimumWorld.z) === 0) {
        return false;
    }
    return true
}


var addElipsedObserwer = function (camera, scene) {
    //Create Visible Ellipsoid around camera
    var a = 0.5;
    var b = 1;
    var points = [];
    for (var theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
        points.push(new BABYLON.Vector3(0, b * Math.sin(theta), a * Math.cos(theta)));
    }

    var ellipse = [];
    ellipse[0] = BABYLON.MeshBuilder.CreateLines("e", {points: points}, scene);
    ellipse[0].color = BABYLON.Color3.Red();
    ellipse[0].parent = camera;
    ellipse[0].rotation.y = 5 * Math.PI / 16;
    for (var i = 1; i < 23; i++) {
        ellipse[i] = ellipse[0].clone("el" + i);
        ellipse[i].parent = camera;
        ellipse[i].rotation.y = 5 * Math.PI / 16 + i * Math.PI / 16;
    }
}

// var loader = new THREE.GLTFLoader();
// loader.load('foo.glb', function (gltf) {
//
//     var model = gltf.scene;
//     var modifer = new THREE.SimplifyModifier();
//
//     model.traverse(function (o) {
//
//         if (o.isMesh) {
//
//             var numVertices = o.geometry.attributes.position.count;
//             o.geometry = modifer.modify(o.geometry, Math.floor(numVertices * 0.9375));
//
//         }
//
//     });
//
//     scene.add(model);
//
// }, undefined, function (e) {
//
//     console.error(e);
//
// });
