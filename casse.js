const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const affichageScore = document.querySelector(".score");

const rayonBalle = 10,
  barreHeight = 10,
  barreWidth = 75,
  nbCol = 8,
  nbRow = 5,
  largeurBrique = 75,
  hauteurBrique = 20;

let x = canvas.width / 2,
  y = canvas.height - 30,
  barreX = (canvas.width - barreWidth) / 2,
  fin = false,
  vitesseX = 5,
  vitesseY = -5,
  score = 0;

function dessineBalle() {
  ctx.beginPath();
  ctx.arc(x, y, rayonBalle, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

function dessineBarre() {
  ctx.beginPath();
  ctx.rect(barreX, canvas.height - barreHeight - 2, barreWidth, barreHeight);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.closePath();
}

const briques = [];
for (let i = 0; i < nbRow; i++) {
  briques[i] = [];
  for (let j = 0; j < nbCol; j++) {
    briques[i][j] = { x: 0, y: 0, statut: 1 };
  }
}

function dessineBrique() {
  for (let i = 0; i < nbRow; i++) {
    for (let j = 0; j < nbCol; j++) {
      if (briques[i][j].statut === 1) {
        let briqueX = j * (largeurBrique + 10) + 35;
        let briqueY = i * (hauteurBrique + 10) + 30;

        briques[i][j].x = briqueX;
        briques[i][j].y = briqueY;

        ctx.beginPath();
        ctx.rect(briqueX, briqueY, largeurBrique, hauteurBrique);
        ctx.fillStyle = "#333";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function dessine() {
  if (fin === false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dessineBrique();
    dessineBalle();
    dessineBarre();
    collision();

    if (x + vitesseX > canvas.width - rayonBalle || x + vitesseX < rayonBalle) {
      vitesseX = -vitesseX;
    }
    if (y + vitesseY < rayonBalle) {
      vitesseY = -vitesseY;
    }

    if (y + vitesseY > canvas.height - rayonBalle) {
      if (x > barreX && x < barreX + barreWidth) {
        vitesseX = vitesseX + 0.1;
        vitesseY = vitesseY + 0.1;
        vitesseY = -vitesseY;
      } else {
        fin = true;
        affichageScore.innerHTML = `Perdu ! <br> Clique sur le casse brique pour recommencer`;
      }
    }

    x += vitesseX;
    y += vitesseY;
    requestAnimationFrame(dessine);
  }
}

dessine();

function collision() {
  for (let i = 0; i < nbRow; i++) {
    for (let j = 0; j < nbCol; j++) {
      let b = briques[i][j];
      if (b.statut === 1) {
        if (
          x > b.x &&
          x < b.x + largeurBrique &&
          y > b.y &&
          y < b.y + hauteurBrique
        ) {
          vitesseY = -vitesseY;
          b.statut = 0;

          score++;
          affichageScore.innerHTML = `Score: ${score}`;

          if (score === nbCol * nbRow) {
            affichageScore.innerHTML = `Bravo!: ${score} <br> Clique sur le casse brique pour recommencer`;
          }
        }
      }
    }
  }
}

document.addEventListener("mousemove", mouvementSouris);

function mouvementSouris(e) {
  let posXBarreCanvas = e.clientX - canvas.offsetLeft;

  if (posXBarreCanvas > 35 && posXBarreCanvas < canvas.width - 35) {
    barreX = posXBarreCanvas - barreWidth / 2;
  }
}

canvas.addEventListener("click", () => {
  if (fin === true) {
    fin = false;
    document.location.reload();
  }
});
