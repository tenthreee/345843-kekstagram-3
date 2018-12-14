'use strict';

(function () {
  var AVATAR_SIZE = '35';

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImage = bigPicture.querySelector('.big-picture__img');
  var bigPictureImg = bigPictureImage.querySelector('img');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var likesCount = bigPicture.querySelector('.likes-count');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var socialCommentLoad = bigPicture.querySelector('.comments-loader');
  var commentsList = bigPicture.querySelector('.social__comments');
  var bigPictureClose = bigPicture.querySelector('#picture-cancel');


  // Удаляем дефолтные комментарии из разметки
  var removeComment = function () {
    while (commentsList.firstChild) {
      commentsList.removeChild(commentsList.firstChild);
    }
  };


  // Создаём какой-нибудь элемент
  var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);

    if (text) {
      element.textContent = text;
    }

    return element;
  };


  // Создаём комментарий
  var createComment = function (comment) {
    var commentItem = makeElement('li', 'social__comment');
    var avatar = makeElement('img', 'social__picture');

    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    avatar.width = AVATAR_SIZE;
    avatar.height = AVATAR_SIZE;

    commentItem.appendChild(avatar);
    commentItem.appendChild(document.createTextNode(comment.message));

    return commentItem;
  };


  // Добавляем комментарий в разметку
  var addComments = function (picture) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < picture.comments.length; i++) {
      var comment = picture.comments[i];
      fragment.appendChild(createComment(comment));
    }

    commentsList.appendChild(fragment);
  };


  // Заполняем и показываем большую фоточку
  var fillOverlay = function (picture) {
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    commentsCount.textContent = picture.comments.length;
    socialCaption.textContent = picture.description;

    removeComment(); // Удаляем дефолтные комментарии из разметки
    addComments(picture);

    bigPicture.classList.remove('hidden');
    socialCommentCount.classList.add('visually-hidden');
    socialCommentLoad.classList.add('visually-hidden');
    document.addEventListener('keydown', onBigPictureEscKeydown);
  };


  // Функция, скрывающая большую фоточку
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
  };

  var onBigPictureCloseClick = function () {
    closeBigPicture();
  };

  var onBigPictureCloseEnterKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ENTER) {
      closeBigPicture();
    }
  };

  var onBigPictureEscKeydown = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
      closeBigPicture();
    }
  };

  bigPictureClose.addEventListener('click', onBigPictureCloseClick);
  bigPictureClose.addEventListener('keydown', onBigPictureCloseEnterKeydown);

  window.preview = {
    fillOverlay: fillOverlay
  };

})();
