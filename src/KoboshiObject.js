/// <reference path="../libs/three.d.ts"/>
/// <reference path="./KoboshiShikakeObject.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KoboshiObject = (function (_super) {
    __extends(KoboshiObject, _super);
    function KoboshiObject() {
        var _this = _super.call(this) || this;
        _this.generateOuter();
        _this.generateInner();
        _this.transparentOuter();
        return _this;
    }
    KoboshiObject.prototype.transparentOuter = function () {
        this.outerSphere1.material.opacity = 0.1;
        this.outerSphere2.material.opacity = 0.1;
    };
    KoboshiObject.prototype.opaqueOuter = function () {
        this.outerSphere1.material.opacity = 1;
        this.outerSphere2.material.opacity = 1;
    };
    KoboshiObject.prototype.generateOuter = function () {
        var sphere1 = new THREE.Mesh(new THREE.SphereGeometry(105, 36, 36), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true }));
        sphere1.position.set(0, 0, 100);
        this.add(sphere1);
        var sphere2 = new THREE.Mesh(new THREE.SphereGeometry(70, 36, 36), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true }));
        sphere2.position.set(0, 0, 240);
        this.add(sphere2);
        this.outerSphere1 = sphere1;
        this.outerSphere2 = sphere2;
    };
    KoboshiObject.prototype.generateInner = function () {
        this.shikake = new KoboshiShikakeObject();
        //        this.shikake.position.set(0,0,5);
        //        this.shikake.position.z = 20;
        this.add(this.shikake);
    };
    return KoboshiObject;
}(THREE.Group));
