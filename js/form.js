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

  var Effect = {
    NONE: {
      id: 'effect-none'
    },

    CHROME: {
      id: 'effect-chrome',
      name: 'chrome',
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },

    SEPIA: {
      id: 'effect-sepia',
      name: 'sepia',
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },

    MARVIN: {
      id: 'effect-marvin',
      name: 'marvin',
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },

    PHOBOS: {
      id: 'effect-phobos',
      name: 'phobos',
      filter: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },

    HEAT: {
      id: 'effect-heat',
      name: 'heat',
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  var HashtagMessage = {
    TOO_MANY: 'Нельзя указать больше пяти хэш-тегов',
    SAME: 'Один и тот же хэш-тег не может быть использован дважды',
    NOT_HASH: 'Хэш-тег должен начинаться с символа #',
    SHORT: 'Хэш-тег не может состоять только из одного символа',
    LONG: 'Максимальная длина одного хэш-тега — 20 символов, включая решётку'
  };

  var HashtagSymbol = {
    START: '#',
    SPLIT: ' '
  };

  var picturesList = document.querySelector('.pictures');
  var form = picturesList.querySelector('.img-upload__form');
  var fileUpload = picturesList.querySelector('#upload-file');
  var imageUpload = picturesList.querySelector('.img-upload__overlay');
  var uploadCancel = imageUpload.querySelector('#upload-cancel');
  var effectLevel = imageUpload.querySelector('.effect-level');
  var effectLeveline = effectLevel.querySelector('.effect-level__line');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var imageUploadPreview = imageUpload.querySelector('.img-upload__preview');
  var imagePreview = imageUploadPreview.querySelector('img');
  var effectsList = imageUpload.querySelector('.effects__list');
  var scaleControlSmaller = imageUpload.querySelector('.scale__control--smaller');
  var scaleControlBigger = imageUpload.querySelector('.scale__control--bigger');
  var scaleControlValue = imageUpload.querySelector('.scale__control--value');
  var textDescription = imageUpload.querySelector('.text__description');
  var textHashtags = imageUpload.querySelector('.text__hashtags');
  var uploadSubmit = imageUpload.querySelector('#upload-submit');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success');
  var success = successTemplate.content.querySelector('.success');
  var successButton = successTemplate.content.querySelector('.success__button');
  var errorTemplate = document.querySelector('#error');
  var error = errorTemplate.content.querySelector('.error');
  var errorButton = errorTemplate.content.querySelector('.error__button');
  var activeEffect;


  // Закрываем форму редактирования изображения
  var closeimageUpload = function () {
    var focused = document.activeElement;

    if (focused !== textDescription && focused !== textHashtags) {
      imageUpload.classList.add('hidden');
      form.reset();

      document.removeEventListener('keydown', onimageUploadEscKeydown);
      uploadCancel.removeEventListener('click', onUploadCancelClick);
      uploadCancel.removeEventListener('keydown', onUploadCancelEnterKeydown);
      effectsList.removeEventListener('click', onEffecstListClick);
      scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
      scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
      uploadSubmit.removeEventListener('click', validateHashtags);
      form.removeEventListener('submit', onUploadSubmitClick);
      textHashtags.removeEventListener('input', onTextHashtagsInput);
    }
  };

  var onUploadCancelClick = function () {
    closeimageUpload();
  };

  var onUploadCancelEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeimageUpload);
  };

  var onimageUploadEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeimageUpload);
  };


  // Показываем модалки
  var showSuccessModal = function () {
    closeimageUpload();
    var message = success.cloneNode(true);

    main.appendChild(message);
    successButton.addEventListener('click', onSuccessButtonClick);
    successButton.addEventListener('keydown', onSuccessButtonEnterKeydown);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.querySelector('.success').addEventListener('click', onSuccessClick);
  };

  var showErrorModal = function () {
    closeimageUpload();
    var message = error.cloneNode(true);

    main.appendChild(message);
    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonEnterKeydown);
    document.addEventListener('keydown', onErrorEscKeydown);
    document.querySelector('.error').addEventListener('click', onErrorClick);
  };


  // Закрываем модалки
  var closeModal = function (modal) {
    main.removeChild(document.querySelector(modal));
  };

  var onSuccessButtonClick = function () {
    closeModal('.success');
  };

  var onErrorButtonClick = function () {
    closeModal('.error');
  };

  var onSuccessButtonEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeModal('.success'));
  };

  var onErrorButtonEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeModal('.error'));
  };

  var onSuccessEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeModal('.success'));
  };

  var onErrorEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeModal('.error'));
  };

  var onSuccessClick = function () {
    closeModal('.success');
  };

  var onErrorClick = function () {
    closeModal('.error');
  };


  // Сбрасываем эффект
  var resetEffect = function () {
    imagePreview.style = '';
    imagePreview.className = '';
    effectLevelDepth.style.width = '100%';
    effectLevelPin.style.left = '100%';
    effectLevelValue.value = '100';
    scaleControlValue.value = '100%';
    effectLevel.classList.add('hidden');
  };


  // Открываем форму редактирования изображения
  var onFileUploadChange = function () {
    window.photo.getUserPhoto();
    imageUpload.classList.remove('hidden');
    activeEffect = document.querySelector('#effect-none');
    activeEffect.checked = true;
    resetEffect();

    document.addEventListener('keydown', onimageUploadEscKeydown);
    uploadCancel.addEventListener('click', onUploadCancelClick);
    uploadCancel.addEventListener('keydown', onUploadCancelEnterKeydown);
    effectsList.addEventListener('click', onEffecstListClick);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    uploadSubmit.addEventListener('click', validateHashtags);
    form.addEventListener('submit', onUploadSubmitClick);
    textHashtags.addEventListener('input', onTextHashtagsInput);
  };

  var onTextHashtagsInput = function () {
    textHashtags.setCustomValidity('');
  };


  // Применяем эффект к фоточке
  var getEffect = function () {
    activeEffect = effectsList.querySelector('input[type=radio]:checked');

    switch (activeEffect.id) {
      case Effect.CHROME.id:
        return Effect.CHROME;
      case Effect.SEPIA.id:
        return Effect.SEPIA;
      case Effect.MARVIN.id:
        return Effect.MARVIN;
      case Effect.PHOBOS.id:
        return Effect.PHOBOS;
      case Effect.HEAT.id:
        return Effect.HEAT;
      default:
        return '';
    }
  };

  var setEffect = function () {
    resetEffect();

    var effect = getEffect();

    if (effect !== '') {
      effectLevel.classList.remove('hidden');
      imagePreview.classList.add('effects__preview--' + effect.name);
      setFilterValue(effect, effect.max);
    }
  };

  var onEffecstListClick = function () {
    setEffect();
  };


  // Задаём уровень фильтра
  var setFilterValue = function (effect, value) {
    imagePreview.style.filter = effect.filter + '(' + value + effect.unit + ')';
  };


  // Меняем масштаб фоточки
  var setScale = function (value) {
    imagePreview.style.transform = 'scale(' + value / 100 + ')';
    scaleControlValue.value = value + '%';
  };

  var onScaleControlSmallerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value > Scale.MIN) {
      value -= Scale.STEP;
      setScale(value);
    }
  };

  var onScaleControlBiggerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < Scale.MAX) {
      value += Scale.STEP;
      setScale(value);
    }
  };


  // Валидируем хэштеги
  var showValidationError = function (message) {
    textHashtags.setCustomValidity(message);
    textHashtags.style = 'border:1px solid red';
  };

  var validateHashtags = function () {
    var userHashtags = document.querySelector('.text__hashtags').value;

    if (userHashtags) {
      var splitHashtags = userHashtags.split(HashtagSymbol.SPLIT);

      if (splitHashtags.length > Hashtag.MAX_NUMBER) {
        showValidationError(HashtagMessage.TOO_MANY);
      }

      splitHashtags.forEach(function (elem) {
        var currentHashtag = elem.toLowerCase();
        var sameHashtags = window.util.searchDuplicate(currentHashtag, splitHashtags);

        if (sameHashtags > 1) {
          showValidationError(HashtagMessage.SAME);
        }
        if (currentHashtag[0] !== HashtagSymbol.START) {
          showValidationError(HashtagMessage.NOT_HASH);
        }
        if (currentHashtag.length < Hashtag.MIN_LENGTH) {
          showValidationError(HashtagMessage.SHORT);
        }
        if (currentHashtag.length > Hashtag.MAX_LENGTH) {
          showValidationError(HashtagMessage.LONG);
        } else {
          textHashtags.style = '';
        }
      });
    }
  };


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
      activeEffect = getEffect();
      var filterValue = activeEffect.min + (effectLevelPinLeft / EffectValue.MAX) * (activeEffect.max - activeEffect.min);

      effectLevelValue.value = effectLevelPinLeft;
      setFilterValue(activeEffect, filterValue);
    };

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });


  // Отправляем данные из формы
  var onSuccsessUpload = function () {
    showSuccessModal();
  };

  var onErrorUpload = function () {
    showErrorModal();
  };

  var onUploadSubmitClick = function (evt) {
    validateHashtags();

    window.backend.upLoad(new FormData(form), onSuccsessUpload, onErrorUpload);
    evt.preventDefault();
  };


  // Накидываем обработчики
  fileUpload.addEventListener('change', onFileUploadChange);

  window.form = {
    fileUpload: fileUpload,
    imagePreview: imagePreview,
    error: error,
    main: main
  };

})();
