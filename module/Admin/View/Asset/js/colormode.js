"use strict";

var COLORMODE = {
  storage_key: 'colormode',
  attribute_key: 'data-colormode',
  value_default: 'default',
  value_dark: 'dark'
};

function setColorMode(isDarkMode) {
  if (isDarkMode) {
    document.body.setAttribute(COLORMODE.attribute_key, COLORMODE.value_dark);
    localStorage.setItem(COLORMODE.storage_key, COLORMODE.value_dark);
  } else {
    document.body.setAttribute(COLORMODE.attribute_key, COLORMODE.value_default);
    localStorage.setItem(COLORMODE.storage_key, COLORMODE.value_default);
  }

  return true;
}

if (window.matchMedia && localStorage.getItem(COLORMODE.storage_key) === null) {
  var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;
  setColorMode(isDarkMode);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
    var isDarkMode = event.matches ? true : false;
    setColorMode(isDarkMode);
  });
} else {
  var _isDarkMode = localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value_dark ? true : false;

  setColorMode(_isDarkMode);
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.colormode')) {
    return false;
  }

  event.preventDefault();
  var isDarkMode = localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value_dark ? true : false;
  setColorMode(!isDarkMode);
});