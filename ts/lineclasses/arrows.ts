class LineArrow extends LineType {
  arrowmaterial: THREE.MeshBasicMaterial;
  every: number;

  constructor() {
    super();

    let stone = THREE.ImageUtils.loadTexture( "img/arrow.png" );
    this.arrowmaterial = new THREE.MeshBasicMaterial({map: stone, transparent: true, blending: THREE.NormalBlending});

    this.every = 0;
  }

  newStart (particles: Particle[], posx: number, posy: number) {
    particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 0,   0, -800));
    particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 1.5,             -800, 0));
    particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 1,       0, 800));
    particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 0.5,     800, 0));
  }
}

class ParticleArrow extends Particle {
  offX: number;
  offY: number;

  constructor (_material: THREE.MeshBasicMaterial, posx: number, posy: number, rotation: number, offX: number, offY: number) {
    var geometry = new THREE.PlaneGeometry( 70, 70 );
    let material = _material;
    let offset = 0;
    let opacityOffset = 0;

    let mesh = new THREE.Mesh( geometry, [material] );
    mesh.rotation.z = rotation;
    mesh.position.set(posx + offX, posy + offY, 0);
    scene.add(mesh);

    super(mesh, posx, posy, 0, offset, opacityOffset);

    this.offX = offX;
    this.offY = offY;
  }

  animate (timediff: number, clearrunner: number, totaltime: number) {
    if (this.birth < 1) {
      this.birth += timediff / 700;

      let inv = 1 - this.birth * 0.90;

      let x = this.x + inv * this.offX;
      let y = this.y + inv * this.offY;

      this.mesh.position.set(x, y, this.z);

    }
  }
}
