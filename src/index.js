import './index.css'

class Shape {
  constructor({
    x = 0,
    y = 0,
    width = 10,
    height = 10,
    radius = 10,
    velocityX = 0,
    velocityY = 0,
    gravity = 0,
    color = "black",
    shapeMode = Math.random(),
  }) {
    this.gravity = gravity;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.shapeMode = shapeMode
  }

  update(dt) {
    this.velocityY += GRAVITY * dt;
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
  }

  render (ctx) {
    if (this.shapeMode < 0.5) {
      this.renderRect(ctx)
    } else {
      this.renderCircle(ctx)
    }
  }

  renderRect(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  renderCircle(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.getElementById("c");

const dpr = devicePixelRatio;
canvas.width = CANVAS_WIDTH * devicePixelRatio;
canvas.height = CANVAS_HEIGHT * devicePixelRatio;
canvas.style.setProperty("width", CANVAS_WIDTH + "px");
canvas.style.setProperty("height", CANVAS_HEIGHT + "px");

const ctx = canvas.getContext("2d");

let GRAVITY = 80;
const shapes = [];
let shape = canvas.getBoundingClientRect();

window.addEventListener('resize', e => {
  shape = canvas.getBoundingClientRect();
})

canvas.addEventListener("click", function (e) {
  createShape(e);
});

let controlGravity = document.getElementById("gravity-input");

controlGravity.addEventListener("change", function (e) {
  GRAVITY = parseInt(e.target.value, 10);
});

function createShape(e) {
  let pos = getMousePos(canvas, e);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  const radius = Math.random() * 20;

  let shape = new Shape({
    gravity: GRAVITY,
    x: pos.x,
    y: pos.y,
    width: radius,
    height: radius,
    radius: radius,
    velocityX: 20 + (Math.random() * 2 - 1) * 100,
    velocityY: -Math.random() * 250 + 50,
    color: getRandomRGBColor(),

  });

  shapes.push(shape);
}

let oldTime = 0;

requestAnimationFrame(drawFrame);

function drawFrame(ts) {
  ts /= 1000;
  let dt = ts - oldTime;
  if (dt > 0.5) {
    dt = 0.5
  }
  oldTime = ts;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let shape of shapes) {
    shape.update(dt);

    shape.render(ctx)

    // down
    const paddingBottom = shape.shapeMode < 0.5 ? shape.height : shape.radius
    if (shape.y + paddingBottom > canvas.height) {
      shape.y = canvas.height - paddingBottom;
      shape.velocityY *= -1;
    }
    // sides
    const paddingRight = shape.shapeMode < 0.5 ? shape.width : shape.radius
    if (shape.x + paddingRight > canvas.width - shape.width) {
      shape.x = canvas.width - shape.width - paddingRight
      shape.velocityX *= -1;
    } else if (shape.x < 0) {
      shape.x = 0
      shape.velocityX *= -1
    }
    
    // up
    if (shape.y - shape.width <= 0) {
      shape.y = shape.width;
      shape.velocityY *= -1;
    }
  }

  // count shapes
  ctx.font = "25px monospace";
  var text = ctx.measureText(shapes.length);
  ctx.fillStyle = "black";
  ctx.fillText(
    shapes.length,
    500 - text.width,
    text.fontBoundingBoxAscent + 10
  );

  requestAnimationFrame(drawFrame);
}

function getRandomRGBColor() {
  const randomR = Math.random() * 255;
  const randomG = Math.random() * 255;
  const randomB = Math.random() * 255;
  return `rgba(${randomR}, ${randomG}, ${randomB})`;
}

function getMousePos(canvas, evt) {
  return {
    x: (evt.clientX - shape.left) * devicePixelRatio,
    y: (evt.clientY - shape.top) * devicePixelRatio,
  };
}
