/// <reference path="../libs/three.d.ts"/>

class KoboshiShikakeObject extends THREE.Group
{

    private outerMesh:THREE.Mesh;

    constructor() {
        super();

        this.generateOuter();
        this.generateInner();
        this.transparentOuter();

        this.rotation.set(Math.PI/2,0,0);
    }



    public transparentOuter(){
        this.outerMesh.material.opacity=0.1;
    }

    public opaqueOuter(){
        this.outerMesh.material.opacity = 1;
    }


    private generateOuter(){
        let cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(35,35,200,36),
            new THREE.MeshPhongMaterial({
                color: 0x0000ff,transparent:true
            }));
        cylinder.position.y = 100;
        this.add(cylinder);

        this.outerMesh = cylinder;
    }

    private generateInner(){

        let omori = new THREE.Mesh(
            new THREE.CylinderGeometry(35,35,20,36),
            new THREE.MeshPhongMaterial({
                color: 0xff00ff
            }));
        omori.position.y = 25;
        this.add(omori);


        const wireCount = 8;
        let wireLen = 100;
        for(let i=0 ; i <wireCount; i++){

            wireLen += (50/wireCount);
            let wire = new THREE.Mesh(
                new THREE.CylinderGeometry(1,1,wireLen,36),
                new THREE.MeshPhongMaterial({
                    color: 0x00ff00
                }));
            wire.position.set(
                25*Math.cos(Math.PI*2*i/wireCount),
                wireLen/2 + 20,
                25*Math.sin(Math.PI*2*i/wireCount)
            );
            this.add(wire);
        }



        let furikoWire = new THREE.Mesh(
            new THREE.CylinderGeometry(1,1,100,36),
            new THREE.MeshPhongMaterial({
                color: 0xff0000
            }));
        furikoWire.position.y = 150;
        this.add(furikoWire);


        let furikoOmori = new THREE.Mesh(
            new THREE.CylinderGeometry(10,10,4,36),
            new THREE.MeshPhongMaterial({
                color: 0xff0000
            }));

        furikoOmori.position.y = 100;
        this.add(furikoOmori);




    }



}