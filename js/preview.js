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
  var currentPicture;


  // Удаляем дефолтные комментарии из разметки
  var removeComments = function () {
    commentsList.innerHTML = '';
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
    var comments = picture.comments.length > COMMENTS_COUNT ?
      picture.comments.slice(0, COMMENTS_COUNT) :
      picture.comments.slice();

    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment));
    });

    commentsList.appendChild(fragment);
  };

  var addMoreComments = function (picture) {
    var fragment = document.createDocumentFragment();
    var addedComments = document.querySelectorAll('.social__comment');
    var commentsCountToRender = picture.comments.length - addedComments.length;
    var comments = commentsCountToRender >= COMMENTS_COUNT ?
      picture.comments.slice(addedComments.length, addedComments.length + COMMENTS_COUNT) :
      picture.comments.slice(addedComments.length);
    var addedCommentsCount = addedComments.length + comments.length;

    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment));
    });

    if (addedCommentsCount === picture.comments.length) {
      socialCommentLoad.classList.add('visually-hidden');
    }

    socialCommentCount.innerHTML = addedCommentsCount + ' из <span class="comments-count">' + picture.comments.length + '</span> комментариев';
    commentsList.appendChild(fragment);
  };


  // Заполняем и показываем большую фоточку
  var fillOverlay = function (picture) {
    currentPicture = picture;
    bigPictureImg.src = picture.url;
    likesCount.textContent = picture.likes;
    commentsCount.textContent = picture.comments.length;
    socialCaption.textContent = picture.description;

    removeComments(); // Удаляем дефолтные комментарии из разметки
    addComments(picture);

    bigPicture.classList.remove('hidden');

    if (picture.comments.length < COMMENTS_COUNT) {
      socialCommentCount.innerHTML = picture.comments.length + ' из <span class="comments-count">' + picture.comments.length + '</span> комментариев';
      socialCommentLoad.classList.add('visually-hidden');
    } else {
      socialCommentCount.innerHTML = COMMENTS_COUNT + ' из <span class="comments-count">' + picture.comments.length + '</span> комментариев';
      socialCommentLoad.classList.remove('visually-hidden');
      socialCommentLoad.addEventListener('click', onSocialCommentLoadClick);
    }

    document.addEventListener('keydown', onBigPictureEscKeydown);
    bigPictureClose.addEventListener('click', onBigPictureCloseClick);
    bigPictureClose.addEventListener('keydown', onBigPictureCloseEnterKeydown);
  };


  // Cкрываем большую фоточку
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscKeydown);
    bigPictureClose.removeEventListener('click', onBigPictureCloseClick);
    bigPictureClose.removeEventListener('keydown', onBigPictureCloseEnterKeydown);
    socialCommentLoad.removeEventListener('click', onSocialCommentLoadClick);
  };

  var onBigPictureCloseClick = function () {
    closeBigPicture();
  };

  var onBigPictureCloseEnterKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ENTER, closeBigPicture);
  };

  var onBigPictureEscKeydown = function (evt) {
    window.util.checkKeyCodeForAction(evt, window.util.Keycode.ESC, closeBigPicture);
  };

  var onSocialCommentLoadClick = function () {
    addMoreComments(currentPicture);
  };

  window.preview = {
    fillOverlay: fillOverlay
  };

})();
