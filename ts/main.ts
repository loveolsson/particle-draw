var lineTypes: LineType[] = [];

const SW = 1920, SH = 1080;
const VW = 1920, VH = 1080;
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
var activeLine:number = 1;

var mousedown:boolean = false; //Draw things if mouse is down
var lastx:number, lasty: number; //

var drawing:boolean = false; // Is true during drawing loop
var video: HTMLVideoElement;

$( function() {
  lineTypes.push(new LineLava());
  lineTypes.push(new LineRed());
  lineTypes.push(new LineArrow());

  video = document.querySelector('video');
  gumInit();
  render();

  var e = $(renderer.domElement).css({position: 'absolute'});
  e.insertAfter($('video'));

});

function createPoint (posx: number, posy: number, direction: number) {
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
  navigator.getUserMedia({video: { width: VW, height: VH } }, gumSuccess, gumError);
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
$(document).bind('touchstart', function(e) {
  //console.log('Click');
  if ($(e.target).hasClass('btn')) {
    return;
  }

  let pageX: number;
  let pageY: number;

  if (e.type == "touchstart") {
    pageX = e.touches[0].clientX;
    pageY = e.touches[0].clientY;
  } else if (e.type == "mousedown") {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  lineTypes[activeLine].newStart(particles, pageX, SH-pageY);

  mousedown = true;
  stopVT();
});

$(document).bind('mouseup touchend', function(e) {
  mousedown = false;
  lastx = lasty = -1;
  console.warn("touch end!!!!");

      //console.log('Click end');

});

$(document).bind('mousemove touchmove', function(e) {

  let pageX: number;
  let pageY: number;

  if (e.type == "touchmove") {
    pageX = e.touches[0].clientX;
    pageY = e.touches[0].clientY;
  } else if (e.type == "mousemove") {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  if (!mousedown || drawing) return;

  if (lastx != -1 && lasty != -1) {
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

      lineTypes[activeLine].newDrag(particles, x, SH-y, direction);
    }

    drawing = false;
  }

  lastx = pageX;
  lasty = pageY;
});


function playVT() {
  sendKey('c3869276-a102-4248-9d9c-81999ca4d0eb');
}

function stopVT() {
  sendKey('1023b31d-8d72-4613-bc3e-d87aae09e1a5');
}

function clearDraw() {
  clear = true;
}

function setActiveLine(no: number) {
  activeLine = no;
}


function sendKey(uuid: string) {
  $.get('http://192.168.10.56:8088/?shortcut=' + uuid);
}
