"use strict";

var COLORMODE = {
  storage_key: 'colormode_admin',
  attribute_key: 'data-colormode',
  value: 'dark'
};

function setColorMode(dark) {
  if (dark) {
    document.body.setAttribute(COLORMODE.attribute_key, COLORMODE.value);
    localStorage.setItem(COLORMODE.storage_key, COLORMODE.value);
  } else {
    document.body.removeAttribute(COLORMODE.attribute_key);
    localStorage.removeItem(COLORMODE.storage_key);
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
  var _isDarkMode = localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value ? true : false;

  setColorMode(_isDarkMode);
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.colormode')) {
    return false;
  }

  event.preventDefault();
  var isDarkMode = localStorage.getItem(COLORMODE.storage_key) === COLORMODE.value ? true : false;
  setColorMode(!isDarkMode);
});