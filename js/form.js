'use strict';

(function () {
  var SCALE_STEP = 25;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var MAX_HASHTAGS = 5;
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;

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

    if (value > MIN_SCALE) {
      value -= SCALE_STEP;
      imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
      scaleControlValue.value = value + '%';
    } else if (value <= MIN_SCALE) {
      imgPreview.setAttribute('style', 'transform:scale(0.25)');
      scaleControlValue.value = value + '%';
    }
  };


  // Увеличиваем фоточку
  var onScaleControlBiggerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < MAX_SCALE - SCALE_STEP) {
      value += SCALE_STEP;
      imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
      scaleControlValue.value = value + '%';
    } else if (value >= MAX_SCALE - SCALE_STEP && value < MAX_SCALE) {
      value += SCALE_STEP;
      imgPreview.removeAttribute('style');
      scaleControlValue.value = value + '%';
    }
  };


  // Валидируем хэштеги
  var validateHashtags = function () {
    var userHashtags = document.querySelector('.text__hashtags').value;
    var splitHashtags = userHashtags.split(' ');

    if (splitHashtags.length > MAX_HASHTAGS) {
      textHashtags.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    }

    for (var i = 0; i < splitHashtags.length; i++) {
      var currentHashtag = splitHashtags[i].toLowerCase();
      var sameHashtags = window.util.searchDuplicate(currentHashtag, splitHashtags);

      if (sameHashtags > 1) {
        textHashtags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag[0] !== '#') {
        textHashtags.setCustomValidity('Хэш-тег должен начинаться с символа #');
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag.length < MIN_HASHTAG_LENGTH) {
        textHashtags.setCustomValidity('Хэш-тег не может состоять только из одного символа');
        textHashtags.style = 'border:1px solid red';
      }
      if (currentHashtag.length > MAX_HASHTAG_LENGTH) {
        textHashtags.setCustomValidity('Максимальная длина одного хэш-тега — 20 символов, включая решётку');
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

      if (effectLevelPinLeft > 100 || effectLevelPinLeft < 0) {
        return;
      }

      effectLevelPin.style.left = effectLevelPinLeft + '%';
      effectLevelDepth.style.width = effectLevelPinLeft + '%';

      // Меняем глубину эффекта при перемещнии пина
      var level = effectLevelPinLeft;
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

})();
