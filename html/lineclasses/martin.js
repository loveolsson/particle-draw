function lineMartin () {
  this.every = 0;
  this.arrowtexture = THREE.ImageUtils.loadTexture( "martin.png" );
  this.arrowmaterial = new THREE.MeshBasicMaterial({map: this.arrowtexture, transparent: true, blending: THREE.NormalBlending});


  this.newPoint = function (scene, particles, posx, posy, direction) {
    this.every ++;
    this.every %= 30;
    if (this.every == 0) this.newArrow(scene, particles, posx, posy, direction);

  }

  this.newArrow = function (scene, particles, posx, posy, direction) {
    var part = new Particle();

    var geometry = new THREE.PlaneGeometry( 60, 60 );
    part.material = this.arrowmaterial.clone();
    part.x = posx;
    part.y = posy;

    part.birth = 0;

    part.object = new THREE.Mesh( geometry, part.material );
    part.object.rotation.z = direction-Math.PI/2;
    part.object.position.z = -0.1;
    part.object.position.x = posx;
    part.object.position.y = posy;
    part.object.scale.set(0,0,0);

    part.animate = this.animateArrow;


    particles[particles.length] = part;

    scene.add( part.object );

  }

  this.animateArrow = function (part, timediff, clearrunner) {
    part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
    part.object.material.opacity = clearrunner;
    part.object.rotation.z += timediff / 1000;

    if (part.birth < 1) part.birth += timediff / 1000;

  }

}
