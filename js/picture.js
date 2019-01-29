'use strict';

(function () {
  var Filter = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISCUSSED: 'filter-discussed'
  };

  var NEW_PICTURES_COUNT = 10;

  var picturesList = document.querySelector('.pictures');
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var imageFilter = document.querySelector('.img-filters');
  var imageFiltersForm = document.querySelector('.img-filters__form');
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
    var activeButton = document.querySelector('.img-filters__button--active');
    activeButton.classList.toggle('img-filters__button--active');

    evt.target.classList.add('img-filters__button--active');
  };


  // Показываем популярные фотографии
  var showPopularPictures = function (photos) {
    removePictures();
    renderPictures(photos);
  };


  // Показываем обсуждаемые фотографии
  var showDiscussedPictures = function (photos) {
    var sortedPhotos = sortPictures(photos);

    removePictures();
    renderPictures(sortedPhotos);
  };


  // Показываем новые фотографии
  var showNewPictures = function (photos) {
    var newPhotos = photos.slice();
    window.util.shuffleArray(newPhotos);

    removePictures();
    renderPictures(newPhotos.slice(0, NEW_PICTURES_COUNT));
  };


  // Переключаем фильтры
  var switchFilter = window.debounce(function (effect) {
    switch (effect.id) {
      case Filter.POPULAR:
        showPopularPictures(pictures);
        break;
      case Filter.NEW:
        showNewPictures(pictures);
        break;
      case Filter.DISCUSSED:
        showDiscussedPictures(pictures);
        break;
      default:
        break;
    }
  });

  var onImageFiltersFormClick = function (evt) {
    activateButton(evt);
    switchFilter(evt.target);
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
  imageFiltersForm.addEventListener('click', onImageFiltersFormClick);

  window.picture = {
    onErrorDownload: onErrorDownload
  };

})();
