"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Translation = /*#__PURE__*/function () {
  function Translation(node) {
    _classCallCheck(this, Translation);

    this.node = node;
    this.data_action = this.node.hasAttribute('data-action') ? this.node.getAttribute('data-action') : window.location.href;
    this.initialize();
  }

  _createClass(Translation, [{
    key: "initialize",
    value: function initialize() {
      this.node.contentEditable = true;
      this.node.spellcheck = false;
      this.colorize();
      this.watchChanges();
    }
  }, {
    key: "colorize",
    value: function colorize() {
      var content = this.node.innerText; // cause memory problems with big files - need to improve
      // content = content.replace(/^(.+)[\s]*(=)[\s]*(")([^"]*)(")$/gmiu, '<span class="translation__key">$1</span> <span class="translation__equals">$2</span> <span class="translation__quote">$3</span><span class="translation__value">$4</span><span class="translation__quote">$5</span>');

      content = content.replace(/^(^[#;\|](?:(?![\n\[])[\s\S])*)/gmi, '<span class="translation__comment">$1</span>');
      this.node.innerHTML = content;
      return true;
    }
  }, {
    key: "watchChanges",
    value: function watchChanges() {
      var _this = this;

      this.node.addEventListener('focusout', function () {
        _this.postChanges();

        _this.colorize();
      });
      return true;
    }
  }, {
    key: "postChanges",
    value: function postChanges() {
      var _this$node$closest,
          _this2 = this;

      (_this$node$closest = this.node.closest('.spinner-action')) === null || _this$node$closest === void 0 ? void 0 : _this$node$closest.classList.add('spinner-action_active');
      fetch(this.data_action, {
        method: 'POST',
        body: this.getFormData()
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        SETTING.toast(data.status, data.message);
      }).catch(function (error) {
        SETTING.toast('error', error);
      }).finally(function () {
        var _this2$node$closest;

        (_this2$node$closest = _this2.node.closest('.spinner-action')) === null || _this2$node$closest === void 0 ? void 0 : _this2$node$closest.classList.remove('spinner-action_active');
      });
      return true;
    }
  }, {
    key: "getFormData",
    value: function getFormData() {
      var data = new FormData();
      data.set('body', this.node.innerText);
      data.set(SETTING.csrf.key, SETTING.csrf.token);
      return data;
    }
  }]);

  return Translation;
}();

document.querySelectorAll('.translation').forEach(function (element) {
  new Translation(element);
});