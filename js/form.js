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
    MAX: 100,
    STEP: 10
  };

  var Effect = {
    NONE: {
      id: 'effect-none'
    },

    CHROME: {
      id: 'effect-chrome',
      class: 'effects__preview--chrome',
      filter: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },

    SEPIA: {
      id: 'effect-sepia',
      class: 'effects__preview--sepia',
      filter: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },

    MARVIN: {
      id: 'effect-marvin',
      class: 'effects__preview--marvin',
      filter: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },

    PHOBOS: {
      id: 'effect-phobos',
      class: 'effects__preview--phobos',
      filter: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },

    HEAT: {
      id: 'effect-heat',
      class: 'effects__preview--heat',
      filter: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  var HashtagMessage = {
    TOO_MANY: 'Нельзя указать больше пяти хэш-тегов. ',
    NO_SPACE: 'Хэш-теги должны разделяться пробелом. ',
    SAME: 'Один и тот же хэш-тег не может быть использован дважды. ',
    NOT_HASH: 'Хэш-тег должен начинаться с символа #. ',
    SHORT: 'Хэш-тег не может состоять только из одного символа. ',
    LONG: 'Максимальная длина одного хэш-тега — 20 символов, включая решётку. '
  };

  var HashtagSymbol = {
    START: '#',
    SPLIT: ' '
  };

  var DESCRIPTION_LENGTH = 140;

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
  var defaultEffect = effectsList.querySelector('#effect-none');
  var smallScaleControl = imageUpload.querySelector('.scale__control--smaller');
  var bigScaleControl = imageUpload.querySelector('.scale__control--bigger');
  var scaleControlValue = imageUpload.querySelector('.scale__control--value');
  var textDescription = imageUpload.querySelector('.text__description');
  var textHashtag = imageUpload.querySelector('.text__hashtags');
  var uploadSubmit = imageUpload.querySelector('#upload-submit');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var success = successTemplate.cloneNode(true);
  var successButton = success.querySelector('.success__button');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var error = errorTemplate.cloneNode(true);
  var errorButton = error.querySelector('.error__button');
  var activeEffect;


  // Закрываем форму редактирования изображения
  var closeImageUpload = function () {
    imageUpload.classList.add('hidden');
    textHashtag.style.outline = null;
    form.reset();

    document.removeEventListener('keydown', onImageUploadEscKeydown);
    uploadCancel.removeEventListener('click', onUploadCancelClick);
    uploadCancel.removeEventListener('keydown', onUploadCancelKeydown);
    effectsList.removeEventListener('click', onEffecstListClick);
    smallScaleControl.removeEventListener('click', onSmallScaleControlClick);
    bigScaleControl.removeEventListener('click', onBigScaleControlClick);
    uploadSubmit.removeEventListener('click', onUploadSubmitClick);
    form.removeEventListener('submit', onFormSubmit);
    textHashtag.removeEventListener('input', onTextHashtagInput);
    effectLevel.removeEventListener('click', onEffectLevelClick);
    effectLevelPin.removeEventListener('keydown', onEffectLevelPinLeftKeydown);
    effectLevelPin.removeEventListener('keydown', onEffectLevelPinRightKeydown);
  };

  var onUploadCancelClick = function () {
    closeImageUpload();
  };

  var onUploadCancelKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ENTER, closeImageUpload);
  };

  var onImageUploadEscKeydown = function (evt) {
    var focused = document.activeElement;

    if (focused !== textDescription && focused !== textHashtag) {
      window.util.checkActionCode(evt, window.util.Keycode.ESC, closeImageUpload);
    }
  };


  // Показываем модалки
  var showModal = function (modal) {
    closeImageUpload();
    main.appendChild(modal);
  };

  var showSuccessModal = function () {
    showModal(success);

    successButton.addEventListener('click', onSuccessButtonClick);
    successButton.addEventListener('keydown', onSuccessButtonEnterKeydown);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.addEventListener('click', onSuccessClick);
  };

  var showErrorModal = function () {
    showModal(error);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonEnterKeydown);
    document.addEventListener('keydown', onErrorEscKeydown);
    document.addEventListener('click', onErrorClick);
  };


  // Закрываем модалки
  var closeSuccessModal = function () {
    successButton.removeEventListener('click', onSuccessButtonClick);
    successButton.removeEventListener('keydown', onSuccessButtonEnterKeydown);

    main.removeChild(success);
    document.removeEventListener('keydown', onSuccessEscKeydown);
    document.removeEventListener('click', onSuccessClick);
  };

  var closeErrorModal = function () {
    errorButton.removeEventListener('click', onErrorButtonClick);
    errorButton.removeEventListener('keydown', onErrorButtonEnterKeydown);

    main.removeChild(error);
    document.removeEventListener('keydown', onErrorEscKeydown);
    document.removeEventListener('click', onErrorClick);
  };


  var onSuccessButtonClick = function () {
    closeSuccessModal();
  };

  var onErrorButtonClick = function () {
    closeErrorModal();
  };

  var onSuccessButtonEnterKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ENTER, closeSuccessModal);
  };

  var onErrorButtonEnterKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ENTER, closeErrorModal);
  };

  var onSuccessEscKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, closeSuccessModal);
  };

  var onErrorEscKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, closeErrorModal);
  };

  var onSuccessClick = function () {
    closeSuccessModal();
  };

  var onErrorClick = function () {
    closeErrorModal();
  };


  // Сбрасываем эффект
  var resetEffect = function () {
    if (activeEffect) {
      imagePreview.classList.remove(activeEffect.class);
    }

    imagePreview.style.filter = null;
    imagePreview.style.transform = null;
    effectLevelDepth.style.width = '100%';
    effectLevelPin.style.left = '100%';
    effectLevelValue.value = '100';
    scaleControlValue.value = '100%';
    effectLevel.classList.add('hidden');
  };


  // Открываем форму редактирования изображения
  var onFileUploadChange = function () {
    imageUpload.classList.remove('hidden');

    window.photo.read();
    textDescription.maxLength = DESCRIPTION_LENGTH;
    defaultEffect.checked = true;
    resetEffect();

    document.addEventListener('keydown', onImageUploadEscKeydown);
    uploadCancel.addEventListener('click', onUploadCancelClick);
    uploadCancel.addEventListener('keydown', onUploadCancelKeydown);
    effectsList.addEventListener('click', onEffecstListClick);
    smallScaleControl.addEventListener('click', onSmallScaleControlClick);
    bigScaleControl.addEventListener('click', onBigScaleControlClick);
    uploadSubmit.addEventListener('click', onUploadSubmitClick);
    form.addEventListener('submit', onFormSubmit);
    textHashtag.addEventListener('input', onTextHashtagInput);
    effectLevel.addEventListener('click', onEffectLevelClick);
    effectLevelPin.addEventListener('keydown', onEffectLevelPinLeftKeydown);
    effectLevelPin.addEventListener('keydown', onEffectLevelPinRightKeydown);
  };

  var onTextHashtagInput = function () {
    textHashtag.setCustomValidity('');
    textHashtag.style.outline = null;
  };


  // Применяем эффект к фоточке
  var getEffect = function (evt) {
    activeEffect = evt.target;

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

  var setEffect = function (evt) {
    resetEffect();

    activeEffect = getEffect(evt);

    if (activeEffect !== '') {
      effectLevel.classList.remove('hidden');
      imagePreview.classList.add(activeEffect.class);
      setFilterValue(activeEffect, activeEffect.max);
    }
  };

  var onEffecstListClick = function (evt) {
    setEffect(evt);
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

  var onSmallScaleControlClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value > Scale.MIN) {
      value -= Scale.STEP;
      setScale(value);
    }
  };

  var onBigScaleControlClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < Scale.MAX) {
      value += Scale.STEP;
      setScale(value);
    }
  };


  // Валидируем хэштеги
  var showValidationError = function (message) {
    textHashtag.setCustomValidity(message);
    textHashtag.style.outline = '1px solid red';
  };

  var onUploadSubmitClick = function () {
    var userHashtag = document.querySelector('.text__hashtags').value.toLowerCase().replace(/\s+/g, ' ').trim();

    if (userHashtag) {
      var splitHashtags = userHashtag.split(HashtagSymbol.SPLIT);
      var errorMessage = '';
      var isHashtagDuplicated = false;

      if (splitHashtags.length > Hashtag.MAX_NUMBER) {
        errorMessage += HashtagMessage.TOO_MANY;
      }

      splitHashtags.forEach(function (elem) {
        var hashtagSymbols = elem.trim().split('');
        var sameHashtagCount = window.util.searchDuplicate(elem, splitHashtags);
        var sharpCount = window.util.searchDuplicate(HashtagSymbol.START, hashtagSymbols);

        if (sharpCount > 1) {
          errorMessage += HashtagMessage.NO_SPACE;
        }
        if (sameHashtagCount > 1) {
          isHashtagDuplicated = true;
        }
        if (elem[0] !== HashtagSymbol.START) {
          errorMessage += HashtagMessage.NOT_HASH;
        }
        if (elem.length < Hashtag.MIN_LENGTH) {
          errorMessage += HashtagMessage.SHORT;
        }
        if (elem.length > Hashtag.MAX_LENGTH) {
          errorMessage += HashtagMessage.LONG;
        }
      });

      if (isHashtagDuplicated) {
        errorMessage += HashtagMessage.SAME;
      }

      if (errorMessage !== '') {
        showValidationError(errorMessage);
      }
    }
  };


  // Двигаем пин
  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      getFilterValue(moveEvt.clientX);
    };

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });


  // Получаем уровень фильтра
  var getFilterValue = function (coordinate) {
    var effectLevelPinLeft = Math.round((coordinate - effectLeveline.getBoundingClientRect().left) / effectLeveline.offsetWidth * 100);

    if (effectLevelPinLeft > EffectValue.MAX || effectLevelPinLeft < EffectValue.MIN) {
      return;
    }

    setStyle(effectLevelPinLeft);
  };

  var setStyle = function (value) {
    effectLevelPin.style.left = value + '%';
    effectLevelDepth.style.width = value + '%';

    var filterValue = activeEffect.min + (value / EffectValue.MAX) * (activeEffect.max - activeEffect.min);

    effectLevelValue.value = value;
    setFilterValue(activeEffect, filterValue);
  };


  // Отправляем данные из формы
  var onSuccsessUpload = function () {
    showSuccessModal();
  };

  var onErrorUpload = function () {
    showErrorModal();
  };

  var onFormSubmit = function (evt) {
    window.backend.uploadForm(new FormData(form), onSuccsessUpload, onErrorUpload);
    evt.preventDefault();
  };


  // Задаём уровень эффекта кликом
  var onEffectLevelClick = function (evt) {
    getFilterValue(evt.clientX);
  };


  // Меняем уровень эффека с клавиатуры
  var onEffectLevelPinLeftKeydown = function (evt) {
    var effectLevelPinPosition = parseInt(effectLevelPin.style.left, 10);

    if (evt.keyCode === window.util.Keycode.ARROW_LEFT && effectLevelPinPosition > EffectValue.MIN) {
      effectLevelPinPosition -= EffectValue.STEP;
      setStyle(effectLevelPinPosition);
    }

    if (effectLevelPinPosition <= EffectValue.MIN) {
      setStyle(EffectValue.MIN);
    }
  };

  var onEffectLevelPinRightKeydown = function (evt) {
    var effectLevelPinPosition = parseInt(effectLevelPin.style.left, 10);

    if (evt.keyCode === window.util.Keycode.ARROW_RIGHT && effectLevelPinPosition < EffectValue.MAX) {
      effectLevelPinPosition += EffectValue.STEP;
      setStyle(effectLevelPinPosition);
    }

    if (effectLevelPinPosition >= EffectValue.MAX) {
      setStyle(EffectValue.MAX);
    }
  };


  // Накидываем обработчики
  fileUpload.addEventListener('change', onFileUploadChange);

  window.form = {
    closeImageUpload: closeImageUpload,
    error: error,
    main: main
  };

})();
