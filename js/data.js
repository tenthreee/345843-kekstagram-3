'use strict';

(function () {
  var Avatar = {
    FOLDER: 'img/avatar-',
    FORMAT: '.svg',
    NUMBER: 6
  };

  var Picture = {
    FOLDER: 'photos/',
    FORMAT: '.jpg',
    NUMBER: 25
  };

  var Like = {
    MIN: 15,
    MAX: 100
  };

  var COMMENTS_NUMBER = 10;

  var SENTENCES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var NAMES = [
    'Peter'
  ];

  // Создаём массив комментов или описаний
  var createTextArray = function (array, length) {
    var textArray = new Array(length);

    textArray.forEach(function (elem, index, arr) {
      var randomIndex = window.util.getRandomNumber(0, array.length - 1);
      arr[index] = array[randomIndex];
    });

    return textArray;
  };

  // Создаём массив объектов, описывающих комментарии
  var createCommentsArray = function () {
    var commentsNumber = window.util.getRandomNumber(1, COMMENTS_NUMBER);
    var comments = [];

    for (var i = 0; i < commentsNumber; i++) {
      comments[i] = {
        avatar: Avatar.FOLDER + window.util.getRandomNumber(1, Avatar.NUMBER) + Avatar.FORMAT,
        message: SENTENCES[window.util.getRandomNumber(0, SENTENCES.length - 1)],
        name: NAMES[window.util.getRandomNumber(0, NAMES.length - 1)]
      };
    }

    return comments;
  };

  // Создаём массив фоточек
  var createPictures = function () {
    var pictures = [];
    var descriptions = createTextArray(DESCRIPTIONS, Picture.NUMBER);

    for (var i = 0; i < Picture.NUMBER; i++) {
      pictures[i] = {
        url: Picture.FOLDER + (i + 1) + Picture.FORMAT,
        likes: window.util.getRandomNumber(Like.MIN, Like.MAX),
        comments: createCommentsArray(),
        description: descriptions[i]
      };
    }

    return window.util.shuffleArray(pictures);
  };

  window.data = {
    createPictures: createPictures
  };

})();
