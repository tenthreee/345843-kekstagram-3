'use strict';

(function () {
  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var Hashtag = {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    MAX_NUMBER: 5
  };

  var EffectValue = {
    MIN: 0,
    MAX: 100
  };

  var ImgEffect = {
    CHROME: {
      name: 'chrome',
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },

    SEPIA: {
      name: 'sepia',
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },

    MARVIN: {
      name: 'marvin',
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },

    PHOBOS: {
      name: 'phobos',
      filter: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },

    HEAT: {
      name: 'heat',
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  var HashtagMessage = {
    TOOMANY: 'Нельзя указать больше пяти хэш-тегов',
    SAME: 'Один и тот же хэш-тег не может быть использован дважды',
    NOTHASH: 'Хэш-тег должен начинаться с символа #',
    SHORT: 'Хэш-тег не может состоять только из одного символа',
    LONG: 'Максимальная длина одного хэш-тега — 20 символов, включая решётку'
  };

  var picturesList = document.querySelector('.pictures');
  var form = picturesList.querySelector('.img-upload__form');
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
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success');
  var success = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var error = errorTemplate.content.querySelector('.error');


  // Закрываем форму редактирования изображения
  var closeImgUpload = function () {
    var focused = document.activeElement;

    if (focused !== textDescription && focused !== textHashtags) {
      imgUpload.classList.add('hidden');
      form.reset();
    }
  };

  var onUploadCancelClick = function () {
    closeImgUpload();
  };

  var onUploadCancelEnterKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ENTER) {
      closeImgUpload();
    }
  };

  var onImgUploadEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
      closeImgUpload();
    }
  };


  // Закрываем модалки
  var closeSuccess = function () {
    main.removeChild(document.querySelector('.success'));
  };

  var closeError = function () {
    main.removeChild(document.querySelector('.error'));
  };

  var onSuccessButtonClick = function () {
    closeSuccess();
  };

  var onErrorButtonClick = function () {
    closeError();
  };

  var onSuccessButtonEnterKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ENTER) {
      closeSuccess();
    }
  };

  var onErrorButtonEnterKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ENTER) {
      closeError();
    }
  };

  var onSuccessEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
      closeSuccess();
    }
  };

  var onErrorEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
      closeError();
    }
  };

  var onSuccessClick = function () {
    closeSuccess();
  };

  var onErrorClick = function () {
    closeError();
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
    document.addEventListener('keydown', onImgUploadEscKeydown);
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
        imgPreview.classList.add('effects__preview--' + ImgEffect.CHROME.name);
        break;
      case 'effect-sepia':
        resetEffect();
        effectLevel.classList.remove('hidden');
        imgPreview.classList.add('effects__preview--' + ImgEffect.SEPIA.name);
        break;
      case 'effect-marvin':
        resetEffect();
        effectLevel.classList.remove('hidden');
        imgPreview.classList.add('effects__preview--' + ImgEffect.MARVIN.name);
        break;
      case 'effect-phobos':
        resetEffect();
        effectLevel.classList.remove('hidden');
        imgPreview.classList.add('effects__preview--' + ImgEffect.PHOBOS.name);
        break;
      case 'effect-heat':
        resetEffect();
        effectLevel.classList.remove('hidden');
        imgPreview.classList.add('effects__preview--' + ImgEffect.HEAT.name);
        break;
    }
  };

  var onEffecstListClick = function () {
    switchEffects();
  };

  // Уменьшаем фоточку
  var onScaleControlSmallerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value > Scale.MIN) {
      value -= Scale.STEP;
      imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
      scaleControlValue.value = value + '%';
    } else if (value <= Scale.MIN) {
      imgPreview.setAttribute('style', 'transform:scale(0.25)');
      scaleControlValue.value = value + '%';
    }
  };


  // Увеличиваем фоточку
  var onScaleControlBiggerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < Scale.MAX - Scale.STEP) {
      value += Scale.STEP;
      imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
      scaleControlValue.value = value + '%';
    } else if (value >= Scale.MAX - Scale.STEP && value < Scale.MAX) {
      value += Scale.STEP;
      imgPreview.removeAttribute('style');
      scaleControlValue.value = value + '%';
    }
  };


  // Валидируем хэштеги
  var validateHashtags = function () {
    var userHashtags = document.querySelector('.text__hashtags').value;
    var splitHashtags = userHashtags.split(' ');

    if (splitHashtags.length > Hashtag.MAX_NUMBER) {
      textHashtags.setCustomValidity(HashtagMessage.TOOMANY);
      textHashtags.style = 'border:1px solid red';
    }

    for (var i = 0; i < splitHashtags.length; i++) {
      var currentHashtag = splitHashtags[i].toLowerCase();
      var sameHashtags = window.util.searchDuplicate(currentHashtag, splitHashtags);

      if (sameHashtags > 1) {
        textHashtags.setCustomValidity(HashtagMessage.SAME);
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag[0] !== '#') {
        textHashtags.setCustomValidity(HashtagMessage.NOTHASH);
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag.length < Hashtag.MIN_LENGTH) {
        textHashtags.setCustomValidity(HashtagMessage.SHORT);
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag.length > Hashtag.MAX_LENGTH) {
        textHashtags.setCustomValidity(HashtagMessage.LONG);
        textHashtags.style = 'border:1px solid red';
      } else {
        textHashtags.style = '';
      }
    }
  };

  // Отправляем данные из формы
  var onUploadSubmitClick = function (evt) {
    validateHashtags();

    window.backend.upLoad(new FormData(form), onSuccsessUpload, onErrorUpload);
    evt.preventDefault();
  };

  var onSuccsessUpload = function () {
    closeImgUpload();
    var successMessage = success.cloneNode(true);

    main.appendChild(successMessage);
    document.querySelector('.success__button').addEventListener('click', onSuccessButtonClick);
    document.querySelector('.success__button').addEventListener('keydown', onSuccessButtonEnterKeydown);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.querySelector('.success').addEventListener('click', onSuccessClick);
  };

  var onErrorUpload = function () {
    closeImgUpload();
    var errorMessage = error.cloneNode(true);

    main.appendChild(errorMessage);
    document.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    document.querySelector('.error__button').addEventListener('keydown', onErrorButtonEnterKeydown);
    document.addEventListener('keydown', onErrorEscKeydown);
    document.querySelector('.error').addEventListener('click', onErrorClick);
  };


  // Накидываем обработчики
  fileUpload.addEventListener('change', onFileUploadChange);
  uploadCancel.addEventListener('click', onUploadCancelClick);
  uploadCancel.addEventListener('keydown', onUploadCancelEnterKeydown);
  effectsList.addEventListener('click', onEffecstListClick);
  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  uploadSubmit.addEventListener('click', validateHashtags);
  form.addEventListener('submit', onUploadSubmitClick);


  // — Нам точно это нужно делать при каждом срабатывании input?
  //
  // — Видимо, нет, раз ты спрашиваешь :) Меня устроило, как в этой реализации
  // появлялись сообщения, на ней я и остановилась :D
  textHashtags.addEventListener('input', function () {
    textHashtags.setCustomValidity('');
  });


  // Двигаем пин
  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startX - moveEvt.clientX;

      var effectLevelLineLeft = effectLeveline.getBoundingClientRect().left;
      var effectLevelPinLeft = Math.round((startX - shift - effectLevelLineLeft) / effectLeveline.offsetWidth * 100);

      if (effectLevelPinLeft > EffectValue.MAX || effectLevelPinLeft < EffectValue.MIN) {
        return;
      }

      effectLevelPin.style.left = effectLevelPinLeft + '%';
      effectLevelDepth.style.width = effectLevelPinLeft + '%';

      // Меняем глубину эффекта при перемещнии пина
      var level = effectLevelPinLeft;
      effectLevelValue.setAttribute('value', level);
      var filterValue = level / EffectValue.MAX;
      var effect = effectsList.querySelector('input[type=radio]:checked');

      switch (effect.id) {
        case 'effect-chrome':
          imgPreview.setAttribute('style', setFilterValue(ImgEffect.CHROME.filter, filterValue));
          break;
        case 'effect-sepia':
          imgPreview.setAttribute('style', setFilterValue(ImgEffect.SEPIA.filter, filterValue));
          break;
        case 'effect-marvin':
          filterValue = level;
          imgPreview.setAttribute('style', setFilterValue(ImgEffect.MARVIN.filter, filterValue, ImgEffect.MARVIN.unit));
          break;
        case 'effect-phobos':
          filterValue = level * ImgEffect.PHOBOS.max / EffectValue.MAX;
          imgPreview.setAttribute('style', setFilterValue(ImgEffect.PHOBOS.filter, filterValue, ImgEffect.PHOBOS.unit));
          break;
        case 'effect-heat':
          filterValue = level * ImgEffect.HEAT.max / EffectValue.MAX; // Не понимаю, как правильно посчитать значение для этого фильтра. И вообще нужна какая-то универсальная функция для подсчёта, наверное
          imgPreview.setAttribute('style', setFilterValue(ImgEffect.HEAT.filter, filterValue));
          break;
      }
    };

    // Ставим фильтр
    var setFilterValue = function (filter, value, units) {
      if (units) {
        return 'filter:' + filter + '(' + value + units + ')';
      }

      return 'filter:' + filter + '(' + value + ')';
    };

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

})();
