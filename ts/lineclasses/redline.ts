class LineRed extends LineType {
  materials: THREE.MeshBasicMaterial[] = [];
  geometry: THREE.PlaneGeometry;
  every: number;

  constructor() {
    super();


    let glowball = THREE.ImageUtils.loadTexture( "img/redline.png" );
    this.materials['white'] = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.NormalBlending});
    this.materials['red'] = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.NormalBlending, color: new THREE.Color('red')});
    this.materials['green'] = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.NormalBlending, color: new THREE.Color('green')});
    this.materials['blue'] = new THREE.MeshBasicMaterial({map: glowball, transparent: true, blending: THREE.NormalBlending, color: new THREE.Color('blue')});
    this.geometry = new THREE.PlaneGeometry( 10, 10 )

    this.every = 0;
  }

  newDrag (particles: Particle[], pos: THREE.Vector2, direction: number) {
    this.every ++;
    this.every = this.every % dashDistance;
    if ((this.every / dashDistance) < 0.5)
      particles.push(new ParticleRedLine(this.materials[activeColor], this.geometry, pos, direction));
  }
}

class ParticleRedLine extends Particle {
  constructor (_material: THREE.MeshBasicMaterial, _geometry: THREE.PlaneGeometry, pos: THREE.Vector2, direction: number) {
    let geometry = _geometry;
    let material = _material;
    let offset = 0;
    let opacityOffset = 0;

    let mesh = new THREE.Mesh( geometry, [material] );
    mesh.rotation.z = direction - Math.PI / 2;
    mesh.position.x = pos.x;
    mesh.position.y = pos.y;
    scene.add(mesh);

    super(mesh, new THREE.Vector3(pos.x,  pos.y, 0), offset, opacityOffset);
  }
}
