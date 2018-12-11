'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var template = document.querySelector('#picture');
  var pictureTemplate = template.content.querySelector('.picture');


  // Создаём болванку для превьюшки
  var getPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };


  // Отрисовываем фоточки
  var renderPictures = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var currentPicture = getPicture(array[i]);

      currentPicture.setAttribute('data-id', i);
      fragment.appendChild(currentPicture);

      currentPicture.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.fillOverlay(array[evt.currentTarget.dataset.id]);
      });
    }

    picturesList.appendChild(fragment);
  };

  var pictures = window.data.createPictures();
  renderPictures(pictures);

  window.picture = {
    renderPictures: renderPictures
  };

})();
