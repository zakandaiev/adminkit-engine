"use strict";

function makeAlert(type, text) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;

  if (!text || !text.length) {
    return false;
  }

  var container = document.querySelector('.toasts');

  if (!container) {
    container = document.createElement('div');
    container.classList.add('toasts');
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.classList.add('toasts__item');

  if (type) {
    toast.classList.add(type);
  }

  var toast_icon = document.createElement('i');
  toast_icon.classList.add('toasts__icon');

  if (type) {
    toast_icon.classList.add(type);
  }

  var toast_text = document.createElement('span');
  toast_text.classList.add('toasts__text');
  toast_text.textContent = text;
  toast.appendChild(toast_icon);
  toast.appendChild(toast_text);
  container.appendChild(toast);
  toast.addEventListener('click', function () {
    return closeAlert(container, toast);
  });
  setTimeout(function () {
    return closeAlert(container, toast);
  }, time);
  return true;
}

function closeAlert(container, toast) {
  toast.classList.add('disappear');
  setTimeout(function () {
    toast.remove();

    if (container && container.childElementCount <= 0) {
      container.remove();
    }
  }, 500);
}