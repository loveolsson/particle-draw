class Lava extends LineType {
  lavamaterial: THREE.MeshBasicMaterial;
  stonematerial: THREE.MeshBasicMaterial;
  every: number;

  constructor() {
    super();

    let glowball = THREE.ImageUtils.loadTexture( "img/glowball2.png" );
    this.lavamaterial = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.AdditiveBlending});

    let stone = THREE.ImageUtils.loadTexture( "img/stone.png" );
    this.stonematerial = new THREE.MeshBasicMaterial({map: stone, transparent: true, blending: THREE.NormalBlending});

    this.every = 0;
  }

  newPoint (scene: THREE.Scene, particles: Particle[], posx: number, posy: number, direction: number) {
    this.every ++;
    this.every %= 6;
    particles.push(this.newLava(scene, posx, posy));
    if (this.every == 0) particles.push(this.newStone(scene, posx, posy));

  }

  newLava (scene: THREE.Scene, posx: number, posy: number) : Particle {
    var geometry = new THREE.PlaneGeometry( 15, 15 );

    let material = this.lavamaterial.clone();

    let offset = Math.random() * Math.PI * 2;
    let opacityOffset = Math.random();

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(posx, posy, 0);
    mesh.rotation.z = Math.random() * Math.PI * 2;

    scene.add( mesh );

    var part = new Particle(mesh, offset, opacityOffset, this.animateLava);

    return part;
  }

  newStone (scene: THREE.Scene, posx: number, posy: number) : Particle {

    let geometry = new THREE.PlaneGeometry( 20, 20 );
    let material = this.stonematerial.clone();
    let offset = Math.random() * Math.PI * 2;
    let opacityOffset = Math.random();

    let mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.z = Math.random() * Math.PI * 2;
    mesh.position.set(posx, posy, -0.1);

    mesh.scale.set(0,0,0);

    scene.add( mesh );

    var part = new Particle(mesh, offset, opacityOffset, this.animateStone);

    return part;
  }

  animateLava (part: Particle, timediff: number, clearrunner: number) {
    part.offset += timediff/5000;
    part.offset %= Math.PI * 2;

    part.mesh.position.x += Math.sin(part.offset)*0.01;
    part.mesh.position.y += Math.cos(part.offset)*0.01;
    part.mesh.material.opacity = (Math.sin(part.offset*3) *0.7 + 0.3)*clearrunner;
    part.mesh.rotation.z += timediff/5000;
    part.mesh.rotation.z %= Math.PI * 2;
    part.mesh.scale.set(2-clearrunner*part.birth,2-clearrunner*part.birth,1);

    if (part.birth < 1) part.birth += timediff / 1000;
  }

  animateStone (part: Particle, timediff: number, clearrunner: number) {
    part.mesh.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
    part.mesh.material.opacity = clearrunner;

    if (part.birth < 1) part.birth += timediff / 1000;

  }

}
