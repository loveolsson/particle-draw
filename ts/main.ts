var lineTypes: LineType[] = [];

const SW = 1920, SH = 1080;
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(SW/-2, SW/2, SH/2, SH/-2, 0, 2000);
camera.position.set(SW/2, SH/2, 100);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(SW, SH);

var particles:Particle[] = [];

var clearrunner:number = 1;
var clear:boolean = false;
var totaltime:number = 0;

var time:number = 0; //Time of last frame

var mousedown:boolean = false; //Draw things if mouse is down
var lastx:number, lasty: number; //

var drawing:boolean = false; // Is true during drawing loop
var video: HTMLVideoElement;

$( function() {
  lineTypes.push(new LineLava());

  video = document.querySelector('video');
  gumInit();
  render();

  var e = $(renderer.domElement).css({position: 'absolute'});
  $('body').append(e);

});

function createPoint (posx: number, posy: number, direction: number) {
  lineTypes[0].newPoint(particles, posx, posy, direction);
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

  particles.forEach(p => p.animate(timediff, clearrunner, totaltime));

  if (clear) clearrunner -= timediff / 500;

  if (clearrunner <= 0) {
    clear = false;
    for (var x in particles) {
      scene.remove(particles[x].mesh);
      delete particles[x];
    }
    clearrunner = 1;
  }


}


function gumSuccess(stream: MediaStream) {
  console.log("gumSuccess");
  video.src = window.URL.createObjectURL(stream);
  video.play();
}

function gumError(error: MediaStreamError) {
  console.error('Error on getUserMedia', error);
}

function gumInit() {
  navigator.getUserMedia({video: true }, gumSuccess, gumError);
}


$(document).keypress(function(event) {
  //console.log(event);

  if (event.charCode == 32) clear = true;
  //if (event.charCode == 49) activeLine = lava;
  // if (event.charCode == 50) activeLine = rubin;
  // if (event.charCode == 51) activeLine = magic;
  // if (event.charCode == 52) activeLine = arrow;
  // if (event.charCode == 53) activeLine = redline;
  // if (event.charCode == 77) activeLine = martin;
});

$(document).bind('mousedown touchstart', function(event) {
  //console.log('Click');
  mousedown = true;
});

$(document).bind('mouseup touchend', function(event) {
  mousedown = false;
  lastx = lasty = -1;
      //console.log('Click end');

});

$(document).bind('mousemove touchmove', function(e) {

  let pageX: number;
  let pageY: number;

  if (e.type == "touchmove") {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else if (e.type == "mousemove") {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  if (!mousedown || drawing) return;

  if (lastx >= 0) {
    drawing = true;
    var distx = pageX - lastx;
    var disty = pageY - lasty;

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

      createPoint(x, SH-y, direction);
    }
    drawing = false;
  }

  lastx = pageX;
  lasty = pageY;
});
