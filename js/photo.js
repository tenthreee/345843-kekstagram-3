'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var read = function () {
    var file = window.form.fileUpload.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.form.imagePreview.src = reader.result;
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
