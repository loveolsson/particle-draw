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
var activeLine:number = 0;
var activeColor:string = 'red';
var dashDistance:number = 1;

var mousedown:boolean = false; //Draw things if mouse is down
//var lastx:number, lasty: number; //
var lastPos:THREE.Vector2;

var drawing:boolean = false; // Is true during drawing loop
var video: HTMLVideoElement;

$( function() {
  //lineTypes.push(new LineLava());
  lineTypes.push(new LineRed());
  lineTypes.push(lineTypes[0]);
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
  let n = new Date().getTime();
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
    particles.forEach(p => {
      scene.remove(p.mesh)
      p.mesh.geometry.dispose();
      p.mesh.material[0].dispose();
    });

    particles = [];
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
$(document).bind('touchstart mousedown', function(e) {
  if ($(e.target).hasClass('btn') || $(e.target).hasClass('fa')) {
    return;
  }

  if (e.type == "touchstart") {
    //pagePos = new THREE.Vector2(e.touches[0].clientX, SH-e.touches[0].clientY);
  } else if (e.type == "mousedown") {
    let pagePos = new THREE.Vector2(e.pageX, SH-e.pageY);
    lineTypes[activeLine].newStart(particles, pagePos);
  }

  mousedown = true;
  stopVT();
});

$(document).bind('mouseup touchend', function(e) {
  mousedown = false;
  lastPos = null;
  console.warn("touch end!!!!");

      //console.log('Click end');

});

$(document).bind('mousemove touchmove', function(e) {

  let pagePos: THREE.Vector2;

  if (e.type == "touchmove") {
    pagePos = new THREE.Vector2(e.touches[0].clientX, SH-e.touches[0].clientY);
  } else if (e.type == "mousemove") {
    pagePos = new THREE.Vector2(e.pageX, SH-e.pageY);
  }

  if (!mousedown || drawing) return;

  if (lastPos) {
    drawing = true;
    let dist = pagePos.distanceTo(lastPos);

    let prevPos = lastPos;
    for (var i = 0; i <= 1; i+=1/dist) {
      let pointPos = lastPos.clone().lerp(pagePos, i);

      let delta = pointPos.clone().sub(prevPos);
      prevPos = pointPos.clone();

      let direction = Math.atan2(delta.y, delta.x);

      lineTypes[activeLine].newDrag(particles, pointPos, direction);
    }

    drawing = false;
  }

  lastPos = pagePos;
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
  $('.brush').removeClass('active');
  $('#l' + (no + 1)).addClass('active');
}

function setActiveColor(color: string) {
  activeColor = color;
  $('.color').removeClass('active');
  $('#' + color).addClass('active');
}


function setDash(distance: number) {
  dashDistance = distance;
}


function sendKey(uuid: string) {
  $.get('http://192.168.10.56:8088/?shortcut=' + uuid);
}
