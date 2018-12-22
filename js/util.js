'use strict';

(function () {
  var Keycode = {
    ESC: 27,
    ENTER: 13
  };

  // Получаем случайное число
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };


  // Меняем местами два элемента в массиве
  var swapElements = function (array, firstElemIndex, secondElemIndex) {
    var temporaryValue = array[firstElemIndex];
    array[firstElemIndex] = array[secondElemIndex];
    array[secondElemIndex] = temporaryValue;
  };


  // Перемешиваем массив
  var shuffleArray = function (array) {
    array.forEach(function (elem, index, arr) {
      var randomIndex = getRandomNumber(0, arr.length - 1);
      swapElements(arr, index, randomIndex);
    });

    return array;
  };


  // Ищем дубль в массиве
  var searchDuplicate = function (elem, arr) {
    var duplicate = 0;

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === elem) {
        duplicate += 1;
      }
    }

    return duplicate;
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    swapElements: swapElements,
    shuffleArray: shuffleArray,
    searchDuplicate: searchDuplicate,
    Keycode: Keycode
  };

})();
