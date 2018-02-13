class LineArrow extends LineType {
  arrowmaterial: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;

  every: number;

  constructor() {
    super();

    let stone = THREE.ImageUtils.loadTexture( "img/arrow.png" );
    this.arrowmaterial = new THREE.MeshBasicMaterial({map: stone, transparent: true, blending: THREE.NormalBlending});
    this.geometry = new THREE.PlaneGeometry( 70, 70 )


    this.every = 0;
  }

  newStart (particles: Particle[], pos:THREE.Vector2) {
    particles.push(new ParticleArrow(this.arrowmaterial, this.geometry, pos, Math.PI * 0,    new THREE.Vector2(0, -800)));
    particles.push(new ParticleArrow(this.arrowmaterial, this.geometry, pos, Math.PI * 1.5,  new THREE.Vector2(-800, 0)));
    particles.push(new ParticleArrow(this.arrowmaterial, this.geometry, pos, Math.PI * 1,    new THREE.Vector2(0, 800)));
    particles.push(new ParticleArrow(this.arrowmaterial, this.geometry, pos, Math.PI * 0.5,  new THREE.Vector2(800, 0)));
  }
}

class ParticleArrow extends Particle {
  off: THREE.Vector2;

  constructor (_material: THREE.MeshBasicMaterial, _geometry: THREE.PlaneGeometry, pos: THREE.Vector2, rotation: number, off:THREE.Vector2) {
    var geometry = _geometry;
    let material = _material;
    let offset = 0;
    let opacityOffset = 0;

    let mesh = new THREE.Mesh( geometry, [material] );
    mesh.rotation.z = rotation;
    let offsetPos = pos.clone().add(off);
    mesh.position.set(offsetPos.x, offsetPos.y, 0);
    scene.add(mesh);

    super(mesh, new THREE.Vector3(pos.x, pos.y, 0), offset, opacityOffset);

    this.off = off;
  }

  animate (timediff: number, clearrunner: number, totaltime: number) {
    if (this.birth < 1) {
      this.birth += timediff / 700;

      let inv = 1 - this.birth * 0.90;

      let x = this.pos.x + inv * this.off.x;
      let y = this.pos.y + inv * this.off.y;

      this.mesh.position.set(x, y, this.pos.z);
    }
  }
}
