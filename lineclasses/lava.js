function lineLava () {
  this.every = 0;
  this.glowball = THREE.ImageUtils.loadTexture( "glowball2.png" );
  this.lavamaterial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.AdditiveBlending});

  this.stone = THREE.ImageUtils.loadTexture( "stone.png" );
  this.stonematerial = new THREE.MeshBasicMaterial({map: this.stone, transparent: true, blending: THREE.NormalBlending});



  this.newPoint = function (scene, particles, posx, posy) {
    this.every ++;
    this.every %= 6;
    this.newLava(scene, particles, posx, posy);
    if (this.every == 0) this.newStone(scene, particles, posx, posy);

  }

  this.newLava = function (scene, particles, posx, posy) {
    var part = new Particle();
    var geometry = new THREE.PlaneGeometry( 15, 15 );

    part.material = this.lavamaterial.clone();
    part.x = posx;
    part.y = posy;
    part.offset = Math.random() * Math.PI * 2;
    part.opacityOffset = Math.random();
    part.birth = 0;

    part.object = new THREE.Mesh( geometry, part.material );
    part.object.rotation.z = Math.random() * Math.PI * 2;

    part.animate = this.animateLava;

    particles[particles.length] = part;

    scene.add( part.object);

  }

  this.newStone = function (scene, particles, posx, posy) {
    var part = new Particle();

    var geometry = new THREE.PlaneGeometry( 20, 20 );
    part.material = this.stonematerial.clone();
    part.x = posx;
    part.y = posy;
    part.offset = Math.random() * Math.PI * 2;
    part.opacityOffset = Math.random();
    part.birth = 0;

    part.object = new THREE.Mesh( geometry, part.material );
    part.object.rotation.z = Math.random() * Math.PI * 2;
    part.object.position.z = -0.1;
    part.object.position.x = posx;
    part.object.position.y = posy;
    part.object.scale.set(0,0,0);

    part.animate = this.animateStone;


    particles[particles.length] = part;

    scene.add( part.object );
  }

  this.animateLava = function (part, timediff, clearrunner) {
    part.offset += timediff/5000;
    part.offset %= Math.PI * 2;
    part.object.position.x = part.x + Math.sin(part.offset)*4;
    part.object.position.y = part.y + Math.cos(part.offset)*4;
    part.object.material.opacity =  (Math.sin(part.offset*3) *0.7 + 0.3)*clearrunner;
    part.object.rotation.z += timediff/5000;
    part.object.rotation.z %= Math.PI * 2;
    part.object.scale.set(2-clearrunner*part.birth,2-clearrunner*part.birth,1);

    if (part.birth < 1) part.birth += timediff / 1000;
  }

  this.animateStone = function (part, timediff, clearrunner) {
    part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
    part.object.material.opacity = clearrunner;

    if (part.birth < 1) part.birth += timediff / 1000;

  }

}
