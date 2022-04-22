"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// SETTINGS
var BASE_URL = window.location.protocol + '//' + window.location.host;
SETTING.loader = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
SETTING.image_placeholder = BASE_URL + '/module/Admin/View/Asset/img/no_image.jpg'; // FUNCTIONS

function SmoothScrollTo(element) {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // SMOOTH SCROLL
  document.querySelectorAll('a').forEach(function (anchor) {
    if (anchor.hasAttribute('target') && anchor.getAttribute('target') === '_blank') {
      anchor.setAttribute('rel', 'noopener noreferrer nofollow');
    }

    if (!anchor.hasAttribute('data-bs-toggle')) {
      anchor.addEventListener('click', function (event) {
        var anchor_href = event.currentTarget.getAttribute('href');

        if (anchor_href.charAt(0) === '#' || anchor_href.charAt(0) === '/' && anchor_href.charAt(1) === '#') {
          var scroll_to_node = document.querySelector(event.currentTarget.hash);

          if (scroll_to_node) {
            event.preventDefault();
            SmoothScrollTo(scroll_to_node);
          }
        }
      });
    }
  }); // RESPONSIVE TABLES

  document.querySelectorAll('table').forEach(function (table) {
    if (!table.parentElement.classList.contains('table-responsive')) {
      table.outerHTML = '<div class="table-responsive">' + table.outerHTML + '</div>';
    }
  }); // FILEPOND

  var pond_input_data = {
    files: function files(input) {
      var files = [];

      if (!input.hasAttribute('data-value')) {
        return files;
      }

      var input_files = input.getAttribute('data-value');

      if (!input_files || input_files == '[]') {
        return files;
      }

      input_files = JSON.parse(input_files);
      input_files.forEach(function (file) {
        var file_obj = {
          source: file.value,
          options: {
            type: 'local',
            metadata: {}
          }
        };

        if (pond_input_data.allowImagePreview(input)) {
          file_obj.options.metadata.poster = file.poster;
        }

        files.push(file_obj);
      });
      return files;
    },
    allowImagePreview: function allowImagePreview(input) {
      return input.getAttribute('data-preview') == 'false' ? false : true;
    },
    maxTotalFileSize: function maxTotalFileSize(input) {
      return input.hasAttribute('data-max-total-size') ? input.getAttribute('data-max-total-size') : null;
    },
    maxFileSize: function maxFileSize(input) {
      return input.hasAttribute('data-max-size') ? input.getAttribute('data-max-size') : null;
    },
    maxFiles: function maxFiles(input) {
      return input.hasAttribute('data-max-files') ? parseInt(input.getAttribute('data-max-files')) : null;
    },
    styleItemPanelAspectRatio: function styleItemPanelAspectRatio(input) {
      return input.hasAttribute('data-aspect-ratio') ? parseInt(input.getAttribute('data-aspect-ratio')) : 0.5625;
    }
  };
  var file_inputs = document.querySelectorAll('input[type="file"]');

  if (file_inputs) {
    file_inputs.forEach(function (input) {
      var pond = FilePond.create(input, {
        server: {
          load: '/upload?load='
        },
        storeAsFile: true,
        instantUpload: false,
        allowProcess: false,
        allowRevert: false,
        allowReorder: true,
        dropOnPage: true,
        dropOnElement: file_inputs.length == 1 ? false : true,
        files: pond_input_data.files(input),
        allowImagePreview: pond_input_data.allowImagePreview(input),
        maxTotalFileSize: pond_input_data.maxTotalFileSize(input),
        maxFileSize: pond_input_data.maxFileSize(input),
        maxFiles: pond_input_data.maxFiles(input),
        styleItemPanelAspectRatio: pond_input_data.styleItemPanelAspectRatio(input),
        credits: false
      });

      if (input.hasAttribute('data-placeholder')) {
        pond.setOptions({
          labelIdle: input.getAttribute('data-placeholder')
        });
      }
    });
  } // QUILL


  document.querySelectorAll('textarea[class*="wysiwyg"]').forEach(function (textarea) {
    textarea.classList.add("hidden");
    var wysiwyg_node = document.createElement('div');
    var quill_node = document.createElement('div');
    quill_node.innerHTML = textarea.value;
    wysiwyg_node.classList.add('wysiwyg');
    wysiwyg_node.appendChild(quill_node);
    textarea.after(wysiwyg_node);
    var quill = new Quill(quill_node, {
      modules: {
        toolbar: {
          container: [[{
            header: [2, 3, false]
          }], ['bold', 'italic', 'underline', 'strike'], [{
            'align': []
          }, {
            'list': 'ordered'
          }, {
            'list': 'bullet'
          }], [{
            'color': []
          }, {
            'background': []
          }], ['link', 'image', 'video', 'blockquote', 'code'], [{
            'indent': '-1'
          }, {
            'indent': '+1'
          }], [{
            'script': 'sub'
          }, {
            'script': 'super'
          }], ['clean'], ['expand']],
          handlers: {
            'image': function image(event) {
              uploadImage();
            },
            'expand': function expand(event) {
              wysiwyg_node.classList.contains('fullscreen') ? minimize() : maximize();
            }
          }
        }
      },
      placeholder: textarea.placeholder,
      readOnly: textarea.disabled ? true : false,
      theme: 'snow'
    }); // POPULATE
    // quill.setContents(JSON.parse(textarea.value).ops);
    // UPDATE TEXTAREA VALUE

    quill.on('editor-change', function (event) {
      // textarea.value = JSON.stringify(quill.getContents());
      textarea.value = quill.root.innerHTML;
    }); // EXPAND BUTTON

    var expand = wysiwyg_node.querySelector('.ql-expand');

    function maximize() {
      wysiwyg_node.classList.add('fullscreen');
      if (expand) expand.classList.add('active');
    }

    function minimize() {
      wysiwyg_node.classList.remove('fullscreen');
      if (expand) expand.classList.remove('active');
    } // IMAGE UPLOAD


    var Image = Quill.import('formats/image');
    Image.className = 'image-fluid';
    Quill.register(Image, true);

    function uploadImage() {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = function () {
        var file = input.files[0];

        if (file) {
          var formData = new FormData();
          formData.append('file', file);
          quill.enable(false);
          fetch('/upload', {
            method: 'POST',
            body: formData
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (data.status === 'success') {
              var selection = quill.getSelection().index;
              quill.insertEmbed(selection, 'image', BASE_URL + '/' + data.message);
              quill.setSelection(selection + 1);
            } else {
              makeAlert(data.status, data.message);
            }
          }).catch(function (error) {
            makeAlert('error', error);
          });
          quill.enable(true);
        }
      };
    }
  }); // SLIMSELECT

  var slimselect_data = {
    addable: function addable(select) {
      if (!select.hasAttribute('data-addable')) {
        return false;
      }

      return function (value) {
        var val = value;

        switch (select.getAttribute('data-addable')) {
          case 'tag':
            {
              val = value.replaceAll(/(?:(?![ 0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])[\s\S])+/gi, '').replaceAll(/[\s]+/g, ' ').trim();
              break;
            }

          default:
            {
              val = value.replaceAll(/[\s]+/g, ' ').trim();
              break;
            }
        }

        return val;
      };
    },
    allowDeselect: function allowDeselect(select) {
      return select.querySelector('option[data-placeholder]') ? true : false;
    },
    deselectLabel: function deselectLabel(select) {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-sm"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    },
    hideSelectedOption: function hideSelectedOption(select) {
      return select.multiple ? true : false;
    },
    closeOnSelect: function closeOnSelect(select) {
      return select.multiple ? false : true;
    },
    showSearch: function showSearch(select) {
      return select.querySelectorAll('option').length > 10 || select.hasAttribute('data-addable') ? true : false;
    },
    placeholder: function placeholder(select) {
      return select.hasAttribute('data-placeholder') ? select.getAttribute('data-placeholder') : null;
    },
    searchPlaceholder: function searchPlaceholder(select) {
      return select.hasAttribute('data-placeholder-search') ? select.getAttribute('data-placeholder-search') : null;
    },
    searchText: function searchText(select) {
      return select.hasAttribute('data-placeholder-search-text') ? select.getAttribute('data-placeholder-search-text') : null;
    }
  };
  document.querySelectorAll('select').forEach(function (select) {
    if (select.hasAttribute('data-native')) {
      return;
    }

    new SlimSelect({
      select: select,
      addable: slimselect_data.addable(select),
      allowDeselect: slimselect_data.allowDeselect(select),
      deselectLabel: slimselect_data.deselectLabel(select),
      // hideSelectedOption: slimselect_data.hideSelectedOption(select), // not work with optgroups
      closeOnSelect: slimselect_data.closeOnSelect(select),
      showSearch: slimselect_data.showSearch(select),
      placeholder: slimselect_data.placeholder(select),
      placeholderText: slimselect_data.placeholder(select),
      searchPlaceholder: slimselect_data.searchPlaceholder(select),
      searchText: slimselect_data.searchText(select),
      showContent: "down"
    });
  }); // SORTABLE

  document.querySelectorAll('[class*="sortable"]').forEach(function (element) {
    new Sortable(element, {
      handle: '.sortable__handle',
      animation: 150
    });
  }); // TOASTS

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
  } // FORMS


  document.querySelectorAll('form').forEach(function (form) {
    form.insertAdjacentHTML('beforeend', SETTING.loader);
    formBehavior(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      disableForm(form);
      var formData = new FormData(form);
      formData.set(SETTING.csrf.key, SETTING.csrf.token);
      fetch(form.action, {
        method: 'POST',
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.status === 'success') {
          if (form.hasAttribute('data-redirect')) {
            var redirect = form.getAttribute('data-redirect');

            if (redirect === 'this') {
              document.location.reload();
            } else {
              window.location.href = redirect;
            }
          }

          if (form.hasAttribute('data-reset')) {
            form.reset();
          }
        }

        makeAlert(data.status, data.message);
      }).catch(function (error) {
        makeAlert('error', error);
      });
      enableForm(form);
    });
  });

  function formBehavior(form) {
    var controls = form.querySelectorAll('[data-behavior]');

    function hideItems(control) {
      var hide = control.getAttribute('data-hide');

      if (control.getAttribute('type') === 'checkbox' && !control.checked) {
        if (hide) {
          hide += ',' + control.getAttribute('data-show');
        } else {
          hide = control.getAttribute('data-show');
        }
      }

      if (control.getAttribute('type') === 'radio' && !control.checked) {
        hide = null;
      }

      if (hide) {
        hide.split(',').forEach(function (to_hide) {
          var item = form.querySelector('[name="' + to_hide + '"]');
          var parent = item.parentElement;

          if (parent.classList.contains('form-control')) {
            parent.classList.add('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      }
    }

    function showItems(control) {
      var show = control.getAttribute('data-show');

      if (control.getAttribute('type') === 'checkbox' && !control.checked) {
        show = null;
      }

      if (control.getAttribute('type') === 'radio' && !control.checked) {
        show = null;
      }

      if (show) {
        show.split(',').forEach(function (to_show) {
          var item = form.querySelector('[name="' + to_show + '"]');
          var parent = item.parentElement;

          if (parent.classList.contains('form-control')) {
            parent.classList.remove('hidden');
          } else {
            item.classList.remove('hidden');
          }
        });
      }
    }

    controls.forEach(function (control) {
      // on form init
      if (control.getAttribute('data-behavior') === 'visibility') {
        hideItems(control);
        showItems(control);
      } // on form change


      control.addEventListener('change', function (event) {
        if (control.getAttribute('data-behavior') === 'visibility') {
          hideItems(control);
          showItems(control);
        }

        if (control.getAttribute('data-behavior') === 'cyr_to_lat') {
          if (control.hasAttribute('data-target')) {
            control.getAttribute('data-target').split(',').forEach(function (target) {
              var target_item = form.querySelector('[name=' + target + ']');

              if (target_item) {
                target_item.value = cyr_to_lat(control.value);
              }
            });
          } else {
            control.value = cyr_to_lat(control.value);
          }
        }

        if (control.getAttribute('data-behavior') === 'slug') {
          if (control.hasAttribute('data-target')) {
            control.getAttribute('data-target').split(',').forEach(function (target) {
              var target_item = form.querySelector('[name=' + target + ']');

              if (target_item) {
                target_item.value = slug(control.value);
              }
            });
          } else {
            control.value = slug(control.value);
          }
        }
      });
    });
  }

  function disableForm(form) {
    form.classList.add('submit');
    form.querySelector('[type="submit"]').disabled = true;
  }

  function enableForm(form) {
    form.classList.remove('submit');
    form.querySelector('[type="submit"]').disabled = false;
  } // DELETE BUTTONS


  var delete_buttons = document.querySelectorAll('[data-delete]');
  delete_buttons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      button.disabled = true;

      if (!button.hasAttribute('data-delete')) {
        return;
      }

      var confirmation = true;

      if (button.hasAttribute('data-confirm')) {
        confirmation = confirm(button.getAttribute('data-confirm'));
      }

      if (!confirmation) {
        return;
      }

      var formData = new FormData();
      formData.set(SETTING.csrf.key, SETTING.csrf.token);
      fetch(button.getAttribute('data-delete'), {
        method: 'POST',
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.status === 'success') {
          // Redirect
          if (button.hasAttribute('data-redirect')) {
            var redirect = button.getAttribute('data-redirect');

            if (redirect === 'this') {
              document.location.reload();
            } else {
              window.location.href = redirect;
            }
          } // Tables


          if (button.parentElement.classList.contains('table-action')) {
            // button.parentElement.parentElement.remove();
            function fadeOut(el) {
              el.style.opacity = 1;

              (function fade() {
                if ((el.style.opacity -= .1) < 0) {
                  el.style.display = "none";
                } else {
                  requestAnimationFrame(fade);
                }
              })();
            }

            ;
            fadeOut(button.parentElement.parentElement);
          } // Counter


          if (button.hasAttribute('data-counter')) {
            var counter = document.querySelector(button.getAttribute('data-counter'));
            counter.textContent = parseInt(counter.textContent) - 1;
          }
        }

        makeAlert(data.status, data.message);
      }).catch(function (error) {
        makeAlert('error', error);
      });
      button.disabled = false;
    });
  });

  var ForeignForm = /*#__PURE__*/function () {
    function ForeignForm(node) {
      _classCallCheck(this, ForeignForm);

      this.node = node;
      this.name = node.getAttribute('data-name');
      this.value = node.getAttribute('data-value');
      this.inputs = node.querySelectorAll('[name]');
      this.button = {
        submit: node.querySelector('[type="submit"]'),
        open_modal: document.createElement('span')
      };
      this.icon = {
        add: "<span class=\"badge bg-primary cursor-pointer\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-plus align-middle feather-sm\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line></svg></span>",
        sort: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-move\"><polyline points=\"5 9 2 12 5 15\"></polyline><polyline points=\"9 5 12 2 15 5\"></polyline><polyline points=\"15 19 12 22 9 19\"></polyline><polyline points=\"19 9 22 12 19 15\"></polyline><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"></line></svg>",
        edit: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-edit\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path></svg>",
        delete: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-trash\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg>"
      };
      this.uid = this.generateUid();
      this.store = document.createElement('input');
      this.table = document.createElement('table');
      this.tbody = document.createElement('tbody');
      this.is_editing = false;
      this.editing_row = null;
      this.initialize();
    }

    _createClass(ForeignForm, [{
      key: "initialize",
      value: function initialize() {
        var _this = this;

        // SET ID TO NODE
        this.node.setAttribute('id', this.uid); // SET UP MODAL BUTTON

        this.button.open_modal.setAttribute('data-bs-toggle', 'modal');
        this.button.open_modal.setAttribute('data-bs-target', '#' + this.uid);
        this.button.open_modal.innerHTML = this.icon.add;
        this.button.open_modal.addEventListener('click', function (event) {
          if (!_this.is_editing) {
            _this.resetEditingRow();
          }
        }); // SET UP STORE

        this.store.setAttribute('name', this.name);
        this.store.setAttribute('type', 'hidden');
        this.store.classList.add('hidden'); // SET UP TABLE

        this.table.classList.add('table');
        this.table.classList.add('table-sm');
        this.tbody.classList.add('sortable');
        new Sortable(this.tbody, {
          handle: '.sortable__handle',
          animation: 150,
          onSort: function onSort() {
            return _this.updateStore();
          }
        }); // SET UP SUMIT BUTTON

        this.button.submit.addEventListener('click', function (event) {
          event.preventDefault();

          _this.clickSubmit();

          _this.updateStore();

          _this.resetEditingRow();
        }); // RENDER

        this.populateTable();
        this.updateStore();
        this.render(); // RESET EDITING ROW IF MODAL CANCELED

        this.node.addEventListener('hidden.bs.modal', function () {
          return _this.resetEditingRow();
        });
      }
    }, {
      key: "clickSubmit",
      value: function clickSubmit() {
        var _this2 = this;

        // EDIT ROW
        if (this.is_editing) {
          this.inputs.forEach(function (input) {
            _this2.editing_row.querySelector("[data-name=\"".concat(input.name, "\"]")).textContent = input.value;
          });
          this.resetEditingRow();
          return true;
        } // ADD ROW


        this.tbody.appendChild(this.createRow());
        return true;
      }
    }, {
      key: "updateStore",
      value: function updateStore() {
        var data = [];
        this.tbody.querySelectorAll('tr').forEach(function (tr) {
          var obj = {};
          tr.querySelectorAll('td').forEach(function (td) {
            if (!td.hasAttribute('data-name')) {
              return false;
            }

            obj[td.getAttribute('data-name')] = td.textContent;
          });
          data.push(obj);
        });
        this.store.value = JSON.stringify(data);
        return true;
      }
    }, {
      key: "resetEditingRow",
      value: function resetEditingRow() {
        this.inputs.forEach(function (input) {
          if (input.tagName.toLowerCase() == 'select') {
            input.selectedIndex = 0;

            if (!input.hasAttribute('data-native')) {
              input.slim.set(input.value);
            }
          } else {
            input.value = '';
          }
        });
        this.is_editing = false;
        this.editing_row = null;
        return true;
      }
    }, {
      key: "createRow",
      value: function createRow() {
        var _this3 = this;

        var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var trow = document.createElement('tr');

        if (object) {
          for (var _i = 0, _Object$entries = Object.entries(object); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                key = _Object$entries$_i[0],
                value = _Object$entries$_i[1];

            var tcol = document.createElement('td');
            tcol.setAttribute('data-name', key);
            tcol.textContent = value;
            trow.appendChild(tcol);
          }
        } else {
          this.inputs.forEach(function (input) {
            var tcol = document.createElement('td');
            tcol.setAttribute('data-name', input.name);
            tcol.textContent = input.value;
            trow.appendChild(tcol);
          });
        }

        var tcol_actions = document.createElement('td');
        tcol_actions.classList.add('table-action');
        var btn_sort = document.createElement('span');
        var btn_edit = document.createElement('span');
        var btn_delete = document.createElement('span');
        btn_sort.innerHTML = this.icon.sort + ' ';
        btn_sort.classList.add('sortable__handle');
        btn_edit.innerHTML = this.icon.edit + ' ';
        btn_delete.innerHTML = this.icon.delete;
        btn_edit.addEventListener('click', function () {
          return _this3.clickEdit(trow);
        });
        btn_delete.addEventListener('click', function () {
          return _this3.clickDelete(trow);
        });
        tcol_actions.append(btn_sort);
        tcol_actions.append(btn_edit);
        tcol_actions.append(btn_delete);
        trow.appendChild(tcol_actions);
        return trow;
      }
    }, {
      key: "clickEdit",
      value: function clickEdit(trow) {
        var _this4 = this;

        this.inputs.forEach(function (input) {
          var value = trow.querySelector("[data-name=\"".concat(input.name, "\"]")).textContent;

          if (input.tagName.toLowerCase() == 'select' && !input.hasAttribute('data-native')) {
            input.slim.set(value);
          } else {
            input.value = value;
          }

          _this4.is_editing = true;
          _this4.editing_row = trow;

          _this4.button.open_modal.click();
        });
      }
    }, {
      key: "clickDelete",
      value: function clickDelete(trow) {
        trow.remove();
        this.updateStore();
      }
    }, {
      key: "populateTable",
      value: function populateTable() {
        var _this5 = this;

        if (!this.value) {
          return true;
        }

        var values = JSON.parse(this.value);
        values.forEach(function (value) {
          _this5.tbody.appendChild(_this5.createRow(value));
        });
        return true;
      }
    }, {
      key: "render",
      value: function render() {
        this.table.appendChild(this.tbody);
        this.node.before(this.button.open_modal);
        this.node.before(this.store);
        this.node.before(this.table);
        return true;
      }
    }, {
      key: "generateUid",
      value: function generateUid() {
        return 'ff-' + Math.random().toString(36).slice(2);
      }
    }]);

    return ForeignForm;
  }();

  document.querySelectorAll('[class*="foreign-form"]').forEach(function (element) {
    new ForeignForm(element);
  });
});

window.onload = function () {
  // HANDLE BROKEN IMAGES
  var images = document.querySelectorAll("img");
  images.forEach(function (image) {
    if (image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
      image.src = SETTING.image_placeholder;
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiQkFTRV9VUkwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaG9zdCIsIlNFVFRJTkciLCJsb2FkZXIiLCJpbWFnZV9wbGFjZWhvbGRlciIsIlNtb290aFNjcm9sbFRvIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3IiwiYmVoYXZpb3IiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImFuY2hvciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImV2ZW50IiwiYW5jaG9yX2hyZWYiLCJjdXJyZW50VGFyZ2V0IiwiY2hhckF0Iiwic2Nyb2xsX3RvX25vZGUiLCJxdWVyeVNlbGVjdG9yIiwiaGFzaCIsInByZXZlbnREZWZhdWx0IiwidGFibGUiLCJwYXJlbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJvdXRlckhUTUwiLCJwb25kX2lucHV0X2RhdGEiLCJmaWxlcyIsImlucHV0IiwiaW5wdXRfZmlsZXMiLCJKU09OIiwicGFyc2UiLCJmaWxlIiwiZmlsZV9vYmoiLCJzb3VyY2UiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJ0eXBlIiwibWV0YWRhdGEiLCJhbGxvd0ltYWdlUHJldmlldyIsInBvc3RlciIsInB1c2giLCJtYXhUb3RhbEZpbGVTaXplIiwibWF4RmlsZVNpemUiLCJtYXhGaWxlcyIsInBhcnNlSW50Iiwic3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbyIsImZpbGVfaW5wdXRzIiwicG9uZCIsIkZpbGVQb25kIiwiY3JlYXRlIiwic2VydmVyIiwibG9hZCIsInN0b3JlQXNGaWxlIiwiaW5zdGFudFVwbG9hZCIsImFsbG93UHJvY2VzcyIsImFsbG93UmV2ZXJ0IiwiYWxsb3dSZW9yZGVyIiwiZHJvcE9uUGFnZSIsImRyb3BPbkVsZW1lbnQiLCJsZW5ndGgiLCJjcmVkaXRzIiwic2V0T3B0aW9ucyIsImxhYmVsSWRsZSIsInRleHRhcmVhIiwiYWRkIiwid3lzaXd5Z19ub2RlIiwiY3JlYXRlRWxlbWVudCIsInF1aWxsX25vZGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImFmdGVyIiwicXVpbGwiLCJRdWlsbCIsIm1vZHVsZXMiLCJ0b29sYmFyIiwiY29udGFpbmVyIiwiaGVhZGVyIiwiaGFuZGxlcnMiLCJ1cGxvYWRJbWFnZSIsIm1pbmltaXplIiwibWF4aW1pemUiLCJwbGFjZWhvbGRlciIsInJlYWRPbmx5IiwiZGlzYWJsZWQiLCJ0aGVtZSIsIm9uIiwicm9vdCIsImV4cGFuZCIsInJlbW92ZSIsIkltYWdlIiwiaW1wb3J0IiwiY2xhc3NOYW1lIiwicmVnaXN0ZXIiLCJjbGljayIsIm9uY2hhbmdlIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImVuYWJsZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwic3RhdHVzIiwic2VsZWN0aW9uIiwiZ2V0U2VsZWN0aW9uIiwiaW5kZXgiLCJpbnNlcnRFbWJlZCIsIm1lc3NhZ2UiLCJzZXRTZWxlY3Rpb24iLCJtYWtlQWxlcnQiLCJjYXRjaCIsImVycm9yIiwic2xpbXNlbGVjdF9kYXRhIiwiYWRkYWJsZSIsInNlbGVjdCIsInZhbCIsInJlcGxhY2VBbGwiLCJ0cmltIiwiYWxsb3dEZXNlbGVjdCIsImRlc2VsZWN0TGFiZWwiLCJoaWRlU2VsZWN0ZWRPcHRpb24iLCJtdWx0aXBsZSIsImNsb3NlT25TZWxlY3QiLCJzaG93U2VhcmNoIiwic2VhcmNoUGxhY2Vob2xkZXIiLCJzZWFyY2hUZXh0IiwiU2xpbVNlbGVjdCIsInBsYWNlaG9sZGVyVGV4dCIsInNob3dDb250ZW50IiwiU29ydGFibGUiLCJoYW5kbGUiLCJhbmltYXRpb24iLCJ0ZXh0IiwidGltZSIsInRvYXN0IiwidG9hc3RfaWNvbiIsInRvYXN0X3RleHQiLCJ0ZXh0Q29udGVudCIsImNsb3NlQWxlcnQiLCJzZXRUaW1lb3V0IiwiY2hpbGRFbGVtZW50Q291bnQiLCJmb3JtIiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiZm9ybUJlaGF2aW9yIiwiZGlzYWJsZUZvcm0iLCJzZXQiLCJjc3JmIiwia2V5IiwidG9rZW4iLCJhY3Rpb24iLCJyZWRpcmVjdCIsInJlbG9hZCIsImhyZWYiLCJyZXNldCIsImVuYWJsZUZvcm0iLCJjb250cm9scyIsImhpZGVJdGVtcyIsImNvbnRyb2wiLCJoaWRlIiwiY2hlY2tlZCIsInNwbGl0IiwidG9faGlkZSIsIml0ZW0iLCJwYXJlbnQiLCJzaG93SXRlbXMiLCJzaG93IiwidG9fc2hvdyIsInRhcmdldCIsInRhcmdldF9pdGVtIiwiY3lyX3RvX2xhdCIsInNsdWciLCJkZWxldGVfYnV0dG9ucyIsImJ1dHRvbiIsImNvbmZpcm1hdGlvbiIsImNvbmZpcm0iLCJmYWRlT3V0IiwiZWwiLCJzdHlsZSIsIm9wYWNpdHkiLCJmYWRlIiwiZGlzcGxheSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNvdW50ZXIiLCJGb3JlaWduRm9ybSIsIm5vZGUiLCJuYW1lIiwiaW5wdXRzIiwic3VibWl0Iiwib3Blbl9tb2RhbCIsImljb24iLCJzb3J0IiwiZWRpdCIsImRlbGV0ZSIsInVpZCIsImdlbmVyYXRlVWlkIiwic3RvcmUiLCJ0Ym9keSIsImlzX2VkaXRpbmciLCJlZGl0aW5nX3JvdyIsImluaXRpYWxpemUiLCJyZXNldEVkaXRpbmdSb3ciLCJvblNvcnQiLCJ1cGRhdGVTdG9yZSIsImNsaWNrU3VibWl0IiwicG9wdWxhdGVUYWJsZSIsInJlbmRlciIsImNyZWF0ZVJvdyIsInRyIiwib2JqIiwidGQiLCJzdHJpbmdpZnkiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzZWxlY3RlZEluZGV4Iiwic2xpbSIsIm9iamVjdCIsInRyb3ciLCJPYmplY3QiLCJlbnRyaWVzIiwidGNvbCIsInRjb2xfYWN0aW9ucyIsImJ0bl9zb3J0IiwiYnRuX2VkaXQiLCJidG5fZGVsZXRlIiwiY2xpY2tFZGl0IiwiY2xpY2tEZWxldGUiLCJ2YWx1ZXMiLCJiZWZvcmUiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzbGljZSIsIm9ubG9hZCIsImltYWdlcyIsImltYWdlIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJzcmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFNQSxRQUFRLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsUUFBaEIsR0FBMkIsSUFBM0IsR0FBa0NGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkUsSUFBbkU7QUFFQUMsT0FBTyxDQUFDQyxNQUFSLEdBQWlCLDhHQUFqQjtBQUNBRCxPQUFPLENBQUNFLGlCQUFSLEdBQTRCUCxRQUFRLEdBQUcsMkNBQXZDLEMsQ0FFQTs7QUFDQSxTQUFTUSxjQUFULENBQXdCQyxPQUF4QixFQUFpQztBQUNoQyxNQUFHQSxPQUFILEVBQVk7QUFDWEEsSUFBQUEsT0FBTyxDQUFDQyxjQUFSLENBQXVCO0FBQ3JCQyxNQUFBQSxRQUFRLEVBQUU7QUFEVyxLQUF2QjtBQUdBO0FBQ0Q7O0FBRURDLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbkQ7QUFDQUQsRUFBQUEsUUFBUSxDQUFDRSxnQkFBVCxDQUEwQixHQUExQixFQUErQkMsT0FBL0IsQ0FBdUMsVUFBQUMsTUFBTSxFQUFJO0FBQ2hELFFBQUdBLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQixRQUFwQixLQUFpQ0QsTUFBTSxDQUFDRSxZQUFQLENBQW9CLFFBQXBCLE1BQWtDLFFBQXRFLEVBQWdGO0FBQy9FRixNQUFBQSxNQUFNLENBQUNHLFlBQVAsQ0FBb0IsS0FBcEIsRUFBMkIsOEJBQTNCO0FBQ0E7O0FBRUQsUUFBRyxDQUFDSCxNQUFNLENBQUNDLFlBQVAsQ0FBb0IsZ0JBQXBCLENBQUosRUFBMkM7QUFDMUNELE1BQUFBLE1BQU0sQ0FBQ0gsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQU8sS0FBSyxFQUFJO0FBQ3pDLFlBQU1DLFdBQVcs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aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG5cclxuU0VUVElORy5sb2FkZXIgPSAnPGRpdiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHRleHQtcHJpbWFyeVwiIHJvbGU9XCJzdGF0dXNcIj48c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPkxvYWRpbmcuLi48L3NwYW4+PC9kaXY+JztcclxuU0VUVElORy5pbWFnZV9wbGFjZWhvbGRlciA9IEJBU0VfVVJMICsgJy9tb2R1bGUvQWRtaW4vVmlldy9Bc3NldC9pbWcvbm9faW1hZ2UuanBnJztcclxuXHJcbi8vIEZVTkNUSU9OU1xyXG5mdW5jdGlvbiBTbW9vdGhTY3JvbGxUbyhlbGVtZW50KSB7XHJcblx0aWYoZWxlbWVudCkge1xyXG5cdFx0ZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XHJcblx0XHRcdFx0YmVoYXZpb3I6ICdzbW9vdGgnXHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblx0Ly8gU01PT1RIIFNDUk9MTFxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKS5mb3JFYWNoKGFuY2hvciA9PiB7XHJcblx0XHRpZihhbmNob3IuaGFzQXR0cmlidXRlKCd0YXJnZXQnKSAmJiBhbmNob3IuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKSA9PT0gJ19ibGFuaycpIHtcclxuXHRcdFx0YW5jaG9yLnNldEF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXIgbm9mb2xsb3cnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZighYW5jaG9yLmhhc0F0dHJpYnV0ZSgnZGF0YS1icy10b2dnbGUnKSkge1xyXG5cdFx0XHRhbmNob3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcblx0XHRcdFx0Y29uc3QgYW5jaG9yX2hyZWYgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG5cdFx0XHRcdGlmKGFuY2hvcl9ocmVmLmNoYXJBdCgwKSA9PT0gJyMnIHx8IChhbmNob3JfaHJlZi5jaGFyQXQoMCkgPT09ICcvJyAmJiBhbmNob3JfaHJlZi5jaGFyQXQoMSkgPT09ICcjJykpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHNjcm9sbF90b19ub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihldmVudC5jdXJyZW50VGFyZ2V0Lmhhc2gpO1xyXG5cdFx0XHRcdFx0aWYoc2Nyb2xsX3RvX25vZGUpIHtcclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0U21vb3RoU2Nyb2xsVG8oc2Nyb2xsX3RvX25vZGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIFJFU1BPTlNJVkUgVEFCTEVTXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGFibGUnKS5mb3JFYWNoKHRhYmxlID0+IHtcclxuXHRcdGlmKCF0YWJsZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndGFibGUtcmVzcG9uc2l2ZScpKSB7XHJcblx0XHRcdHRhYmxlLm91dGVySFRNTCA9ICc8ZGl2IGNsYXNzPVwidGFibGUtcmVzcG9uc2l2ZVwiPicgKyB0YWJsZS5vdXRlckhUTUwgKyAnPC9kaXY+JztcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gRklMRVBPTkRcclxuXHRjb25zdCBwb25kX2lucHV0X2RhdGEgPSB7XHJcblx0ZmlsZXM6IGlucHV0ID0+IHtcclxuXHRcdGxldCBmaWxlcyA9IFtdO1xyXG5cdFx0aWYoIWlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKSB7XHJcblx0XHRcdHJldHVybiBmaWxlcztcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaW5wdXRfZmlsZXMgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKTtcclxuXHJcblx0XHRpZighaW5wdXRfZmlsZXMgfHwgaW5wdXRfZmlsZXMgPT0gJ1tdJykge1xyXG5cdFx0XHRyZXR1cm4gZmlsZXM7XHJcblx0XHR9XHJcblxyXG5cdFx0aW5wdXRfZmlsZXMgPSBKU09OLnBhcnNlKGlucHV0X2ZpbGVzKTtcclxuXHRcdFxyXG5cdFx0aW5wdXRfZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuXHRcdFx0bGV0IGZpbGVfb2JqID0ge1xyXG5cdFx0XHRcdHNvdXJjZTogZmlsZS52YWx1ZSxcclxuXHRcdFx0XHRvcHRpb25zOiB7XHJcblx0XHRcdFx0XHR0eXBlOiAnbG9jYWwnLFxyXG5cdFx0XHRcdFx0bWV0YWRhdGE6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYocG9uZF9pbnB1dF9kYXRhLmFsbG93SW1hZ2VQcmV2aWV3KGlucHV0KSkge1xyXG5cdFx0XHRcdGZpbGVfb2JqLm9wdGlvbnMubWV0YWRhdGEucG9zdGVyID0gZmlsZS5wb3N0ZXI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbGVzLnB1c2goZmlsZV9vYmopO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBmaWxlcztcclxuXHR9LFxyXG5cdGFsbG93SW1hZ2VQcmV2aWV3OiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpZXcnKSA9PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlO1xyXG5cdH0sXHJcblx0bWF4VG90YWxGaWxlU2l6ZTogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYXgtdG90YWwtc2l6ZScpID8gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLW1heC10b3RhbC1zaXplJykgOiBudWxsO1xyXG5cdH0sXHJcblx0bWF4RmlsZVNpemU6IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWF4LXNpemUnKSA/IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXgtc2l6ZScpIDogbnVsbDtcclxuXHR9LFxyXG5cdG1heEZpbGVzOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW1heC1maWxlcycpID8gcGFyc2VJbnQoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLW1heC1maWxlcycpKSA6IG51bGw7XHJcblx0fSxcclxuXHRzdHlsZUl0ZW1QYW5lbEFzcGVjdFJhdGlvOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLWFzcGVjdC1yYXRpbycpID8gcGFyc2VJbnQoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWFzcGVjdC1yYXRpbycpKSA6IDAuNTYyNTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBmaWxlX2lucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJyk7XHJcblxyXG5pZihmaWxlX2lucHV0cykge1xyXG5cdGZpbGVfaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0Y29uc3QgcG9uZCA9IEZpbGVQb25kLmNyZWF0ZShcclxuXHRcdFx0aW5wdXQsIHtcclxuXHRcdFx0XHRzZXJ2ZXI6IHtsb2FkOiAnL3VwbG9hZD9sb2FkPSd9LFxyXG5cdFx0XHRcdHN0b3JlQXNGaWxlOiB0cnVlLFxyXG5cdFx0XHRcdGluc3RhbnRVcGxvYWQ6IGZhbHNlLFxyXG5cdFx0XHRcdGFsbG93UHJvY2VzczogZmFsc2UsXHJcblx0XHRcdFx0YWxsb3dSZXZlcnQ6IGZhbHNlLFxyXG5cdFx0XHRcdGFsbG93UmVvcmRlcjogdHJ1ZSxcclxuXHRcdFx0XHRkcm9wT25QYWdlOiB0cnVlLFxyXG5cdFx0XHRcdGRyb3BPbkVsZW1lbnQ6IGZpbGVfaW5wdXRzLmxlbmd0aCA9PSAxID8gZmFsc2UgOiB0cnVlLFxyXG5cdFx0XHRcdGZpbGVzOiBwb25kX2lucHV0X2RhdGEuZmlsZXMoaW5wdXQpLFxyXG5cdFx0XHRcdGFsbG93SW1hZ2VQcmV2aWV3OiBwb25kX2lucHV0X2RhdGEuYWxsb3dJbWFnZVByZXZpZXcoaW5wdXQpLFxyXG5cdFx0XHRcdG1heFRvdGFsRmlsZVNpemU6IHBvbmRfaW5wdXRfZGF0YS5tYXhUb3RhbEZpbGVTaXplKGlucHV0KSxcclxuXHRcdFx0XHRtYXhGaWxlU2l6ZTogcG9uZF9pbnB1dF9kYXRhLm1heEZpbGVTaXplKGlucHV0KSxcclxuXHRcdFx0XHRtYXhGaWxlczogcG9uZF9pbnB1dF9kYXRhLm1heEZpbGVzKGlucHV0KSxcclxuXHRcdFx0XHRzdHlsZUl0ZW1QYW5lbEFzcGVjdFJhdGlvOiBwb25kX2lucHV0X2RhdGEuc3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbyhpbnB1dCksXHJcblx0XHRcdFx0Y3JlZGl0czogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHRpZihpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKSkge1xyXG5cdFx0XHRwb25kLnNldE9wdGlvbnMoe1xyXG5cdFx0XHRcdGxhYmVsSWRsZTogaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJylcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcblx0Ly8gUVVJTExcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYVtjbGFzcyo9XCJ3eXNpd3lnXCJdJykuZm9yRWFjaCh0ZXh0YXJlYSA9PiB7XHJcblx0dGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuXHJcblx0Y29uc3Qgd3lzaXd5Z19ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0Y29uc3QgcXVpbGxfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdHF1aWxsX25vZGUuaW5uZXJIVE1MID0gdGV4dGFyZWEudmFsdWU7XHJcblxyXG5cdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QuYWRkKCd3eXNpd3lnJyk7XHJcblx0d3lzaXd5Z19ub2RlLmFwcGVuZENoaWxkKHF1aWxsX25vZGUpO1xyXG5cdHRleHRhcmVhLmFmdGVyKHd5c2l3eWdfbm9kZSk7XHJcblxyXG5cdGNvbnN0IHF1aWxsID0gbmV3IFF1aWxsKHF1aWxsX25vZGUsIHtcclxuXHRcdG1vZHVsZXM6IHtcclxuXHRcdFx0dG9vbGJhcjoge1xyXG5cdFx0XHRcdFx0Y29udGFpbmVyOiBbXHJcblx0XHRcdFx0XHRcdFt7IGhlYWRlcjogWzIsIDMsIGZhbHNlXSB9XSxcclxuXHRcdFx0XHRcdFx0Wydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlJ10sXHJcblx0XHRcdFx0XHRcdFt7J2FsaWduJzogW119LCB7J2xpc3QnOiAnb3JkZXJlZCd9LCB7J2xpc3QnOiAnYnVsbGV0J31dLFxyXG5cdFx0XHRcdFx0XHRbeydjb2xvcic6IFtdfSwgeydiYWNrZ3JvdW5kJzogW119XSxcclxuXHRcdFx0XHRcdFx0WydsaW5rJywgJ2ltYWdlJywgJ3ZpZGVvJywgJ2Jsb2NrcXVvdGUnLCAnY29kZSddLFxyXG5cdFx0XHRcdFx0XHRbeydpbmRlbnQnOiAnLTEnfSwgeydpbmRlbnQnOiAnKzEnfV0sXHJcblx0XHRcdFx0XHRcdFt7J3NjcmlwdCc6ICdzdWInfSwgeydzY3JpcHQnOiAnc3VwZXInfV0sXHJcblx0XHRcdFx0XHRcdFsnY2xlYW4nXSwgWydleHBhbmQnXVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGhhbmRsZXJzOiB7XHJcblx0XHRcdFx0XHRcdCdpbWFnZSc6IGV2ZW50ID0+IHtcclxuXHRcdFx0XHRcdFx0XHR1cGxvYWRJbWFnZSgpO1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQnZXhwYW5kJzogZXZlbnQgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGxzY3JlZW4nKSA/ICBtaW5pbWl6ZSgpIDogbWF4aW1pemUoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cGxhY2Vob2xkZXI6IHRleHRhcmVhLnBsYWNlaG9sZGVyLFxyXG5cdFx0cmVhZE9ubHk6IHRleHRhcmVhLmRpc2FibGVkID8gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0dGhlbWU6ICdzbm93J1xyXG5cdH0pO1xyXG5cclxuXHQvLyBQT1BVTEFURVxyXG5cdC8vIHF1aWxsLnNldENvbnRlbnRzKEpTT04ucGFyc2UodGV4dGFyZWEudmFsdWUpLm9wcyk7XHJcblxyXG5cdC8vIFVQREFURSBURVhUQVJFQSBWQUxVRVxyXG5cdHF1aWxsLm9uKCdlZGl0b3ItY2hhbmdlJywgZXZlbnQgPT4ge1xyXG5cdFx0Ly8gdGV4dGFyZWEudmFsdWUgPSBKU09OLnN0cmluZ2lmeShxdWlsbC5nZXRDb250ZW50cygpKTtcclxuXHRcdHRleHRhcmVhLnZhbHVlID0gcXVpbGwucm9vdC5pbm5lckhUTUw7XHJcblx0fSk7XHJcblxyXG5cdC8vIEVYUEFORCBCVVRUT05cclxuXHRjb25zdCBleHBhbmQgPSB3eXNpd3lnX25vZGUucXVlcnlTZWxlY3RvcignLnFsLWV4cGFuZCcpO1xyXG5cdGZ1bmN0aW9uIG1heGltaXplKCkge1xyXG5cdFx0d3lzaXd5Z19ub2RlLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdGlmKGV4cGFuZCkgZXhwYW5kLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBtaW5pbWl6ZSgpIHtcclxuXHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRpZihleHBhbmQpIGV4cGFuZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHR9XHJcblxyXG5cdC8vIElNQUdFIFVQTE9BRFxyXG5cdGNvbnN0IEltYWdlID0gUXVpbGwuaW1wb3J0KCdmb3JtYXRzL2ltYWdlJyk7XHJcblx0SW1hZ2UuY2xhc3NOYW1lID0gJ2ltYWdlLWZsdWlkJztcclxuXHRRdWlsbC5yZWdpc3RlcihJbWFnZSwgdHJ1ZSk7XHJcblxyXG5cdGZ1bmN0aW9uIHVwbG9hZEltYWdlKCkge1xyXG5cdFx0Y29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0aW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHRcdGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgJ2ltYWdlLyonKTtcclxuXHRcdGlucHV0LmNsaWNrKCk7XHJcblxyXG5cdFx0aW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcclxuXHJcblx0XHRcdGlmKGZpbGUpIHtcclxuXHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuXHJcblx0XHRcdFx0cXVpbGwuZW5hYmxlKGZhbHNlKTtcclxuXHJcblx0XHRcdFx0ZmV0Y2goJy91cGxvYWQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdFx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcblx0XHRcdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHNlbGVjdGlvbiA9IHF1aWxsLmdldFNlbGVjdGlvbigpLmluZGV4O1xyXG5cdFx0XHRcdFx0XHRxdWlsbC5pbnNlcnRFbWJlZChzZWxlY3Rpb24sICdpbWFnZScsIEJBU0VfVVJMICsgJy8nICsgZGF0YS5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdFx0cXVpbGwuc2V0U2VsZWN0aW9uKHNlbGVjdGlvbiArIDEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bWFrZUFsZXJ0KGRhdGEuc3RhdHVzLCBkYXRhLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmNhdGNoKGVycm9yID0+IHtcclxuXHRcdFx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHF1aWxsLmVuYWJsZSh0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcblx0Ly8gU0xJTVNFTEVDVFxyXG5cdGNvbnN0IHNsaW1zZWxlY3RfZGF0YSA9IHtcclxuXHRhZGRhYmxlOiBzZWxlY3QgPT4ge1xyXG5cdFx0aWYoIXNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtYWRkYWJsZScpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKHZhbHVlKSA9PiB7XHJcblx0XHRcdGxldCB2YWwgPSB2YWx1ZTtcclxuXHJcblx0XHRcdHN3aXRjaChzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkge1xyXG5cdFx0XHRcdGNhc2UgJ3RhZyc6IHtcclxuXHRcdFx0XHRcdHZhbCA9IHZhbHVlLnJlcGxhY2VBbGwoL1teXFxwe0x9XFxkIF0rL2dpdSwgJycpLnJlcGxhY2VBbGwoL1tcXHNdKy9nLCAnICcpLnRyaW0oKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0XHR2YWwgPSB2YWx1ZS5yZXBsYWNlQWxsKC9bXFxzXSsvZywgJyAnKS50cmltKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB2YWw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRhbGxvd0Rlc2VsZWN0OiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bZGF0YS1wbGFjZWhvbGRlcl0nKSA/IHRydWUgOiBmYWxzZTtcclxuXHR9LFxyXG5cdGRlc2VsZWN0TGFiZWw6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXItc21cIj48bGluZSB4MT1cIjE4XCIgeTE9XCI2XCIgeDI9XCI2XCIgeTI9XCIxOFwiPjwvbGluZT48bGluZSB4MT1cIjZcIiB5MT1cIjZcIiB4Mj1cIjE4XCIgeTI9XCIxOFwiPjwvbGluZT48L3N2Zz4nO1xyXG5cdH0sXHJcblx0aGlkZVNlbGVjdGVkT3B0aW9uOiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5tdWx0aXBsZSA/IHRydWUgOiBmYWxzZTtcclxuXHR9LFxyXG5cdGNsb3NlT25TZWxlY3Q6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gc2VsZWN0Lm11bHRpcGxlID8gZmFsc2UgOiB0cnVlO1xyXG5cdH0sXHJcblx0c2hvd1NlYXJjaDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiAoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbicpLmxlbmd0aCA+IDEwIHx8IHNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtYWRkYWJsZScpKSA/IHRydWUgOiBmYWxzZTtcclxuXHR9LFxyXG5cdHBsYWNlaG9sZGVyOiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKSA/IHNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKSA6IG51bGw7XHJcblx0fSxcclxuXHRzZWFyY2hQbGFjZWhvbGRlcjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaCcpID8gc2VsZWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlci1zZWFyY2gnKSA6IG51bGw7XHJcblx0fSxcclxuXHRzZWFyY2hUZXh0OiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXItc2VhcmNoLXRleHQnKSA/IHNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXItc2VhcmNoLXRleHQnKSA6IG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0JykuZm9yRWFjaChzZWxlY3QgPT4ge1xyXG5cdGlmKHNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmF0aXZlJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0XHJcblx0bmV3IFNsaW1TZWxlY3Qoe1xyXG5cdFx0c2VsZWN0OiBzZWxlY3QsXHJcblx0XHRhZGRhYmxlOiBzbGltc2VsZWN0X2RhdGEuYWRkYWJsZShzZWxlY3QpLFxyXG5cdFx0YWxsb3dEZXNlbGVjdDogc2xpbXNlbGVjdF9kYXRhLmFsbG93RGVzZWxlY3Qoc2VsZWN0KSxcclxuXHRcdGRlc2VsZWN0TGFiZWw6IHNsaW1zZWxlY3RfZGF0YS5kZXNlbGVjdExhYmVsKHNlbGVjdCksXHJcblx0XHQvLyBoaWRlU2VsZWN0ZWRPcHRpb246IHNsaW1zZWxlY3RfZGF0YS5oaWRlU2VsZWN0ZWRPcHRpb24oc2VsZWN0KSwgLy8gbm90IHdvcmsgd2l0aCBvcHRncm91cHNcclxuXHRcdGNsb3NlT25TZWxlY3Q6IHNsaW1zZWxlY3RfZGF0YS5jbG9zZU9uU2VsZWN0KHNlbGVjdCksXHJcblx0XHRzaG93U2VhcmNoOiBzbGltc2VsZWN0X2RhdGEuc2hvd1NlYXJjaChzZWxlY3QpLFxyXG5cdFx0cGxhY2Vob2xkZXI6IHNsaW1zZWxlY3RfZGF0YS5wbGFjZWhvbGRlcihzZWxlY3QpLFxyXG5cdFx0cGxhY2Vob2xkZXJUZXh0OiBzbGltc2VsZWN0X2RhdGEucGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHNlYXJjaFBsYWNlaG9sZGVyOiBzbGltc2VsZWN0X2RhdGEuc2VhcmNoUGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHNlYXJjaFRleHQ6IHNsaW1zZWxlY3RfZGF0YS5zZWFyY2hUZXh0KHNlbGVjdCksXHJcblx0XHRzaG93Q29udGVudDogXCJkb3duXCJcclxuXHR9KTtcclxufSk7XHJcblxyXG5cdC8vIFNPUlRBQkxFXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzKj1cInNvcnRhYmxlXCJdJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRuZXcgU29ydGFibGUoZWxlbWVudCwge1xyXG5cdFx0aGFuZGxlOiAnLnNvcnRhYmxlX19oYW5kbGUnLFxyXG5cdFx0YW5pbWF0aW9uOiAxNTBcclxuXHR9KTtcclxufSk7XHJcblxyXG5cdC8vIFRPQVNUU1xyXG5cdGZ1bmN0aW9uIG1ha2VBbGVydCh0eXBlLCB0ZXh0LCB0aW1lID0gNTAwMCkge1xyXG5cdGlmKCF0ZXh0IHx8ICF0ZXh0Lmxlbmd0aCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2FzdHMnKTtcclxuXHRpZighY29udGFpbmVyKSB7XHJcblx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b2FzdHMnKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHR9XHJcblxyXG5cdGxldCB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19faXRlbScpO1xyXG5cdGlmKHR5cGUpIHtcclxuXHRcdHRvYXN0LmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3RfaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHR0b2FzdF9pY29uLmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19faWNvbicpO1xyXG5cdGlmKHR5cGUpIHtcclxuXHRcdHRvYXN0X2ljb24uY2xhc3NMaXN0LmFkZCh0eXBlKTtcclxuXHR9XHJcblxyXG5cdGxldCB0b2FzdF90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cdHRvYXN0X3RleHQuY2xhc3NMaXN0LmFkZCgndG9hc3RzX190ZXh0Jyk7XHJcblx0dG9hc3RfdGV4dC50ZXh0Q29udGVudCA9IHRleHQ7XHJcblxyXG5cdHRvYXN0LmFwcGVuZENoaWxkKHRvYXN0X2ljb24pO1xyXG5cdHRvYXN0LmFwcGVuZENoaWxkKHRvYXN0X3RleHQpO1xyXG5cclxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xyXG5cclxuXHR0b2FzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCkpO1xyXG5cclxuXHRzZXRUaW1lb3V0KCgpID0+IGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCksIHRpbWUpO1xyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VBbGVydChjb250YWluZXIsIHRvYXN0KSB7XHJcblx0dG9hc3QuY2xhc3NMaXN0LmFkZCgnZGlzYXBwZWFyJyk7XHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHR0b2FzdC5yZW1vdmUoKTtcclxuXHRcdGlmKGNvbnRhaW5lciAmJiBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkge1xyXG5cdFx0XHRjb250YWluZXIucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fSwgNTAwKTtcclxufVxyXG5cclxuXHQvLyBGT1JNU1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKS5mb3JFYWNoKGZvcm0gPT4ge1xyXG5cdGZvcm0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBTRVRUSU5HLmxvYWRlcik7XHJcblxyXG5cdGZvcm1CZWhhdmlvcihmb3JtKTtcclxuXHJcblx0Zm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBldmVudCA9PiB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHJcblx0XHRkaXNhYmxlRm9ybShmb3JtKTtcclxuXHJcblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG5cdFx0Zm9ybURhdGEuc2V0KFNFVFRJTkcuY3NyZi5rZXksIFNFVFRJTkcuY3NyZi50b2tlbik7XHJcblxyXG5cdFx0ZmV0Y2goZm9ybS5hY3Rpb24sIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG5cdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdGlmKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRpZihmb3JtLmhhc0F0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpKSB7XHJcblx0XHRcdFx0XHRjb25zdCByZWRpcmVjdCA9IGZvcm0uZ2V0QXR0cmlidXRlKCdkYXRhLXJlZGlyZWN0Jyk7XHJcblx0XHRcdFx0XHRpZihyZWRpcmVjdCA9PT0gJ3RoaXMnKSB7XHJcblx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSByZWRpcmVjdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoZm9ybS5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVzZXQnKSkge1xyXG5cdFx0XHRcdFx0Zm9ybS5yZXNldCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bWFrZUFsZXJ0KGRhdGEuc3RhdHVzLCBkYXRhLm1lc3NhZ2UpO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnJvciA9PiB7XHJcblx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRlbmFibGVGb3JtKGZvcm0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGZvcm1CZWhhdmlvcihmb3JtKSB7XHJcblx0Y29uc3QgY29udHJvbHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWJlaGF2aW9yXScpO1xyXG5cclxuXHRmdW5jdGlvbiBoaWRlSXRlbXMoY29udHJvbCkge1xyXG5cdFx0bGV0IGhpZGUgPSBjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1oaWRlJyk7XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnY2hlY2tib3gnICYmICFjb250cm9sLmNoZWNrZWQpIHtcclxuXHRcdFx0aWYoaGlkZSkge1xyXG5cdFx0XHRcdGhpZGUgKz0gJywnICsgY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhpZGUgPSBjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1zaG93Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdyYWRpbycgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRoaWRlID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKGhpZGUpIHtcclxuXHRcdFx0aGlkZS5zcGxpdCgnLCcpLmZvckVhY2godG9faGlkZSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCInICsgdG9faGlkZSArICdcIl0nKTtcclxuXHRcdFx0XHRjb25zdCBwYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdFx0aWYocGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1jb250cm9sJykpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2hvd0l0ZW1zKGNvbnRyb2wpIHtcclxuXHRcdGxldCBzaG93ID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdHNob3cgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3JhZGlvJyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdHNob3cgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0aWYoc2hvdykge1xyXG5cdFx0XHRzaG93LnNwbGl0KCcsJykuZm9yRWFjaCh0b19zaG93ID0+IHtcclxuXHRcdFx0XHRjb25zdCBpdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cIicgKyB0b19zaG93ICsgJ1wiXScpO1xyXG5cdFx0XHRcdGNvbnN0IHBhcmVudCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcclxuXHRcdFx0XHRpZihwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWNvbnRyb2wnKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNvbnRyb2xzLmZvckVhY2goY29udHJvbCA9PiB7XHJcblx0XHQvLyBvbiBmb3JtIGluaXRcclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLWJlaGF2aW9yJykgPT09ICd2aXNpYmlsaXR5Jykge1xyXG5cdFx0XHRoaWRlSXRlbXMoY29udHJvbCk7XHJcblx0XHRcdHNob3dJdGVtcyhjb250cm9sKTtcclxuXHRcdH1cclxuXHRcdC8vIG9uIGZvcm0gY2hhbmdlXHJcblx0XHRjb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ3Zpc2liaWxpdHknKSB7XHJcblx0XHRcdFx0aGlkZUl0ZW1zKGNvbnRyb2wpO1xyXG5cdFx0XHRcdHNob3dJdGVtcyhjb250cm9sKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAnY3lyX3RvX2xhdCcpIHtcclxuXHRcdFx0XHRpZihjb250cm9sLmhhc0F0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG5cdFx0XHRcdFx0Y29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jykuc3BsaXQoJywnKS5mb3JFYWNoKHRhcmdldCA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldF9pdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT0nK3RhcmdldCsnXScpO1xyXG5cdFx0XHRcdFx0XHRpZih0YXJnZXRfaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdHRhcmdldF9pdGVtLnZhbHVlID0gY3lyX3RvX2xhdChjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wudmFsdWUgPSBjeXJfdG9fbGF0KGNvbnRyb2wudmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAnc2x1ZycpIHtcclxuXHRcdFx0XHRpZihjb250cm9sLmhhc0F0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG5cdFx0XHRcdFx0Y29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jykuc3BsaXQoJywnKS5mb3JFYWNoKHRhcmdldCA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldF9pdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT0nK3RhcmdldCsnXScpO1xyXG5cdFx0XHRcdFx0XHRpZih0YXJnZXRfaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdHRhcmdldF9pdGVtLnZhbHVlID0gc2x1Zyhjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wudmFsdWUgPSBzbHVnKGNvbnRyb2wudmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc2FibGVGb3JtKGZvcm0pIHtcclxuXHRmb3JtLmNsYXNzTGlzdC5hZGQoJ3N1Ym1pdCcpO1xyXG5cdGZvcm0ucXVlcnlTZWxlY3RvcignW3R5cGU9XCJzdWJtaXRcIl0nKS5kaXNhYmxlZCA9IHRydWU7XHJcbn1cclxuZnVuY3Rpb24gZW5hYmxlRm9ybShmb3JtKSB7XHJcblx0Zm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdzdWJtaXQnKTtcclxuXHRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJykuZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuLy8gREVMRVRFIEJVVFRPTlNcclxuY29uc3QgZGVsZXRlX2J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kZWxldGVdJyk7XHJcblxyXG5kZWxldGVfYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcblx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFxyXG5cdFx0YnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcblx0XHRpZighYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1kZWxldGUnKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNvbmZpcm1hdGlvbiA9IHRydWU7XHJcblx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWNvbmZpcm0nKSkge1xyXG5cdFx0XHRjb25maXJtYXRpb24gPSBjb25maXJtKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29uZmlybScpKTtcclxuXHRcdH1cclxuXHRcdGlmKCFjb25maXJtYXRpb24pIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG5cclxuXHRcdGZvcm1EYXRhLnNldChTRVRUSU5HLmNzcmYua2V5LCBTRVRUSU5HLmNzcmYudG9rZW4pO1xyXG5cclxuXHRcdGZldGNoKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVsZXRlJyksIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG5cdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdGlmKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHQvLyBSZWRpcmVjdFxyXG5cdFx0XHRcdGlmKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVkaXJlY3QnKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmVkaXJlY3QgPSBidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlZGlyZWN0Jyk7XHJcblx0XHRcdFx0XHRpZihyZWRpcmVjdCA9PT0gJ3RoaXMnKSB7XHJcblx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSByZWRpcmVjdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVGFibGVzXHJcblx0XHRcdFx0aWYoYnV0dG9uLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJsZS1hY3Rpb24nKSkge1xyXG5cdFx0XHRcdFx0Ly8gYnV0dG9uLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdGZ1bmN0aW9uIGZhZGVPdXQoZWwpIHtcclxuXHRcdFx0XHRcdFx0ZWwuc3R5bGUub3BhY2l0eSA9IDE7XHJcblx0XHRcdFx0XHRcdChmdW5jdGlvbiBmYWRlKCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgoZWwuc3R5bGUub3BhY2l0eSAtPSAuMSkgPCAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmYWRlKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pKCk7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0ZmFkZU91dChidXR0b24ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gQ291bnRlclxyXG5cdFx0XHRcdGlmKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtY291bnRlcicpKSB7XHJcblx0XHRcdFx0XHRjb25zdCBjb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvdW50ZXInKSk7XHJcblx0XHRcdFx0XHRjb3VudGVyLnRleHRDb250ZW50ID0gcGFyc2VJbnQoY291bnRlci50ZXh0Q29udGVudCkgLSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bWFrZUFsZXJ0KGRhdGEuc3RhdHVzLCBkYXRhLm1lc3NhZ2UpO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnJvciA9PiB7XHJcblx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5cdGNsYXNzIEZvcmVpZ25Gb3JtIHtcclxuXHRjb25zdHJ1Y3Rvcihub2RlKSB7XHJcblx0XHR0aGlzLm5vZGUgPSBub2RlO1xyXG5cdFx0dGhpcy5uYW1lID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpO1xyXG5cdFx0dGhpcy52YWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyk7XHJcblx0XHR0aGlzLmlucHV0cyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW25hbWVdJyk7XHJcblx0XHR0aGlzLmJ1dHRvbiA9IHtcclxuXHRcdFx0c3VibWl0OiBub2RlLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJyksXHJcblx0XHRcdG9wZW5fbW9kYWw6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG5cdFx0fTtcclxuXHRcdHRoaXMuaWNvbiA9IHtcclxuXHRcdFx0YWRkOiBgPHNwYW4gY2xhc3M9XCJiYWRnZSBiZy1wcmltYXJ5IGN1cnNvci1wb2ludGVyXCI+PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLXBsdXMgYWxpZ24tbWlkZGxlIGZlYXRoZXItc21cIj48bGluZSB4MT1cIjEyXCIgeTE9XCI1XCIgeDI9XCIxMlwiIHkyPVwiMTlcIj48L2xpbmU+PGxpbmUgeDE9XCI1XCIgeTE9XCIxMlwiIHgyPVwiMTlcIiB5Mj1cIjEyXCI+PC9saW5lPjwvc3ZnPjwvc3Bhbj5gLFxyXG5cdFx0XHRzb3J0OiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLW1vdmVcIj48cG9seWxpbmUgcG9pbnRzPVwiNSA5IDIgMTIgNSAxNVwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cIjkgNSAxMiAyIDE1IDVcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XCIxNSAxOSAxMiAyMiA5IDE5XCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVwiMTkgOSAyMiAxMiAxOSAxNVwiPjwvcG9seWxpbmU+PGxpbmUgeDE9XCIyXCIgeTE9XCIxMlwiIHgyPVwiMjJcIiB5Mj1cIjEyXCI+PC9saW5lPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjJcIiB4Mj1cIjEyXCIgeTI9XCIyMlwiPjwvbGluZT48L3N2Zz5gLFxyXG5cdFx0XHRlZGl0OiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLWVkaXRcIj48cGF0aCBkPVwiTTExIDRINGEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMnYtN1wiPjwvcGF0aD48cGF0aCBkPVwiTTE4LjUgMi41YTIuMTIxIDIuMTIxIDAgMCAxIDMgM0wxMiAxNWwtNCAxIDEtNCA5LjUtOS41elwiPjwvcGF0aD48L3N2Zz5gLFxyXG5cdFx0XHRkZWxldGU6IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJmZWF0aGVyIGZlYXRoZXItdHJhc2hcIj48cG9seWxpbmUgcG9pbnRzPVwiMyA2IDUgNiAyMSA2XCI+PC9wb2x5bGluZT48cGF0aCBkPVwiTTE5IDZ2MTRhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWNm0zIDBWNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyXCI+PC9wYXRoPjwvc3ZnPmBcclxuXHRcdH07XHJcblx0XHR0aGlzLnVpZCA9IHRoaXMuZ2VuZXJhdGVVaWQoKTtcclxuXHRcdHRoaXMuc3RvcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0dGhpcy50YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XHJcblx0XHR0aGlzLnRib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcclxuXHRcdHRoaXMuaXNfZWRpdGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5lZGl0aW5nX3JvdyA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKCkge1xyXG5cdFx0Ly8gU0VUIElEIFRPIE5PREVcclxuXHRcdHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy51aWQpO1xyXG5cclxuXHRcdC8vIFNFVCBVUCBNT0RBTCBCVVRUT05cclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuc2V0QXR0cmlidXRlKCdkYXRhLWJzLXRvZ2dsZScsICdtb2RhbCcpO1xyXG5cdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnMtdGFyZ2V0JywgJyMnICsgdGhpcy51aWQpO1xyXG5cdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5pbm5lckhUTUwgPSB0aGlzLmljb24uYWRkO1xyXG5cdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYoIXRoaXMuaXNfZWRpdGluZykge1xyXG5cdFx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFNFVCBVUCBTVE9SRVxyXG5cdFx0dGhpcy5zdG9yZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCB0aGlzLm5hbWUpO1xyXG5cdFx0dGhpcy5zdG9yZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcblx0XHR0aGlzLnN0b3JlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG5cclxuXHRcdC8vIFNFVCBVUCBUQUJMRVxyXG5cdFx0dGhpcy50YWJsZS5jbGFzc0xpc3QuYWRkKCd0YWJsZScpO1xyXG5cdFx0dGhpcy50YWJsZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1zbScpO1xyXG5cclxuXHRcdHRoaXMudGJvZHkuY2xhc3NMaXN0LmFkZCgnc29ydGFibGUnKTtcclxuXHRcdG5ldyBTb3J0YWJsZSh0aGlzLnRib2R5LCB7XHJcblx0XHRcdGhhbmRsZTogJy5zb3J0YWJsZV9faGFuZGxlJyxcclxuXHRcdFx0YW5pbWF0aW9uOiAxNTAsXHJcblx0XHRcdG9uU29ydDogKCkgPT4gdGhpcy51cGRhdGVTdG9yZSgpXHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBTRVQgVVAgU1VNSVQgQlVUVE9OXHJcblx0XHR0aGlzLmJ1dHRvbi5zdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHR0aGlzLmNsaWNrU3VibWl0KCk7XHJcblx0XHRcdHRoaXMudXBkYXRlU3RvcmUoKTtcclxuXHRcdFx0dGhpcy5yZXNldEVkaXRpbmdSb3coKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFJFTkRFUlxyXG5cdFx0dGhpcy5wb3B1bGF0ZVRhYmxlKCk7XHJcblx0XHR0aGlzLnVwZGF0ZVN0b3JlKCk7XHJcblx0XHR0aGlzLnJlbmRlcigpO1xyXG5cclxuXHRcdC8vIFJFU0VUIEVESVRJTkcgUk9XIElGIE1PREFMIENBTkNFTEVEXHJcblx0XHR0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaGlkZGVuLmJzLm1vZGFsJywgKCkgPT4gdGhpcy5yZXNldEVkaXRpbmdSb3coKSk7XHJcblx0fVxyXG5cclxuXHRjbGlja1N1Ym1pdCgpIHtcclxuXHRcdC8vIEVESVQgUk9XXHJcblx0XHRpZih0aGlzLmlzX2VkaXRpbmcpIHtcclxuXHRcdFx0dGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdFx0dGhpcy5lZGl0aW5nX3Jvdy5xdWVyeVNlbGVjdG9yKGBbZGF0YS1uYW1lPVwiJHtpbnB1dC5uYW1lfVwiXWApLnRleHRDb250ZW50ID0gaW5wdXQudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5yZXNldEVkaXRpbmdSb3coKTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFERCBST1dcclxuXHRcdHRoaXMudGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVSb3coKSk7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVTdG9yZSgpIHtcclxuXHRcdGxldCBkYXRhID0gW107XHJcblxyXG5cdFx0dGhpcy50Ym9keS5xdWVyeVNlbGVjdG9yQWxsKCd0cicpLmZvckVhY2godHIgPT4ge1xyXG5cdFx0XHRsZXQgb2JqID0ge307XHJcblxyXG5cdFx0XHR0ci5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpLmZvckVhY2godGQgPT4ge1xyXG5cdFx0XHRcdGlmKCF0ZC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9ialt0ZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpXSA9IHRkLnRleHRDb250ZW50O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGRhdGEucHVzaChvYmopO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5zdG9yZS52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cmVzZXRFZGl0aW5nUm93KCkge1xyXG5cdFx0dGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdGlmKGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnc2VsZWN0Jykge1xyXG5cdFx0XHRcdGlucHV0LnNlbGVjdGVkSW5kZXggPSAwO1xyXG5cdFx0XHRcdGlmKCFpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmF0aXZlJykpIHtcclxuXHRcdFx0XHRcdGlucHV0LnNsaW0uc2V0KGlucHV0LnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aW5wdXQudmFsdWUgPSAnJztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5pc19lZGl0aW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmVkaXRpbmdfcm93ID0gbnVsbDtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZVJvdyhvYmplY3QgPSBudWxsKSB7XHJcblx0XHRjb25zdCB0cm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuXHJcblx0XHRpZihvYmplY3QpIHtcclxuXHRcdFx0Zm9yKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XHJcblx0XHRcdFx0Y29uc3QgdGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcblxyXG5cdFx0XHRcdHRjb2wuc2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnLCBrZXkpO1xyXG5cdFx0XHRcdHRjb2wudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuXHJcblx0XHRcdFx0dHJvdy5hcHBlbmRDaGlsZCh0Y29sKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcblxyXG5cdFx0XHRcdHRjb2wuc2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnLCBpbnB1dC5uYW1lKTtcclxuXHRcdFx0XHR0Y29sLnRleHRDb250ZW50ID0gaW5wdXQudmFsdWU7XHJcblxyXG5cdFx0XHRcdHRyb3cuYXBwZW5kQ2hpbGQodGNvbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRjb2xfYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcblx0XHR0Y29sX2FjdGlvbnMuY2xhc3NMaXN0LmFkZCgndGFibGUtYWN0aW9uJyk7XHJcblxyXG5cdFx0Y29uc3QgYnRuX3NvcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblx0XHRjb25zdCBidG5fZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHRcdGNvbnN0IGJ0bl9kZWxldGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG5cdFx0YnRuX3NvcnQuaW5uZXJIVE1MID0gdGhpcy5pY29uLnNvcnQgKyAnICc7IGJ0bl9zb3J0LmNsYXNzTGlzdC5hZGQoJ3NvcnRhYmxlX19oYW5kbGUnKTtcclxuXHRcdGJ0bl9lZGl0LmlubmVySFRNTCA9IHRoaXMuaWNvbi5lZGl0ICsgJyAnO1xyXG5cdFx0YnRuX2RlbGV0ZS5pbm5lckhUTUwgPSB0aGlzLmljb24uZGVsZXRlO1xyXG5cclxuXHRcdGJ0bl9lZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jbGlja0VkaXQodHJvdykpO1xyXG5cdFx0YnRuX2RlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuY2xpY2tEZWxldGUodHJvdykpO1xyXG5cdFx0XHJcblx0XHR0Y29sX2FjdGlvbnMuYXBwZW5kKGJ0bl9zb3J0KTtcclxuXHRcdHRjb2xfYWN0aW9ucy5hcHBlbmQoYnRuX2VkaXQpO1xyXG5cdFx0dGNvbF9hY3Rpb25zLmFwcGVuZChidG5fZGVsZXRlKTtcclxuXHJcblx0XHR0cm93LmFwcGVuZENoaWxkKHRjb2xfYWN0aW9ucyk7XHJcblxyXG5cdFx0cmV0dXJuIHRyb3c7XHJcblx0fVxyXG5cclxuXHRjbGlja0VkaXQodHJvdykge1xyXG5cdFx0dGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJvdy5xdWVyeVNlbGVjdG9yKGBbZGF0YS1uYW1lPVwiJHtpbnB1dC5uYW1lfVwiXWApLnRleHRDb250ZW50O1xyXG5cclxuXHRcdFx0aWYoaW5wdXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09ICdzZWxlY3QnICYmICFpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmF0aXZlJykpIHtcclxuXHRcdFx0XHRpbnB1dC5zbGltLnNldCh2YWx1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5pc19lZGl0aW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5lZGl0aW5nX3JvdyA9IHRyb3c7XHJcblxyXG5cdFx0XHR0aGlzLmJ1dHRvbi5vcGVuX21vZGFsLmNsaWNrKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsaWNrRGVsZXRlKHRyb3cpIHtcclxuXHRcdHRyb3cucmVtb3ZlKCk7XHJcblx0XHR0aGlzLnVwZGF0ZVN0b3JlKCk7XHJcblx0fVxyXG5cclxuXHRwb3B1bGF0ZVRhYmxlKCkge1xyXG5cdFx0aWYoIXRoaXMudmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdmFsdWVzID0gSlNPTi5wYXJzZSh0aGlzLnZhbHVlKTtcclxuXHJcblx0XHR2YWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcblx0XHRcdHRoaXMudGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVSb3codmFsdWUpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0dGhpcy50YWJsZS5hcHBlbmRDaGlsZCh0aGlzLnRib2R5KTtcclxuXHJcblx0XHR0aGlzLm5vZGUuYmVmb3JlKHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwpO1xyXG5cdFx0dGhpcy5ub2RlLmJlZm9yZSh0aGlzLnN0b3JlKTtcclxuXHRcdHRoaXMubm9kZS5iZWZvcmUodGhpcy50YWJsZSk7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZVVpZCgpIHtcclxuXHRcdHJldHVybiAnZmYtJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xyXG5cdH1cclxufVxyXG5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzKj1cImZvcmVpZ24tZm9ybVwiXScpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcblx0bmV3IEZvcmVpZ25Gb3JtKGVsZW1lbnQpO1xyXG59KTtcclxufSk7XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG5cdC8vIEhBTkRMRSBCUk9LRU4gSU1BR0VTXHJcblx0Y29uc3QgaW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuXHRpbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XHJcblx0XHRpZihpbWFnZS5jb21wbGV0ZSAmJiB0eXBlb2YgaW1hZ2UubmF0dXJhbFdpZHRoICE9IFwidW5kZWZpbmVkXCIgJiYgaW1hZ2UubmF0dXJhbFdpZHRoIDw9IDApIHtcclxuXHRcdFx0aW1hZ2Uuc3JjID0gU0VUVElORy5pbWFnZV9wbGFjZWhvbGRlcjtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuIl0sImZpbGUiOiJtYWluLmpzIn0=