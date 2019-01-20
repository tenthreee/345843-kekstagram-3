'use strict';

(function () {

  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data'; // Получаем данные
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram/'; // Отправляем данные

  var TIMEOUT = 10000;
  var STATUS_OK = 200;

  var createXHR = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        return onLoad(xhr.response);
      }

      return onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
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
  var downloadData = function (onLoad, onError) {
    createXHR(DOWNLOAD_URL, 'GET', onLoad, onError);
  };

  // Отправляем данные на сервер
  var uploadForm = function (data, onLoad, onError) {
    createXHR(UPLOAD_URL, 'POST', onLoad, onError, data);
  };

  window.backend = {
    downloadData: downloadData,
    uploadForm: uploadForm
  };

})();
