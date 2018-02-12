class Particle {
    birth: number;
    constructor(public mesh: THREE.Mesh, public x: number, public y: number, public z: number, public offset: number,
      public opacityOffset: number) {
      this.birth = 0;
    }

    animate (timediff: number, clearrunner: number, totaltime: number) {
    }
}

class LineType {
  constructor () {
  }

  newStart (particles: Particle[], posx: number, posy: number) {
  }
  newDrag (particles: Particle[], posx: number, posy: number, direction: number) {
  }
}
