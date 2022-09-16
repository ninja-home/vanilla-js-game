import { debounce } from './debounce';

const DEBOUNCE_TIME = 1000; // ms
const TIME_INTERVAL = 2000; // ms
const HIDE_TIME_RANGE = [200, 400];
const HOLE_COUNT = 3;

function pickTime(start, end) {
  return Math.floor(Math.random() * (end - start)) + start;
}

export function documentReady() {
  let timer = null;
  let gameTimer = null;
  const moles = [];

  let clicks = 0;
  let elapsed = 0;

  function playMoles() {
    const index = Math.floor(Math.random() * HOLE_COUNT);
    for (let i = 0; i < HOLE_COUNT; i++) {
      if (i === index) {
        moles[i].mole.classList.add('active');
        moles[i].status = 1;
      } else {
        moles[i].mole.classList.remove('active');
        moles[i].status = 0;
      }
    }

    const timeout = pickTime(HIDE_TIME_RANGE[0], HIDE_TIME_RANGE[1]);
    setTimeout(() => {
      for (let i = 0; i < HOLE_COUNT; i++) {
        moles[index].mole.classList.remove('active');
        moles[index].status = 0;
      }
    }, timeout);
  }

  const debouncedPlayMole = debounce(playMoles, DEBOUNCE_TIME);

  function startGame() {
    elapsed = 0;
    clicks = 0;
    document.getElementById('message').innerHTML = '';

    gameTimer = setInterval(debouncedPlayMole, TIME_INTERVAL);
    timer = setInterval(() => {
      elapsed++;
      document.getElementById('elapsed').innerHTML = `Elapsed time: ${elapsed} seconds`;
    }, 1000);
    document.getElementById('start').setAttribute('disabled', true);

    document.getElementById('elapsed').innerHTML = `Elapsed time: ${elapsed} seconds`;
    document.getElementById('clicks').innerHTML = `Clicks: ${clicks}`;
  }

  function stopGame() {
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    document.getElementById('start').removeAttribute('disabled');
  }

  function onClickMole(idx) {
    if (!gameTimer) {
      return;
    }

    if (moles[idx].status === 1) {
      stopGame();
      document.getElementById('message').innerHTML = 'You win!';
      setTimeout(() => {
        alert(`Gotcha! time to catch ${elapsed} seconds and ${clicks} clicks`);
      }, 0);
    } else {
      clicks++;
      document.getElementById('clicks').innerHTML = `Clicks: ${clicks}`;
      setTimeout(() => {
        debouncedPlayMole();
      }, DEBOUNCE_TIME);
    }
  }

  function setupUI() {
    const btnStart = document.getElementById('start');
    btnStart.addEventListener('click', () => {
      startGame();
    });

    document.getElementById('moles').childNodes.forEach((mole) => {
      if (mole.nodeName.toUpperCase() === 'DIV') {
        let idx = moles.length;

        mole.classList.remove('active');
        mole.addEventListener('click', function () {
          onClickMole(idx);
        });
        moles.push({ mole, status: 0 });
      }
    });
  }

  setupUI();
}
