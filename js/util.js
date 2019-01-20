'use strict';

(function () {
  var Keycode = {
    ESC: 27,
    ENTER: 13,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
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
  var searchDuplicate = function (element, array) {
    var duplicate = 0;

    array.forEach(function (elem, index, arr) {
      if (arr[index] === element) {
        duplicate += 1;
      }
    });

    return duplicate;
  };


  // Выполняем что-то по нажатию на какую-то кнопку
  var checkActionCode = function (evt, key, action) {
    if (evt.keyCode === key) {
      action();
    }
  };


  window.util = {
    getRandomNumber: getRandomNumber,
    swapElements: swapElements,
    shuffleArray: shuffleArray,
    searchDuplicate: searchDuplicate,
    checkActionCode: checkActionCode,
    Keycode: Keycode
  };

})();
