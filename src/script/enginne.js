const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    life: document.querySelector("#life"),
  },
  values: {
    timerId: null,
    gameVelocite: 500,
    hitPosition: 0,
    result: 0,
    pointLife: 3,
    currentTimer: 60,
  },
  actions: {
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function countDown() {
  state.values.currentTimer--;
  state.view.timeLeft.textContent = state.values.currentTimer;

  if (state.values.currentTimer <= 0) {
    clearInterval(state.values.timerId); // parar inimigo
    clearInterval(state.actions.countDownTimerId); // parar contador
    const gameOverElement = document.getElementById("gameOver");
    const restartBtn = document.getElementById("restartBtn");

    gameOverElement.classList.add("show");
    gameOverElement.textContent = "Tempo esgotado!";
    restartBtn.style.display = "block";
  }
}

function playsound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.3;
    audio.play()
}
function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocite);
}

function gameOver() {
  const gameOverElement = document.getElementById("gameOver");
  const restartBtn = document.getElementById("restartBtn");

  if (state.values.pointLife <= 0) {
    clearInterval(state.values.timerId); // parar inimigo
    clearInterval(state.actions.countDownTimerId); // parar contador
    gameOverElement.classList.add("show");
    gameOverElement.textContent = "Game Over!";
    restartBtn.style.display = "block";
    playsound("GameOver")
  }
  
}

function restartGame() {
  // Resetar valores
  state.values.result = 0;
  state.values.pointLife = 3;
  state.view.score.textContent = 0;
  state.view.life.textContent = 3;
  state.view.timeLeft.textContent = 60;

  // Esconder tela de game over
  document.getElementById("gameOver").classList.remove("show");
  // Esconder botão de reinício, se estiver visível
  document.getElementById("restartBtn").style.display = "none";
  // Reiniciar cronômetro
  state.values.currentTimer = 60;
  state.view.timeLeft.textContent = 60;
  // Reiniciar movimentação
  clearInterval(state.values.timerId);
  clearInterval(state.actions.countDownTimerId);
  moveEnemy();
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function addListinerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playsound("succes");
      } else if (square.id !== state.values.hitPosition) {
        state.values.pointLife--;
        state.view.life.textContent = state.values.pointLife;
        playsound("losse");
        gameOver();
      }
    });
  });
}

function main() {
  moveEnemy();
  addListinerHitBox();
  gameOver();
}
main();
document.getElementById("restartBtn").addEventListener("click", restartGame);
