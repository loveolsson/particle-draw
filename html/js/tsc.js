var lineTypes = [];
const SW = 1920, SH = 1080;
const VW = 1920, VH = 1080;
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(SW / -2, SW / 2, SH / 2, SH / -2, 0, 2000);
camera.position.set(SW / 2, SH / 2, 100);
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(SW, SH);
var particles = [];
var clearrunner = 1;
var clear = false;
var totaltime = 0;
var time = 0; //Time of last frame
var activeLine = 1;
var mousedown = false; //Draw things if mouse is down
var lastx, lasty; //
var drawing = false; // Is true during drawing loop
var video;
$(function () {
    lineTypes.push(new LineLava());
    lineTypes.push(new LineRed());
    lineTypes.push(new LineArrow());
    video = document.querySelector('video');
    gumInit();
    render();
    var e = $(renderer.domElement).css({ position: 'absolute' });
    e.insertAfter($('video'));
});
function createPoint(posx, posy, direction) {
}
function render() {
    var d = new Date();
    var n = d.getTime();
    if (time == 0)
        time = n;
    var timediff = n - time;
    time = n;
    totaltime += timediff;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    particles.forEach(p => p.animate(timediff, clearrunner, totaltime));
    if (clear)
        clearrunner -= timediff / 500;
    if (clearrunner <= 0) {
        clear = false;
        for (var x in particles) {
            scene.remove(particles[x].mesh);
            delete particles[x];
        }
        clearrunner = 1;
    }
}
function gumSuccess(stream) {
    console.log("gumSuccess");
    video.src = window.URL.createObjectURL(stream);
    video.play();
}
function gumError(error) {
    console.error('Error on getUserMedia', error);
}
function gumInit() {
    navigator.getUserMedia({ video: { width: VW, height: VH } }, gumSuccess, gumError);
}
$(document).keypress(function (event) {
    //console.log(event);
    if (event.charCode == 32)
        clear = true;
    //if (event.charCode == 49) activeLine = lava;
    // if (event.charCode == 50) activeLine = rubin;
    // if (event.charCode == 51) activeLine = magic;
    // if (event.charCode == 52) activeLine = arrow;
    // if (event.charCode == 53) activeLine = redline;
    // if (event.charCode == 77) activeLine = martin;
});
$(document).bind('touchstart', function (e) {
    //console.log('Click');
    if ($(e.target).hasClass('btn')) {
        return;
    }
    let pageX;
    let pageY;
    if (e.type == "touchstart") {
        pageX = e.touches[0].clientX;
        pageY = e.touches[0].clientY;
    }
    else if (e.type == "mousedown") {
        pageX = e.pageX;
        pageY = e.pageY;
    }
    lineTypes[activeLine].newStart(particles, pageX, SH - pageY);
    mousedown = true;
    stopVT();
});
$(document).bind('mouseup touchend', function (e) {
    mousedown = false;
    lastx = lasty = -1;
    console.warn("touch end!!!!");
    //console.log('Click end');
});
$(document).bind('mousemove touchmove', function (e) {
    let pageX;
    let pageY;
    if (e.type == "touchmove") {
        pageX = e.touches[0].clientX;
        pageY = e.touches[0].clientY;
    }
    else if (e.type == "mousemove") {
        pageX = e.pageX;
        pageY = e.pageY;
    }
    if (!mousedown || drawing)
        return;
    if (lastx != -1 && lasty != -1) {
        drawing = true;
        var distx = pageX - lastx;
        var disty = pageY - lasty;
        var distance = Math.sqrt(distx * distx + disty * disty) / 2;
        var x = lastx;
        var y = lasty;
        for (var i = 0; i < distance - 1; i++) {
            var oldx = x;
            var oldy = y;
            x += distx / distance;
            y += disty / distance;
            //Calculate direction i radians
            var deltaX = x - oldx;
            var deltaY = oldy - y;
            let direction = Math.atan2(deltaY, deltaX);
            lineTypes[activeLine].newDrag(particles, x, SH - y, direction);
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
function setActiveLine(no) {
    activeLine = no;
}
function sendKey(uuid) {
    $.get('http://192.168.10.56:8088/?shortcut=' + uuid);
}
class Particle {
    constructor(mesh, x, y, z, offset, opacityOffset) {
        this.mesh = mesh;
        this.x = x;
        this.y = y;
        this.z = z;
        this.offset = offset;
        this.opacityOffset = opacityOffset;
        this.birth = 0;
    }
    animate(timediff, clearrunner, totaltime) {
    }
}
class LineType {
    constructor() {
    }
    newStart(particles, posx, posy) {
    }
    newDrag(particles, posx, posy, direction) {
    }
}
class LineArrow extends LineType {
    constructor() {
        super();
        let stone = THREE.ImageUtils.loadTexture("img/arrow.png");
        this.arrowmaterial = new THREE.MeshBasicMaterial({ map: stone, transparent: true, blending: THREE.NormalBlending });
        this.every = 0;
    }
    newStart(particles, posx, posy) {
        particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 0, 0, -800));
        particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 1.5, -800, 0));
        particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 1, 0, 800));
        particles.push(new ParticleArrow(this.arrowmaterial, posx, posy, Math.PI * 0.5, 800, 0));
    }
}
class ParticleArrow extends Particle {
    constructor(_material, posx, posy, rotation, offX, offY) {
        var geometry = new THREE.PlaneGeometry(70, 70);
        let material = _material;
        let offset = 0;
        let opacityOffset = 0;
        let mesh = new THREE.Mesh(geometry, [material]);
        mesh.rotation.z = rotation;
        mesh.position.set(posx + offX, posy + offY, 0);
        scene.add(mesh);
        super(mesh, posx, posy, 0, offset, opacityOffset);
        this.offX = offX;
        this.offY = offY;
    }
    animate(timediff, clearrunner, totaltime) {
        if (this.birth < 1) {
            this.birth += timediff / 700;
            let inv = 1 - this.birth * 0.90;
            let x = this.x + inv * this.offX;
            let y = this.y + inv * this.offY;
            this.mesh.position.set(x, y, this.z);
        }
    }
}
class LineLava extends LineType {
    constructor() {
        super();
        let glowball = THREE.ImageUtils.loadTexture("img/glowball2.png");
        this.lavamaterial = new THREE.MeshBasicMaterial({ map: glowball, transparent: true, blending: THREE.AdditiveBlending });
        let stone = THREE.ImageUtils.loadTexture("img/stone.png");
        this.stonematerial = new THREE.MeshBasicMaterial({ map: stone, transparent: true, blending: THREE.NormalBlending });
        this.every = 0;
    }
    newDrag(particles, posx, posy, direction) {
        this.every++;
        this.every %= 6;
        particles.push(new ParticleLava(this.lavamaterial, posx, posy));
        if (this.every == 0)
            particles.push(new ParticleStone(this.stonematerial, posx, posy));
    }
}
class ParticleLava extends Particle {
    constructor(_material, posx, posy) {
        var geometry = new THREE.PlaneGeometry(15, 15);
        let material = _material.clone();
        let offset = Math.random() * Math.PI * 2;
        let opacityOffset = Math.random();
        let mesh = new THREE.Mesh(geometry, [material]);
        mesh.rotation.z = Math.random() * Math.PI * 2;
        scene.add(mesh);
        super(mesh, posx, posy, 0, offset, opacityOffset);
    }
    animate(timediff, clearrunner, totaltime) {
        this.offset += timediff / 5000;
        this.offset %= Math.PI * 2;
        let x = this.x + Math.sin(this.offset) * 4;
        let y = this.y + Math.cos(this.offset) * 4;
        this.mesh.position.set(x, y, this.z);
        this.mesh.material[0].opacity = (Math.sin(this.offset * 3) * 0.7 + 0.3) * clearrunner;
        this.mesh.rotation.z += timediff / 5000;
        this.mesh.rotation.z %= Math.PI * 2;
        this.mesh.scale.set(2 - clearrunner * this.birth, 2 - clearrunner * this.birth, 1);
        if (this.birth < 1)
            this.birth += timediff / 1000;
    }
}
class ParticleStone extends Particle {
    constructor(_material, posx, posy) {
        let geometry = new THREE.PlaneGeometry(20, 20);
        let material = _material.clone();
        let offset = Math.random() * Math.PI * 2;
        let opacityOffset = Math.random();
        let mesh = new THREE.Mesh(geometry, [material]);
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.scale.set(0, 0, 0);
        scene.add(mesh);
        super(mesh, posx, posy, -0.1, offset, opacityOffset);
    }
    animate(timediff, clearrunner, totaltime) {
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.scale.set(this.birth * clearrunner, this.birth * clearrunner, 1);
        this.mesh.material[0].opacity = clearrunner;
        if (this.birth < 1)
            this.birth += timediff / 1000;
    }
}
// function lineMagic () {
//   this.every = 0;
//   this.total = 0;
//   this.glowball = THREE.ImageUtils.loadTexture( "img/magic_ball.png" );
//   this.lavamaterial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.NormalBlending});
//
//   this.stone = THREE.ImageUtils.loadTexture( "img/magic.png" );
//   this.stonematerial = new THREE.MeshBasicMaterial({map: this.stone, transparent: true, blending: THREE.NormalBlending});
//
//
//
//   this.newPoint = function (scene, particles, posx, posy, direction) {
//     this.every ++;
//     this.total += 0.02;
//     this.every %= 6;
//     this.newLava(scene, particles, posx, posy, direction);
//     //if (this.every == 0) this.newStone(scene, particles, posx, posy);
//
//   }
//
//   this.newLava = function (scene, particles, posx, posy, direction) {
//     var part = new Particle();
//     var geometry = new THREE.PlaneGeometry( 5, 10 );
//
//     part.material = this.lavamaterial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = this.total;
//     part.opacityOffset = Math.random();
//     part.birth = 0;
//     part.direction = direction + Math.PI;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = direction-Math.PI/2;
//
//     part.animate = this.animateLava;
//
//     particles[particles.length] = part;
//
//     scene.add( part.object);
//
//   }
//
//   this.newStone = function (scene, particles, posx, posy, direction) {
//     var part = new Particle();
//
//     var geometry = new THREE.PlaneGeometry( 30, 30 );
//     part.material = this.stonematerial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = Math.random() * Math.PI * 2;
//     part.opacityOffset = 0;
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = Math.random() * Math.PI * 2;
//     part.object.position.z = -0.1;
//     part.object.position.x = posx;
//     part.object.position.y = posy;
//     part.object.scale.set(0,0,0);
//
//     part.animate = this.animateStone;
//
//
//     particles[particles.length] = part;
//
//     scene.add( part.object );
//   }
//
//   this.animateLava = function (part, timediff, clearrunner, totaltime) {
//     var offset = part.offset + totaltime / 200;
//     //part.offset %= Math.PI * 2;
//     part.object.position.x = part.x + (Math.sin(part.direction) * Math.sin(offset*1.3)*Math.sin(-offset*3.4) * 5);
//     part.object.position.y = part.y - (Math.cos(part.direction) * Math.sin(offset*1.3)*Math.sin(-offset*3.4) * 5);
//     part.object.material.opacity =  clearrunner*part.birth;
//     part.object.scale.set(clearrunner*part.birth,clearrunner*part.birth,1);
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//   }
//
//   this.animateStone = function (part, timediff, clearrunner) {
//     part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
//     part.object.material.opacity = clearrunner;
//     part.object.rotation.z += timediff/5000;
//
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//
//   }
//
// }
// function lineMartin () {
//   this.every = 0;
//   this.arrowtexture = THREE.ImageUtils.loadTexture( "img/martin.png" );
//   this.arrowmaterial = new THREE.MeshBasicMaterial({map: this.arrowtexture, transparent: true, blending: THREE.NormalBlending});
//
//
//   this.newPoint = function (scene, particles, posx, posy, direction) {
//     this.every ++;
//     this.every %= 30;
//     if (this.every == 0) this.newArrow(scene, particles, posx, posy, direction);
//
//   }
//
//   this.newArrow = function (scene, particles, posx, posy, direction) {
//     var part = new Particle();
//
//     var geometry = new THREE.PlaneGeometry( 60, 60 );
//     part.material = this.arrowmaterial.clone();
//     part.x = posx;
//     part.y = posy;
//
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = direction-Math.PI/2;
//     part.object.position.z = -0.1;
//     part.object.position.x = posx;
//     part.object.position.y = posy;
//     part.object.scale.set(0,0,0);
//
//     part.animate = this.animateArrow;
//
//
//     particles[particles.length] = part;
//
//     scene.add( part.object );
//
//   }
//
//   this.animateArrow = function (part, timediff, clearrunner) {
//     part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
//     part.object.material.opacity = clearrunner;
//     part.object.rotation.z += timediff / 1000;
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//
//   }
//
// }
// function lineRedline () {
//   this.every = 0;
//   this.glowball = THREE.ImageUtils.loadTexture( "img/redline.png" );
//   this.redlinematerial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.NormalBlending});
//
//
//
//   this.newPoint = function (scene, particles, posx, posy, direction) {
//     this.every ++;
//     this.every %= 8;
//     //if (this.every % 2 == 0)
//     this.newRedline(scene, particles, posx, posy, direction);
//
//   }
//
//   this.newRedline = function (scene, particles, posx, posy, direction) {
//     var part = new Particle();
//     var geometry = new THREE.PlaneGeometry( 15, 15 );
//
//     part.material = this.redlinematerial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = 0;
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = direction - Math.PI / 2;
//
//     part.animate = this.animateRedline;
//
//     particles[particles.length] = part;
//
//     scene.add( part.object);
//
//   }
//
//
//   this.animateRedline = function (part, timediff, clearrunner) {
//     part.offset += timediff/30000;
//     part.offset %= Math.PI * 2;
//     part.object.position.x = part.x;
//     part.object.position.y = part.y;
//     part.object.material.opacity =  clearrunner;
//     part.object.scale.set(clearrunner*part.birth + Math.sin(part.offset*50)/4,1,1);
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//   }
//
// }
class LineRed extends LineType {
    constructor() {
        super();
        let glowball = THREE.ImageUtils.loadTexture("img/redline.png");
        this.redlinematerial = new THREE.MeshBasicMaterial({ map: glowball, transparent: true, blending: THREE.NormalBlending });
        this.every = 0;
    }
    newDrag(particles, posx, posy, direction) {
        this.every++;
        if ((this.every %= 1) == 0)
            particles.push(new ParticleRedLine(this.redlinematerial, posx, posy, direction));
    }
}
class ParticleRedLine extends Particle {
    constructor(_material, posx, posy, direction) {
        let geometry = new THREE.PlaneGeometry(10, 10);
        let material = _material;
        let offset = 0;
        let opacityOffset = 0;
        let mesh = new THREE.Mesh(geometry, [material]);
        mesh.rotation.z = direction - Math.PI / 2;
        mesh.position.x = posx;
        mesh.position.y = posy;
        scene.add(mesh);
        super(mesh, posx, posy, 0, offset, opacityOffset);
    }
}
// function lineRubin () {
//   this.every = 0;
//   this.glowball = THREE.ImageUtils.loadTexture( "img/crystal_glow.png" );
//   this.lavamaterial = new THREE.MeshBasicMaterial({map: this.glowball, transparent: true, blending: THREE.AdditiveBlending});
//
//   this.stone = THREE.ImageUtils.loadTexture( "img/crystal.png" );
//   this.stonematerial = new THREE.MeshBasicMaterial({map: this.stone, transparent: true, blending: THREE.NormalBlending});
//
//
//
//   this.newPoint = function (scene, particles, posx, posy) {
//     this.every ++;
//     this.every %= 8;
//     if (this.every % 2 == 0) this.newLava(scene, particles, posx, posy);
//     if (this.every == 0) this.newCrystal(scene, particles, posx, posy);
//
//   }
//
//   this.newLava = function (scene, particles, posx, posy) {
//     var part = new Particle();
//     var geometry = new THREE.PlaneGeometry( 15, 15 );
//
//     part.material = this.lavamaterial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = Math.random() * Math.PI * 2;
//     part.opacityOffset = Math.random();
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = Math.random() * Math.PI * 2;
//
//     part.animate = this.animateLava;
//
//     particles[particles.length] = part;
//
//     scene.add( part.object);
//
//   }
//
//   this.newCrystal = function (scene, particles, posx, posy) {
//     var part = new Particle();
//
//     var geometry = new THREE.PlaneGeometry( 30, 30 );
//     part.material = this.stonematerial.clone();
//     part.x = posx;
//     part.y = posy;
//     part.offset = Math.random() * Math.PI * 2;
//     part.opacityOffset = Math.random();
//     part.birth = 0;
//
//     part.object = new THREE.Mesh( geometry, part.material );
//     part.object.rotation.z = Math.random() * Math.PI * 2;
//     part.object.position.z = -0.1;
//     part.object.position.x = posx;
//     part.object.position.y = posy;
//     part.object.scale.set(0,0,0);
//
//     part.animate = this.animateCrystal;
//
//
//     particles[particles.length] = part;
//
//     scene.add( part.object );
//   }
//
//   this.animateLava = function (part, timediff, clearrunner) {
//     part.offset += timediff/5000;
//     part.offset %= Math.PI * 2;
//     part.object.position.x = part.x + Math.sin(part.offset)*4;
//     part.object.position.y = part.y + Math.cos(part.offset)*4;
//     part.object.material.opacity =  Math.sin(part.offset*3)*clearrunner;
//     part.object.rotation.z += timediff/5000;
//     part.object.rotation.z %= Math.PI * 2;
//     part.object.scale.set(2-clearrunner*part.birth,2-clearrunner*part.birth,1);
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//   }
//
//   this.animateCrystal = function (part, timediff, clearrunner) {
//     part.object.scale.set(part.birth*clearrunner,part.birth*clearrunner,1);
//     part.object.material.opacity = clearrunner;
//
//     if (part.birth < 1) part.birth += timediff / 1000;
//
//   }
//
// }
