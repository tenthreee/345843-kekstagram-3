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


  // Успешное выполнение запроса
  var onSuccsessDownload = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
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
})();
