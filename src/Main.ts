/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/three.d.ts"/>
/// <reference path="../libs/threeTrackball.js.my.d.ts"/>
/// <reference path="../myLibs/UtilWindow.ts"/>
/// <reference path="./KoboshiObject.ts"/>

class Main
{
    private renderer:THREE.WebGLRenderer;
    private scene:THREE.Scene;
    private camera:THREE.PerspectiveCamera;

    private mouseStartX:number;
    private mouseStartY:number;
    private isMouseDown:boolean;

    private phi;
    private theta;

    private cameraRadius = 700;

    private mode;

    static MODE_DEMO_H = 1;
    static MODE_DEMO_V = 2;
    static MODE_INTERACT = 3;

    private mainObj:THREE.Group;

    constructor(_mode:number) {

        this.mode = _mode;

        this.initBase();
        this.initHelper();

        this.scene.add(new KoboshiObject());

        let light = new THREE.DirectionalLight(0xcccccc,1);
        light.position.set(-100,-100,100);
        this.scene.add(light);
        let light2 = new THREE.DirectionalLight(0xcccccc,1);
        light2.position.set(100,100,100);
        this.scene.add(light2);

        let plane =  new THREE.Mesh(
            new THREE.PlaneGeometry(300,300,1, 1),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xd89d4a,
            }));
        plane.receiveShadow = true;
        this.scene.add(plane);

        this.onReady();

    }

    private initBase(){
        let scene:THREE.Scene = new THREE.Scene();

        //let width:number = 960;
        //let height:number = 640;
        let width:number = UtilWindow.getWindowWidth();
        let height:number = UtilWindow.getWindowHeight();
        let fov:number = 60;
        let near:number = 1;
        let far:number = 10000;
        let camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fov, (width/height) , near , far);

        let rad1 = 30/180*Math.PI;
        let rad2 = 30/180*Math.PI;
        camera.position.set(
            this.cameraRadius * Math.cos(rad1) * Math.cos(rad2),
            this.cameraRadius * Math.cos(rad1) * Math.sin(rad2),
            this.cameraRadius * Math.sin(rad1)
        );
        camera.up.set(0,0,1);
        camera.lookAt(new THREE.Vector3(0,0,0));

        let renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer();
        if (renderer == null) {
            alert('WebGL is not support');
            return;
        }

        renderer.setClearColor(0xeeeeee, 0.5);
        renderer.setSize( width, height );
        document.getElementById('main').appendChild( renderer.domElement );

        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;

        switch(this.mode){
            case Main.MODE_DEMO_H :
            case Main.MODE_DEMO_V :
                this.startCameraRotation();
                break;
            case Main.MODE_INTERACT :
                this.renderer.domElement.addEventListener('mousedown', (e) => this.mouseDownHandler(e));
                this.renderer.domElement.addEventListener('mousemove', (e) => this.mouseMoveHandler(e));
                this.renderer.domElement.addEventListener('mouseup', (e) => this.mouseUpHandler(e));
                break;
        }
    }
    private initHelper(){
        //座標
        let  axis = new THREE.AxisHelper(1000);
        this.scene.add(axis);
        axis.position.set(0,0,0);

        //マウスで簡易操作
        //this._trackballCtrl = new THREE.TrackballControls(this.camera);
        //this._trackballCtrl.noRotate = true;

    }



    private v2;
    private u2;
    private w2;
    private sx;
    private sz;

    private startPos;
    private startUp;

    private mouseDownHandler(e){
        this.mouseStartX = e.clientX;
        this.mouseStartY = e.clientY;
        this.isMouseDown = true;

        let camera = this.camera;
        this.sx = e.clientX;
        this.sz = e.clientY;

        this.startPos = camera.position.clone();
        this.startUp = camera.up.clone();

        this.v2 = camera.position.clone().normalize();
//        this.v2 = new THREE.Vector3(0,0,1);
        this.u2 = camera.up.clone().normalize();
        this.w2 = this.v2.clone().cross(this.u2).normalize();

    }
    private mouseMoveHandler(e){
        if(! this.isMouseDown){
            return;
        }
        let mx = e.clientX - this.mouseStartX;
        let my = e.clientY - this.mouseStartY;


        let camera = this.camera;

        let newPos = this.startPos.clone();
        let deltaQuat = new THREE.Quaternion();
        let deltaQuatX = new THREE.Quaternion();
        let deltaQuatZ = new THREE.Quaternion();
        deltaQuatX.setFromAxisAngle(this.u2 , -mx * Math.PI / 180);
        deltaQuatZ.setFromAxisAngle(this.w2 , my * Math.PI / 180);
        deltaQuat.multiply(deltaQuatX).multiply(deltaQuatZ);
        newPos.applyQuaternion(deltaQuat);

        this.camera.position.set(newPos.x,newPos.y,newPos.z);

        let newUp = this.startUp.clone();
        deltaQuat.setFromAxisAngle(this.w2 , my * Math.PI / 180);
        newUp.applyQuaternion(deltaQuat);
        this.camera.up.set(newUp.x,newUp.y,newUp.z);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

    }
    private mouseUpHandler(e){
        this.isMouseDown = false;
        console.log('mouseUp');
    }



    private startCameraRotation(){
        this.phi = Math.asin(this.camera.position.z / this.cameraRadius);
        this.theta = Math.atan2(this.camera.position.y, this.camera.position.x);
    }
    private moveCameraRotation(diffX , diffZ){
        this.phi += diffZ *  Math.PI / 180;
        this.theta += diffX *  Math.PI / 180;

        this.camera.position.set(
            this.cameraRadius * Math.cos(this.phi) * Math.cos(this.theta),
            this.cameraRadius * Math.cos(this.phi) * Math.sin(this.theta),
            this.cameraRadius * Math.sin(this.phi)
        );
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    }






    private onReady(){
        this.tick();

    }

    private tick(){

        switch(this.mode){
            case Main.MODE_DEMO_H :
                this.moveCameraRotation(1 , 0);
                break;
            case Main.MODE_DEMO_V :
                this.moveCameraRotation(0 , -1);
                break;
            case Main.MODE_INTERACT :
                break;
        }

        requestAnimationFrame( () => this.tick() );
        this.renderer.render( this.scene, this.camera );

    }

}