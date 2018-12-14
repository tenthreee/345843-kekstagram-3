'use strict';

var PICTURES_NUMBER = 25;
var AVATAR_SIZE = '35';
var PICTURES_FOLDER = 'photos/';
var PICTURES_FORMAT = '.jpg';
var AVATARS_FOLDER = 'img/avatar-';
var AVATARS_FORMAT = '.svg';

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

var Keycode = {
  ESC: 27,
  ENTER: 13
};

var template = document.querySelector('#picture');
var pictureTemplate = template.content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureImage = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImage.querySelector('img');
var socialCaption = bigPicture.querySelector('.social__caption');
var commentsList = bigPicture.querySelector('.social__comments');
var likesCount = bigPicture.querySelector('.likes-count');
var commentsCount = bigPicture.querySelector('.comments-count');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var socialCommentLoad = bigPicture.querySelector('.comments-loader');
var bigPictureClose = bigPicture.querySelector('#picture-cancel');
var fileUpload = picturesList.querySelector('#upload-file');
var imgUpload = picturesList.querySelector('.img-upload__overlay');
var uploadCancel = imgUpload.querySelector('#upload-cancel');
var effectLevel = imgUpload.querySelector('.effect-level');
var effectLeveline = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');
var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');
var imgPreview = imgUploadPreview.querySelector('img');
var effectsList = imgUpload.querySelector('.effects__list');
var scaleControlSmaller = imgUpload.querySelector('.scale__control--smaller');
var scaleControlBigger = imgUpload.querySelector('.scale__control--bigger');
var scaleControlValue = imgUpload.querySelector('.scale__control--value');
var textDescription = imgUpload.querySelector('.text__description');
var textHashtags = imgUpload.querySelector('.text__hashtags');
var uploadSubmit = imgUpload.querySelector('#upload-submit');


/* Вспомогательные функции
   ========================================================================== */

// Получаем случайное число
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};


// Меняем местами два элемента в массиве
var swapElements = function (array, firstElemIndex, secondElemIndex) {
  var temporaryValue = array[firstElemIndex];
  array[firstElemIndex] = array[secondElemIndex];
  array[secondElemIndex] = temporaryValue;
};


// Перемешиваем массив
var shuffleArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    swapElements(array, i, randomIndex);
  }

  return array;
};


// Создаём массив комментов или описаний
var createTextArray = function (array, length) {
  var textArray = new Array(length);

  for (var i = 0; i < length; i++) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    textArray.fill(array[randomIndex], i, i + 1);
  }

  return textArray;
};


// Создаём какой-нибудь элемент
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};


// Ищем дубль в массиве
var searchDuplicate = function (elem, arr) {
  var dubl = 0;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      dubl += 1;
    }
  }

  return dubl;
};


// Создаём массив объектов, описывающих комментарии
var createCommentsArray = function () {
  var commentsNumber = getRandomNumber(1, 10);
  var comments = [];

  for (var i = 0; i < commentsNumber; i++) {
    comments[i] = {
      avatar: AVATARS_FOLDER + getRandomNumber(1, 6) + AVATARS_FORMAT,
      message: SENTENCES[getRandomNumber(0, SENTENCES.length - 1)],
      name: NAMES[getRandomNumber(0, NAMES.length - 1)]
    };
  }

  return comments;
};


/* Основные функции
   ========================================================================== */

// Создаём массив фоточек
var createPictures = function () {
  var pictures = [];
  var descriptions = createTextArray(DESCRIPTIONS, PICTURES_NUMBER);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    pictures[i] = {
      url: PICTURES_FOLDER + (i + 1) + PICTURES_FORMAT,
      likes: getRandomNumber(15, 200),
      comments: createCommentsArray(),
      description: descriptions[i]
    };
  }

  return shuffleArray(pictures);
};


// Создаём болванку для превьюшки
var getPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};


// Удаляем дефолтные комментарии из разметки
var removeComment = function () {
  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }
};


// Создаём комментарий
var createComment = function (comment) {
  var commentItem = makeElement('li', 'social__comment');
  var avatar = makeElement('img', 'social__picture');

  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;

  commentItem.appendChild(avatar);
  commentItem.appendChild(document.createTextNode(comment.message));

  return commentItem;
};


// Добавляем комментарий в разметку
var addComments = function (picture) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picture.comments.length; i++) {
    var comment = picture.comments[i];
    fragment.appendChild(createComment(comment));
  }

  commentsList.appendChild(fragment);
};


// Заполняем и показываем большую фоточку
var fillOverlay = function (picture) {
  bigPictureImg.src = picture.url;
  likesCount.textContent = picture.likes;
  commentsCount.textContent = picture.comments.length;
  socialCaption.textContent = picture.description;

  removeComment(); // Удаляем дефолтные комментарии из разметки
  addComments(picture);

  bigPicture.classList.remove('hidden');
  socialCommentCount.classList.add('visually-hidden');
  socialCommentLoad.classList.add('visually-hidden');
  document.addEventListener('keydown', onDocumentEscKeydown);
};


// Отрисовываем фоточки
var renderPictures = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var currentPicture = getPicture(array[i]);

    currentPicture.setAttribute('data-id', i);
    fragment.appendChild(currentPicture);

    currentPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      fillOverlay(array[evt.currentTarget.dataset.id]);
    });
  }

  picturesList.appendChild(fragment);
};


// Функция, скрывающая большую фоточку
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
};

var onBigPictureCloseClick = function () {
  closeBigPicture();
};

var onBigPictureCloseEnterKeydown = function (evt) {
  if (evt.keyCode === Keycode.ENTER) {
    closeBigPicture();
  }
};

var onDocumentEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeBigPicture();
  }
};


// Функция, закрывающая форму редактирования изображения
var closeImgUpload = function () {
  var focused = document.activeElement;

  if (focused !== textDescription && focused !== textHashtags) {
    imgUpload.classList.add('hidden');
    fileUpload.reset();
  }
};

var onUploadCancelClick = function () {
  closeImgUpload();
};

var onUploadCancelEnterKeydown = function (evt) {
  if (evt.keyCode === Keycode.ENTER) {
    closeImgUpload();
  }
};

// Закрываем форму редактирования изображения эскейпом
var onImgUploadEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeImgUpload();
  }
};


// Сбрасываем эффект
var resetEffect = function () {
  imgPreview.style = '';
  imgPreview.className = '';

  effectLevelDepth.setAttribute('style', 'width:100%');
  effectLevelPin.setAttribute('style', 'left:100%');
  effectLevelValue.setAttribute('value', '100');
};


// Открываем форму редактирования изображения
var onFileUploadChange = function () {
  imgUpload.classList.remove('hidden');
  effectLevel.classList.add('hidden');
  resetEffect();
  scaleControlValue.setAttribute('value', '100%'); // Делаем значение поля по умолчанию 100% (ТЗ 2.1)
};


// Применяем эффекты к фоточке
var switchEffects = function () {
  var effect = effectsList.querySelector('input[type=radio]:checked');

  switch (effect.id) {
    case 'effect-none':
      imgPreview.className = '';
      effectLevel.classList.add('hidden');
      break;
    case 'effect-chrome':
      resetEffect();
      effectLevel.classList.remove('hidden');
      imgPreview.classList.add('effects__preview--chrome');
      break;
    case 'effect-sepia':
      resetEffect();
      effectLevel.classList.remove('hidden');
      imgPreview.classList.add('effects__preview--sepia');
      break;
    case 'effect-marvin':
      resetEffect();
      effectLevel.classList.remove('hidden');
      imgPreview.classList.add('effects__preview--marvin');
      break;
    case 'effect-phobos':
      resetEffect();
      effectLevel.classList.remove('hidden');
      imgPreview.classList.add('effects__preview--phobos');
      break;
    case 'effect-heat':
      resetEffect();
      effectLevel.classList.remove('hidden');
      imgPreview.classList.add('effects__preview--heat');
      break;
  }
};

var onEffecstListClick = function () {
  switchEffects();
};

// Уменьшаем фоточку
var onScaleControlSmallerClick = function () {
  var value = parseInt(scaleControlValue.value, 10);

  if (value > 25) {
    value -= 25;
    imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
    scaleControlValue.value = value + '%';
  } else if (value <= 25) {
    imgPreview.setAttribute('style', 'transform:scale(0.25)');
    scaleControlValue.value = value + '%';
  }
};


// Увеличиваем фоточку
var onScaleControlBiggerClick = function () {
  var value = parseInt(scaleControlValue.value, 10);

  if (value < 75) {
    value += 25;
    imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
    scaleControlValue.value = value + '%';
  } else if (value >= 75 && value < 100) {
    value += 25;
    imgPreview.removeAttribute('style');
    scaleControlValue.value = value + '%';
  }
};


// Валидируем хэштеги
var onUploadSubmitClick = function () {
  var userHashtags = document.querySelector('.text__hashtags').value;
  var splitHashtags = userHashtags.split(' ');

  if (splitHashtags.length > 5) {
    textHashtags.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
  }

  for (var i = 0; i < splitHashtags.length; i++) {
    var currentHashtag = splitHashtags[i].toLowerCase();
    var sameHashtags = searchDuplicate(currentHashtag, splitHashtags);

    if (sameHashtags > 1) {
      textHashtags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
    }
    if (currentHashtag[0] !== '#') {
      textHashtags.setCustomValidity('Хэш-тег должен начинаться с символа #');
    }
    if (currentHashtag.length < 2) {
      textHashtags.setCustomValidity('Хэш-тег не может состоять только из одного символа');
    }
    if (currentHashtag.length > 20) {
      textHashtags.setCustomValidity('Максимальная длина одного хэш-тега — 20 символов, включая решётку');
    }
  }
};


// Отрисовываем фоточки
var pictures = createPictures();
renderPictures(pictures);


/* Добавляем обработчики событий
   ========================================================================== */

bigPictureClose.addEventListener('click', onBigPictureCloseClick);

bigPictureClose.addEventListener('keydown', onBigPictureCloseEnterKeydown);

fileUpload.addEventListener('change', onFileUploadChange);

uploadCancel.addEventListener('click', onUploadCancelClick);

uploadCancel.addEventListener('keydown', onUploadCancelEnterKeydown);

effectsList.addEventListener('click', onEffecstListClick);

scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);

scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);

uploadSubmit.addEventListener('click', onUploadSubmitClick);

textHashtags.addEventListener('input', function () {
  textHashtags.setCustomValidity('');
});


// Двигаем пин
effectLevelPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var maxLeftCoords = effectLeveline.offsetWidth;
  var minLeftCoords = 0;

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Ограничиваем перемещение пина
  var checkLimits = function (shift) {
    if (effectLevelPin.offsetLeft > maxLeftCoords) {
      effectLevelPin.style.left = maxLeftCoords + 'px';
      effectLevelDepth.setAttribute('style', 'width:0');
    } else if (effectLevelPin.offsetLeft < minLeftCoords) {
      effectLevelPin.style.left = minLeftCoords + 'px';
    } else {
      effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift.x) + 'px';
      effectLevelDepth.setAttribute('style', 'width:' + effectLevelPin.style.left);
    }
  };

  var onPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    checkLimits(shift);

    // Меняем глубину эффекта при перемещнии пина
    var level = Math.floor((effectLevelPin.offsetLeft - shift.x) / maxLeftCoords * 100);
    effectLevelValue.setAttribute('value', level);
    var filterValue = level / 100;
    var effect = effectsList.querySelector('input[type=radio]:checked');

    switch (effect.id) {
      case 'effect-chrome':
        imgPreview.setAttribute('style', getFilterValue('grayscale', filterValue));
        break;
      case 'effect-sepia':
        imgPreview.setAttribute('style', getFilterValue('sepia', filterValue));
        break;
      case 'effect-marvin':
        imgPreview.setAttribute('style', getFilterValue('invert', level, '%'));
        break;
      case 'effect-phobos':
        filterValue = level * 5 / 100;
        imgPreview.setAttribute('style', getFilterValue('blur', filterValue, 'px'));
        break;
      case 'effect-heat':
        filterValue = level * 3 / 100;
        imgPreview.setAttribute('style', getFilterValue('brightness', filterValue));
        break;
    }
  };

  // Получаем имя и значание фильтра
  var getFilterValue = function (filter, value, units) {
    if (units) {
      return 'filter:' + filter + '(' + value + units + ')';
    } else {
      return 'filter:' + filter + '(' + value + ')';
    }
  };

  var onPinMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onPinMouseMove);
    document.removeEventListener('mouseup', onPinMouseUp);
  };

  document.addEventListener('mousemove', onPinMouseMove);
  document.addEventListener('mouseup', onPinMouseUp);
});


document.addEventListener('keydown', onDocumentEscKeydown);
document.addEventListener('keydown', onImgUploadEscKeydown);
