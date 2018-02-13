class Particle {
    birth: number;
    constructor(public mesh: THREE.Mesh, public pos: THREE.Vector3, public offset: number,
      public opacityOffset: number) {
      this.birth = 0;
    }

    animate (timediff: number, clearrunner: number, totaltime: number) {
      this.mesh.material[0].opacity = clearrunner;
    }
}

class LineType {
  constructor () {
  }

  newStart (particles: Particle[], pos: THREE.Vector2) {
  }
  newDrag (particles: Particle[], pos: THREE.Vector2, direction: number) {
  }
}
