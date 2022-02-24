// https://stackoverflow.com/questions/1955687/best-way-for-simple-game-loop-in-javascript

"use strict";

let canvas;
let buffer;
let ctx;
let buf;

let size;
let unite = 16;
let interval;
let tau = Math.PI * 2;

let xx, yy, dx, dy;

window.onload = main();

function main() {
  init();
  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  draw();
  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);  
}

function draw() {
  clear(ctx);
  flip();
  info(ctx);
  square(ctx);
}

function flip() {
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
  
  buf.fillStyle = 'rgba(205, 205, 0, 0.5)';
  buf.fillRect(xx + 4, yy + 4, 4, 4);
  
  xx += dx;
  yy += dy;
  
  if (xx + 10 > size || xx < 0 ) {dx = -dx;}
  if (yy + 10 > size || yy < 0 ) {dy = -dy;}  
}


function clear(c) {
  c.fillStyle = 'white';
  c.clearRect(0, 0, size, size);
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
  
  grid(buf);

}

//done: optimize by drawing once to a 2nd canvas and copy buffer.
function grid(c) {
  
  console.log("drawing grid", size, unite, interval); 
  c.fillStyle = 'rgba(0, 0, 200, 0.3)';

  for(let x = 0; x < size; x += interval) {
    c.fillRect(x, 0, 1, size);  
    c.fillRect(0, x, size, 1);
  }      

  c.fillStyle = 'rgba(0, 128, 0, 1.0)';
  c.font = '18px sans-serif';

  for (let x = -(unite / 2); x < (unite / 2) + 1 ; x++) {
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
