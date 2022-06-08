"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CustomFields = /*#__PURE__*/function () {
  function CustomFields(node) {
    _classCallCheck(this, CustomFields);

    this.node = node;
    this.name = this.node.getAttribute('name');
    this.store = document.querySelector('#page-custom-fields [name="custom_fields"]');

    if (this.name && this.store) {
      this.initialize();
    }
  }

  _createClass(CustomFields, [{
    key: "initialize",
    value: function initialize() {
      var node_value = this.getStoreValue()[this.name];
      this.populateField(node_value);
      this.updateStore(node_value);
      this.watchChanges();
    }
  }, {
    key: "getStoreValue",
    value: function getStoreValue() {
      var _this$store$value;

      return (_this$store$value = this.store.value) !== null && _this$store$value !== void 0 && _this$store$value.length ? JSON.parse(this.store.value) : {};
    }
  }, {
    key: "populateField",
    value: function populateField() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.node.value = value;

      if (this.node.classList.contains('wysiwyg')) {
        this.node.quill.root.innerHTML = value;
      }

      return true;
    }
  }, {
    key: "updateStore",
    value: function updateStore() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var store_value = this.getStoreValue();
      store_value[this.name] = value;
      this.store.value = JSON.stringify(store_value);
      return true;
    }
  }, {
    key: "watchChanges",
    value: function watchChanges() {
      var _this = this;

      this.node.addEventListener('change', function () {
        _this.updateStore(_this.node.value);
      });

      if (this.node.classList.contains('wysiwyg')) {
        var _this$node;

        (_this$node = this.node) === null || _this$node === void 0 ? void 0 : _this$node.quill.on('editor-change', function () {
          _this.updateStore(_this.node.value);
        });
      }

      return true;
    }
  }]);

  return CustomFields;
}();

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#page-custom-fields [name]').forEach(function (element) {
    if (element.getAttribute('name') !== 'custom_fields') {
      new CustomFields(element);
    }
  });
});