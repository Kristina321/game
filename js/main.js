(() => {
  const container = document.getElementById('container');
  const cards = [];
  const greeting = createGreeting();

  function createVinBox() {
    const h1 = document.createElement('h1');
    const button = createBtn('Сыграть ещё');

    container.classList.add('game-container--pad');
    h1.classList.add('text-center', 'vin-title');
    button.btn.classList.add('button--vin');

    h1.textContent = 'Поздравляю, вы победили!';

    container.append(h1, button.btnWrapper);

    button.btn.addEventListener('click', () => location.reload());
  }

  function createCheckbox(id, name, text) {
    const checkbox = document.createElement('label');
    const check = document.createElement('input');
    const checkDesc = document.createElement('span');

    checkbox.classList.add('game__checkbox');
    check.classList.add('game__checkbox-check', 'form-check-input');
    check.type = 'radio';
    check.id = id;
    check.name = name;
    check.value = 'false';
    checkDesc.classList.add('game__checkbox-desc');
    checkDesc.innerHTML = text;

    checkbox.append(check, checkDesc);

    return checkbox;
  }

  function createBtn(btnText) {
    const btnWrapper = document.createElement('div');
    const btn = document.createElement('button');
    btnWrapper.classList.add('button-wrapper');
    btn.classList.add('button');
    btn.textContent = btnText;

    btnWrapper.append(btn);

    return {
      btnWrapper,
      btn,
    }
  }

  function ctreateTooltip() {
    const tooltip = document.createElement('div');
    const tooltipValue = document.createElement('span');

    tooltip.classList.add('tooltip');
    tooltipValue.textContent = 'необязательно, меняет стиль картинки';

    tooltip.append(tooltipValue);

    return tooltip;
  }

  function createGreeting() {
    const box = document.createElement('div');
    const h1 = document.createElement('h1');
    const form = document.createElement('form');
    const inputLevelWrapper = document.createElement('div');
    const inputAgeWrapper = document.createElement('div');
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    const easy = createCheckbox('easy', 'difficultyLevel', 'Лёгкий (6 пар)');
    const medium = createCheckbox('medium', 'difficultyLevel', 'Средний (12 пар)');
    const hard = createCheckbox('hard', 'difficultyLevel', 'Сложный (18 пар)');
    const ageVerification = createCheckbox('age', 'age', 'Мне уже есть 18 лет');
    const ageVerificationTooltip = ctreateTooltip();
    const button = createBtn('Начать игру');

    box.classList.add('d-flex', 'game');
    h1.classList.add('text-center', 'game__title');
    form.classList.add('game__form', 'd-flex', 'flex-column', 'align-items-center');
    fieldset.classList.add('m-0');
    ageVerification.classList.add('game__checkbox-age');
    legend.classList.add('game__legend');
    if (container.classList.contains('game-container--pad')) container.classList.remove('game-container--pad');

    h1.textContent = 'Игра в пары';
    legend.innerHTML = 'Выберите уровень сложности';

    medium.children[0].checked = 'true';
    medium.children[0].value = 'true';
    ageVerification.children[0].type = 'checkbox';
    button.btn.type = 'submit';

    fieldset.append(legend, easy, medium, hard);
    ageVerification.append(ageVerificationTooltip);
    inputLevelWrapper.append(fieldset);
    inputAgeWrapper.append(ageVerification);
    form.append(inputLevelWrapper, inputAgeWrapper, button.btnWrapper);
    box.append(h1, form);
    container.append(box);

    return {
      box,
      form,
      fieldset,
      button,
    };
  }

  function checkChecked(input) {
    return (input.checked) ? input.value = 'true' : input.value = 'false';
  }

  function createDoubleNumArr(arr) {
    const numberArr = [1, 1];

    const difficulty = arr.filter(radio => radio.value === 'true')
      .map(radio => {
        switch (radio.id) {
          case 'easy':
            return 12;
          case 'hard':
            return 36;
          default:
            return 24;
        }
      }).join();

    const count = Math.floor(+difficulty / 2);

    for (let i = 2; i <= count; ++i) {
      let j = i;
      numberArr.push(i);
      numberArr.push(j);
    }

    return numberArr;
  }

  function createShuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; --i) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function setGameBoxStyle(arr, game) {
    let sum = arr.reduce((sum, current) => sum + current, 0);

    switch (sum) {
      case 42:
        game.classList.add('game-all', 'game-light');
        break;
      case 342:
        game.classList.add('game-all', 'game-hard');
        break;
      default:
        game.classList.add('game-all', 'game-medium');
        break;
    }
  }

  function createCard(item, checkAge, cards) {
    const game = document.getElementById('cardGame');
    const gameCard = document.createElement('div');

    gameCard.classList.add('text-center', 'game-card', 'game-card--size', 'game-card-close');
    gameCard.textContent = item;
    gameCard.setAttribute('data-id', item);

    if (checkAge.value === 'false') {
      if (+gameCard.dataset.id === item) {
        gameCard.classList.add(`game-card-baby-` + item);
      }
    } else {
      if (+gameCard.dataset.id === item) {
        gameCard.classList.add(`game-card-adult-` + item);
      }
    }

    game.append(gameCard);
    cards.push(gameCard);
  }

  function createGameBox(arrDoubleNumberCard) {
    const game = document.createElement('div');

    game.id = 'cardGame';

    setGameBoxStyle(arrDoubleNumberCard, game);

    container.append(game);

    return game;
  }

  function startGame() {
    const radioArr = Array.from(document.querySelectorAll('input[type="radio"]'));
    const checkAge = document.getElementById('age');

    greeting.fieldset.addEventListener('click', () => {
      radioArr.forEach(radio => checkChecked(radio));
    });

    checkAge.addEventListener('click', () => checkChecked(checkAge));

    greeting.form.addEventListener('submit', (event) => {
      event.preventDefault();

      const arrDoubleNumberCard = createDoubleNumArr(radioArr);
      const shuffleArr = createShuffleArr(arrDoubleNumberCard);

      greeting.box.remove();

      createGameBox(arrDoubleNumberCard);

      shuffleArr.forEach(item => createCard(item, checkAge, cards));

      play();
    });
  }

  function play() {
    let firstCard = null;
    let secondCard = null;

    const openCardArr = [];
    const cardGame = document.getElementById('cardGame');

    cards.forEach(card => {
      card.addEventListener('click', function () {

        if (cards.length === (openCardArr.length + 2)) {
          openCardArr.forEach(el => el.classList.remove('succes'));
          createVinBox();
          if (cardGame.classList.contains('game-hard')) cardGame.classList.add('game-hard--vin');
        }

        this.classList.add('game-card-open', 'stop-click');
        this.classList.remove('game-card-close');

        if (secondCard !== null && firstCard.dataset.id !== secondCard.dataset.id) {
          firstCard.classList.remove('game-card-open', 'stop-click');
          secondCard.classList.remove('game-card-open', 'stop-click');
          firstCard.classList.add('game-card-close');
          secondCard.classList.add('game-card-close');

          secondCard = null;
          firstCard = null;
        }

        if (secondCard !== null && firstCard.dataset.id === secondCard.dataset.id) {
          firstCard.classList.add('succes', 'stop-click');
          secondCard.classList.add('succes', 'stop-click');

          openCardArr.push(firstCard);
          openCardArr.push(secondCard);

          secondCard = null;
          firstCard = null;
        }

        if (firstCard === null) {
          firstCard = this;
          firstCard.dataset.id = this.dataset.id;
        } else {
          secondCard = this;
          secondCard.dataset.id = this.dataset.id;
        }
      });
    });
  }

  window.startGame = startGame;
})();
