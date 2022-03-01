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
let cx, cy; // cadeau
let ux, uy; // screen coord for user Y

let user_x, user_y;

const button = document.getElementById('bouton');
const encore = document.getElementById('encore');
const lghelp = document.getElementById("lghelp");
const aidez_moi = document.getElementById("aidez_moi");

let game_state = "start";

let aidez = 60;

window.onload = main();

function main() {
  init();
  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  draw();  

  switch(game_state) {

    case "start":
      // code block
      encore.classList.add("hide");
      placeGuy();
      game_state = "help";
      document.getElementById("X").focus();
      break;

    case "help":
      if (button.disabled) { button.disabled = false; }
      break;

    case "drop":
      if (!button.disabled) { button.disabled = true; }
      break;

    case "happy":
      if (!button.disabled) { button.disabled = true; }
      encore.classList.remove("hide");
      break;

    case "sad":
      if (button.disabled) { button.disabled = false; }
      break;

    default:
      // code block
  }

  window.requestAnimationFrame(gameLoop);  // Keep requesting new frames
}

function placeGuy() {

  var limit = unite / 2 - 1;

  var pixel;
  var count = 0;

  do {

    count++;

    target_x = Rnd(-limit, limit)
    target_y = Rnd(-limit, limit)

    tx = (target_x * interval) + (size / 2);
    ty = (target_y * -interval) + (size / 2);

    //console.log("target-c",target_x,target_y);
    //console.log("target-s",tx,ty);

    pixel = ctx.getImageData(tx + 2, ty + 2, 1, 1).data;
    //console.log(pixel);

  }
  while ( (pixel[0] != 255) && (count < 1000) ); // water

  console.log("pixel, count",pixel, count)

  //while (false);
  console.log("target-c",target_x,target_y);
  console.log("target-s",tx,ty);

}

function draw() {
  //console.log('another frame...');
  clear(ctx);

  afficheIle(ctx);

  planCartesien();

  //info(ctx);

  switch(game_state) {
    case "help":
    case "drop":
      afficheLGHelp(ctx, target_x, target_y);  
      break;
    case "happy":
      afficheLGHappy(ctx, target_x, target_y);
      break;
    case "sad":
      afficheLGSad(ctx, target_x, target_y);
      break;
  }


  if (game_state == "drop") {
    afficheCadeau(ctx);

    cy = cy + 3;
    if ((cy >= uy - 16) || cy > size) {
      //drop_en_cours = false;
      game_state = "ok";

      const button = document.getElementById('bouton');
      button.disabled = false;    

      console.log("cad.x,y =", cx, cy, "t.x,y=", tx, ty, "user.x,y=",ux, uy);

      if (tx === ux && ty === uy) {
        game_state = "happy";
      } else {
        game_state = "sad";
      }
    }

  }

}

function afficheCadeau(c) {
  //c.fillStyle = 'rgba(128, 00, 0, 1.0)';
  //c.fillRect(cx-8, cy, 16, 16);
  var jitter = Rnd(-1,1)

  var img = document.getElementById("care");
  c.drawImage(img, cx-13+jitter, cy-15);  
}

function afficheLGHelp(c, x, y) {
  c.drawImage(lghelp, (size / 2) + (x * interval) - 17, (size / 2) - (y * interval) - 15);  

  aidez--;  
  if (aidez > 0) {
    c.drawImage(aidez_moi, (size / 2) + (x * interval), (size / 2) - (y * interval) - 60);      
  } else {
    if (aidez < -50 )  {
      aidez = 100;
    }
  }
}

function afficheLGSad(c, x, y) {
  //  console.log('afficheLGH');
  var img = document.getElementById("lgsad");
  c.drawImage(img, (size / 2) + (x * interval) - 17, (size / 2) - (y * interval) - 12);  

  img = document.getElementById("oh_non");
  c.drawImage(img, (size / 2) + (x * interval) + 10, (size / 2) - (y * interval) - 60);  

}

function afficheLGHappy(c, x, y) {
  //  console.log('afficheLGH');
  var img = document.getElementById("lghappy");
  c.drawImage(img, (size / 2) + (x * interval) - 22, (size / 2) - (y * interval) - 10);  

  img = document.getElementById("merci");
  c.drawImage(img, (size / 2) + (x * interval) + 10, (size / 2) - (y * interval) - 70);    
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
  c.fillStyle = 'rgba(150, 192, 255, 1)'; // water blue
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
  //c.fillText(xx.toFixed(0) + ", " + yy.toFixed(0), 3, 10);
  c.fillText(game_state, 3, 10);
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

  button.disabled = true;

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

  user_x = document.getElementById("X").value;
  user_y = document.getElementById("Y").value;
  console.log("piton cliqué!", user_x, user_y);

  cx = coordToScreenX(user_x);
  cy = 0;

  ux = coordToScreenX(user_x);
  uy = coordToScreenY(user_y);

  game_state = "drop";

}

function btnEncore() {

  document.getElementById("X").value = "";
  document.getElementById("Y").value = "";  

  game_state = "start";

}

function coordToScreenX(cx) {
  return (size / 2) + (cx * interval);
}

function coordToScreenY(cy) {
  return (size / 2) - (cy * interval);  
}

function Rnd(min, max) { // get a random integer between min, max inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
