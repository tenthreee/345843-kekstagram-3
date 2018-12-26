'use strict';

(function () {
  var AVATAR_SIZE = '35';
  var COMMENTS_COUNT = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('img');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var likesCount = bigPicture.querySelector('.likes-count');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var socialCommentLoad = bigPicture.querySelector('.comments-loader');
  var commentsList = bigPicture.querySelector('.social__comments');
  var bigPictureClose = bigPicture.querySelector('#picture-cancel');


  // Удаляем дефолтные комментарии из разметки
  var removeComment = function () {
    var comments = commentsList.querySelectorAll('.social__comment');
    var comment;

    comments.forEach(function (elem, index, array) {
      comment = array[index];
      commentsList.removeChild(comment);
    });
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
    var comments = picture.comments;

    if (comments.length > COMMENTS_COUNT) {
      for (var i = 0; i < COMMENTS_COUNT; i++) {
        var comment = comments[i];
        fragment.appendChild(createComment(comment));
      }
    } else {
      comments.forEach(function (elem, index, array) {
        comment = array[index];
        fragment.appendChild(createComment(comment));
      });
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

    if (picture.comments.length < COMMENTS_COUNT) {
      socialCommentCount.innerHTML = picture.comments.length + ' из <span class="comments-count">' + picture.comments.length + '</span> комментариев';
      socialCommentLoad.classList.add('visually-hidden');
    } else {
      socialCommentCount.innerHTML = COMMENTS_COUNT + ' из <span class="comments-count">' + picture.comments.length + '</span> комментариев';
      socialCommentLoad.classList.remove('visually-hidden');
    }

    document.addEventListener('keydown', onBigPictureEscKeydown);
    bigPictureClose.addEventListener('click', onBigPictureCloseClick);
    bigPictureClose.addEventListener('keydown', onBigPictureCloseEnterKeydown);
  };


  // Функция, скрывающая большую фоточку
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscKeydown);
    bigPictureClose.removeEventListener('click', onBigPictureCloseClick);
    bigPictureClose.removeEventListener('keydown', onBigPictureCloseEnterKeydown);
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

  window.preview = {
    fillOverlay: fillOverlay
  };

})();
