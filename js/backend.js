'use strict';

(function () {

  var Url = {
    DOWNLOAD: 'https://js.dump.academy/kekstagram/data', // Получаем данные
    UPLOAD: 'https://js.dump.academy/kekstagram/' // Отправляем данные
  };

  var TIMEOUT = 10000;
  var okStatus = 200;

  var createXHR = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === okStatus) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);
  };

  // Получаем данные с сервера
  var downLoad = function (onLoad, onError) {
    createXHR(Url.DOWNLOAD, 'GET', onLoad, onError);
  };

  // Отправляем данные на сервер
  var upLoad = function (data, onLoad, onError) {
    createXHR(Url.UPLOAD, 'POST', onLoad, onError, data);
  };

  window.backend = {
    downLoad: downLoad,
    upLoad: upLoad
  };

})();
