"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CustomField = /*#__PURE__*/function () {
  function CustomField(node) {
    var _this$node$getAttribu;

    _classCallCheck(this, CustomField);

    this.node = node;
    this.name = (_this$node$getAttribu = this.node.getAttribute('name')) === null || _this$node$getAttribu === void 0 ? void 0 : _this$node$getAttribu.replace('[]', '');
    this.store = document.querySelector('#page-custom-fields [name="custom_fields"]');

    if (this.name) {
      this.initialize();
    }
  }

  _createClass(CustomField, [{
    key: "initialize",
    value: function initialize() {
      var node_value = this.getStoreValue()[this.name];
      this.populateField(node_value);
    }
  }, {
    key: "getStoreValue",
    value: function getStoreValue() {
      var _this$store, _this$store$value;

      return (_this$store = this.store) !== null && _this$store !== void 0 && (_this$store$value = _this$store.value) !== null && _this$store$value !== void 0 && _this$store$value.length ? JSON.parse(this.store.value) : {};
    }
  }, {
    key: "populateField",
    value: function populateField() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (this.node.getAttribute('type') === 'file') {
        this.populateFile(value);
      } else {
        this.node.value = value;
      }

      return true;
    }
  }, {
    key: "populateFile",
    value: function populateFile() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (!value || !value.length) {
        return false;
      }

      var files = [];
      var value_files = value[0] === '[' ? JSON.parse(value) : [value];
      value_files.forEach(function (file) {
        files.push({
          value: file,
          poster: BASE_URL + '/' + file
        });
      });
      this.node.setAttribute('data-value', JSON.stringify(files));
      return true;
    }
  }]);

  return CustomField;
}();

document.querySelectorAll('#page-custom-fields [name]').forEach(function (element) {
  if (element.name === 'custom_fields' || element.closest('.foreign-form__body')) {
    return false;
  }

  new CustomField(element);
});