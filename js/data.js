'use strict';

(function () {
  var AVATARS_FOLDER = 'img/avatar-';
  var AVATARS_FORMAT = '.svg';
  var AVATARS_NUMBER = 6;
  var PICTURES_NUMBER = 25;
  var PICTURES_FOLDER = 'photos/';
  var PICTURES_FORMAT = '.jpg';
  var COMMENTS_NUMBER = 10;
  var MIN_LIKES = 15;
  var MAX_LIKES = 100;

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
        avatar: AVATARS_FOLDER + window.util.getRandomNumber(1, AVATARS_NUMBER) + AVATARS_FORMAT,
        message: SENTENCES[window.util.getRandomNumber(0, SENTENCES.length - 1)],
        name: NAMES[window.util.getRandomNumber(0, NAMES.length - 1)]
      };
    }

    return comments;
  };

  // Создаём массив фоточек
  var createPictures = function () {
    var pictures = [];
    var descriptions = createTextArray(DESCRIPTIONS, PICTURES_NUMBER);

    for (var i = 0; i < PICTURES_NUMBER; i++) {
      pictures[i] = {
        url: PICTURES_FOLDER + (i + 1) + PICTURES_FORMAT,
        likes: window.util.getRandomNumber(MIN_LIKES, MAX_LIKES),
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
