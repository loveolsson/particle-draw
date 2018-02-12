function lineMagic () {
  this.every = 0;
  this.total = 0;
  this.glowball = THREE.ImageUtils.loadTexture( "magic_ball.png" );
  this.lavamaterial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.NormalBlending});

  this.stone = THREE.ImageUtils.loadTexture( "magic.png" );
  this.stonematerial = new THREE.MeshBasicMaterial({map: this.stone, transparent: true, blending: THREE.NormalBlending});



  this.newPoint = function (scene, particles, posx, posy, direction) {
    this.every ++;
    this.total += 0.02;
    this.every %= 6;
    this.newLava(scene, particles, posx, posy, direction);
    //if (this.every == 0) this.newStone(scene, particles, posx, posy);

  }

  this.newLava = function (scene, particles, posx, posy, direction) {
    var part = new Particle();
    var geometry = new THREE.PlaneGeometry( 5, 10 );

    part.material = this.lavamaterial.clone();
    part.x = posx;
    part.y = posy;
    part.offset = this.total;
    part.opacityOffset = Math.random();
    part.birth = 0;
    part.direction = direction + Math.PI;

    part.object = new THREE.Mesh( geometry, part.material );
    part.object.rotation.z = direction-Math.PI/2;

    part.animate = this.animateLava;

    particles[particles.length] = part;

    scene.add( part.object);

  }

  this.newStone = function (scene, particles, posx, posy, direction) {
    var part = new Particle();

    var geometry = new THREE.PlaneGeometry( 30, 30 );
    part.material = this.stonematerial.clone();
    part.x = posx;
    part.y = posy;
    part.offset = Math.random() * Math.PI * 2;
    part.opacityOffset = 0;
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

  this.animateLava = function (part, timediff, clearrunner, totaltime) {
    var offset = part.offset + totaltime / 200;
    //part.offset %= Math.PI * 2;
    part.object.position.x = part.x + (Math.sin(part.direction) * Math.sin(offset*1.3)*Math.sin(-offset*3.4) * 5);
    part.object.position.y = part.y - (Math.cos(part.direction) * Math.sin(offset*1.3)*Math.sin(-offset*3.4) * 5);
    part.object.material.opacity =  clearrunner*part.birth;
    part.object.scale.set(clearrunner*part.birth,clearrunner*part.birth,1);

    if (part.birth < 1) part.birth += timediff / 1000;
  }

  this.animateStone = function (part, timediff, clearrunner) {
    part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
    part.object.material.opacity = clearrunner;
    part.object.rotation.z += timediff/5000;


    if (part.birth < 1) part.birth += timediff / 1000;

  }

}
