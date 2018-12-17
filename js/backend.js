'use strict';

(function () {

  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data'; // Получаем данные
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram/'; // Отправляем данные
  var timeout = 10000;

  var createXHR = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
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

    xhr.timeout = timeout;

    xhr.open(method, url);
    xhr.send(data);
  };

  // Получаем данные с сервера
  var downLoad = function (onLoad, onError) {
    createXHR(DOWNLOAD_URL, 'GET', onLoad, onError);
  };

  // Отправляем данные на сервер
  var upLoad = function (data, onLoad, onError) {
    createXHR(UPLOAD_URL, 'POST', onLoad, onError, data);
  };

  window.backend = {
    downLoad: downLoad,
    upLoad: upLoad
  };

})();
