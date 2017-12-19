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


    private phi;
    private theta;

    private isMouseDown:boolean;
    private mouseBaseX:number;
    private mouseBaseY:number;
    private cameraBasePosition;
    private cameraBaseUp;
    private cameraBaseUpCross;
    private cameraRadius = 700;

    private mode;

    static MODE_DEMO_H = 1;
    static MODE_DEMO_V = 2;
    static MODE_INTERACT = 3;


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

        if(this.mode == Main.MODE_DEMO_V){
            let  axis = new THREE.AxisHelper(1000);
            this.scene.add(axis);
            axis.position.set(0,0,0);
        }

        //マウスで簡易操作
        //this._trackballCtrl = new THREE.TrackballControls(this.camera);
        //this._trackballCtrl.noRotate = true;

    }





    private mouseDownHandler(e){
        this.isMouseDown = true;
        this.setBaseInfo(e.clientX , e.clientY);
    }
    private mouseMoveHandler(e){
        if(! this.isMouseDown){
            return;
        }
        let mx = e.clientX - this.mouseBaseX;
        let my = e.clientY - this.mouseBaseY;

        let newPos = this.cameraBasePosition.clone();
        let deltaQuat = new THREE.Quaternion();
        let deltaQuatX = new THREE.Quaternion();
        let deltaQuatZ = new THREE.Quaternion();
        deltaQuatX.setFromAxisAngle(this.cameraBaseUp , -mx * Math.PI / 180);
        deltaQuatZ.setFromAxisAngle(this.cameraBaseUpCross , my * Math.PI / 180);
        deltaQuat.multiply(deltaQuatX).multiply(deltaQuatZ);
        newPos.applyQuaternion(deltaQuat);

        this.camera.position.set(newPos.x,newPos.y,newPos.z);

        let newUp = this.cameraBaseUp.clone();
        deltaQuat.setFromAxisAngle(this.cameraBaseUpCross , my * Math.PI / 180);
        newUp.applyQuaternion(deltaQuat);
        this.camera.up.set(newUp.x,newUp.y,newUp.z);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.setBaseInfo(e.clientX , e.clientY);
    }
    private setBaseInfo(x,y){
        this.mouseBaseX = x;
        this.mouseBaseY = y;
        this.cameraBasePosition = this.camera.position.clone();
        this.cameraBaseUp = this.camera.up.clone();
        this.cameraBaseUpCross = this.cameraBasePosition.clone().cross(this.cameraBaseUp).normalize();
    }
    private mouseUpHandler(e){
        this.isMouseDown = false;
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