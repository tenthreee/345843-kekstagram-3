'use strict';

(function () {
  var TYPES_OF_IMAGES = {
    'image/gif': '',
    'image/jpeg': '',
    'image/png': '',
    'image/jpg': ''
  };

  var imagePreview = document.querySelector('img');
  var fileUpload = document.querySelector('#upload-file');


  var read = function () {
    var file = fileUpload.files[0];

    var matches = Object.keys(TYPES_OF_IMAGES).some(function (type) {
      return file.type === type;
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imagePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    } else {
      window.form.closeImageUpload();
      window.picture.onErrorDownload('Неверный тип файла');
    }
  };

  window.photo = {
    read: read
  };

})();
