// function lineRedline () {
//   this.every = 0;
//   this.glowball = THREE.ImageUtils.loadTexture( "img/redline.png" );
//   this.redlinematerial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.NormalBlending});
//
//
//
//   this.newPoint = function (scene, particles, posx, posy, direction) {
//     this.every ++;
//     this.every %= 8;
//     //if (this.every % 2 == 0)
//     this.newRedline(scene, particles, posx, posy, direction);
//
//   }
//
//   this.newRedline = function (scene, particles, posx, posy, direction) {
//     var part = new Particle();
//     var geometry = new THREE.PlaneGeometry( 15, 15 );
//
//     part.material = this.redlinematerial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = 0;
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = direction - Math.PI / 2;
//
//     part.animate = this.animateRedline;
//
//     particles[particles.length] = part;
//
//     scene.add( part.object);
//
//   }
//
//
//   this.animateRedline = function (part, timediff, clearrunner) {
//     part.offset += timediff/30000;
//     part.offset %= Math.PI * 2;
//     part.object.position.x = part.x;
//     part.object.position.y = part.y;
//     part.object.material.opacity =  clearrunner;
//     part.object.scale.set(clearrunner*part.birth + Math.sin(part.offset*50)/4,1,1);
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//   }
//
// }

class LineRed extends LineType {
  redlinematerial: THREE.MeshBasicMaterial;
  every: number;

  constructor() {
    super();


    let glowball = THREE.ImageUtils.loadTexture( "img/redline.png" );
    this.redlinematerial = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.NormalBlending});

    this.every = 0;
  }

  newDrag (particles: Particle[], posx: number, posy: number, direction: number) {
    this.every ++;
    if ((this.every %= 1) == 0)
      particles.push(new ParticleRedLine(this.redlinematerial, posx, posy, direction));
  }
}

class ParticleRedLine extends Particle {
  constructor (_material: THREE.MeshBasicMaterial, posx: number, posy: number, direction: number) {
    let geometry = new THREE.PlaneGeometry( 10, 10 );
    let material = _material;
    let offset = 0;
    let opacityOffset = 0;

    let mesh = new THREE.Mesh( geometry, [material] );
    mesh.rotation.z = direction - Math.PI / 2;
    mesh.position.x = posx;
    mesh.position.y = posy;
    scene.add(mesh);

    super(mesh, posx,  posy, 0, offset, opacityOffset);
  }
}
