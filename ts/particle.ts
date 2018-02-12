class Particle {
    birth: number;
    constructor(public mesh: THREE.Mesh, public offset: number,
      public opacityOffset: number, public animate: Function) {
      this.birth = 0;
    }
}

class LineType {
  constructor () {

  }

  newPoint (scene: THREE.Scene, particles: Particle[], posx: number, posy: number, direction: number) {

  }

}
