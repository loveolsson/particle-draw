var lineTypes: LineType[] = [];

var SW = 1280, SH = 720;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, SW / SH, 0.1, 1000);
camera.position.z = 870;
camera.position.x = 640;
camera.position.y = 360;

var renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(SW, SH);

var particles = [];

var clearrunner = 1;
var clear = false;
var totaltime = 0;

var time = 0; //Time of last frame

var mousedown = false; //Draw things if mouse is down

var lastx, lasty; //


var drawing = false; // Is true during drawing loop
var video;



$( function() {
  lineTypes.push(new Lava());


  video = document.querySelector('video');
  console.log(video);
  gumInit();
  render();
  document.body.appendChild(renderer.domElement);
  $(renderer.domElement).css({position: 'absolute'});


});

function createPoint(posx, posy, direction) {
  lineTypes[0].newPoint (scene, particles, posx, posy, direction);
}

function render() {
  var d = new Date();
  var n = d.getTime();

  if (time == 0) time = n;

  var timediff = n - time;
  time = n;

  totaltime += timediff;

  renderer.render(scene, camera);
  requestAnimationFrame(render);

  particles.forEach(p => p.animate(p, timediff, clearrunner, totaltime));

  if (clear) clearrunner -= timediff / 500;

  if (clearrunner <= 0) {
    clear = false;
    for (var x in particles) {
      scene.remove( particles[x].object );
      delete particles[x];
    }
    clearrunner = 1;
  }


}


function gumSuccess(stream) {
  console.log("gumSuccess");
  // window.stream = stream;
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
  video.play();
}

function gumError(error) {
  console.error('Error on getUserMedia', error);
}

function gumInit() {
  navigator.getUserMedia({video: true }, gumSuccess, gumError);
}


$(document).keypress(function(event) {
  console.log(event);

  if (event.charCode == 32) clear = true;
  //if (event.charCode == 49) activeLine = lava;
  // if (event.charCode == 50) activeLine = rubin;
  // if (event.charCode == 51) activeLine = magic;
  // if (event.charCode == 52) activeLine = arrow;
  // if (event.charCode == 53) activeLine = redline;
  // if (event.charCode == 77) activeLine = martin;
});

$(document).bind('mousedown touchstart', function(event) {
  console.log('Click');
  mousedown = true;
});

$(document).bind('mouseup touchend', function(event) {
  mousedown = false;
  lastx = lasty = false;
      console.log('Click end');

});

$(document).bind('mousemove touchmove', function(e) {

  var event = e;
  if (e.type == "touchmove") event = e.originalEvent.touches[0];


      console.log('Move');
      console.log(event);

  if (!mousedown || drawing) return;

  if (_.isInteger(lastx)) {
    drawing = true;
    var distx = event.pageX - lastx;
    var disty = event.pageY - lasty;

    var distance = Math.sqrt(distx*distx + disty*disty)/2;

    var x = lastx;
    var y = lasty;

    for (var i = 0; i<distance - 1; i++) {

      var oldx = x;
      var oldy = y;

      x += distx / distance;
      y += disty / distance;

      //Calculate direction i radians
      var deltaX = x - oldx;
      var deltaY = oldy -y;

      let direction = Math.atan2(deltaY, deltaX);

      createPoint(x, 720-y, direction);


    }
    drawing = false;

  }
  lastx = event.pageX;
  lasty = event.pageY;
});
