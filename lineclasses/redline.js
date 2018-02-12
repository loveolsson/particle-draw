function lineRedline () {
  this.every = 0;
  this.glowball = THREE.ImageUtils.loadTexture( "redline.png" );
  this.redlinematerial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.NormalBlending});



  this.newPoint = function (scene, particles, posx, posy, direction) {
    this.every ++;
    this.every %= 8;
    //if (this.every % 2 == 0) 
    this.newRedline(scene, particles, posx, posy, direction);

  }

  this.newRedline = function (scene, particles, posx, posy, direction) {
    var part = new Particle();
    var geometry = new THREE.PlaneGeometry( 15, 15 );

    part.material = this.redlinematerial.clone();
    part.x = posx;
    part.y = posy;
    part.offset = 0;
    part.birth = 0;

    part.object = new THREE.Mesh( geometry, part.material );
    part.object.rotation.z = direction - Math.PI / 2;

    part.animate = this.animateRedline;

    particles[particles.length] = part;

    scene.add( part.object);

  }


  this.animateRedline = function (part, timediff, clearrunner) {
    part.offset += timediff/30000;
    part.offset %= Math.PI * 2;
    part.object.position.x = part.x;
    part.object.position.y = part.y;
    part.object.material.opacity =  clearrunner;
    part.object.scale.set(clearrunner*part.birth + Math.sin(part.offset*50)/4,1,1);

    if (part.birth < 1) part.birth += timediff / 1000;
  }

}
