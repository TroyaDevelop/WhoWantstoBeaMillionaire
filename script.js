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

class Question {
  constructor(options){
    this.id = options.id;
    this.text = options.text;
    this.a = options.a;
    this.b = options.b;
    this.c = options.c;
    this.d = options.d;
    this.correct = options.correct;
  }
};

const questions = [
  new Question({
    id: 1,
    text: 'Кто написал философское\nпроизведение "Так говорил Заратустра"?',
    a: 'Сартр',
    b: 'Ницше',
    c: 'Камю',
    d: 'Фуко',
    correct: 'b',
  }),
  new Question({
    id:2,
    text: 'Какое химическое вещество\nотвечает за цвет листвы растений?',
    a: 'Хлорофилл',
    b: 'Адреналин',
    c: 'Меланин',
    d: 'Инсулин',
    correct: 'a',
  }),
  new Question({
    id: 3,
    text: 'Какое животное является\nнациональным символом\nАвстралии?',
    a: 'Кенгуру',
    b: 'Коала',
    c: 'Эму',
    d: 'Вомбат',
    correct: 'a',
  }),
  new Question({
    id: 4,
    text: 'Кто написал роман\n"Преступление и наказание"?',
    a: 'Иван Тургенев',
    b: 'Лев Толстой',
    c: 'Антон Чехов',
    d: 'Фёдор Достоевский',
    correct: 'd',
  }),
  new Question({
    id: 5,
    text: 'Какая планета Солнечной системы\nявляется самой большой по диаметру?',
    a: 'Сатурн',
    b: 'Юпитер',
    c: 'Марс',
    d: 'Земля',
    correct: 'b',
  }),
  new Question({
    id: 6,
    text: 'Какая страна является\nродиной пиццы?',
    a: 'Италия',
    b: 'Франция',
    c: 'Греция',
    d: 'США',
    correct: 'a',
  }),
  new Question({
    id: 7,
    text: 'Кто является автором\nпроизведения "Война и мир"?',
    a: 'Александр Пушкин',
    b: 'Фёдор Достоевский',
    c: 'Лев Толстой',
    d: 'Иван Тургенев',
    correct: 'c',
  }),
  new Question({
    id: 8,
    text: 'Какой химический элемент\nобозначается символом "Fe"?',
    a: 'Железо',
    b: 'Серебро',
    c: 'Фтор',
    d: 'Кальций',
    correct: 'a',
  }),
  new Question({
    id: 9,
    text: 'Кто является автором картины\n"Мона Лиза"?',
    a: 'Микеланджело',
    b: 'Пабло Пикассо',
    c: 'Леонардо да Винчи',
    d: 'Клод Моне',
    correct: 'c',
  }),
  new Question({
    id: 10,
    text: 'Кто является автором книги "1984"?',
    a: 'Алдоус Хаксли',
    b: 'Рэй Брэдбери',
    c: 'Харпер Ли',
    d: 'Джордж Оруэлл',
    correct: 'd',
  }),
];

const audio = {
  menuMusic: new Audio('./audio/menu.mp3'),
  firstQuestion: new Audio('./audio/firstQuestion.mp3'),
  correctAnswer: new Audio('./audio/correctAnswer.mp3'),
  wrongAnswer: new Audio('./audio/wrongAnswer.mp3'),
  transitionQuestion: new Audio('./audio/transitionQuestion.mp3'),
};

const settings = {
  MouseX: null,
  MouseY: null,
  firstInit: 0,
  currentScene: 0,
  canPlayerClick: true,

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
        game.renderQuestion();
        audio.menuMusic.pause();
        audio.firstQuestion.play();
        this.currentScene = 1;
    };

    if(this.MouseX <= 484 && this.MouseX >= 217 && this.MouseY <= 445 && this.MouseY >= 383 && this.currentScene === 1 && this.canPlayerClick === true){
      game.compareAnswer('a', 1);
    } else if(this.MouseX <= 788 && this.MouseX >= 503 && this.MouseY <= 483 && this.MouseY >= 388 && this.currentScene === 1 && this.canPlayerClick === true){
      game.compareAnswer('b', 2);
    } else if(this.MouseX <= 483 && this.MouseX >= 215 && this.MouseY <= 536 && this.MouseY >= 381 && this.currentScene === 1 && this.canPlayerClick === true){
      game.compareAnswer('c', 3);
    } else if(this.MouseX <= 767 && this.MouseX >= 501 && this.MouseY <= 552 && this.MouseY >= 484 && this.currentScene === 1 && this.canPlayerClick === true){
      game.compareAnswer('d', 4);
    };
  },
};

const game = {
  sprites,
  audio,
  settings,
  questions,
  currentQuestion: null,
  currentAnswer: null,
  askedQuestionsId: [],

  init() {
    this.sprites.init();
    audio.menuMusic.play();
    this.getQuestion();
    this.currentAnswer = this.currentQuestion.correct;
  },

  nextQuestionTransition(){
    setTimeout(() => {
      this.getQuestion();
      this.drawQuestion();
      this.currentAnswer = this.currentQuestion.correct;
      this.settings.canPlayerClick = true;
      this.audio.transitionQuestion.play();
    }, 3000);
  },

  renderMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.sprites.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.sprites.miniFrame, 330, 300, 448/1.7, 150/1.7);
    ctx.font = '28px serif';
    this.drawText("Начать игру", 390, 350)
  },

  getQuestion(){
    let id = Math.floor(Math.random() * this.questions.length+1);
    for(const quest of questions){

      if(this.askedQuestionsId.includes(id)){
        id = Math.floor(Math.random() * this.questions.length+1);
      };

      if(quest.id === id && !this.askedQuestionsId.includes(id)){
        this.currentQuestion = quest;
        this.askedQuestionsId.push(id);
        break;
      };
    };
  },

  compareAnswer(answer, buttonId){
    this.settings.canPlayerClick = false;
    if(answer === this.currentAnswer){
      this.drawQuestion(true, buttonId);

      this.audio.firstQuestion.pause();
      this.audio.correctAnswer.play();
      this.nextQuestionTransition();
    } else {
      this.drawQuestion(false, buttonId);
      this.audio.firstQuestion.pause();
      this.audio.wrongAnswer.play();
      this.gameLose();
    }
  },

  gameLose(){
    setTimeout(() => {
      this.renderMenu();
      this.settings.currentScene = 0;
      this.currentAnswer = this.currentQuestion.correct;
      this.settings.canPlayerClick = true;
      this.getQuestion();
    }, 3000);
  },

  drawQuestion(correct, buttonId){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.sprites.background, 0, 0, canvas.width, canvas.height);
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
    this.drawQuestion();
  },

  askQuestion() {
    ctx.font = '30px serif';
    this.drawText(this.currentQuestion.text, 235, 190);
    ctx.font = '22px serif';
    this.drawText(this.currentQuestion.a, 280, 435);
    this.drawText(this.currentQuestion.b, 570, 435);
    this.drawText(this.currentQuestion.c, 280, 530);
    this.drawText(this.currentQuestion.d, 570, 530);
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