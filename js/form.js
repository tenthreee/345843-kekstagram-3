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
    TOO_MANY: 'Нельзя указать больше пяти хэш-тегов',
    SAME: 'Один и тот же хэш-тег не может быть использован дважды',
    NOT_HASH: 'Хэш-тег должен начинаться с символа #',
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
  var successButton = successTemplate.content.querySelector('.success__button');
  var errorTemplate = document.querySelector('#error');
  var error = errorTemplate.content.querySelector('.error');
  var errorButton = errorTemplate.content.querySelector('.error__button');


  // Закрываем форму редактирования изображения
  var closeImgUpload = function () {
    var focused = document.activeElement;

    if (focused !== textDescription && focused !== textHashtags) {
      imgUpload.classList.add('hidden');
      form.reset();

      document.removeEventListener('keydown', onImgUploadEscKeydown);
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
    closeImgUpload();
  };

  var onUploadCancelEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeImgUpload);
  };

  var onImgUploadEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeImgUpload);
  };


  // Показываем модалки
  var showSuccessModal = function () {
    closeImgUpload();
    var message = success.cloneNode(true);

    main.appendChild(message);
    successButton.addEventListener('click', onSuccessButtonClick);
    successButton.addEventListener('keydown', onSuccessButtonEnterKeydown);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.querySelector('.success').addEventListener('click', onSuccessClick);
  };

  var showErrorModal = function () {
    closeImgUpload();
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
    imgPreview.style = '';
    imgPreview.className = '';
    effectLevelDepth.style.width = '100%';
    effectLevelPin.style.left = '100%';
    effectLevelValue.value = '100';
    scaleControlValue.value = '100%';
  };


  // Открываем форму редактирования изображения
  var onFileUploadChange = function () {
    window.photo.getUserPhoto();
    imgUpload.classList.remove('hidden');
    effectLevel.classList.add('hidden');
    resetEffect();

    document.addEventListener('keydown', onImgUploadEscKeydown);
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


  // Применяем эффекты к фоточке
  var setEffect = function (effect) {
    resetEffect();
    effectLevel.classList.remove('hidden');
    imgPreview.classList.add('effects__preview--' + effect);
  };

  var switchEffects = function () {
    var effect = effectsList.querySelector('input[type=radio]:checked');

    switch (effect.id) {
      case 'effect-none':
        imgPreview.className = '';
        effectLevel.classList.add('hidden');
        break;
      case 'effect-chrome':
        setEffect(ImgEffect.CHROME.name);
        break;
      case 'effect-sepia':
        setEffect(ImgEffect.SEPIA.name);
        break;
      case 'effect-marvin':
        setEffect(ImgEffect.MARVIN.name);
        break;
      case 'effect-phobos':
        setEffect(ImgEffect.PHOBOS.name);
        break;
      case 'effect-heat':
        setEffect(ImgEffect.HEAT.name);
        break;
    }
  };

  var onEffecstListClick = function () {
    switchEffects();
  };


  // Прописываем уровень фильтра
  var setFilterValue = function (filter, value, units) {
    if (units) {
      return filter + '(' + value + units + ')';
    }

    return filter + '(' + value + ')';
  };


  // Меняем масштаб фоточки
  var setScale = function (value) {
    imgPreview.style.transform = 'scale(' + value / 100 + ')';
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
      var splitHashtags = userHashtags.split(' ');

      if (splitHashtags.length > Hashtag.MAX_NUMBER) {
        showValidationError(HashtagMessage.TOO_MANY);
      }

      for (var i = 0; i < splitHashtags.length; i++) {
        var currentHashtag = splitHashtags[i].toLowerCase();
        var sameHashtags = window.util.searchDuplicate(currentHashtag, splitHashtags);

        if (sameHashtags > 1) {
          showValidationError(HashtagMessage.SAME);
        }
        if (currentHashtag[0] !== '#') {
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
      }
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
      var level = effectLevelPinLeft;
      effectLevelValue.value = level;
      var filterValue = level / EffectValue.MAX;
      var effect = effectsList.querySelector('input[type=radio]:checked');

      switch (effect.id) {
        case 'effect-chrome':
          imgPreview.style.filter = setFilterValue(ImgEffect.CHROME.filter, filterValue);
          break;
        case 'effect-sepia':
          imgPreview.style.filter = setFilterValue(ImgEffect.SEPIA.filter, filterValue);
          break;
        case 'effect-marvin':
          filterValue = level;
          imgPreview.style.filter = setFilterValue(ImgEffect.MARVIN.filter, filterValue, ImgEffect.MARVIN.unit);
          break;
        case 'effect-phobos':
          filterValue = level * ImgEffect.PHOBOS.max / EffectValue.MAX;
          imgPreview.style.filter = setFilterValue(ImgEffect.PHOBOS.filter, filterValue, ImgEffect.PHOBOS.unit);
          break;
        case 'effect-heat':
          filterValue = level * ImgEffect.HEAT.max / EffectValue.MAX;
          imgPreview.style.filter = setFilterValue(ImgEffect.HEAT.filter, filterValue);
          break;
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
    imgPreview: imgPreview
  };

})();
