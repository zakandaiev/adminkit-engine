"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var LoadMore = /*#__PURE__*/function () {
  function LoadMore(node) {
    var _SETTING;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, LoadMore);

    this.node = node;
    this.options = options;
    this.data_action = this.node.getAttribute('data-load-more');
    this.data_method = this.node.hasAttribute('data-method') ? this.node.getAttribute('data-method') : 'POST';
    this.data_event = this.node.hasAttribute('data-event') ? this.node.getAttribute('data-event') : 'click';
    this.data_target = this.node.getAttribute('data-target');
    this.data_target_position = this.node.hasAttribute('data-target-position') ? this.node.getAttribute('data-target-position') : 'beforeend';
    this.data_class = this.node.getAttribute('data-class');
    this.data_class_target = this.node.getAttribute('data-class-target');
    this.data_uri_key = this.node.hasAttribute('data-uri-key') ? this.node.getAttribute('data-uri-key') : 'page';
    this.data_page = this.node.hasAttribute('data-page') ? parseInt(this.node.getAttribute('data-page')) : 1;
    this.data_total = parseInt(this.node.getAttribute('data-total'));
    this.pagination_limit = parseInt((_SETTING = SETTING) === null || _SETTING === void 0 ? void 0 : _SETTING.pagination_limit);
    this.data_output = null;

    if (this.data_page * this.pagination_limit >= this.data_total) {
      this.node.remove();
    } else if (this.data_action && this.data_target && this.data_total && this.pagination_limit) {
      this.initialize();
    }
  }

  _createClass(LoadMore, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.node.addEventListener(this.data_event, function (event) {
        event.preventDefault();

        _this.disableNodes();

        var action = _this.data_action + '?' + _this.data_uri_key + '=' + ++_this.data_page;
        fetch(action, {
          method: _this.data_method,
          body: _this.getFormData()
        }).then(function (response) {
          return response.text();
        }).then(function (data) {
          _this.data_output = data;

          _this.output();
        }).catch(function (error) {
          SETTING.toast('error', error);
        }).finally(function () {
          _this.enableNodes();
        });
      });
    }
  }, {
    key: "getFormData",
    value: function getFormData() {
      var data = new FormData();
      var options = [];

      if (this.options.data) {
        options = options.concat(this.options.data);
      }

      options.forEach(function (field) {
        if (field.key) {
          data.set(field.key, field.value ? field.value : null);
        }
      });
      return data;
    }
  }, {
    key: "disableNodes",
    value: function disableNodes() {
      var _this2 = this;

      // DISABLE SELF
      this.node.setAttribute('disabled', 'disabled');
      this.node.classList.add('disabled'); // ADD CLASS TO TARGETS

      if (this.data_class && this.data_class_target) {
        document.querySelectorAll(this.data_class_target).forEach(function (target) {
          target.classList.add(_this2.data_class);
        });
      } else if (this.data_class) {
        this.node.classList.add(this.data_class);
      }

      return true;
    }
  }, {
    key: "enableNodes",
    value: function enableNodes() {
      var _this3 = this;

      // ENABLE SELF
      this.node.removeAttribute('disabled', 'disabled');
      this.node.classList.remove('disabled'); // REMOVE CLASS FROM TARGETS

      if (this.data_class && this.data_class_target) {
        document.querySelectorAll(this.data_class_target).forEach(function (target) {
          target.classList.remove(_this3.data_class);
        });
      } else if (this.data_class) {
        this.node.classList.remove(this.data_class);
      }

      return true;
    }
  }, {
    key: "output",
    value: function output() {
      var _feather;

      var target = document.querySelector(this.data_target);

      if (!target || !this.data_output) {
        return false;
      }

      target.insertAdjacentHTML(this.data_target_position, this.data_output);
      (_feather = feather) === null || _feather === void 0 ? void 0 : _feather.replace();

      if (this.data_page * this.pagination_limit >= this.data_total) {
        fadeOut(this.node);
      }

      return true;
    }
  }]);

  return LoadMore;
}();

document.querySelectorAll('[data-load-more]').forEach(function (element) {
  new LoadMore(element, {
    data: [{
      key: SETTING.csrf.key,
      value: SETTING.csrf.token
    }]
  });
});