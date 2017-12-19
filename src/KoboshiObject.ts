/// <reference path="../libs/three.d.ts"/>
/// <reference path="./KoboshiShikakeObject.ts"/>

class KoboshiObject extends THREE.Group
{

    private outerSphere1:THREE.Mesh;
    private outerSphere2:THREE.Mesh;
    private shikake:KoboshiShikakeObject;

    constructor() {
        super();

        this.generateOuter();
        this.generateInner();
        this.transparentOuter();

    }



    public transparentOuter(){
        this.outerSphere1.material.opacity=0.1;
        this.outerSphere2.material.opacity=0.1;
    }

    public opaqueOuter(){
        this.outerSphere1.material.opacity = 1;
        this.outerSphere2.material.opacity = 1;
    }


    private generateOuter(){
        let sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry (105,36,36),
            new THREE.MeshPhongMaterial( { color: 0xffffff,transparent:true} )
        );
        sphere1.position.set(0,0,100);
        this.add(sphere1);


        let sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry (70,36,36),
            new THREE.MeshPhongMaterial( { color: 0xffffff,transparent:true} )
        );
        sphere2.position.set(0,0,240);
        this.add(sphere2);


        this.outerSphere1 = sphere1;
        this.outerSphere2 = sphere2;

    }

    private generateInner(){
        this.shikake = new KoboshiShikakeObject();
//        this.shikake.position.set(0,0,5);

//        this.shikake.position.z = 20;
        this.add(this.shikake);




    }



}