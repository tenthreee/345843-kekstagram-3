'use strict';

(function () {
  var NEW_PICTURES_COUNT = 10;

  var picturesList = document.querySelector('.pictures');
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');
  var filterPopular = document.querySelector('#filter-popular');
  var filterNew = document.querySelector('#filter-new');
  var filterDiscussed = document.querySelector('#filter-discussed');
  var pictures = [];


  // Удаляем фотографии из разметки
  var removePictures = function () {
    while (picturesList.querySelector('.picture')) {
      picturesList.removeChild(picturesList.querySelector('.picture'));
    }
  };


  // Сортируем фотки по количеству комментариев
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


  // Создаём болванку для превьюшки
  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };


  // Отрисовываем фотки
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


  // Успешное выполнение запроса
  var onSuccsessDownload = function (array) {
    removePictures();
    renderPictures(array, array.length);

    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  var onFilterPopularClick = function () {
    filterPopular.classList.add('img-filters__button--active');
    filterNew.classList.remove('img-filters__button--active');
    filterDiscussed.classList.remove('img-filters__button--active');
    window.backend.downLoad(onSuccsessDownload, onErrorDownload);
  };

  // Показываем обсуждаемые фотографии
  var showDiscussedPictures = function (array) {
    removePictures();

    pictures = array;
    var newArray = sortPictures(pictures);

    renderPictures(newArray, newArray.length);
  };

  var onFilterDiscussedClick = function () {
    filterDiscussed.classList.add('img-filters__button--active');
    filterNew.classList.remove('img-filters__button--active');
    filterPopular.classList.remove('img-filters__button--active');
    window.backend.downLoad(showDiscussedPictures, onErrorDownload);
  };

  // Показываем новые фотографии
  var showNewPictures = function (array) {
    removePictures();

    pictures = array;
    var newArray = window.util.shuffleArray(pictures);

    renderPictures(newArray, NEW_PICTURES_COUNT);
  };

  var onFilterNewClick = function () {
    filterNew.classList.add('img-filters__button--active');
    filterPopular.classList.remove('img-filters__button--active');
    filterDiscussed.classList.remove('img-filters__button--active');
    window.backend.downLoad(showNewPictures, onErrorDownload);
  };


  // Неуспешное выполнение запроса
  var onErrorDownload = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.downLoad(onSuccsessDownload, onErrorDownload);


  // Обработчки кликов по кнопкам сортировки
  filterPopular.addEventListener('click', onFilterPopularClick);
  filterNew.addEventListener('click', onFilterNewClick);
  filterDiscussed.addEventListener('click', onFilterDiscussedClick);
})();
