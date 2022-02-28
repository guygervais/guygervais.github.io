// https://stackoverflow.com/questions/1955687/best-way-for-simple-game-loop-in-javascript

"use strict";

let canvas;
let buffer;
let ctx;
let buf;

let size;
let unite = 12;
let interval;
let tau = Math.PI * 2;

let xx, yy, dx, dy;

let target_x, target_y; //target x,y cartesienne
let tx, ty; // target coordonnées écran.
let cx, cy;
let uy; // screen coord for user Y
let drop_en_cours = false;

let guy_happy = false;
let guy_sad = false;

window.onload = main();

function main() {
  init();

  target_x = -2;
  target_y = -3;
  
  tx = (target_x * interval) + (size / 2);
  ty = (target_y * -interval) + (size / 2);
  
  console.log("target",tx,ty);

  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  draw();  
  window.requestAnimationFrame(gameLoop);  // Keep requesting new frames
  //  console.log('fini');
}

function draw() {
  //console.log('another frame...');
  clear(ctx);

  afficheIle(ctx);

  planCartesien();

  if (!(guy_happy || guy_sad)) {
    afficheLGHelp(ctx, target_x, target_y);  
  }

  if (drop_en_cours) {
    afficheCadeau(ctx);

    cy = cy + 3;
    if (cy >= uy - 16 || cy > size) {
      drop_en_cours = false;
      const button = document.getElementById('bouton');
      button.disabled = false;    
      
      if (ty === uy) {
        console.log(cx, cy, ty, uy);
        guy_happy = true;
        guy_sad = false;
      } else {
        //console.log(cx, cy, uy);
        guy_happy = false;
        guy_sad = true;
      }
    }

  }
  
  if (guy_happy) {
    afficheLGHappy(ctx, target_x, target_y);
  }

  if (guy_sad) {
    afficheLGSad(ctx, target_x, target_y);
  }

  //  afficheLGH(ctx, -4, 2);
  //  afficheLGH(ctx, 3, 4);
  //  afficheLGH(ctx, 1, -3);
  //  afficheLGH(ctx, 4, -4);
  //
  //info(ctx);
  //square(ctx);
}

function afficheCadeau(c) {
  c.fillStyle = 'rgba(128, 00, 0, 1.0)';
  c.fillRect(cx-8, cy, 16, 16);
}

function afficheLGHelp(c, x, y) {
  //  console.log('afficheLGH');
  var img = document.getElementById("lghelp");
  c.drawImage(img, (size / 2) + (x * interval) - 17, (size / 2) - (y * interval) - 15);  
}

function afficheLGSad(c, x, y) {
  //  console.log('afficheLGH');
  var img = document.getElementById("lgsad");
  c.drawImage(img, (size / 2) + (x * interval) - 17, (size / 2) - (y * interval) - 12);  
}

function afficheLGHappy(c, x, y) {
  //  console.log('afficheLGH');
  var img = document.getElementById("lghappy");
  c.drawImage(img, (size / 2) + (x * interval) - 22, (size / 2) - (y * interval) - 10);  
}


function afficheIle(c) {
  //  console.log('afficherIle');

  var img = document.getElementById("ile");

  //c.save();
  //c.translate(canvas.width,0);
  //c.rotate(90*Math.PI/180);

  c.drawImage(img, 0, 0);  
  //context.drawImage(image,-image.width/2,-image.width/2);
  //c.restore();

}

function clear(c) {
  c.fillStyle = 'rgba(150, 192, 255, 1)';
  //c.clearRect(0, 0, size, size);
  c.fillRect(0, 0, size, size);  
}

function planCartesien() {
  //  console.log('planCartesien');
  ctx.drawImage(buffer, 0, 0);  // copy static grid to live canvas
}

function info(c) {
  //ctx.fillStyle = 'white';
  //ctx.fillRect(0, 0, 200, 100);
  c.font = '10px sans-serif';
  c.fillStyle = 'black';
  c.fillText(xx.toFixed(0) + ", " + yy.toFixed(0), 3, 10);
}

function square(c) {
  c.fillStyle = 'rgba(128, 00, 0, 1.0)';
  c.fillRect(xx, yy, 10, 10);

  buf.fillStyle = 'rgba(0, 205, 111, 0.5)';
  buf.fillRect(xx + 4, yy + 4, 4, 4);

  xx += dx;
  yy += dy;

  if (xx + 10 > size || xx < 0 ) {dx = -dx;}
  if (yy + 10 > size || yy < 0 ) {dy = -dy;}  
}

function init() {

  canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  buffer = document.createElement('canvas');
  buffer.width = canvas.width;
  buffer.height = canvas.height;
  console.log("buffer size", buffer.width, buffer.height)
  if (buffer.getContext) {
    buf = buffer.getContext('2d');
  }

  size = ctx.canvas.width;
  interval = size / unite

  xx = parseInt(Math.random() * (size - 20) + 10);
  yy = parseInt(Math.random() * (size - 20) + 10);

  dx = Math.random() > 0.5 ? 2.9 : -3.1;
  dy = Math.random() > 0.5 ? 2.7 : -1.7;

  dessinePlanCartesien(buf);

}

//done: optimize by drawing once to a 2nd canvas and copy buffer.
function dessinePlanCartesien(c) {

  console.log("drawing grid", size, unite, interval); 
  c.fillStyle = 'rgba(0, 0, 200, 0.3)';

  for(let x = 0; x < size; x += interval) {
    c.fillRect(x, 0, 1, size);  
    c.fillRect(0, x, size, 1);
  }      

  c.fillStyle = 'rgba(0, 0, 0, 1)';
  c.fillRect(0, size / 2 - 0.5, size, 2);  
  c.fillRect(size / 2 - 0.5, 0, 2, size);  

  c.fillStyle = 'rgba(0, 0, 0, 1)';
  c.font = '18px sans-serif';

  for (let x = -(unite / 2) + 1; x < (unite / 2) ; x++) {

    // points horizontaux
    c.beginPath();
    c.arc(size / 2 + ( x * interval ) + 0.5, size / 2 + 0.5, 3, 0, 6);
    c.fill();

    // points verticaux
    c.beginPath();
    c.arc(size / 2 + 0.5, size / 2 + ( x * interval ) + 0.5, 3, 0, tau);
    c.fill();

    // chiffres x
    c.fillText(x, size / 2 + 2 + ( x * interval ), size / 2 + 16);  // axe X

    // chiffres y
    c.fillText(-x, size / 2 + 2, size / 2 + 16 + (x * interval ));  // axe Y

  }

}

function btnOK() {

  const button = document.getElementById('bouton');
  button.disabled = true;

  var coord_x = document.getElementById("X").value;
  var coord_y = document.getElementById("Y").value;
  console.log("piton cliqué!", coord_x, coord_y);
  
  guy_happy = false;
  guy_sad = false;
  
  uy = (coord_y * -interval) + (size / 2);

  cx = (coord_x * interval) + (size / 2); // a calculer... todo
  cy = 0;
  drop_en_cours = true;
}
