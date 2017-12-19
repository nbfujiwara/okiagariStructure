/// <reference path="../libs/three.d.ts"/>
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
var KoboshiShikakeObject = (function (_super) {
    __extends(KoboshiShikakeObject, _super);
    function KoboshiShikakeObject() {
        var _this = _super.call(this) || this;
        _this.generateOuter();
        _this.generateInner();
        _this.transparentOuter();
        _this.rotation.set(Math.PI / 2, 0, 0);
        return _this;
    }
    KoboshiShikakeObject.prototype.transparentOuter = function () {
        this.outerMesh.material.opacity = 0.1;
    };
    KoboshiShikakeObject.prototype.opaqueOuter = function () {
        this.outerMesh.material.opacity = 1;
    };
    KoboshiShikakeObject.prototype.generateOuter = function () {
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 200, 36), new THREE.MeshPhongMaterial({
            color: 0x0000ff, transparent: true
        }));
        cylinder.position.y = 100;
        this.add(cylinder);
        this.outerMesh = cylinder;
    };
    KoboshiShikakeObject.prototype.generateInner = function () {
        var omori = new THREE.Mesh(new THREE.CylinderGeometry(35, 35, 20, 36), new THREE.MeshPhongMaterial({
            color: 0xff00ff
        }));
        omori.position.y = 25;
        this.add(omori);
        var wireCount = 8;
        var wireLen = 100;
        for (var i = 0; i < wireCount; i++) {
            wireLen += (50 / wireCount);
            var wire = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, wireLen, 36), new THREE.MeshPhongMaterial({
                color: 0x00ff00
            }));
            wire.position.set(25 * Math.cos(Math.PI * 2 * i / wireCount), wireLen / 2 + 20, 25 * Math.sin(Math.PI * 2 * i / wireCount));
            this.add(wire);
        }
        var furikoWire = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 100, 36), new THREE.MeshPhongMaterial({
            color: 0xff0000
        }));
        furikoWire.position.y = 150;
        this.add(furikoWire);
        var furikoOmori = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 4, 36), new THREE.MeshPhongMaterial({
            color: 0xff0000
        }));
        furikoOmori.position.y = 100;
        this.add(furikoOmori);
    };
    return KoboshiShikakeObject;
}(THREE.Group));
