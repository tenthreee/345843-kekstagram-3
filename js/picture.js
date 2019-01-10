'use strict';

(function () {
  var NEW_PICTURES_COUNT = 10;

  var picturesList = document.querySelector('.pictures');
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var imgFilters = document.querySelector('.img-filters');
  var filterPopular = imgFilters.querySelector('#filter-popular');
  var filterNew = imgFilters.querySelector('#filter-new');
  var filterDiscussed = imgFilters.querySelector('#filter-discussed');
  var picturesData = [];


  // Удаляем фотографии из разметки
  var removePictures = function () {
    var photos = picturesList.querySelectorAll('.picture');
    var photo;

    photos.forEach(function (elem, index, array) {
      photo = array[index];
      picturesList.removeChild(photo);
    });
  };


  // Сортируем фотографии по количеству комментариев
  var sortPictures = function (array) {
    var arrayCopy = array.slice();
    arrayCopy.sort(function (first, second) {
      if (first.comments.length > second.comments.length) {
        return -1;
      } else if (first.comments.length < second.comments.length) {
        return 1;
      } else {
        return 0;
      }
    });

    return arrayCopy;
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
  var renderPictures = function (array, length) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < length; i++) {
      var currentPicture = getPicture(array[i]);

      currentPicture.dataset.id = i;
      fragment.appendChild(currentPicture);

      currentPicture.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.fillOverlay(array[evt.currentTarget.dataset.id]);
      });
    }

    picturesList.appendChild(fragment);
  };


  // Показываем, какой фильтр выбран
  var activateButton = function (evt) {
    document.querySelectorAll('.img-filters__button').forEach(function (elem) {
      elem.classList.remove('img-filters__button--active');
    });

    evt.target.classList.add('img-filters__button--active');
  };


  // Показываем популярные фотографии
  var onFilterPopularClick = window.debounce(function (evt) {
    activateButton(evt);
    onSuccsessDownload(picturesData);
  });


  // Показываем обсуждаемые фотографии
  var showDiscussedPictures = function (array) {
    var newArray = sortPictures(array);

    removePictures();
    renderPictures(newArray, newArray.length);
  };

  var onFilterDiscussedClick = window.debounce(function (evt) {
    activateButton(evt);
    showDiscussedPictures(picturesData);
  });


  // Показываем новые фотографии
  var showNewPictures = function (array) {
    var newArray = window.util.shuffleArray(array);

    removePictures();
    renderPictures(newArray, NEW_PICTURES_COUNT);
  };

  var onFilterNewClick = window.debounce(function (evt) {
    activateButton(evt);
    showNewPictures(picturesData);
  });


  // Успешное выполнение запроса
  var onSuccsessDownload = function (array) {
    picturesData = array;

    removePictures();
    renderPictures(array, array.length);

    imgFilters.classList.remove('img-filters--inactive');
  };


  // Неуспешное выполнение запроса
  var onErrorDownload = function (errorMessage) {
    var message = window.form.error.cloneNode(true);

    window.form.main.appendChild(message);
    document.querySelector('.error__inner').removeChild(document.querySelector('.error__buttons'));
    document.querySelector('.error__title').textContent = errorMessage;
  };


  // Получаем данные о фотографиях
  window.backend.downLoad(onSuccsessDownload, onErrorDownload);


  // Обработчки кликов по кнопкам сортировки
  filterPopular.addEventListener('click', onFilterPopularClick);
  filterNew.addEventListener('click', onFilterNewClick);
  filterDiscussed.addEventListener('click', onFilterDiscussedClick);
})();
