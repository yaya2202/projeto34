const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var raposa1, sadraposa;
var breakButton, breakbutton2;
var backgroundImage;

var stones = [];
var collided = false;
function preload() {
  raposa1 = loadImage("./assets/raposa.png");

  sadraposa = loadImage("./assets/raposaTriste.png");

  backgroundImage = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(30, { x: 50, y: height / 2 - 140 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  raposa = createSprite(width / 2, height - 100, 50, 50);
  raposa.addAnimation("lefttoright", raposa1);
  raposa.addImage("sad", sadraposa);

  raposa.scale = 0.4;
  raposa.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
  breakButton2 = createButton("");
  breakButton2.position(width - 1550, height / 2 - 50);
  breakButton2.class("breakbutton");
  breakButton2.mousePressed(handleButtonPress2);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    
    var distance = dist(raposa.position.x, raposa.position.y, pos.x, pos.y);

    if (distance <= 50) {
      raposa.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      raposa.changeImage("sad");
      collided = true;
    }
  }

  if (raposa.position.x >= width - 300 && !collided) {
    raposa.velocityX = -10;
    raposa.changeAnimation("righttoleft");
  }

  if (raposa.position.x <= 300 && !collided) {
    raposa.velocityX = 10;
    raposa.changeAnimation("lefttoright");
  }

  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
function handleButtonPress2() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
