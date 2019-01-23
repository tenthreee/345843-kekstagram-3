'use strict';

(function () {
  var NEW_PICTURES_COUNT = 10;

  var picturesList = document.querySelector('.pictures');
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var imageFilter = document.querySelector('.img-filters');
  var filterPopular = imageFilter.querySelector('#filter-popular');
  var filterNew = imageFilter.querySelector('#filter-new');
  var filterDiscussed = imageFilter.querySelector('#filter-discussed');
  var pictures = [];


  // Удаляем фотографии из разметки
  var removePictures = function () {
    var photos = picturesList.querySelectorAll('.picture');

    photos.forEach(function (elem) {
      picturesList.removeChild(elem);
    });
  };


  // Сортируем фотографии по количеству комментариев
  var sortPictures = function (photos) {
    var photosCopy = photos.slice();

    photosCopy.sort(function (first, second) {
      if (first.comments.length > second.comments.length) {
        return -1;
      } else if (first.comments.length < second.comments.length) {
        return 1;
      }

      return 0;
    });

    return photosCopy;
  };


  // Создаём болванку для превью фотографии
  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };


  // Отрисовываем фотографии
  var renderPictures = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (picture, index) {
      var currentPicture = getPicture(picture);

      currentPicture.dataset.id = index;
      fragment.appendChild(currentPicture);

      currentPicture.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.fillOverlay(photos[evt.currentTarget.dataset.id]);
      });
    });

    picturesList.appendChild(fragment);
  };


  // Показываем, какой фильтр выбран
  var activateButton = function (evt) {
    document.querySelectorAll('.img-filters__button').forEach(function (elem) {
      if (elem.classList.contains('img-filters__button--active')) {
        elem.classList.remove('img-filters__button--active');
      }
    });

    evt.target.classList.add('img-filters__button--active');
  };


  // Показываем популярные фотографии
  var showPopularPictures = window.debounce(function (photos) {
    removePictures();
    renderPictures(photos);
  });

  var onFilterPopularClick = function (evt) {
    activateButton(evt);
    showPopularPictures(pictures);
  };


  // Показываем обсуждаемые фотографии
  var showDiscussedPictures = window.debounce(function (photos) {
    var sortedPhotos = sortPictures(photos);

    removePictures();
    renderPictures(sortedPhotos);
  });

  var onFilterDiscussedClick = function (evt) {
    activateButton(evt);
    showDiscussedPictures(pictures);
  };


  // Показываем новые фотографии
  var showNewPictures = window.debounce(function (photos) {
    var newPhotos = photos.slice();
    window.util.shuffleArray(newPhotos);

    removePictures();
    renderPictures(newPhotos.slice(0, NEW_PICTURES_COUNT));
  });

  var onFilterNewClick = function (evt) {
    activateButton(evt);
    showNewPictures(pictures);
  };


  // Успешное выполнение запроса
  var onSuccsessDownload = function (array) {
    pictures = array.slice();

    removePictures();
    renderPictures(array);

    imageFilter.classList.remove('img-filters--inactive');
  };


  // Неуспешное выполнение запроса
  var onErrorDownload = function (errorMessage) {
    var message = window.form.error.cloneNode(true);

    window.form.main.appendChild(message);
    document.querySelector('.error__inner').removeChild(document.querySelector('.error__buttons'));
    document.querySelector('.error__title').textContent = errorMessage;

    document.addEventListener('keydown', onErrorEscKeydown);
    document.addEventListener('click', onErrorClick);
  };

  var onErrorEscKeydown = function (evt) {
    window.util.checkActionCode(evt, window.util.Keycode.ESC, closeErrorModal);
  };

  var onErrorClick = function () {
    closeErrorModal();
  };

  var closeErrorModal = function () {
    window.form.main.removeChild(document.querySelector('.error'));
    document.removeEventListener('keydown', onErrorEscKeydown);
    document.removeEventListener('click', onErrorClick);
  };


  // Получаем данные о фотографиях
  window.backend.downloadData(onSuccsessDownload, onErrorDownload);


  // Обработчки кликов по кнопкам сортировки
  filterPopular.addEventListener('click', onFilterPopularClick);
  filterNew.addEventListener('click', onFilterNewClick);
  filterDiscussed.addEventListener('click', onFilterDiscussedClick);

  window.picture = {
    onErrorDownload: onErrorDownload
  };

})();
