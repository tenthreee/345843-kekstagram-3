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
    for (var i = 0; i < array.length; i++) {
      var randomIndex = getRandomNumber(0, array.length - 1);
      swapElements(array, i, randomIndex);
    }

    return array;
  };


  // Ищем дубль в массиве
  var searchDuplicate = function (elem, arr) {
    var dubl = 0;

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === elem) {
        dubl += 1;
      }
    }

    return dubl;
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    swapElements: swapElements,
    shuffleArray: shuffleArray,
    searchDuplicate: searchDuplicate,
    Keycode: Keycode
  };

})();
