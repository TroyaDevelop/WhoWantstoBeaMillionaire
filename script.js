'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const sprites = {
  background: new Image(),
  questionFrame: new Image(),
  questionVariant: new Image(),
  questionCorrectAnswer: new Image(),
  questionWrongAnswer: new Image(),
  miniFrame: new Image(),

  init() {
    this.background.addEventListener('load', () => game.renderMenu());
    this.background.src = './img/background.png';
    this.questionFrame.src = './img/questionFrame.png';
    this.questionVariant.src = './img/questionVariant.png';
    this.questionCorrectAnswer.src = './img/questionCorrectAnswer.png';
    this.questionWrongAnswer.src = './img/questionWrongAnswer.png';
    this.miniFrame.src = './img/miniFrame.png';
  },
};

const questions = {
  question1: {
    text: 'В каком году\nпроизошло открытие Австралии?',
    a: 'А) 1770',
    b: 'Б) 1788',
    c: 'В) 1801',
    d: 'Г) 1856',
    correct: 'b',
  },

  question2: {
    text: 'Какое химическое вещество отвечает за цвет листвы растений?',
    a: 'Хлорофилл',
    b: 'Адреналин',
    c: 'Меланин',
    d: 'Инсулин',
    correct: null,
  },

  question3: {
    text: 'Какое из следующих произведений не является работой Шекспира?',
    a: 'Гамлет',
    b: 'Ромео и Джульетта',
    c: 'Гордость и предубеждение',
    d: 'Отелло',
    correct: null,
  },
};

const audio = {
  menuMusic: new Audio('./audio/menu.mp3'),
  firstQuestion: new Audio('./audio/firstQuestion.mp3'),
  correctAnswer: new Audio('./audio/correctAnswer.mp3'),
  wrongAnswer: new Audio('./audio/wrongAnswer.mp3'),
};

const settings = {
  MouseX: null,
  MouseY: null,
  firstInit: 0,
  currentScene: 0,

  handleClick(event) {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    
    this.MouseX = (event.clientX - canvasRect.left) * scaleX;
    this.MouseY = (event.clientY - canvasRect.top) * scaleY;

    if(this.firstInit === 0){
      game.init();
      setTimeout(() => {
        this.firstInit = 1;
      }, 100);
    };

    if(this.MouseX <= 580 && this.MouseX >= 340 && this.MouseY <= 363 && this.MouseY >= 309 && this.currentScene === 0 && this.firstInit === 1){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.renderQuestion();
        audio.menuMusic.pause();
        audio.firstQuestion.play();
        this.currentScene += 1;
    };

    if(this.MouseX <= 484 && this.MouseX >= 217 && this.MouseY <= 445 && this.MouseY >= 383 && this.currentScene === 1){
      game.compareAnswer('a', 1);
    } else if(this.MouseX <= 788 && this.MouseX >= 503 && this.MouseY <= 483 && this.MouseY >= 388 && this.currentScene === 1){
      game.compareAnswer('b', 2);
    } else if(this.MouseX <= 483 && this.MouseX >= 215 && this.MouseY <= 536 && this.MouseY >= 381 && this.currentScene === 1){
      game.compareAnswer('c', 3);
    } else if(this.MouseX <= 767 && this.MouseX >= 501 && this.MouseY <= 552 && this.MouseY >= 484 && this.currentScene === 1){
      game.compareAnswer('d', 4);
    };
  },
};

const game = {
  sprites,
  audio,
  settings,
  questions,
  currentAnswer: null,

  init() {
    this.sprites.init();
    audio.menuMusic.play();
    this.currentAnswer = this.questions.question1.correct;
  },

  renderMenu() {
    ctx.drawImage(this.sprites.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.sprites.miniFrame, 330, 300, 448/1.7, 150/1.7);
    ctx.font = '30px serif';
    this.drawText("Начать игру", 390, 350)
  },

  compareAnswer(answer, buttonId){
    if(answer === this.currentAnswer){
      this.drawQuestion(true, buttonId);

      this.audio.firstQuestion.pause();
      this.audio.correctAnswer.play();
    } else {
      this.drawQuestion(false, buttonId);
      this.audio.firstQuestion.pause();
      this.audio.wrongAnswer.play();
    }
  },

  drawQuestion(correct, buttonId){
    ctx.drawImage(this.sprites.questionFrame, 195, 55, 398 * 1.5, 202 * 1.5);
    //a
    if(buttonId === 1 && correct === true){
      ctx.drawImage(this.sprites.questionCorrectAnswer, 215, 385, 182 * 1.5, 56 * 1.5);
    } else if(buttonId === 1 && correct === false){
      ctx.drawImage(this.sprites.questionWrongAnswer, 215, 385, 182 * 1.5, 56 * 1.5);
    } else {
      ctx.drawImage(this.sprites.questionVariant, 215, 385, 182 * 1.5, 56 * 1.5);
    };
    //b
    if(buttonId === 2 && correct === true){
      ctx.drawImage(this.sprites.questionCorrectAnswer, 500, 385, 182 * 1.5, 56 * 1.5);
    } else if(buttonId === 2 && correct === false){
      ctx.drawImage(this.sprites.questionWrongAnswer, 500, 385, 182 * 1.5, 56 * 1.5);
    } else {
      ctx.drawImage(this.sprites.questionVariant, 500, 385, 182 * 1.5, 56 * 1.5);
    };
    //c
    if(buttonId === 3 && correct === true){
      ctx.drawImage(this.sprites.questionCorrectAnswer, 215, 480, 182 * 1.5, 56 * 1.5);
    } else if(buttonId === 3 && correct === false){
      ctx.drawImage(this.sprites.questionWrongAnswer, 215, 480, 182 * 1.5, 56 * 1.5);
    } else {
      ctx.drawImage(this.sprites.questionVariant, 215, 480, 182 * 1.5, 56 * 1.5);
    };
    //d
    if(buttonId === 4 && correct === true){
      ctx.drawImage(this.sprites.questionCorrectAnswer, 500, 480, 182 * 1.5, 56 * 1.5);
    } else if(buttonId === 4 && correct === false){
      ctx.drawImage(this.sprites.questionWrongAnswer, 500, 480, 182 * 1.5, 56 * 1.5);
    } else {
      ctx.drawImage(this.sprites.questionVariant, 500, 480, 182 * 1.5, 56 * 1.5);
    };
    ctx.font = '36px serif';
    this.askQuestion();
  },

  renderQuestion() {
    ctx.drawImage(this.sprites.background, 0, 0, canvas.width, canvas.height);
    this.drawQuestion();
  },

  askQuestion() {
    this.drawText(this.questions.question1.text, 235, 200);
    this.drawText(this.questions.question1.a, 280, 440);
    this.drawText(this.questions.question1.b, 570, 440);
    this.drawText(this.questions.question1.c, 280, 535);
    this.drawText(this.questions.question1.d, 570, 535);
  },

  drawText(question, x, y) {
    this.splitText(question, x, y);
  },

  splitText(text, x, y) {
    const lines = text.split('\n');
    const lineHeight = 30;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      ctx.fillText(line, x, y + i * lineHeight);
    }
  },
};

canvas.addEventListener('click', (event) => settings.handleClick(event));