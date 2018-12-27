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

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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
  var showModal = function (template, modal, button) {
    closeImgUpload();
    var message = template.cloneNode(true);

    main.appendChild(message);
    document.querySelector(button).addEventListener('click', onSuccessButtonClick);
    document.querySelector(button).addEventListener('keydown', onSuccessButtonEnterKeydown);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.querySelector(modal).addEventListener('click', onSuccessClick);
  };


  // Закрываем модалки
  var closeModal = function (modal, button) {
    main.removeChild(document.querySelector(modal));

    document.querySelector(button).removeEventListener('click', onErrorButtonClick);
    document.querySelector(button).removeEventListener('keydown', onErrorButtonEnterKeydown);
    document.removeEventListener('keydown', onErrorEscKeydown);
    document.querySelector(modal).removeEventListener('click', onErrorClick);
  };

  var onSuccessButtonClick = function () {
    closeModal('.success', '.success__button');
  };

  var onErrorButtonClick = function () {
    closeModal('.error', '.error__button');
  };

  var onSuccessButtonEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeModal('.success', '.success__button'));
  };

  var onErrorButtonEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeModal('.error', '.error__button'));
  };

  var onSuccessEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeModal('.success', '.success__button'));
  };

  var onErrorEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeModal('.error', '.error__button'));
  };

  var onSuccessClick = function () {
    closeModal('.success', '.success__button');
  };

  var onErrorClick = function () {
    closeModal('.error', '.error__button');
  };


  // Сбрасываем эффект
  var resetEffect = function () {
    imgPreview.style = '';
    imgPreview.className = '';

    effectLevelDepth.setAttribute('style', 'width:100%');
    effectLevelPin.setAttribute('style', 'left:100%');
    effectLevelValue.setAttribute('value', '100');
    scaleControlValue.setAttribute('value', '100%');
  };


  // Открываем форму редактирования изображения
  var onFileUploadChange = function () {
    var file = fileUpload.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

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
      return 'filter:' + filter + '(' + value + units + ')';
    }

    return 'filter:' + filter + '(' + value + ')';
  };


  // Меняем масштаб фоточки
  var setScale = function (value) {
    if (value >= 100) {
      imgPreview.removeAttribute('style');
      scaleControlValue.value = value + '%';
    } else {
      imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
      scaleControlValue.value = value + '%';
    }
  };

  var onScaleControlSmallerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value > Scale.MIN) {
      value -= Scale.STEP;
      setScale(value);
    } else if (value <= Scale.MIN) {
      setScale(Scale.MIN);
    }
  };

  var onScaleControlBiggerClick = function () {
    var value = parseInt(scaleControlValue.value, 10);

    if (value < Scale.MAX - Scale.STEP) {
      value += Scale.STEP;
      setScale(value);
    } else if (value >= Scale.MAX - Scale.STEP && value < Scale.MAX) {
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
    showModal(success, '.success', '.success__button');
  };

  var onErrorUpload = function () {
    showModal(error, '.error', '.error__button');
  };

  var onUploadSubmitClick = function (evt) {
    validateHashtags();

    window.backend.upLoad(new FormData(form), onSuccsessUpload, onErrorUpload);
    evt.preventDefault();
  };


  // Накидываем обработчики
  fileUpload.addEventListener('change', onFileUploadChange);
})();
