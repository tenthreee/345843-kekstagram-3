'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
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
    if (evt.keyCode === window.util.Keycode.ENTER) {
      closeImgUpload();
    }
  };

  // Закрываем форму редактирования изображения эскейпом
  var onImgUploadEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
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
      var sameHashtags = window.util.searchDuplicate(currentHashtag, splitHashtags);

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

})();
