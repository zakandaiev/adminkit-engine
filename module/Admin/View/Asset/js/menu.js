"use strict";

var mainMenu = document.querySelector('ul.list-group.sortable');
var addMenuItem = document.getElementById('menu-add-item');
var addMenuItemBlank = document.getElementById('menu-item-blank');
addMenuItem === null || addMenuItem === void 0 ? void 0 : addMenuItem.addEventListener('click', function (event) {
  event.preventDefault();
  var newItem = addMenuItemBlank.cloneNode(true);
  newItem.classList.remove('hidden');
  newItem.removeAttribute('id');
  mainMenu.appendChild(newItem);
  makeSortable(newItem.querySelector('.sortable'));
});
document.addEventListener('click', function (event) {
  var itemRemove = event.target.closest('.menu-item__icon');

  if (itemRemove && itemRemove.classList.contains('feather-trash')) {
    fadeOut(itemRemove.closest('.menu-list'), false, 'editMenuItems');
  }

  if (event.target.closest('[data-bs-toggle]') || event.target.closest('[data-bs-toggle]')) {
    event.preventDefault();
  }
});
document.addEventListener('focusout', function (event) {
  if (event.target.classList.contains('menu-item__input')) {
    editMenuItems();
  }
});

function editMenuItems() {
  var menuItems = JSON.stringify(formatMenuItems(getMenuItems(mainMenu)));
  var spinner_body = document.querySelector('.spinner-action');
  spinner_body.classList.add('spinner-action_active');
  var data = new FormData();
  data.set('items', menuItems);
  data.set(SETTING.csrf.key, SETTING.csrf.token);
  fetch(spinner_body.getAttribute('data-menu-action'), {
    method: 'POST',
    body: data
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    SETTING.toast(data.status, data.message);
  }).catch(function (error) {
    SETTING.toast('error', error);
  }).finally(function () {
    spinner_body.classList.remove('spinner-action_active');
  });
}

function getMenuItems(menu) {
  var menuItems = [];
  menu.querySelectorAll('.menu-list').forEach(function (item) {
    var itemData = {
      name: '#',
      url: '#',
      parent: null,
      children: []
    };
    var parent_menu = item.closest('ul.list-group.sortable');

    if (parent_menu !== menu) {
      itemData.parent = getItemProp(parent_menu.previousElementSibling, 'name');
    }

    itemData.name = getItemProp(item, 'name');
    itemData.url = getItemProp(item, 'url');
    menuItems.push(itemData);
  });
  return menuItems;
}

function formatMenuItems() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var map = {},
      node,
      res = [],
      i;

  for (i = 0; i < arr.length; i += 1) {
    map[arr[i].name] = i;
    arr[i].children = [];
  }

  ;

  for (i = 0; i < arr.length; i += 1) {
    node = arr[i];

    if (node.parent) {
      arr[map[node.parent]].children.push(node);
    } else {
      res.push(node);
    }

    ;
  }

  ;
  return res;
}

function getItemProp(item) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'name';

  switch (type) {
    case 'name':
      {
        var _item$querySelector$v, _item$querySelector;

        return (_item$querySelector$v = (_item$querySelector = item.querySelector('.menu-item > input[name="name"]')) === null || _item$querySelector === void 0 ? void 0 : _item$querySelector.value) !== null && _item$querySelector$v !== void 0 ? _item$querySelector$v : '';
      }

    case 'url':
      {
        var _item$querySelector$v2, _item$querySelector2;

        return (_item$querySelector$v2 = (_item$querySelector2 = item.querySelector('.menu-item > input[name="url"]')) === null || _item$querySelector2 === void 0 ? void 0 : _item$querySelector2.value) !== null && _item$querySelector$v2 !== void 0 ? _item$querySelector$v2 : '';
      }

    default:
      {
        return null;
      }
  }
}