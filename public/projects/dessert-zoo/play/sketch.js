/*
  Dessert Zoo (p5.js) - Project Overview

  This project starts from a personal idea: I love desserts, so I wanted to imagine sweets
  as living characters with emotions, movement, and interaction. The visual concept is a
  "dessert shop zoo" where each creature is a hybrid of an animal and a dessert (for example,
  tart-octopus, strawberry-cake rabbit, pudding jellyfish, lollipop cat, pudding dog, and
  cream lamb). The design language focuses on soft shapes, warm candy colors, and layered
  details such as frosting, caramel, foil textures, cup patterns, highlights, and shadows to
  make each character feel playful and flavorful.

  Technically, this sketch applies core programming concepts from class in a complete system:
  object-oriented programming (DessertCreature and CandyBit classes), arrays for managing many
  dynamic entities (creatures, foods, particles), and loops for updating/drawing repeated
  elements efficiently. Interaction is implemented through mouse and keyboard input: users can
  drop food, trigger panic reactions, and switch movement modes. A state-based behavior flow
  (feed -> grow -> mood change -> explode -> particle spread) connects code logic to visual
  storytelling, so the audience can both observe and actively influence the dessert ecosystem.

  Interaction Highlight & Meaning:
  The key interaction idea is "overfeeding": creatures become happier as they eat, but if they
  eat too much, they burst ("peng") into many mini desserts. This is designed as more than a
  visual effect. Conceptually, it represents how desire can transform and overflow: one large
  sweet identity breaks into many smaller playful forms. In other words, appetite becomes
  multiplicative energy. From a gameplay perspective, this creates a satisfying risk-reward
  loop—feeding is helpful and cute, but excessive feeding triggers a dramatic transformation
  that refreshes the scene and keeps interaction dynamic.
*/

const ZOO_WIDTH = 1280;
const ZOO_HEIGHT = 720;

const shopPalette = {
  text: "#4A2A14",
  floor: "#EFC08A",
  wood: "#B87544",
  cream: "#FFF4E8",
  glass: "#DFF6FF",
};

const FOOD_TYPES = {
  tart: { name: "Egg Tart", nutrition: 0.95 },
  strawberryCake: { name: "Strawberry Cake", nutrition: 1.12 },
  pudding: { name: "Pudding", nutrition: 1.0 },
  lollipop: { name: "Lollipop", nutrition: 0.82 },
};

const speciesList = [
  {
    name: "Tart Octopus",
    kind: "octopus",
    dessert: "tart",
    body: "#F3BE67",
    accent: "#CF8B3F",
    eye: "#362415",
    speed: 1.2,
  },
  {
    name: "Strawberry Rabbit",
    kind: "rabbit",
    dessert: "strawberryCake",
    body: "#FFA8C5",
    accent: "#FF5B8C",
    eye: "#301919",
    speed: 1.45,
  },
  {
    name: "Pudding Jellyfish",
    kind: "jellyfish",
    dessert: "pudding",
    body: "#93E3EC",
    accent: "#59B8C9",
    eye: "#0F3139",
    speed: 0.96,
  },
  {
    name: "Lollipop Cat",
    kind: "cat",
    dessert: "lollipop",
    body: "#F3B88A",
    accent: "#D38B57",
    eye: "#2D2117",
    speed: 1.58,
  },
  {
    name: "Pudding Dog",
    kind: "dog",
    dessert: "pudding",
    body: "#D8BE97",
    accent: "#A98157",
    eye: "#2F2418",
    speed: 1.02,
  },
  {
    name: "Cream Lamb",
    kind: "lamb",
    dessert: "strawberryCake",
    body: "#F7F1EA",
    accent: "#E7D3C3",
    eye: "#3A2A20",
    speed: 1.0,
  },
];

// Runtime containers for dynamic entities in the scene.
let creatures = [];
let foods = [];
let candyBits = [];
let zooMode = "chill";
let totalBoom = 0;

// Particle object spawned when a creature reaches growth limit and explodes.
class CandyBit {
  constructor(x, y, sourceDessert) {
    this.x = x;
    this.y = y;
    this.sourceDessert = sourceDessert;
    this.vx = random(-4.4, 4.4);
    this.vy = random(-6.5, -1.9);
    this.rot = random(TWO_PI);
    this.rotV = random(-0.1, 0.1);
    this.life = 200;
    this.scale = random(0.8, 1.2);
  }

  update() {
    this.vy += 0.13;
    this.vx *= 0.992;
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    if (this.y > height - 16) {
      this.y = height - 16;
      this.vy *= -0.3;
      this.vx *= 0.9;
    }
    this.life--;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rot);
    scale(this.scale);
    noStroke();
    const alpha = map(this.life, 0, 200, 0, 255);

    if (this.sourceDessert === "tart") {
      fill(240, 173, 91, alpha);
      beginShape();
      vertex(-8, 4);
      vertex(8, 4);
      vertex(6, -6);
      vertex(-6, -6);
      endShape(CLOSE);
      fill(255, 234, 147, alpha);
      ellipse(0, -4, 10, 6);
    } else if (this.sourceDessert === "strawberryCake") {
      fill(255, 168, 188, alpha);
      triangle(-8, 5, 8, 5, 0, -7);
      fill(255, alpha);
      rect(-6, 0, 12, 3, 2);
      fill(242, 72, 112, alpha);
      circle(0, -8, 4);
    } else if (this.sourceDessert === "pudding") {
      fill(250, 200, 115, alpha);
      arc(0, 2, 14, 12, PI, TWO_PI);
      rect(-7, 2, 14, 5, 0, 0, 3, 3);
      fill(138, 85, 46, alpha);
      arc(0, -1, 14, 8, PI, TWO_PI);
    } else {
      fill(255, 118, 159, alpha);
      ellipse(0, -3, 10, 10);
      fill(240, 240, 255, alpha);
      rect(-1, -1, 2, 9, 1);
      fill(255, 237, 164, alpha);
      triangle(-5, -3, -9, -7, -8, 1);
      triangle(5, -3, 9, -7, 8, 1);
    }
    pop();
  }
}

// Main creature class: movement, interaction, mood state, growth and rendering.
class DessertCreature {
  constructor(spec, x, y, baseSize) {
    this.spec = spec;
    this.x = x;
    this.y = y;
    this.baseSize = baseSize;
    this.size = baseSize;
    this.vx = random(-spec.speed, spec.speed);
    this.vy = random(-0.9, 0.9);
    this.wobble = random(TWO_PI);
    this.growth = 0;
    this.boomThreshold = random(5.2, 7.0);
    this.faceTimer = 0;
    this.mood = "hungry";
    this.blink = int(random(26, 145));
    this.dead = false;
    // Per-character visual variation so creatures do not look identical.
    this.octoFlavor = this.spec.kind === "octopus" ? random(["original", "chocolate"]) : "original";
    this.catStyle = this.spec.kind === "cat" ? random(["seated", "seated", "seated", "candyBase"]) : "seated";
    this.catFur = this.spec.kind === "cat" ? random(["#F3B88A", "#D9C4F2", "#9ED8CF", "#F5C5A7"]) : "#F3B88A";
    this.catAccent = this.spec.kind === "cat" ? random(["#D38B57", "#A88CCF", "#5FAFA1", "#CC8C6A"]) : "#D38B57";
  }

  update() {
    if (this.dead) return;

    // Organic wandering motion driven by sinusoidal offsets.
    this.wobble += 0.03;
    const modeBoost = zooMode === "party" ? 1.4 : 1;
    this.vx += sin(this.wobble + this.x * 0.003) * 0.02 * modeBoost;
    this.vy += cos(this.wobble * 1.3) * 0.012 * modeBoost;

    this.seekFood();
    this.reactToMouse();
    this.updateMood();

    this.vx = constrain(this.vx, -2.8, 2.8);
    this.vy = constrain(this.vy, -2.1, 2.1);
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 60 || this.x > width - 60) this.vx *= -1;
    if (this.y < 135 || this.y > height - 92) this.vy *= -1;

    this.size = this.baseSize + this.growth * 10.8;
    this.blink--;
    if (this.blink < 0) this.blink = int(random(26, 145));

    if (this.growth >= this.boomThreshold) this.explode();
  }

  seekFood() {
    // Steering behavior: move toward nearby food; consume when close enough.
    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i];
      const d = dist(this.x, this.y, f.x, f.y);
      if (d < 210) {
        const a = atan2(f.y - this.y, f.x - this.x);
        this.vx += cos(a) * 0.046;
        this.vy += sin(a) * 0.046;
      }
      if (d < this.size * 0.5 + f.r) {
        foods.splice(i, 1);
        // Favorite dessert gives extra growth, reinforcing character identity.
        const favBonus = f.type === this.spec.dessert ? 1.45 : 0.95;
        this.growth += f.nutrition * favBonus;
        this.mood = "happy";
        this.faceTimer = 68;
      }
    }
  }

  reactToMouse() {
    // Panic reaction: while mouse is pressed nearby, the creature flees.
    const d = dist(this.x, this.y, mouseX, mouseY);
    if (mouseIsPressed && d < 140) {
      const a = atan2(this.y - mouseY, this.x - mouseX);
      this.vx += cos(a) * 0.24;
      this.vy += sin(a) * 0.24;
      this.mood = "panic";
      this.faceTimer = 22;
    }
  }

  updateMood() {
    // Simple mood state machine based on temporary reactions + growth ratio.
    if (this.faceTimer > 0) {
      this.faceTimer--;
      return;
    }
    const ratio = this.growth / this.boomThreshold;
    if (ratio < 0.28) this.mood = "hungry";
    else if (ratio < 0.72) this.mood = "neutral";
    else this.mood = "full";
  }

  explode() {
    // Convert creature into dessert particles and remove it from active zoo.
    this.dead = true;
    totalBoom++;
    const burst = int(map(this.size, 70, 150, 24, 40, true));
    for (let i = 0; i < burst; i++) {
      candyBits.push(new CandyBit(this.x + random(-12, 12), this.y + random(-12, 12), this.spec.dessert));
    }
  }

  draw() {
    if (this.dead) return;
    push();
    translate(this.x, this.y);
    const facing = this.vx >= 0 ? 1 : -1;
    scale(facing, 1);
    noStroke();

    fill(0, 34);
    // Ground shadow anchors floating/round characters in the scene.
    ellipse(0, this.size * 0.52, this.size * 0.92, this.size * 0.27);

    if (this.spec.kind === "octopus") this.drawTartOctopus();
    else if (this.spec.kind === "rabbit") this.drawStrawberryRabbit();
    else if (this.spec.kind === "jellyfish") this.drawPuddingJellyfish();
    else if (this.spec.kind === "cat") this.drawLollipopCat();
    else if (this.spec.kind === "dog") this.drawPuddingDog();
    else this.drawCreamLamb();

    // The candy-base cat uses its own tiny face inside drawLollipopCat().
    if (!(this.spec.kind === "cat" && this.catStyle === "candyBase")) {
      this.drawFace();
    }
    this.drawFavoriteBadge(facing);
    pop();
  }

  drawFavoriteBadge(facing) {
    push();
    scale(facing, 1);
    fill(255, 245);
    rect(-this.size * 0.18, -this.size * 0.9, this.size * 0.36, this.size * 0.14, 8);
    fill("#6D3F1C");
    textSize(this.size * 0.1);
    textAlign(CENTER, CENTER);
    const label = FOOD_TYPES[this.spec.dessert].name;
    text(label, 0, -this.size * 0.83);
    pop();
  }

  drawFace() {
    const eyeY = -this.size * 0.08;
    fill(this.spec.eye);
    if (this.blink < 8) {
      rect(-this.size * 0.19, eyeY, this.size * 0.14, 2.2, 2);
      rect(this.size * 0.05, eyeY, this.size * 0.14, 2.2, 2);
    } else if (this.mood === "panic") {
      circle(-this.size * 0.12, eyeY, this.size * 0.1);
      circle(this.size * 0.12, eyeY, this.size * 0.1);
      fill(255);
      circle(-this.size * 0.1, eyeY - this.size * 0.015, this.size * 0.03);
      circle(this.size * 0.14, eyeY - this.size * 0.015, this.size * 0.03);
    } else {
      ellipse(-this.size * 0.12, eyeY, this.size * 0.08, this.size * 0.1);
      ellipse(this.size * 0.12, eyeY, this.size * 0.08, this.size * 0.1);
    }

    noFill();
    stroke(this.spec.eye);
    strokeWeight(2.2);
    if (this.spec.kind === "octopus") {
      // fixed O-shaped octopus mouth
      ellipse(0, this.size * 0.1, this.size * 0.06, this.size * 0.08);
    } else if (this.mood === "hungry") {
      arc(0, this.size * 0.08, this.size * 0.15, this.size * 0.12, 0, PI);
    } else if (this.mood === "happy") {
      arc(0, this.size * 0.03, this.size * 0.22, this.size * 0.16, 0, PI);
      noStroke();
      fill("#FF6A9A");
      circle(0, this.size * 0.1, this.size * 0.05);
    } else if (this.mood === "full") {
      line(-this.size * 0.09, this.size * 0.08, this.size * 0.09, this.size * 0.08);
    } else if (this.mood === "panic") {
      ellipse(0, this.size * 0.08, this.size * 0.11, this.size * 0.13);
    } else {
      arc(0, this.size * 0.09, this.size * 0.18, this.size * 0.11, PI, TWO_PI);
    }
    if (this.spec.kind === "cat" && this.catStyle !== "candyBase") {
      stroke(this.spec.eye);
      strokeWeight(1.8);
      line(-this.size * 0.2, this.size * 0.06, -this.size * 0.33, this.size * 0.03);
      line(-this.size * 0.2, this.size * 0.1, -this.size * 0.34, this.size * 0.11);
      line(this.size * 0.2, this.size * 0.06, this.size * 0.33, this.size * 0.03);
      line(this.size * 0.2, this.size * 0.1, this.size * 0.34, this.size * 0.11);
    }
    noStroke();
  }

  drawTartOctopus() {
    const isChoco = this.octoFlavor === "chocolate";
    const bodyCol = isChoco ? "#C78658" : "#E7A257";
    const tentacleCol = isChoco ? "#A36843" : "#D68E4A";
    const crustCol = isChoco ? "#905B33" : "#D79347";
    const custardCol = isChoco ? "#E5B87F" : "#FFE39E";

    // octopus tentacles as animated round bead chains (shorter, behind body)
    noStroke();
    for (let i = 0; i < 8; i++) {
      const tx = map(i, 0, 7, -this.size * 0.3, this.size * 0.3);
      const dir = map(i, 0, 7, -1, 1);
      for (let j = 0; j < 5; j++) {
        const t = j / 4;
        const px = tx + dir * this.size * (0.03 + 0.09 * t) + sin(this.wobble * 2 + i + j * 0.7) * this.size * 0.015;
        const py = this.size * (0.2 + 0.06 * j) + cos(this.wobble * 1.8 + i * 0.5 + j) * this.size * 0.012;
        const pr = this.size * (0.042 + 0.007 * j);
        fill(tentacleCol);
        circle(px, py, pr * 2);
        fill(255, 85);
        circle(px - pr * 0.2, py, pr * 0.7);
      }
    }

    // octopus body (drawn after tentacles so roots hide behind body)
    fill(bodyCol);
    ellipse(0, -this.size * 0.01, this.size * 0.9, this.size * 0.72);
    fill(255, 75);
    ellipse(-this.size * 0.16, -this.size * 0.17, this.size * 0.18, this.size * 0.1);

    // body spots
    fill(isChoco ? "#8C5534" : "#C37833");
    circle(-this.size * 0.2, 0, this.size * 0.05);
    circle(this.size * 0.16, -this.size * 0.04, this.size * 0.042);
    circle(0, this.size * 0.08, this.size * 0.04);

    // big tart hat on top (foil tightly attached to head)
    fill("#D6DBE5");
    beginShape();
    vertex(-this.size * 0.34, -this.size * 0.45);
    vertex(this.size * 0.34, -this.size * 0.45);
    vertex(this.size * 0.3, -this.size * 0.33);
    vertex(-this.size * 0.3, -this.size * 0.33);
    endShape(CLOSE);
    fill("#BFC6D4");
    for (let i = 0; i < 6; i++) {
      const x = map(i, 0, 5, -this.size * 0.24, this.size * 0.24);
      rect(x - this.size * 0.013, -this.size * 0.44, this.size * 0.026, this.size * 0.1, 2);
    }

    fill(crustCol);
    ellipse(0, -this.size * 0.49, this.size * 0.76, this.size * 0.29);
    fill(isChoco ? "#8B5A34" : "#E4A65A");
    for (let i = 0; i < 10; i++) {
      const x = map(i, 0, 9, -this.size * 0.32, this.size * 0.32);
      ellipse(x, -this.size * 0.49 + sin(i * 1.1) * 1.1, this.size * 0.085, this.size * 0.072);
    }

    fill(custardCol);
    ellipse(0, -this.size * 0.49, this.size * 0.58, this.size * 0.17);
    fill(isChoco ? "#6A4026" : "#C7823D");
    circle(-this.size * 0.1, -this.size * 0.5, this.size * 0.04);
    circle(this.size * 0.08, -this.size * 0.52, this.size * 0.03);
    if (isChoco) {
      fill("#5A341E");
      circle(this.size * 0.15, -this.size * 0.48, this.size * 0.025);
    }

    fill(255, 65);
    ellipse(-this.size * 0.14, -this.size * 0.52, this.size * 0.16, this.size * 0.06);

    // no extra mouth here; mouth is handled in drawFace() as an O shape
  }

  drawStrawberryRabbit() {
    // soft sea-bunny-like ears (irregular droopy shape)
    fill("#FF6F98");
    beginShape();
    vertex(-this.size * 0.1, -this.size * 0.62);
    bezierVertex(-this.size * 0.3, -this.size * 0.86, -this.size * 0.56, -this.size * 0.78, -this.size * 0.5, -this.size * 0.48);
    bezierVertex(-this.size * 0.46, -this.size * 0.36, -this.size * 0.3, -this.size * 0.33, -this.size * 0.16, -this.size * 0.47);
    endShape(CLOSE);
    beginShape();
    vertex(this.size * 0.1, -this.size * 0.62);
    bezierVertex(this.size * 0.3, -this.size * 0.86, this.size * 0.56, -this.size * 0.78, this.size * 0.5, -this.size * 0.48);
    bezierVertex(this.size * 0.46, -this.size * 0.36, this.size * 0.3, -this.size * 0.33, this.size * 0.16, -this.size * 0.47);
    endShape(CLOSE);
    fill("#FF9DBB");
    beginShape();
    vertex(-this.size * 0.16, -this.size * 0.56);
    bezierVertex(-this.size * 0.3, -this.size * 0.7, -this.size * 0.44, -this.size * 0.67, -this.size * 0.4, -this.size * 0.5);
    bezierVertex(-this.size * 0.38, -this.size * 0.44, -this.size * 0.28, -this.size * 0.43, -this.size * 0.2, -this.size * 0.49);
    endShape(CLOSE);
    beginShape();
    vertex(this.size * 0.16, -this.size * 0.56);
    bezierVertex(this.size * 0.3, -this.size * 0.7, this.size * 0.44, -this.size * 0.67, this.size * 0.4, -this.size * 0.5);
    bezierVertex(this.size * 0.38, -this.size * 0.44, this.size * 0.28, -this.size * 0.43, this.size * 0.2, -this.size * 0.49);
    endShape(CLOSE);

    // cloud-like irregular cake body
    fill("#FFAEC9");
    beginShape();
    vertex(-this.size * 0.4, this.size * 0.01);
    bezierVertex(-this.size * 0.5, -this.size * 0.22, -this.size * 0.28, -this.size * 0.38, -this.size * 0.1, -this.size * 0.31);
    bezierVertex(0, -this.size * 0.45, this.size * 0.18, -this.size * 0.36, this.size * 0.25, -this.size * 0.27);
    bezierVertex(this.size * 0.45, -this.size * 0.28, this.size * 0.54, -this.size * 0.06, this.size * 0.41, this.size * 0.09);
    bezierVertex(this.size * 0.34, this.size * 0.21, this.size * 0.12, this.size * 0.3, -this.size * 0.07, this.size * 0.26);
    bezierVertex(-this.size * 0.3, this.size * 0.32, -this.size * 0.48, this.size * 0.2, -this.size * 0.4, this.size * 0.01);
    endShape(CLOSE);

    // white frosting on top
    fill("#FFF6FA");
    for (let i = 0; i < 5; i++) {
      const px = -this.size * 0.24 + i * this.size * 0.12;
      const py = -this.size * 0.2 + sin(this.wobble + i) * 2.2;
      ellipse(px, py, this.size * 0.2, this.size * 0.14);
    }

    fill("#F0A272");
    beginShape();
    vertex(-this.size * 0.46, this.size * 0.16);
    vertex(this.size * 0.46, this.size * 0.16);
    vertex(this.size * 0.31, this.size * 0.46);
    vertex(-this.size * 0.31, this.size * 0.46);
    endShape(CLOSE);
    // cup texture lines
    fill("#D88F5B");
    for (let i = 0; i < 7; i++) {
      const x = map(i, 0, 6, -this.size * 0.24, this.size * 0.24);
      rect(x - this.size * 0.012, this.size * 0.16, this.size * 0.024, this.size * 0.24, 2);
    }
    fill(255);
    rect(-this.size * 0.26, this.size * 0.18, this.size * 0.52, this.size * 0.05, 3);

    fill("#FFDCE7");
    for (let i = 0; i < 5; i++) {
      const px = -this.size * 0.24 + i * this.size * 0.12;
      const py = -this.size * 0.35 + sin(this.wobble + i) * 3.5;
      ellipse(px, py, this.size * 0.2, this.size * 0.17);
    }
    fill("#F24578");
    circle(0, -this.size * 0.57, this.size * 0.11);
    fill("#6BC961");
    triangle(-this.size * 0.03, -this.size * 0.63, this.size * 0.03, -this.size * 0.63, 0, -this.size * 0.69);
    fill(255, 55);
    ellipse(-this.size * 0.2, -this.size * 0.14, this.size * 0.2, this.size * 0.14);
  }

  drawPuddingJellyfish() {
    fill("#8EDCEA");
    arc(0, -this.size * 0.04, this.size * 1.03, this.size * 0.92, PI, TWO_PI);
    rect(-this.size * 0.52, -this.size * 0.04, this.size * 1.04, this.size * 0.31, 0, 0, 20, 20);

    fill("#FFF5E6");
    rect(-this.size * 0.35, -this.size * 0.42, this.size * 0.7, this.size * 0.08, 4);
    fill("#F8C57E");
    arc(0, -this.size * 0.2, this.size * 0.7, this.size * 0.42, PI, TWO_PI);
    rect(-this.size * 0.35, -this.size * 0.2, this.size * 0.7, this.size * 0.14, 0, 0, 6, 6);
    fill("#8C532B");
    arc(0, -this.size * 0.25, this.size * 0.7, this.size * 0.22, PI, TWO_PI);
    fill("#8C532B");
    beginShape();
    vertex(-this.size * 0.18, -this.size * 0.18);
    vertex(-this.size * 0.12, -this.size * 0.08);
    vertex(-this.size * 0.08, -this.size * 0.18);
    endShape(CLOSE);
    beginShape();
    vertex(this.size * 0.08, -this.size * 0.18);
    vertex(this.size * 0.12, -this.size * 0.07);
    vertex(this.size * 0.17, -this.size * 0.18);
    endShape(CLOSE);

    stroke("#5DB8C5");
    strokeWeight(4);
    noFill();
    for (let i = 0; i < 7; i++) {
      const x = map(i, 0, 6, -this.size * 0.36, this.size * 0.36);
      beginShape();
      for (let j = 0; j < 5; j++) {
        const py = this.size * 0.18 + j * this.size * 0.11;
        const px = x + sin(this.wobble * 2 + i * 0.5 + j) * this.size * 0.08;
        curveVertex(px, py);
      }
      endShape();
    }
    noStroke();
    fill(255, 65);
    ellipse(-this.size * 0.18, -this.size * 0.28, this.size * 0.2, this.size * 0.14);
  }

  drawLollipopCat() {
    const fur = this.catFur;
    const accent = this.catAccent;

    // special variant: candy base + tiny cat lying on top
    if (this.catStyle === "candyBase") {
      fill("#FFE9F2");
      rect(-this.size * 0.09, this.size * 0.1, this.size * 0.18, this.size * 0.36, 4);
      fill("#FF659A");
      circle(0, this.size * 0.06, this.size * 0.4);
      fill("#FFC0DD");
      arc(0, this.size * 0.06, this.size * 0.4, this.size * 0.4, PI * 0.2, PI * 1.2);

      // tiny cat body
      fill(fur);
      ellipse(0, -this.size * 0.1, this.size * 0.3, this.size * 0.16);
      ellipse(-this.size * 0.11, -this.size * 0.12, this.size * 0.09, this.size * 0.07);
      ellipse(this.size * 0.11, -this.size * 0.12, this.size * 0.09, this.size * 0.07);
      fill(accent);
      triangle(-this.size * 0.09, -this.size * 0.145, -this.size * 0.04, -this.size * 0.21, -this.size * 0.005, -this.size * 0.15);
      triangle(this.size * 0.09, -this.size * 0.145, this.size * 0.04, -this.size * 0.21, this.size * 0.005, -this.size * 0.15);
      fill("#FFF3E3");
      ellipse(0, -this.size * 0.09, this.size * 0.14, this.size * 0.07);
      fill(this.spec.eye);
      circle(-this.size * 0.035, -this.size * 0.095, this.size * 0.014);
      circle(this.size * 0.035, -this.size * 0.095, this.size * 0.014);
      noFill();
      stroke(this.spec.eye);
      strokeWeight(1.4);
      arc(0, -this.size * 0.07, this.size * 0.05, this.size * 0.04, PI, TWO_PI);
      noStroke();
      fill(255, 50);
      ellipse(-this.size * 0.08, -this.size * 0.12, this.size * 0.08, this.size * 0.04);
      return;
    }

    fill(fur);
    beginShape();
    vertex(-this.size * 0.5, this.size * 0.1);
    bezierVertex(-this.size * 0.45, -this.size * 0.36, this.size * 0.45, -this.size * 0.36, this.size * 0.5, this.size * 0.1);
    bezierVertex(this.size * 0.39, this.size * 0.44, -this.size * 0.39, this.size * 0.44, -this.size * 0.5, this.size * 0.1);
    endShape(CLOSE);

    fill(accent);
    beginShape();
    vertex(-this.size * 0.28, this.size * 0.03);
    vertex(-this.size * 0.12, -this.size * 0.2);
    vertex(this.size * 0.12, -this.size * 0.2);
    vertex(this.size * 0.28, this.size * 0.03);
    vertex(this.size * 0.12, this.size * 0.18);
    vertex(-this.size * 0.12, this.size * 0.18);
    endShape(CLOSE);

    fill(fur);
    triangle(-this.size * 0.24, -this.size * 0.25, -this.size * 0.08, -this.size * 0.62, -this.size * 0.01, -this.size * 0.28);
    triangle(this.size * 0.24, -this.size * 0.25, this.size * 0.08, -this.size * 0.62, this.size * 0.01, -this.size * 0.28);
    fill("#FFEEDC");
    ellipse(0, this.size * 0.1, this.size * 0.42, this.size * 0.24);

    // small seated half-circle body + belly patch
    fill(lerpColor(color(fur), color("#E29563"), 0.35));
    arc(0, this.size * 0.34, this.size * 0.56, this.size * 0.34, PI, TWO_PI);
    fill("#FFF3E3");
    arc(0, this.size * 0.34, this.size * 0.34, this.size * 0.2, PI, TWO_PI);

    // tiny stripes
    stroke("#C67F4E");
    strokeWeight(2.5);
    line(-this.size * 0.14, this.size * 0.33, -this.size * 0.14, this.size * 0.24);
    line(0, this.size * 0.34, 0, this.size * 0.23);
    line(this.size * 0.14, this.size * 0.33, this.size * 0.14, this.size * 0.24);
    noStroke();

    push();
    translate(this.size * 0.45, -this.size * 0.15);
    rotate(sin(this.wobble) * 0.25);
    fill("#FFE8F2");
    rect(-this.size * 0.02, -this.size * 0.01, this.size * 0.04, this.size * 0.28, 3);
    fill("#FF5B9D");
    circle(0, -this.size * 0.13, this.size * 0.24);
    fill("#FFD0E7");
    arc(0, -this.size * 0.13, this.size * 0.24, this.size * 0.24, PI * 0.2, PI * 1.2);
    pop();

    fill(255, 48);
    ellipse(-this.size * 0.14, -this.size * 0.15, this.size * 0.18, this.size * 0.1);
  }

  drawPuddingDog() {
    // canele body
    fill("#9A6136");
    beginShape();
    vertex(-this.size * 0.3, this.size * 0.36);
    vertex(this.size * 0.3, this.size * 0.36);
    vertex(this.size * 0.24, this.size * 0.57);
    vertex(-this.size * 0.24, this.size * 0.57);
    endShape(CLOSE);
    fill("#B47645");
    for (let i = 0; i < 5; i++) {
      const x = map(i, 0, 4, -this.size * 0.19, this.size * 0.19);
      rect(x - this.size * 0.02, this.size * 0.37, this.size * 0.04, this.size * 0.18, 4);
    }

    fill("#D8BE97");
    ellipse(0, 0, this.size * 0.96, this.size * 0.74);

    // floppy ears
    fill("#B48A62");
    ellipse(-this.size * 0.34, -this.size * 0.2, this.size * 0.2, this.size * 0.36);
    ellipse(this.size * 0.34, -this.size * 0.2, this.size * 0.2, this.size * 0.36);

    // face muzzle
    fill("#F7E3CC");
    ellipse(0, this.size * 0.08, this.size * 0.42, this.size * 0.25);
    fill("#5B3F27");
    ellipse(0, this.size * 0.03, this.size * 0.07, this.size * 0.05);

    // dog body paws
    fill("#CFAF85");
    ellipse(-this.size * 0.2, this.size * 0.33, this.size * 0.18, this.size * 0.13);
    ellipse(this.size * 0.2, this.size * 0.33, this.size * 0.18, this.size * 0.13);

    // pudding topping
    fill("#FFF3E6");
    rect(-this.size * 0.32, -this.size * 0.4, this.size * 0.64, this.size * 0.08, 4);
    fill("#F4C27A");
    arc(0, -this.size * 0.2, this.size * 0.64, this.size * 0.38, PI, TWO_PI);
    rect(-this.size * 0.32, -this.size * 0.2, this.size * 0.64, this.size * 0.12, 0, 0, 6, 6);
    fill("#8A542D");
    arc(0, -this.size * 0.24, this.size * 0.64, this.size * 0.2, PI, TWO_PI);
    beginShape();
    vertex(-this.size * 0.15, -this.size * 0.19);
    vertex(-this.size * 0.1, -this.size * 0.09);
    vertex(-this.size * 0.06, -this.size * 0.19);
    endShape(CLOSE);
    beginShape();
    vertex(this.size * 0.06, -this.size * 0.19);
    vertex(this.size * 0.1, -this.size * 0.1);
    vertex(this.size * 0.15, -this.size * 0.19);
    endShape(CLOSE);

    fill(255, 50);
    ellipse(-this.size * 0.2, -this.size * 0.12, this.size * 0.2, this.size * 0.12);
  }

  drawCreamLamb() {
    // irregular fluffy wool silhouette
    fill("#F7F1EA");
    beginShape();
    vertex(-this.size * 0.46, this.size * 0.05);
    bezierVertex(-this.size * 0.54, -this.size * 0.24, -this.size * 0.2, -this.size * 0.42, 0, -this.size * 0.34);
    bezierVertex(this.size * 0.24, -this.size * 0.44, this.size * 0.56, -this.size * 0.2, this.size * 0.44, this.size * 0.1);
    bezierVertex(this.size * 0.52, this.size * 0.32, this.size * 0.24, this.size * 0.48, 0, this.size * 0.42);
    bezierVertex(-this.size * 0.26, this.size * 0.5, -this.size * 0.52, this.size * 0.32, -this.size * 0.46, this.size * 0.05);
    endShape(CLOSE);

    fill("#E7D3C3");
    ellipse(0, -this.size * 0.02, this.size * 0.46, this.size * 0.34);
    fill("#CDAE96");
    ellipse(-this.size * 0.42, -this.size * 0.02, this.size * 0.14, this.size * 0.22);
    ellipse(this.size * 0.42, -this.size * 0.02, this.size * 0.14, this.size * 0.22);

    // little horns
    stroke("#B99273");
    strokeWeight(4);
    noFill();
    arc(-this.size * 0.18, -this.size * 0.16, this.size * 0.14, this.size * 0.14, PI * 0.2, PI * 1.2);
    arc(this.size * 0.18, -this.size * 0.16, this.size * 0.14, this.size * 0.14, PI * 1.8, PI * 0.8);
    noStroke();

    // cake-cream topping
    fill("#FFF4FB");
    for (let i = 0; i < 4; i++) {
      circle(-this.size * 0.18 + i * this.size * 0.12, -this.size * 0.34 + sin(i + this.wobble) * 1.4, this.size * 0.15);
    }
    fill("#F65C8D");
    circle(0, -this.size * 0.44, this.size * 0.08);

    // sugar sprinkles on wool
    fill("#FFFFFF");
    circle(-this.size * 0.26, this.size * 0.02, this.size * 0.03);
    circle(this.size * 0.24, this.size * 0.06, this.size * 0.025);
    fill("#FFD9EC");
    circle(-this.size * 0.1, this.size * 0.2, this.size * 0.02);
    circle(this.size * 0.08, -this.size * 0.24, this.size * 0.018);
    fill("#D9F7FF");
    circle(this.size * 0.17, -this.size * 0.1, this.size * 0.018);
  }
}

function setup() {
  createCanvas(ZOO_WIDTH, ZOO_HEIGHT);
  angleMode(RADIANS);
  textFont("Trebuchet MS");

  for (let i = 0; i < 18; i++) {
    const spec = speciesList[i % speciesList.length];
    creatures.push(new DessertCreature(spec, random(100, width - 100), random(160, height - 110), random(62, 86)));
  }
}

function draw() {
  // Layer 1: environment / shop background
  drawDessertShopBackground();

  // Layer 2: food items dropped by player
  for (let i = 0; i < foods.length; i++) drawFood(foods[i]);

  // Layer 3: creature simulation (update + draw + cleanup)
  for (let i = creatures.length - 1; i >= 0; i--) {
    creatures[i].update();
    creatures[i].draw();
    if (creatures[i].dead) creatures.splice(i, 1);
  }

  // Layer 4: explosion particles
  for (let i = candyBits.length - 1; i >= 0; i--) {
    candyBits[i].update();
    candyBits[i].draw();
    if (candyBits[i].life <= 0) candyBits.splice(i, 1);
  }

  // Keep the zoo populated by spawning new creatures over time
  if (frameCount % 210 === 0 && creatures.length < 16) {
    const spec = random(speciesList);
    creatures.push(new DessertCreature(spec, random(120, width - 120), random(170, height - 120), random(60, 84)));
  }

  drawHUD();
}

function drawDessertShopBackground() {
  // Warm gradient backdrop
  noStroke();
  for (let y = 0; y < height; y += 3) {
    const t = map(y, 0, height, 0, 1);
    const c = lerpColor(color("#FFEED8"), color("#FFC88C"), t);
    fill(c);
    rect(0, y, width, 3);
  }

  fill("#FDF3EA");
  rect(90, 70, width - 180, 360, 18);

  fill(shopPalette.wood);
  rect(90, 390, width - 180, 40);
  rect(110, 430, width - 220, 22);

  fill("#FFE6C4");
  rect(140, 100, width - 280, 150, 12);
  fill(shopPalette.glass);
  rect(160, 120, width - 320, 110, 10);

  fill("#F89B6B");
  rect(80, 56, width - 160, 40, 12);
  for (let i = 0; i < 11; i++) {
    fill(i % 2 === 0 ? "#FFD7A8" : "#FFB3B3");
    rect(94 + i * 100, 56, 52, 46, 8);
  }

  // Decorative side sign (moved away from HUD to avoid overlap)
  fill("#F8A16E");
  rect(width - 270, 130, 220, 86, 14);
  fill("#FFD4AE");
  rect(width - 255, 145, 190, 56, 10);
  fill("#7B3E1E");
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Sweet Animal", width - 160, 165);
  text("Dessert Shop", width - 160, 185);
  fill("#B87544");
  rect(width - 175, 216, 30, 20, 6);
  rect(width - 250, 155, 10, 34, 4);
  rect(width - 80, 155, 10, 34, 4);

  drawShelfDetails();

  fill(shopPalette.floor);
  rect(0, height * 0.72, width, height * 0.28);

  fill("#D5A16A");
  for (let x = 0; x < width; x += 44) {
    rect(x, height * 0.68, 20, 70, 7);
  }
}

function drawShelfDetails() {
  fill("#F2C693");
  rect(200, 270, width - 400, 16, 8);
  rect(250, 310, width - 500, 14, 7);

  for (let i = 0; i < 7; i++) {
    const x = 250 + i * 115;
    fill("#FFCFDC");
    rect(x, 230, 32, 42, 8);
    fill("#FFF2F7");
    rect(x + 4, 236, 24, 20, 6);
    fill("#FF5E8D");
    circle(x + 16, 230, 12);
  }

  for (let i = 0; i < 5; i++) {
    const x = 305 + i * 150;
    fill("#FFDF8D");
    arc(x, 305, 52, 28, PI, TWO_PI);
    rect(x - 26, 305, 52, 14, 0, 0, 7, 7);
    fill("#B86F37");
    arc(x, 299, 52, 18, PI, TWO_PI);
  }
}

function drawFood(f) {
  push();
  translate(f.x, f.y);
  noStroke();

  if (f.type === "tart") {
    fill("#F0B56C");
    beginShape();
    vertex(-f.r, 4);
    vertex(f.r, 4);
    vertex(f.r * 0.75, -f.r * 0.7);
    vertex(-f.r * 0.75, -f.r * 0.7);
    endShape(CLOSE);
    fill("#FFE590");
    ellipse(0, -f.r * 0.6, f.r * 1.25, f.r * 0.74);
  } else if (f.type === "strawberryCake") {
    fill("#FFA7C1");
    triangle(-f.r, f.r * 0.5, f.r, f.r * 0.5, 0, -f.r);
    fill(255);
    rect(-f.r * 0.78, -f.r * 0.08, f.r * 1.56, f.r * 0.24, 3);
    fill("#F3497C");
    circle(0, -f.r * 1.05, f.r * 0.42);
    fill("#68BE55");
    triangle(-f.r * 0.12, -f.r * 1.2, f.r * 0.12, -f.r * 1.2, 0, -f.r * 1.35);
  } else if (f.type === "pudding") {
    fill("#FFF4E8");
    rect(-f.r * 0.98, -f.r * 0.05, f.r * 1.96, f.r * 0.86, 4);
    fill("#F8C57E");
    arc(0, -f.r * 0.02, f.r * 1.8, f.r * 1.3, PI, TWO_PI);
    rect(-f.r * 0.9, -f.r * 0.02, f.r * 1.8, f.r * 0.62, 0, 0, 5, 5);
    fill("#8A542D");
    arc(0, -f.r * 0.3, f.r * 1.8, f.r * 0.72, PI, TWO_PI);
    beginShape();
    vertex(-f.r * 0.38, -f.r * 0.26);
    vertex(-f.r * 0.29, -f.r * 0.02);
    vertex(-f.r * 0.2, -f.r * 0.26);
    endShape(CLOSE);
    beginShape();
    vertex(f.r * 0.2, -f.r * 0.26);
    vertex(f.r * 0.29, -f.r * 0.03);
    vertex(f.r * 0.38, -f.r * 0.26);
    endShape(CLOSE);
    fill("#FFF0BE");
    ellipse(0, -f.r * 0.22, f.r * 0.58, f.r * 0.18);
  } else {
    fill("#FFE9F2");
    rect(-f.r * 0.13, -f.r * 0.1, f.r * 0.26, f.r * 1.5, 2);
    fill("#FF659A");
    circle(0, -f.r * 0.75, f.r * 0.95);
    fill("#FFD77D");
    triangle(-f.r * 0.5, -f.r * 0.75, -f.r * 0.95, -f.r * 1.1, -f.r * 0.86, -f.r * 0.36);
    triangle(f.r * 0.5, -f.r * 0.75, f.r * 0.95, -f.r * 1.1, f.r * 0.86, -f.r * 0.36);
    fill("#FFC0DD");
    arc(0, -f.r * 0.75, f.r * 0.95, f.r * 0.95, PI * 0.2, PI * 1.2);
  }
  pop();
}

function drawHUD() {
  // Instruction HUD for interaction and runtime status
  fill(255, 232);
  rect(14, 14, 780, 108, 16);
  fill(shopPalette.text);
  textAlign(LEFT, BASELINE);
  textSize(21);
  text("Dessert Zoo: feed creatures, watch them grow, then BOOM into sweets", 28, 45);
  textSize(14);
  text("Click: drop random sweet (egg tart / strawberry cake / pudding / lollipop)", 28, 70);
  text("Hold mouse near creature: panic escape  |  SPACE: chill/party", 28, 90);
  text(`Mode: ${zooMode.toUpperCase()}  |  Creatures: ${creatures.length}  |  Booms: ${totalBoom}`, 28, 110);
}

function mousePressed() {
  // Drop one random dessert item at mouse position
  const type = random(["tart", "strawberryCake", "pudding", "lollipop"]);
  foods.push({
    x: mouseX,
    y: mouseY,
    type,
    r: random(10, 16),
    nutrition: FOOD_TYPES[type].nutrition * random(0.92, 1.14),
  });
  if (foods.length > 34) foods.shift();
}

function keyPressed() {
  // Toggle movement style
  if (key === " ") zooMode = zooMode === "chill" ? "party" : "chill";
}
