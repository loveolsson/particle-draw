class LineLava extends LineType {
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

  newPoint (particles: Particle[], posx: number, posy: number, direction: number) {
    this.every ++;
    this.every %= 6;
    particles.push(new ParticleLava(this.lavamaterial, posx, posy));
    if (this.every == 0) particles.push(new ParticleStone(this.stonematerial, posx, posy));
  }
}

class ParticleLava extends Particle {
  constructor (_material: THREE.MeshBasicMaterial, posx: number, posy: number) {
    var geometry = new THREE.PlaneGeometry( 15, 15 );
    let material = _material.clone();
    let offset = Math.random() * Math.PI * 2;
    let opacityOffset = Math.random();

    let mesh = new THREE.Mesh( geometry, [material] );
    mesh.rotation.z = Math.random() * Math.PI * 2;
    scene.add(mesh);

    super(mesh, posx, posy, 0, offset, opacityOffset);
  }

  animate (timediff: number, clearrunner: number, totaltime: number) {
    this.offset += timediff/5000;
    this.offset %= Math.PI * 2;

    let x = this.x + Math.sin(this.offset) * 4;
    let y = this.y + Math.cos(this.offset) * 4;
    this.mesh.position.set(x, y, this.z);
    this.mesh.material[0].opacity = (Math.sin(this.offset*3) *0.7 + 0.3)*clearrunner;
    this.mesh.rotation.z += timediff/5000;
    this.mesh.rotation.z %= Math.PI * 2;
    this.mesh.scale.set(2-clearrunner*this.birth,2-clearrunner*this.birth,1);

    if (this.birth < 1) this.birth += timediff / 1000;
  }
}

class ParticleStone extends Particle {
  constructor (_material: THREE.MeshBasicMaterial, posx: number, posy: number) {
    let geometry = new THREE.PlaneGeometry( 20, 20 );
    let material = _material.clone();
    let offset = Math.random() * Math.PI * 2;
    let opacityOffset = Math.random();

    let mesh = new THREE.Mesh( geometry, [material] );

    mesh.rotation.z = Math.random() * Math.PI * 2;
    mesh.scale.set(0,0,0);
    scene.add(mesh);

    super(mesh, posx,  posy, -0.1, offset, opacityOffset);
  }

  animate (timediff: number, clearrunner: number, totaltime: number) {
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.scale.set(this.birth*clearrunner,this.birth*clearrunner,1);
    this.mesh.material[0].opacity = clearrunner;

    if (this.birth < 1) this.birth += timediff / 1000;
  }
}
