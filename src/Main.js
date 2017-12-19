/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/three.d.ts"/>
/// <reference path="../libs/threeTrackball.js.my.d.ts"/>
/// <reference path="../myLibs/UtilWindow.ts"/>
/// <reference path="./KoboshiObject.ts"/>
var Main = (function () {
    function Main(_mode) {
        this.cameraRadius = 700;
        this.mode = _mode;
        this.initBase();
        this.initHelper();
        this.scene.add(new KoboshiObject());
        var light = new THREE.DirectionalLight(0xcccccc, 1);
        light.position.set(-100, -100, 100);
        this.scene.add(light);
        var light2 = new THREE.DirectionalLight(0xcccccc, 1);
        light2.position.set(100, 100, 100);
        this.scene.add(light2);
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 1, 1), new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xd89d4a,
        }));
        plane.receiveShadow = true;
        this.scene.add(plane);
        this.onReady();
    }
    Main.prototype.initBase = function () {
        var _this = this;
        var scene = new THREE.Scene();
        //let width:number = 960;
        //let height:number = 640;
        var width = UtilWindow.getWindowWidth();
        var height = UtilWindow.getWindowHeight();
        var fov = 60;
        var near = 1;
        var far = 10000;
        var camera = new THREE.PerspectiveCamera(fov, (width / height), near, far);
        var rad1 = 30 / 180 * Math.PI;
        var rad2 = 30 / 180 * Math.PI;
        camera.position.set(this.cameraRadius * Math.cos(rad1) * Math.cos(rad2), this.cameraRadius * Math.cos(rad1) * Math.sin(rad2), this.cameraRadius * Math.sin(rad1));
        camera.up.set(0, 0, 1);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        var renderer = new THREE.WebGLRenderer();
        if (renderer == null) {
            alert('WebGL is not support');
            return;
        }
        renderer.setClearColor(0xeeeeee, 0.5);
        renderer.setSize(width, height);
        document.getElementById('main').appendChild(renderer.domElement);
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        switch (this.mode) {
            case Main.MODE_DEMO_H:
            case Main.MODE_DEMO_V:
                this.startCameraRotation();
                break;
            case Main.MODE_INTERACT:
                this.renderer.domElement.addEventListener('mousedown', function (e) { return _this.mouseDownHandler(e); });
                this.renderer.domElement.addEventListener('mousemove', function (e) { return _this.mouseMoveHandler(e); });
                this.renderer.domElement.addEventListener('mouseup', function (e) { return _this.mouseUpHandler(e); });
                break;
        }
    };
    Main.prototype.initHelper = function () {
        //座標
        var axis = new THREE.AxisHelper(1000);
        this.scene.add(axis);
        axis.position.set(0, 0, 0);
        //マウスで簡易操作
        //this._trackballCtrl = new THREE.TrackballControls(this.camera);
        //this._trackballCtrl.noRotate = true;
    };
    Main.prototype.mouseDownHandler = function (e) {
        this.mouseStartX = e.clientX;
        this.mouseStartY = e.clientY;
        this.isMouseDown = true;
        var camera = this.camera;
        this.sx = e.clientX;
        this.sz = e.clientY;
        this.startPos = camera.position.clone();
        this.startUp = camera.up.clone();
        this.v2 = camera.position.clone().normalize();
        //        this.v2 = new THREE.Vector3(0,0,1);
        this.u2 = camera.up.clone().normalize();
        this.w2 = this.v2.clone().cross(this.u2).normalize();
    };
    Main.prototype.mouseMoveHandler = function (e) {
        if (!this.isMouseDown) {
            return;
        }
        var mx = e.clientX - this.mouseStartX;
        var my = e.clientY - this.mouseStartY;
        var camera = this.camera;
        var newPos = this.startPos.clone();
        var deltaQuat = new THREE.Quaternion();
        var deltaQuatX = new THREE.Quaternion();
        var deltaQuatZ = new THREE.Quaternion();
        deltaQuatX.setFromAxisAngle(this.u2, -mx * Math.PI / 180);
        deltaQuatZ.setFromAxisAngle(this.w2, my * Math.PI / 180);
        deltaQuat.multiply(deltaQuatX).multiply(deltaQuatZ);
        newPos.applyQuaternion(deltaQuat);
        this.camera.position.set(newPos.x, newPos.y, newPos.z);
        var newUp = this.startUp.clone();
        deltaQuat.setFromAxisAngle(this.w2, my * Math.PI / 180);
        newUp.applyQuaternion(deltaQuat);
        this.camera.up.set(newUp.x, newUp.y, newUp.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    };
    Main.prototype.mouseUpHandler = function (e) {
        this.isMouseDown = false;
        console.log('mouseUp');
    };
    Main.prototype.startCameraRotation = function () {
        this.phi = Math.asin(this.camera.position.z / this.cameraRadius);
        this.theta = Math.atan2(this.camera.position.y, this.camera.position.x);
    };
    Main.prototype.moveCameraRotation = function (diffX, diffZ) {
        this.phi += diffZ * Math.PI / 180;
        this.theta += diffX * Math.PI / 180;
        this.camera.position.set(this.cameraRadius * Math.cos(this.phi) * Math.cos(this.theta), this.cameraRadius * Math.cos(this.phi) * Math.sin(this.theta), this.cameraRadius * Math.sin(this.phi));
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    };
    Main.prototype.onReady = function () {
        this.tick();
    };
    Main.prototype.tick = function () {
        var _this = this;
        switch (this.mode) {
            case Main.MODE_DEMO_H:
                this.moveCameraRotation(1, 0);
                break;
            case Main.MODE_DEMO_V:
                this.moveCameraRotation(0, -1);
                break;
            case Main.MODE_INTERACT:
                break;
        }
        requestAnimationFrame(function () { return _this.tick(); });
        this.renderer.render(this.scene, this.camera);
    };
    return Main;
}());
Main.MODE_DEMO_H = 1;
Main.MODE_DEMO_V = 2;
Main.MODE_INTERACT = 3;
