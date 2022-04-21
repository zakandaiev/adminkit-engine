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
var ELEM = {
  loader: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>',
  image_placeholder: BASE_URL + '/module/Admin/Asset/img/no_image.jpg'
}; // FUNCTIONS

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
    form.insertAdjacentHTML('beforeend', ELEM.loader);
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
      image.src = ELEM.image_placeholder;
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiQkFTRV9VUkwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaG9zdCIsIkVMRU0iLCJsb2FkZXIiLCJpbWFnZV9wbGFjZWhvbGRlciIsIlNtb290aFNjcm9sbFRvIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3IiwiYmVoYXZpb3IiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImFuY2hvciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImV2ZW50IiwiYW5jaG9yX2hyZWYiLCJjdXJyZW50VGFyZ2V0IiwiY2hhckF0Iiwic2Nyb2xsX3RvX25vZGUiLCJxdWVyeVNlbGVjdG9yIiwiaGFzaCIsInByZXZlbnREZWZhdWx0IiwidGFibGUiLCJwYXJlbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJvdXRlckhUTUwiLCJwb25kX2lucHV0X2RhdGEiLCJmaWxlcyIsImlucHV0IiwiaW5wdXRfZmlsZXMiLCJKU09OIiwicGFyc2UiLCJmaWxlIiwiZmlsZV9vYmoiLCJzb3VyY2UiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJ0eXBlIiwibWV0YWRhdGEiLCJhbGxvd0ltYWdlUHJldmlldyIsInBvc3RlciIsInB1c2giLCJtYXhUb3RhbEZpbGVTaXplIiwibWF4RmlsZVNpemUiLCJtYXhGaWxlcyIsInBhcnNlSW50Iiwic3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbyIsImZpbGVfaW5wdXRzIiwicG9uZCIsIkZpbGVQb25kIiwiY3JlYXRlIiwic2VydmVyIiwibG9hZCIsInN0b3JlQXNGaWxlIiwiaW5zdGFudFVwbG9hZCIsImFsbG93UHJvY2VzcyIsImFsbG93UmV2ZXJ0IiwiYWxsb3dSZW9yZGVyIiwiZHJvcE9uUGFnZSIsImRyb3BPbkVsZW1lbnQiLCJsZW5ndGgiLCJjcmVkaXRzIiwic2V0T3B0aW9ucyIsImxhYmVsSWRsZSIsInRleHRhcmVhIiwiYWRkIiwid3lzaXd5Z19ub2RlIiwiY3JlYXRlRWxlbWVudCIsInF1aWxsX25vZGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImFmdGVyIiwicXVpbGwiLCJRdWlsbCIsIm1vZHVsZXMiLCJ0b29sYmFyIiwiY29udGFpbmVyIiwiaGVhZGVyIiwiaGFuZGxlcnMiLCJ1cGxvYWRJbWFnZSIsIm1pbmltaXplIiwibWF4aW1pemUiLCJwbGFjZWhvbGRlciIsInJlYWRPbmx5IiwiZGlzYWJsZWQiLCJ0aGVtZSIsIm9uIiwicm9vdCIsImV4cGFuZCIsInJlbW92ZSIsIkltYWdlIiwiaW1wb3J0IiwiY2xhc3NOYW1lIiwicmVnaXN0ZXIiLCJjbGljayIsIm9uY2hhbmdlIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImVuYWJsZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwic3RhdHVzIiwic2VsZWN0aW9uIiwiZ2V0U2VsZWN0aW9uIiwiaW5kZXgiLCJpbnNlcnRFbWJlZCIsIm1lc3NhZ2UiLCJzZXRTZWxlY3Rpb24iLCJtYWtlQWxlcnQiLCJjYXRjaCIsImVycm9yIiwic2xpbXNlbGVjdF9kYXRhIiwiYWRkYWJsZSIsInNlbGVjdCIsInZhbCIsInJlcGxhY2VBbGwiLCJ0cmltIiwiYWxsb3dEZXNlbGVjdCIsImRlc2VsZWN0TGFiZWwiLCJoaWRlU2VsZWN0ZWRPcHRpb24iLCJtdWx0aXBsZSIsImNsb3NlT25TZWxlY3QiLCJzaG93U2VhcmNoIiwic2VhcmNoUGxhY2Vob2xkZXIiLCJzZWFyY2hUZXh0IiwiU2xpbVNlbGVjdCIsInBsYWNlaG9sZGVyVGV4dCIsInNob3dDb250ZW50IiwiU29ydGFibGUiLCJoYW5kbGUiLCJhbmltYXRpb24iLCJ0ZXh0IiwidGltZSIsInRvYXN0IiwidG9hc3RfaWNvbiIsInRvYXN0X3RleHQiLCJ0ZXh0Q29udGVudCIsImNsb3NlQWxlcnQiLCJzZXRUaW1lb3V0IiwiY2hpbGRFbGVtZW50Q291bnQiLCJmb3JtIiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiZm9ybUJlaGF2aW9yIiwiZGlzYWJsZUZvcm0iLCJzZXQiLCJTRVRUSU5HIiwiY3NyZiIsImtleSIsInRva2VuIiwiYWN0aW9uIiwicmVkaXJlY3QiLCJyZWxvYWQiLCJocmVmIiwicmVzZXQiLCJlbmFibGVGb3JtIiwiY29udHJvbHMiLCJoaWRlSXRlbXMiLCJjb250cm9sIiwiaGlkZSIsImNoZWNrZWQiLCJzcGxpdCIsInRvX2hpZGUiLCJpdGVtIiwicGFyZW50Iiwic2hvd0l0ZW1zIiwic2hvdyIsInRvX3Nob3ciLCJ0YXJnZXQiLCJ0YXJnZXRfaXRlbSIsImN5cl90b19sYXQiLCJzbHVnIiwiZGVsZXRlX2J1dHRvbnMiLCJidXR0b24iLCJjb25maXJtYXRpb24iLCJjb25maXJtIiwiZmFkZU91dCIsImVsIiwic3R5bGUiLCJvcGFjaXR5IiwiZmFkZSIsImRpc3BsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjb3VudGVyIiwiRm9yZWlnbkZvcm0iLCJub2RlIiwibmFtZSIsImlucHV0cyIsInN1Ym1pdCIsIm9wZW5fbW9kYWwiLCJpY29uIiwic29ydCIsImVkaXQiLCJkZWxldGUiLCJ1aWQiLCJnZW5lcmF0ZVVpZCIsInN0b3JlIiwidGJvZHkiLCJpc19lZGl0aW5nIiwiZWRpdGluZ19yb3ciLCJpbml0aWFsaXplIiwicmVzZXRFZGl0aW5nUm93Iiwib25Tb3J0IiwidXBkYXRlU3RvcmUiLCJjbGlja1N1Ym1pdCIsInBvcHVsYXRlVGFibGUiLCJyZW5kZXIiLCJjcmVhdGVSb3ciLCJ0ciIsIm9iaiIsInRkIiwic3RyaW5naWZ5IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwic2VsZWN0ZWRJbmRleCIsInNsaW0iLCJvYmplY3QiLCJ0cm93IiwiT2JqZWN0IiwiZW50cmllcyIsInRjb2wiLCJ0Y29sX2FjdGlvbnMiLCJidG5fc29ydCIsImJ0bl9lZGl0IiwiYnRuX2RlbGV0ZSIsImNsaWNrRWRpdCIsImNsaWNrRGVsZXRlIiwidmFsdWVzIiwiYmVmb3JlIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic2xpY2UiLCJvbmxvYWQiLCJpbWFnZXMiLCJpbWFnZSIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwic3JjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsSUFBTUEsUUFBUSxHQUFHQyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLFFBQWhCLEdBQTJCLElBQTNCLEdBQWtDRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JFLElBQW5FO0FBRUEsSUFBTUMsSUFBSSxHQUFHO0FBQ1pDLEVBQUFBLE1BQU0sRUFBRSw4R0FESTtBQUVaQyxFQUFBQSxpQkFBaUIsRUFBRVAsUUFBUSxHQUFHO0FBRmxCLENBQWIsQyxDQUtBOztBQUNBLFNBQVNRLGNBQVQsQ0FBd0JDLE9BQXhCLEVBQWlDO0FBQ2hDLE1BQUdBLE9BQUgsRUFBWTtBQUNYQSxJQUFBQSxPQUFPLENBQUNDLGNBQVIsQ0FBdUI7QUFDckJDLE1BQUFBLFFBQVEsRUFBRTtBQURXLEtBQXZCO0FBR0E7QUFDRDs7QUFFREMsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNuRDtBQUNBRCxFQUFBQSxRQUFRLENBQUNFLGdCQUFULENBQTBCLEdBQTFCLEVBQStCQyxPQUEvQixDQUF1QyxVQUFBQyxNQUFNLEVBQUk7QUFDaEQsUUFBR0EsTUFBTSxDQUFDQyxZQUFQLENBQW9CLFFBQXBCLEtBQWlDRCxNQUFNLENBQUNFLFlBQVAsQ0FBb0IsUUFBcEIsTUFBa0MsUUFBdEUsRUFBZ0Y7QUFDL0VGLE1BQUFBLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQixLQUFwQixFQUEyQiw4QkFBM0I7QUFDQTs7QUFFRCxRQUFHLENBQUNILE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQixnQkFBcEIsQ0FBSixFQUEyQztBQUMxQ0QsTUFBQUEsTUFBTSxDQUFDSCxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxVQUFBTyxLQUFLLEVBQUk7QUFDekMsWUFBTUMsV0FBVyxHQUFHRCxLQUFLLENBQUNFLGFBQU4sQ0FBb0JKLFlBQXBCLENBQWlDLE1BQWpDLENBQXBCOztBQUNBLFlBQUdHLFdBQVcsQ0FBQ0UsTUFBWixDQUFtQixDQUFuQixNQUEwQixHQUExQixJQUFrQ0YsV0FBVyxDQUFDRSxNQUFaLENBQW1CLENBQW5CLE1BQTBCLEdBQTFCLElBQWlDRixXQUFXLENBQUNFLE1BQVosQ0FBbUIsQ0FBbkIsTUFBMEIsR0FBaEcsRUFBc0c7QUFDckcsY0FBTUMsY0FBYyxHQUFHWixRQUFRLENBQUNhLGFBQVQsQ0FBdUJMLEtBQUssQ0FBQ0UsYUFBTixDQUFvQkksSUFBM0MsQ0FBdkI7O0FBQ0EsY0FBR0YsY0FBSCxFQUFtQjtBQUNsQkosWUFBQUEsS0FBSyxDQUFDTyxjQUFOO0FBQ0FuQixZQUFBQSxjQUFjLENBQUNnQixjQUFELENBQWQ7QUFDQTtBQUNEO0FBQ0QsT0FURDtBQVVBO0FBQ0QsR0FqQkQsRUFGbUQsQ0FxQm5EOztBQUNBWixFQUFBQSxRQUFRLENBQUNFLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DQyxPQUFuQyxDQUEyQyxVQUFBYSxLQUFLLEVBQUk7QUFDbkQsUUFBRyxDQUFDQSxLQUFLLENBQUNDLGFBQU4sQ0FBb0JDLFNBQXBCLENBQThCQyxRQUE5QixDQUF1QyxrQkFBdkMsQ0FBSixFQUFnRTtBQUMvREgsTUFBQUEsS0FBSyxDQUFDSSxTQUFOLEdBQWtCLG1DQUFtQ0osS0FBSyxDQUFDSSxTQUF6QyxHQUFxRCxRQUF2RTtBQUNBO0FBQ0QsR0FKRCxFQXRCbUQsQ0E0Qm5EOztBQUNBLE1BQU1DLGVBQWUsR0FBRztBQUN4QkMsSUFBQUEsS0FBSyxFQUFFLGVBQUFDLEtBQUssRUFBSTtBQUNmLFVBQUlELEtBQUssR0FBRyxFQUFaOztBQUNBLFVBQUcsQ0FBQ0MsS0FBSyxDQUFDbEIsWUFBTixDQUFtQixZQUFuQixDQUFKLEVBQXNDO0FBQ3JDLGVBQU9pQixLQUFQO0FBQ0E7O0FBRUQsVUFBSUUsV0FBVyxHQUFHRCxLQUFLLENBQUNqQixZQUFOLENBQW1CLFlBQW5CLENBQWxCOztBQUVBLFVBQUcsQ0FBQ2tCLFdBQUQsSUFBZ0JBLFdBQVcsSUFBSSxJQUFsQyxFQUF3QztBQUN2QyxlQUFPRixLQUFQO0FBQ0E7O0FBRURFLE1BQUFBLFdBQVcsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdGLFdBQVgsQ0FBZDtBQUVBQSxNQUFBQSxXQUFXLENBQUNyQixPQUFaLENBQW9CLFVBQUF3QixJQUFJLEVBQUk7QUFDM0IsWUFBSUMsUUFBUSxHQUFHO0FBQ2RDLFVBQUFBLE1BQU0sRUFBRUYsSUFBSSxDQUFDRyxLQURDO0FBRWRDLFVBQUFBLE9BQU8sRUFBRTtBQUNSQyxZQUFBQSxJQUFJLEVBQUUsT0FERTtBQUVSQyxZQUFBQSxRQUFRLEVBQUU7QUFGRjtBQUZLLFNBQWY7O0FBUUEsWUFBR1osZUFBZSxDQUFDYSxpQkFBaEIsQ0FBa0NYLEtBQWxDLENBQUgsRUFBNkM7QUFDNUNLLFVBQUFBLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQkUsUUFBakIsQ0FBMEJFLE1BQTFCLEdBQW1DUixJQUFJLENBQUNRLE1BQXhDO0FBQ0E7O0FBRURiLFFBQUFBLEtBQUssQ0FBQ2MsSUFBTixDQUFXUixRQUFYO0FBQ0EsT0FkRDtBQWdCQSxhQUFPTixLQUFQO0FBQ0EsS0FoQ3VCO0FBaUN4QlksSUFBQUEsaUJBQWlCLEVBQUUsMkJBQUFYLEtBQUssRUFBSTtBQUMzQixhQUFPQSxLQUFLLENBQUNqQixZQUFOLENBQW1CLGNBQW5CLEtBQXNDLE9BQXRDLEdBQWdELEtBQWhELEdBQXdELElBQS9EO0FBQ0EsS0FuQ3VCO0FBb0N4QitCLElBQUFBLGdCQUFnQixFQUFFLDBCQUFBZCxLQUFLLEVBQUk7QUFDMUIsYUFBT0EsS0FBSyxDQUFDbEIsWUFBTixDQUFtQixxQkFBbkIsSUFBNENrQixLQUFLLENBQUNqQixZQUFOLENBQW1CLHFCQUFuQixDQUE1QyxHQUF3RixJQUEvRjtBQUNBLEtBdEN1QjtBQXVDeEJnQyxJQUFBQSxXQUFXLEVBQUUscUJBQUFmLEtBQUssRUFBSTtBQUNyQixhQUFPQSxLQUFLLENBQUNsQixZQUFOLENBQW1CLGVBQW5CLElBQXNDa0IsS0FBSyxDQUFDakIsWUFBTixDQUFtQixlQUFuQixDQUF0QyxHQUE0RSxJQUFuRjtBQUNBLEtBekN1QjtBQTBDeEJpQyxJQUFBQSxRQUFRLEVBQUUsa0JBQUFoQixLQUFLLEVBQUk7QUFDbEIsYUFBT0EsS0FBSyxDQUFDbEIsWUFBTixDQUFtQixnQkFBbkIsSUFBdUNtQyxRQUFRLENBQUNqQixLQUFLLENBQUNqQixZQUFOLENBQW1CLGdCQUFuQixDQUFELENBQS9DLEdBQXdGLElBQS9GO0FBQ0EsS0E1Q3VCO0FBNkN4Qm1DLElBQUFBLHlCQUF5QixFQUFFLG1DQUFBbEIsS0FBSyxFQUFJO0FBQ25DLGFBQU9BLEtBQUssQ0FBQ2xCLFlBQU4sQ0FBbUIsbUJBQW5CLElBQTBDbUMsUUFBUSxDQUFDakIsS0FBSyxDQUFDakIsWUFBTixDQUFtQixtQkFBbkIsQ0FBRCxDQUFsRCxHQUE4RixNQUFyRztBQUNBO0FBL0N1QixHQUF4QjtBQWtERCxNQUFNb0MsV0FBVyxHQUFHMUMsUUFBUSxDQUFDRSxnQkFBVCxDQUEwQixvQkFBMUIsQ0FBcEI7O0FBRUEsTUFBR3dDLFdBQUgsRUFBZ0I7QUFDZkEsSUFBQUEsV0FBVyxDQUFDdkMsT0FBWixDQUFvQixVQUFBb0IsS0FBSyxFQUFJO0FBQzVCLFVBQU1vQixJQUFJLEdBQUdDLFFBQVEsQ0FBQ0MsTUFBVCxDQUNadEIsS0FEWSxFQUNMO0FBQ051QixRQUFBQSxNQUFNLEVBQUU7QUFBQ0MsVUFBQUEsSUFBSSxFQUFFO0FBQVAsU0FERjtBQUVOQyxRQUFBQSxXQUFXLEVBQUUsSUFGUDtBQUdOQyxRQUFBQSxhQUFhLEVBQUUsS0FIVDtBQUlOQyxRQUFBQSxZQUFZLEVBQUUsS0FKUjtBQUtOQyxRQUFBQSxXQUFXLEVBQUUsS0FMUDtBQU1OQyxRQUFBQSxZQUFZLEVBQUUsSUFOUjtBQU9OQyxRQUFBQSxVQUFVLEVBQUUsSUFQTjtBQVFOQyxRQUFBQSxhQUFhLEVBQUVaLFdBQVcsQ0FBQ2EsTUFBWixJQUFzQixDQUF0QixHQUEwQixLQUExQixHQUFrQyxJQVIzQztBQVNOakMsUUFBQUEsS0FBSyxFQUFFRCxlQUFlLENBQUNDLEtBQWhCLENBQXNCQyxLQUF0QixDQVREO0FBVU5XLFFBQUFBLGlCQUFpQixFQUFFYixlQUFlLENBQUNhLGlCQUFoQixDQUFrQ1gsS0FBbEMsQ0FWYjtBQVdOYyxRQUFBQSxnQkFBZ0IsRUFBRWhCLGVBQWUsQ0FBQ2dCLGdCQUFoQixDQUFpQ2QsS0FBakMsQ0FYWjtBQVlOZSxRQUFBQSxXQUFXLEVBQUVqQixlQUFlLENBQUNpQixXQUFoQixDQUE0QmYsS0FBNUIsQ0FaUDtBQWFOZ0IsUUFBQUEsUUFBUSxFQUFFbEIsZUFBZSxDQUFDa0IsUUFBaEIsQ0FBeUJoQixLQUF6QixDQWJKO0FBY05rQixRQUFBQSx5QkFBeUIsRUFBRXBCLGVBQWUsQ0FBQ29CLHlCQUFoQixDQUEwQ2xCLEtBQTFDLENBZHJCO0FBZU5pQyxRQUFBQSxPQUFPLEVBQUU7QUFmSCxPQURLLENBQWI7O0FBb0JBLFVBQUdqQyxLQUFLLENBQUNsQixZQUFOLENBQW1CLGtCQUFuQixDQUFILEVBQTJDO0FBQzFDc0MsUUFBQUEsSUFBSSxDQUFDYyxVQUFMLENBQWdCO0FBQ2ZDLFVBQUFBLFNBQVMsRUFBRW5DLEtBQUssQ0FBQ2pCLFlBQU4sQ0FBbUIsa0JBQW5CO0FBREksU0FBaEI7QUFHQTtBQUNELEtBMUJEO0FBMkJBLEdBN0dtRCxDQStHbkQ7OztBQUNBTixFQUFBQSxRQUFRLENBQUNFLGdCQUFULENBQTBCLDRCQUExQixFQUF3REMsT0FBeEQsQ0FBZ0UsVUFBQXdELFFBQVEsRUFBSTtBQUM1RUEsSUFBQUEsUUFBUSxDQUFDekMsU0FBVCxDQUFtQjBDLEdBQW5CLENBQXVCLFFBQXZCO0FBRUEsUUFBTUMsWUFBWSxHQUFHN0QsUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixLQUF2QixDQUFyQjtBQUNBLFFBQU1DLFVBQVUsR0FBRy9ELFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbkI7QUFDQUMsSUFBQUEsVUFBVSxDQUFDQyxTQUFYLEdBQXVCTCxRQUFRLENBQUM3QixLQUFoQztBQUVBK0IsSUFBQUEsWUFBWSxDQUFDM0MsU0FBYixDQUF1QjBDLEdBQXZCLENBQTJCLFNBQTNCO0FBQ0FDLElBQUFBLFlBQVksQ0FBQ0ksV0FBYixDQUF5QkYsVUFBekI7QUFDQUosSUFBQUEsUUFBUSxDQUFDTyxLQUFULENBQWVMLFlBQWY7QUFFQSxRQUFNTSxLQUFLLEdBQUcsSUFBSUMsS0FBSixDQUFVTCxVQUFWLEVBQXNCO0FBQ25DTSxNQUFBQSxPQUFPLEVBQUU7QUFDUkMsUUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFVBQUFBLFNBQVMsRUFBRSxDQUNWLENBQUM7QUFBRUMsWUFBQUEsTUFBTSxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQO0FBQVYsV0FBRCxDQURVLEVBRVYsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixXQUFuQixFQUFnQyxRQUFoQyxDQUZVLEVBR1YsQ0FBQztBQUFDLHFCQUFTO0FBQVYsV0FBRCxFQUFnQjtBQUFDLG9CQUFRO0FBQVQsV0FBaEIsRUFBcUM7QUFBQyxvQkFBUTtBQUFULFdBQXJDLENBSFUsRUFJVixDQUFDO0FBQUMscUJBQVM7QUFBVixXQUFELEVBQWdCO0FBQUMsMEJBQWM7QUFBZixXQUFoQixDQUpVLEVBS1YsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixPQUFsQixFQUEyQixZQUEzQixFQUF5QyxNQUF6QyxDQUxVLEVBTVYsQ0FBQztBQUFDLHNCQUFVO0FBQVgsV0FBRCxFQUFtQjtBQUFDLHNCQUFVO0FBQVgsV0FBbkIsQ0FOVSxFQU9WLENBQUM7QUFBQyxzQkFBVTtBQUFYLFdBQUQsRUFBb0I7QUFBQyxzQkFBVTtBQUFYLFdBQXBCLENBUFUsRUFRVixDQUFDLE9BQUQsQ0FSVSxFQVFDLENBQUMsUUFBRCxDQVJELENBREo7QUFXUEMsVUFBQUEsUUFBUSxFQUFFO0FBQ1QscUJBQVMsZUFBQWpFLEtBQUssRUFBSTtBQUNqQmtFLGNBQUFBLFdBQVc7QUFDWCxhQUhRO0FBSVQsc0JBQVUsZ0JBQUFsRSxLQUFLLEVBQUk7QUFDbEJxRCxjQUFBQSxZQUFZLENBQUMzQyxTQUFiLENBQXVCQyxRQUF2QixDQUFnQyxZQUFoQyxJQUFpRHdELFFBQVEsRUFBekQsR0FBOERDLFFBQVEsRUFBdEU7QUFDQTtBQU5RO0FBWEg7QUFERCxPQUQwQjtBQXVCbkNDLE1BQUFBLFdBQVcsRUFBRWxCLFFBQVEsQ0FBQ2tCLFdBdkJhO0FBd0JuQ0MsTUFBQUEsUUFBUSxFQUFFbkIsUUFBUSxDQUFDb0IsUUFBVCxHQUFvQixJQUFwQixHQUEyQixLQXhCRjtBQXlCbkNDLE1BQUFBLEtBQUssRUFBRTtBQXpCNEIsS0FBdEIsQ0FBZCxDQVg0RSxDQXVDNUU7QUFDQTtBQUVBOztBQUNBYixJQUFBQSxLQUFLLENBQUNjLEVBQU4sQ0FBUyxlQUFULEVBQTBCLFVBQUF6RSxLQUFLLEVBQUk7QUFDbEM7QUFDQW1ELE1BQUFBLFFBQVEsQ0FBQzdCLEtBQVQsR0FBaUJxQyxLQUFLLENBQUNlLElBQU4sQ0FBV2xCLFNBQTVCO0FBQ0EsS0FIRCxFQTNDNEUsQ0FnRDVFOztBQUNBLFFBQU1tQixNQUFNLEdBQUd0QixZQUFZLENBQUNoRCxhQUFiLENBQTJCLFlBQTNCLENBQWY7O0FBQ0EsYUFBUytELFFBQVQsR0FBb0I7QUFDbkJmLE1BQUFBLFlBQVksQ0FBQzNDLFNBQWIsQ0FBdUIwQyxHQUF2QixDQUEyQixZQUEzQjtBQUNBLFVBQUd1QixNQUFILEVBQVdBLE1BQU0sQ0FBQ2pFLFNBQVAsQ0FBaUIwQyxHQUFqQixDQUFxQixRQUFyQjtBQUNYOztBQUNELGFBQVNlLFFBQVQsR0FBb0I7QUFDbkJkLE1BQUFBLFlBQVksQ0FBQzNDLFNBQWIsQ0FBdUJrRSxNQUF2QixDQUE4QixZQUE5QjtBQUNBLFVBQUdELE1BQUgsRUFBV0EsTUFBTSxDQUFDakUsU0FBUCxDQUFpQmtFLE1BQWpCLENBQXdCLFFBQXhCO0FBQ1gsS0F6RDJFLENBMkQ1RTs7O0FBQ0EsUUFBTUMsS0FBSyxHQUFHakIsS0FBSyxDQUFDa0IsTUFBTixDQUFhLGVBQWIsQ0FBZDtBQUNBRCxJQUFBQSxLQUFLLENBQUNFLFNBQU4sR0FBa0IsYUFBbEI7QUFDQW5CLElBQUFBLEtBQUssQ0FBQ29CLFFBQU4sQ0FBZUgsS0FBZixFQUFzQixJQUF0Qjs7QUFFQSxhQUFTWCxXQUFULEdBQXVCO0FBQ3RCLFVBQU1uRCxLQUFLLEdBQUd2QixRQUFRLENBQUM4RCxhQUFULENBQXVCLE9BQXZCLENBQWQ7QUFDQXZDLE1BQUFBLEtBQUssQ0FBQ2hCLFlBQU4sQ0FBbUIsTUFBbkIsRUFBMkIsTUFBM0I7QUFDQWdCLE1BQUFBLEtBQUssQ0FBQ2hCLFlBQU4sQ0FBbUIsUUFBbkIsRUFBNkIsU0FBN0I7QUFDQWdCLE1BQUFBLEtBQUssQ0FBQ2tFLEtBQU47O0FBRUFsRSxNQUFBQSxLQUFLLENBQUNtRSxRQUFOLEdBQWlCLFlBQU07QUFDdEIsWUFBTS9ELElBQUksR0FBR0osS0FBSyxDQUFDRCxLQUFOLENBQVksQ0FBWixDQUFiOztBQUVBLFlBQUdLLElBQUgsRUFBUztBQUNSLGNBQUlnRSxRQUFRLEdBQUcsSUFBSUMsUUFBSixFQUFmO0FBQ0FELFVBQUFBLFFBQVEsQ0FBQ0UsTUFBVCxDQUFnQixNQUFoQixFQUF3QmxFLElBQXhCO0FBRUF3QyxVQUFBQSxLQUFLLENBQUMyQixNQUFOLENBQWEsS0FBYjtBQUVBQyxVQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZO0FBQUNDLFlBQUFBLE1BQU0sRUFBRSxNQUFUO0FBQWlCQyxZQUFBQSxJQUFJLEVBQUVOO0FBQXZCLFdBQVosQ0FBTCxDQUNDTyxJQURELENBQ00sVUFBQUMsUUFBUTtBQUFBLG1CQUFJQSxRQUFRLENBQUNDLElBQVQsRUFBSjtBQUFBLFdBRGQsRUFFQ0YsSUFGRCxDQUVNLFVBQUFHLElBQUksRUFBSTtBQUNiLGdCQUFHQSxJQUFJLENBQUNDLE1BQUwsS0FBZ0IsU0FBbkIsRUFBOEI7QUFDN0Isa0JBQU1DLFNBQVMsR0FBR3BDLEtBQUssQ0FBQ3FDLFlBQU4sR0FBcUJDLEtBQXZDO0FBQ0F0QyxjQUFBQSxLQUFLLENBQUN1QyxXQUFOLENBQWtCSCxTQUFsQixFQUE2QixPQUE3QixFQUFzQ25ILFFBQVEsR0FBRyxHQUFYLEdBQWlCaUgsSUFBSSxDQUFDTSxPQUE1RDtBQUNBeEMsY0FBQUEsS0FBSyxDQUFDeUMsWUFBTixDQUFtQkwsU0FBUyxHQUFHLENBQS9CO0FBQ0EsYUFKRCxNQUlPO0FBQ05NLGNBQUFBLFNBQVMsQ0FBQ1IsSUFBSSxDQUFDQyxNQUFOLEVBQWNELElBQUksQ0FBQ00sT0FBbkIsQ0FBVDtBQUNBO0FBQ0QsV0FWRCxFQVdDRyxLQVhELENBV08sVUFBQUMsS0FBSyxFQUFJO0FBQ2ZGLFlBQUFBLFNBQVMsQ0FBQyxPQUFELEVBQVVFLEtBQVYsQ0FBVDtBQUNBLFdBYkQ7QUFlQTVDLFVBQUFBLEtBQUssQ0FBQzJCLE1BQU4sQ0FBYSxJQUFiO0FBQ0E7QUFDRCxPQTFCRDtBQTJCQTtBQUVELEdBbkdBLEVBaEhtRCxDQXFObkQ7O0FBQ0EsTUFBTWtCLGVBQWUsR0FBRztBQUN4QkMsSUFBQUEsT0FBTyxFQUFFLGlCQUFBQyxNQUFNLEVBQUk7QUFDbEIsVUFBRyxDQUFDQSxNQUFNLENBQUM3RyxZQUFQLENBQW9CLGNBQXBCLENBQUosRUFBeUM7QUFDeEMsZUFBTyxLQUFQO0FBQ0E7O0FBRUQsYUFBTyxVQUFDeUIsS0FBRCxFQUFXO0FBQ2pCLFlBQUlxRixHQUFHLEdBQUdyRixLQUFWOztBQUVBLGdCQUFPb0YsTUFBTSxDQUFDNUcsWUFBUCxDQUFvQixjQUFwQixDQUFQO0FBQ0MsZUFBSyxLQUFMO0FBQVk7QUFDWDZHLGNBQUFBLEdBQUcsR0FBR3JGLEtBQUssQ0FBQ3NGLFVBQU4sQ0FBaUIsOHJQQUFqQixFQUFvQyxFQUFwQyxFQUF3Q0EsVUFBeEMsQ0FBbUQsUUFBbkQsRUFBNkQsR0FBN0QsRUFBa0VDLElBQWxFLEVBQU47QUFDQTtBQUNBOztBQUNEO0FBQVM7QUFDUkYsY0FBQUEsR0FBRyxHQUFHckYsS0FBSyxDQUFDc0YsVUFBTixDQUFpQixRQUFqQixFQUEyQixHQUEzQixFQUFnQ0MsSUFBaEMsRUFBTjtBQUNBO0FBQ0E7QUFSRjs7QUFXQSxlQUFPRixHQUFQO0FBQ0EsT0FmRDtBQWdCQSxLQXRCdUI7QUF1QnhCRyxJQUFBQSxhQUFhLEVBQUUsdUJBQUFKLE1BQU0sRUFBSTtBQUN4QixhQUFPQSxNQUFNLENBQUNyRyxhQUFQLENBQXFCLDBCQUFyQixJQUFtRCxJQUFuRCxHQUEwRCxLQUFqRTtBQUNBLEtBekJ1QjtBQTBCeEIwRyxJQUFBQSxhQUFhLEVBQUUsdUJBQUFMLE1BQU0sRUFBSTtBQUN4QixhQUFPLCtRQUFQO0FBQ0EsS0E1QnVCO0FBNkJ4Qk0sSUFBQUEsa0JBQWtCLEVBQUUsNEJBQUFOLE1BQU0sRUFBSTtBQUM3QixhQUFPQSxNQUFNLENBQUNPLFFBQVAsR0FBa0IsSUFBbEIsR0FBeUIsS0FBaEM7QUFDQSxLQS9CdUI7QUFnQ3hCQyxJQUFBQSxhQUFhLEVBQUUsdUJBQUFSLE1BQU0sRUFBSTtBQUN4QixhQUFPQSxNQUFNLENBQUNPLFFBQVAsR0FBa0IsS0FBbEIsR0FBMEIsSUFBakM7QUFDQSxLQWxDdUI7QUFtQ3hCRSxJQUFBQSxVQUFVLEVBQUUsb0JBQUFULE1BQU0sRUFBSTtBQUNyQixhQUFRQSxNQUFNLENBQUNoSCxnQkFBUCxDQUF3QixRQUF4QixFQUFrQ3FELE1BQWxDLEdBQTJDLEVBQTNDLElBQWlEMkQsTUFBTSxDQUFDN0csWUFBUCxDQUFvQixjQUFwQixDQUFsRCxHQUF5RixJQUF6RixHQUFnRyxLQUF2RztBQUNBLEtBckN1QjtBQXNDeEJ3RSxJQUFBQSxXQUFXLEVBQUUscUJBQUFxQyxNQUFNLEVBQUk7QUFDdEIsYUFBT0EsTUFBTSxDQUFDN0csWUFBUCxDQUFvQixrQkFBcEIsSUFBMEM2RyxNQUFNLENBQUM1RyxZQUFQLENBQW9CLGtCQUFwQixDQUExQyxHQUFvRixJQUEzRjtBQUNBLEtBeEN1QjtBQXlDeEJzSCxJQUFBQSxpQkFBaUIsRUFBRSwyQkFBQVYsTUFBTSxFQUFJO0FBQzVCLGFBQU9BLE1BQU0sQ0FBQzdHLFlBQVAsQ0FBb0IseUJBQXBCLElBQWlENkcsTUFBTSxDQUFDNUcsWUFBUCxDQUFvQix5QkFBcEIsQ0FBakQsR0FBa0csSUFBekc7QUFDQSxLQTNDdUI7QUE0Q3hCdUgsSUFBQUEsVUFBVSxFQUFFLG9CQUFBWCxNQUFNLEVBQUk7QUFDckIsYUFBT0EsTUFBTSxDQUFDN0csWUFBUCxDQUFvQiw4QkFBcEIsSUFBc0Q2RyxNQUFNLENBQUM1RyxZQUFQLENBQW9CLDhCQUFwQixDQUF0RCxHQUE0RyxJQUFuSDtBQUNBO0FBOUN1QixHQUF4QjtBQWlERE4sRUFBQUEsUUFBUSxDQUFDRSxnQkFBVCxDQUEwQixRQUExQixFQUFvQ0MsT0FBcEMsQ0FBNEMsVUFBQStHLE1BQU0sRUFBSTtBQUNyRCxRQUFHQSxNQUFNLENBQUM3RyxZQUFQLENBQW9CLGFBQXBCLENBQUgsRUFBdUM7QUFDdEM7QUFDQTs7QUFFRCxRQUFJeUgsVUFBSixDQUFlO0FBQ2RaLE1BQUFBLE1BQU0sRUFBRUEsTUFETTtBQUVkRCxNQUFBQSxPQUFPLEVBQUVELGVBQWUsQ0FBQ0MsT0FBaEIsQ0FBd0JDLE1BQXhCLENBRks7QUFHZEksTUFBQUEsYUFBYSxFQUFFTixlQUFlLENBQUNNLGFBQWhCLENBQThCSixNQUE5QixDQUhEO0FBSWRLLE1BQUFBLGFBQWEsRUFBRVAsZUFBZSxDQUFDTyxhQUFoQixDQUE4QkwsTUFBOUIsQ0FKRDtBQUtkO0FBQ0FRLE1BQUFBLGFBQWEsRUFBRVYsZUFBZSxDQUFDVSxhQUFoQixDQUE4QlIsTUFBOUIsQ0FORDtBQU9kUyxNQUFBQSxVQUFVLEVBQUVYLGVBQWUsQ0FBQ1csVUFBaEIsQ0FBMkJULE1BQTNCLENBUEU7QUFRZHJDLE1BQUFBLFdBQVcsRUFBRW1DLGVBQWUsQ0FBQ25DLFdBQWhCLENBQTRCcUMsTUFBNUIsQ0FSQztBQVNkYSxNQUFBQSxlQUFlLEVBQUVmLGVBQWUsQ0FBQ25DLFdBQWhCLENBQTRCcUMsTUFBNUIsQ0FUSDtBQVVkVSxNQUFBQSxpQkFBaUIsRUFBRVosZUFBZSxDQUFDWSxpQkFBaEIsQ0FBa0NWLE1BQWxDLENBVkw7QUFXZFcsTUFBQUEsVUFBVSxFQUFFYixlQUFlLENBQUNhLFVBQWhCLENBQTJCWCxNQUEzQixDQVhFO0FBWWRjLE1BQUFBLFdBQVcsRUFBRTtBQVpDLEtBQWY7QUFjQSxHQW5CRCxFQXZRb0QsQ0E0Um5EOztBQUNBaEksRUFBQUEsUUFBUSxDQUFDRSxnQkFBVCxDQUEwQixxQkFBMUIsRUFBaURDLE9BQWpELENBQXlELFVBQUFOLE9BQU8sRUFBSTtBQUNwRSxRQUFJb0ksUUFBSixDQUFhcEksT0FBYixFQUFzQjtBQUNyQnFJLE1BQUFBLE1BQU0sRUFBRSxtQkFEYTtBQUVyQkMsTUFBQUEsU0FBUyxFQUFFO0FBRlUsS0FBdEI7QUFJQSxHQUxBLEVBN1JtRCxDQW9TbkQ7O0FBQ0EsV0FBU3RCLFNBQVQsQ0FBbUI3RSxJQUFuQixFQUF5Qm9HLElBQXpCLEVBQTRDO0FBQUEsUUFBYkMsSUFBYSx1RUFBTixJQUFNOztBQUM1QyxRQUFHLENBQUNELElBQUQsSUFBUyxDQUFDQSxJQUFJLENBQUM3RSxNQUFsQixFQUEwQjtBQUN6QixhQUFPLEtBQVA7QUFDQTs7QUFFRCxRQUFJZ0IsU0FBUyxHQUFHdkUsUUFBUSxDQUFDYSxhQUFULENBQXVCLFNBQXZCLENBQWhCOztBQUNBLFFBQUcsQ0FBQzBELFNBQUosRUFBZTtBQUNkQSxNQUFBQSxTQUFTLEdBQUd2RSxRQUFRLENBQUM4RCxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQVMsTUFBQUEsU0FBUyxDQUFDckQsU0FBVixDQUFvQjBDLEdBQXBCLENBQXdCLFFBQXhCO0FBQ0E1RCxNQUFBQSxRQUFRLENBQUNpRyxJQUFULENBQWNoQyxXQUFkLENBQTBCTSxTQUExQjtBQUNBOztBQUVELFFBQUkrRCxLQUFLLEdBQUd0SSxRQUFRLENBQUM4RCxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQXdFLElBQUFBLEtBQUssQ0FBQ3BILFNBQU4sQ0FBZ0IwQyxHQUFoQixDQUFvQixjQUFwQjs7QUFDQSxRQUFHNUIsSUFBSCxFQUFTO0FBQ1JzRyxNQUFBQSxLQUFLLENBQUNwSCxTQUFOLENBQWdCMEMsR0FBaEIsQ0FBb0I1QixJQUFwQjtBQUNBOztBQUVELFFBQUl1RyxVQUFVLEdBQUd2SSxRQUFRLENBQUM4RCxhQUFULENBQXVCLEdBQXZCLENBQWpCO0FBQ0F5RSxJQUFBQSxVQUFVLENBQUNySCxTQUFYLENBQXFCMEMsR0FBckIsQ0FBeUIsY0FBekI7O0FBQ0EsUUFBRzVCLElBQUgsRUFBUztBQUNSdUcsTUFBQUEsVUFBVSxDQUFDckgsU0FBWCxDQUFxQjBDLEdBQXJCLENBQXlCNUIsSUFBekI7QUFDQTs7QUFFRCxRQUFJd0csVUFBVSxHQUFHeEksUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixNQUF2QixDQUFqQjtBQUNBMEUsSUFBQUEsVUFBVSxDQUFDdEgsU0FBWCxDQUFxQjBDLEdBQXJCLENBQXlCLGNBQXpCO0FBQ0E0RSxJQUFBQSxVQUFVLENBQUNDLFdBQVgsR0FBeUJMLElBQXpCO0FBRUFFLElBQUFBLEtBQUssQ0FBQ3JFLFdBQU4sQ0FBa0JzRSxVQUFsQjtBQUNBRCxJQUFBQSxLQUFLLENBQUNyRSxXQUFOLENBQWtCdUUsVUFBbEI7QUFFQWpFLElBQUFBLFNBQVMsQ0FBQ04sV0FBVixDQUFzQnFFLEtBQXRCO0FBRUFBLElBQUFBLEtBQUssQ0FBQ3JJLGdCQUFOLENBQXVCLE9BQXZCLEVBQWdDO0FBQUEsYUFBTXlJLFVBQVUsQ0FBQ25FLFNBQUQsRUFBWStELEtBQVosQ0FBaEI7QUFBQSxLQUFoQztBQUVBSyxJQUFBQSxVQUFVLENBQUM7QUFBQSxhQUFNRCxVQUFVLENBQUNuRSxTQUFELEVBQVkrRCxLQUFaLENBQWhCO0FBQUEsS0FBRCxFQUFxQ0QsSUFBckMsQ0FBVjtBQUVBLFdBQU8sSUFBUDtBQUNBOztBQUVELFdBQVNLLFVBQVQsQ0FBb0JuRSxTQUFwQixFQUErQitELEtBQS9CLEVBQXNDO0FBQ3JDQSxJQUFBQSxLQUFLLENBQUNwSCxTQUFOLENBQWdCMEMsR0FBaEIsQ0FBb0IsV0FBcEI7QUFDQStFLElBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2hCTCxNQUFBQSxLQUFLLENBQUNsRCxNQUFOOztBQUNBLFVBQUdiLFNBQVMsSUFBSUEsU0FBUyxDQUFDcUUsaUJBQVYsSUFBK0IsQ0FBL0MsRUFBa0Q7QUFDakRyRSxRQUFBQSxTQUFTLENBQUNhLE1BQVY7QUFDQTtBQUNELEtBTFMsRUFLUCxHQUxPLENBQVY7QUFNQSxHQXJWbUQsQ0F1Vm5EOzs7QUFDQXBGLEVBQUFBLFFBQVEsQ0FBQ0UsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0NDLE9BQWxDLENBQTBDLFVBQUEwSSxJQUFJLEVBQUk7QUFDbERBLElBQUFBLElBQUksQ0FBQ0Msa0JBQUwsQ0FBd0IsV0FBeEIsRUFBcUNySixJQUFJLENBQUNDLE1BQTFDO0FBRUFxSixJQUFBQSxZQUFZLENBQUNGLElBQUQsQ0FBWjtBQUVBQSxJQUFBQSxJQUFJLENBQUM1SSxnQkFBTCxDQUFzQixRQUF0QixFQUFnQyxVQUFBTyxLQUFLLEVBQUk7QUFDeENBLE1BQUFBLEtBQUssQ0FBQ08sY0FBTjtBQUVBaUksTUFBQUEsV0FBVyxDQUFDSCxJQUFELENBQVg7QUFFQSxVQUFJbEQsUUFBUSxHQUFHLElBQUlDLFFBQUosQ0FBYWlELElBQWIsQ0FBZjtBQUVBbEQsTUFBQUEsUUFBUSxDQUFDc0QsR0FBVCxDQUFhQyxPQUFPLENBQUNDLElBQVIsQ0FBYUMsR0FBMUIsRUFBK0JGLE9BQU8sQ0FBQ0MsSUFBUixDQUFhRSxLQUE1QztBQUVBdEQsTUFBQUEsS0FBSyxDQUFDOEMsSUFBSSxDQUFDUyxNQUFOLEVBQWM7QUFBQ3RELFFBQUFBLE1BQU0sRUFBRSxNQUFUO0FBQWlCQyxRQUFBQSxJQUFJLEVBQUVOO0FBQXZCLE9BQWQsQ0FBTCxDQUNDTyxJQURELENBQ00sVUFBQUMsUUFBUTtBQUFBLGVBQUlBLFFBQVEsQ0FBQ0MsSUFBVCxFQUFKO0FBQUEsT0FEZCxFQUVDRixJQUZELENBRU0sVUFBQUcsSUFBSSxFQUFJO0FBQ2IsWUFBR0EsSUFBSSxDQUFDQyxNQUFMLEtBQWdCLFNBQW5CLEVBQThCO0FBQzdCLGNBQUd1QyxJQUFJLENBQUN4SSxZQUFMLENBQWtCLGVBQWxCLENBQUgsRUFBdUM7QUFDdEMsZ0JBQU1rSixRQUFRLEdBQUdWLElBQUksQ0FBQ3ZJLFlBQUwsQ0FBa0IsZUFBbEIsQ0FBakI7O0FBQ0EsZ0JBQUdpSixRQUFRLEtBQUssTUFBaEIsRUFBd0I7QUFDdkJ2SixjQUFBQSxRQUFRLENBQUNWLFFBQVQsQ0FBa0JrSyxNQUFsQjtBQUNBLGFBRkQsTUFFTztBQUNObkssY0FBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCbUssSUFBaEIsR0FBdUJGLFFBQXZCO0FBQ0E7QUFDRDs7QUFDRCxjQUFHVixJQUFJLENBQUN4SSxZQUFMLENBQWtCLFlBQWxCLENBQUgsRUFBb0M7QUFDbkN3SSxZQUFBQSxJQUFJLENBQUNhLEtBQUw7QUFDQTtBQUNEOztBQUVEN0MsUUFBQUEsU0FBUyxDQUFDUixJQUFJLENBQUNDLE1BQU4sRUFBY0QsSUFBSSxDQUFDTSxPQUFuQixDQUFUO0FBQ0EsT0FsQkQsRUFtQkNHLEtBbkJELENBbUJPLFVBQUFDLEtBQUssRUFBSTtBQUNmRixRQUFBQSxTQUFTLENBQUMsT0FBRCxFQUFVRSxLQUFWLENBQVQ7QUFDQSxPQXJCRDtBQXVCQTRDLE1BQUFBLFVBQVUsQ0FBQ2QsSUFBRCxDQUFWO0FBQ0EsS0FqQ0Q7QUFrQ0EsR0F2Q0E7O0FBeUNELFdBQVNFLFlBQVQsQ0FBc0JGLElBQXRCLEVBQTRCO0FBQzNCLFFBQU1lLFFBQVEsR0FBR2YsSUFBSSxDQUFDM0ksZ0JBQUwsQ0FBc0IsaUJBQXRCLENBQWpCOztBQUVBLGFBQVMySixTQUFULENBQW1CQyxPQUFuQixFQUE0QjtBQUMzQixVQUFJQyxJQUFJLEdBQUdELE9BQU8sQ0FBQ3hKLFlBQVIsQ0FBcUIsV0FBckIsQ0FBWDs7QUFDQSxVQUFHd0osT0FBTyxDQUFDeEosWUFBUixDQUFxQixNQUFyQixNQUFpQyxVQUFqQyxJQUErQyxDQUFDd0osT0FBTyxDQUFDRSxPQUEzRCxFQUFvRTtBQUNuRSxZQUFHRCxJQUFILEVBQVM7QUFDUkEsVUFBQUEsSUFBSSxJQUFJLE1BQU1ELE9BQU8sQ0FBQ3hKLFlBQVIsQ0FBcUIsV0FBckIsQ0FBZDtBQUNBLFNBRkQsTUFFTztBQUNOeUosVUFBQUEsSUFBSSxHQUFHRCxPQUFPLENBQUN4SixZQUFSLENBQXFCLFdBQXJCLENBQVA7QUFDQTtBQUNEOztBQUNELFVBQUd3SixPQUFPLENBQUN4SixZQUFSLENBQXFCLE1BQXJCLE1BQWlDLE9BQWpDLElBQTRDLENBQUN3SixPQUFPLENBQUNFLE9BQXhELEVBQWlFO0FBQ2hFRCxRQUFBQSxJQUFJLEdBQUcsSUFBUDtBQUNBOztBQUNELFVBQUdBLElBQUgsRUFBUztBQUNSQSxRQUFBQSxJQUFJLENBQUNFLEtBQUwsQ0FBVyxHQUFYLEVBQWdCOUosT0FBaEIsQ0FBd0IsVUFBQStKLE9BQU8sRUFBSTtBQUNsQyxjQUFNQyxJQUFJLEdBQUd0QixJQUFJLENBQUNoSSxhQUFMLENBQW1CLFlBQVlxSixPQUFaLEdBQXNCLElBQXpDLENBQWI7QUFDQSxjQUFNRSxNQUFNLEdBQUdELElBQUksQ0FBQ2xKLGFBQXBCOztBQUNBLGNBQUdtSixNQUFNLENBQUNsSixTQUFQLENBQWlCQyxRQUFqQixDQUEwQixjQUExQixDQUFILEVBQThDO0FBQzdDaUosWUFBQUEsTUFBTSxDQUFDbEosU0FBUCxDQUFpQjBDLEdBQWpCLENBQXFCLFFBQXJCO0FBQ0EsV0FGRCxNQUVPO0FBQ051RyxZQUFBQSxJQUFJLENBQUNqSixTQUFMLENBQWUwQyxHQUFmLENBQW1CLFFBQW5CO0FBQ0E7QUFDRCxTQVJEO0FBU0E7QUFDRDs7QUFFRCxhQUFTeUcsU0FBVCxDQUFtQlAsT0FBbkIsRUFBNEI7QUFDM0IsVUFBSVEsSUFBSSxHQUFHUixPQUFPLENBQUN4SixZQUFSLENBQXFCLFdBQXJCLENBQVg7O0FBQ0EsVUFBR3dKLE9BQU8sQ0FBQ3hKLFlBQVIsQ0FBcUIsTUFBckIsTUFBaUMsVUFBakMsSUFBK0MsQ0FBQ3dKLE9BQU8sQ0FBQ0UsT0FBM0QsRUFBb0U7QUFDbkVNLFFBQUFBLElBQUksR0FBRyxJQUFQO0FBQ0E7O0FBQ0QsVUFBR1IsT0FBTyxDQUFDeEosWUFBUixDQUFxQixNQUFyQixNQUFpQyxPQUFqQyxJQUE0QyxDQUFDd0osT0FBTyxDQUFDRSxPQUF4RCxFQUFpRTtBQUNoRU0sUUFBQUEsSUFBSSxHQUFHLElBQVA7QUFDQTs7QUFDRCxVQUFHQSxJQUFILEVBQVM7QUFDUkEsUUFBQUEsSUFBSSxDQUFDTCxLQUFMLENBQVcsR0FBWCxFQUFnQjlKLE9BQWhCLENBQXdCLFVBQUFvSyxPQUFPLEVBQUk7QUFDbEMsY0FBTUosSUFBSSxHQUFHdEIsSUFBSSxDQUFDaEksYUFBTCxDQUFtQixZQUFZMEosT0FBWixHQUFzQixJQUF6QyxDQUFiO0FBQ0EsY0FBTUgsTUFBTSxHQUFHRCxJQUFJLENBQUNsSixhQUFwQjs7QUFDQSxjQUFHbUosTUFBTSxDQUFDbEosU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsY0FBMUIsQ0FBSCxFQUE4QztBQUM3Q2lKLFlBQUFBLE1BQU0sQ0FBQ2xKLFNBQVAsQ0FBaUJrRSxNQUFqQixDQUF3QixRQUF4QjtBQUNBLFdBRkQsTUFFTztBQUNOK0UsWUFBQUEsSUFBSSxDQUFDakosU0FBTCxDQUFla0UsTUFBZixDQUFzQixRQUF0QjtBQUNBO0FBQ0QsU0FSRDtBQVNBO0FBQ0Q7O0FBRUR3RSxJQUFBQSxRQUFRLENBQUN6SixPQUFULENBQWlCLFVBQUEySixPQUFPLEVBQUk7QUFDM0I7QUFDQSxVQUFHQSxPQUFPLENBQUN4SixZQUFSLENBQXFCLGVBQXJCLE1BQTBDLFlBQTdDLEVBQTJEO0FBQzFEdUosUUFBQUEsU0FBUyxDQUFDQyxPQUFELENBQVQ7QUFDQU8sUUFBQUEsU0FBUyxDQUFDUCxPQUFELENBQVQ7QUFDQSxPQUwwQixDQU0zQjs7O0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQzdKLGdCQUFSLENBQXlCLFFBQXpCLEVBQW1DLFVBQUFPLEtBQUssRUFBSTtBQUMzQyxZQUFHc0osT0FBTyxDQUFDeEosWUFBUixDQUFxQixlQUFyQixNQUEwQyxZQUE3QyxFQUEyRDtBQUMxRHVKLFVBQUFBLFNBQVMsQ0FBQ0MsT0FBRCxDQUFUO0FBQ0FPLFVBQUFBLFNBQVMsQ0FBQ1AsT0FBRCxDQUFUO0FBQ0E7O0FBQ0QsWUFBR0EsT0FBTyxDQUFDeEosWUFBUixDQUFxQixlQUFyQixNQUEwQyxZQUE3QyxFQUEyRDtBQUMxRCxjQUFHd0osT0FBTyxDQUFDekosWUFBUixDQUFxQixhQUFyQixDQUFILEVBQXdDO0FBQ3ZDeUosWUFBQUEsT0FBTyxDQUFDeEosWUFBUixDQUFxQixhQUFyQixFQUFvQzJKLEtBQXBDLENBQTBDLEdBQTFDLEVBQStDOUosT0FBL0MsQ0FBdUQsVUFBQXFLLE1BQU0sRUFBSTtBQUNoRSxrQkFBTUMsV0FBVyxHQUFHNUIsSUFBSSxDQUFDaEksYUFBTCxDQUFtQixXQUFTMkosTUFBVCxHQUFnQixHQUFuQyxDQUFwQjs7QUFDQSxrQkFBR0MsV0FBSCxFQUFnQjtBQUNmQSxnQkFBQUEsV0FBVyxDQUFDM0ksS0FBWixHQUFvQjRJLFVBQVUsQ0FBQ1osT0FBTyxDQUFDaEksS0FBVCxDQUE5QjtBQUNBO0FBQ0QsYUFMRDtBQU1BLFdBUEQsTUFPTztBQUNOZ0ksWUFBQUEsT0FBTyxDQUFDaEksS0FBUixHQUFnQjRJLFVBQVUsQ0FBQ1osT0FBTyxDQUFDaEksS0FBVCxDQUExQjtBQUNBO0FBQ0Q7O0FBQ0QsWUFBR2dJLE9BQU8sQ0FBQ3hKLFlBQVIsQ0FBcUIsZUFBckIsTUFBMEMsTUFBN0MsRUFBcUQ7QUFDcEQsY0FBR3dKLE9BQU8sQ0FBQ3pKLFlBQVIsQ0FBcUIsYUFBckIsQ0FBSCxFQUF3QztBQUN2Q3lKLFlBQUFBLE9BQU8sQ0FBQ3hKLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0MySixLQUFwQyxDQUEwQyxHQUExQyxFQUErQzlKLE9BQS9DLENBQXVELFVBQUFxSyxNQUFNLEVBQUk7QUFDaEUsa0JBQU1DLFdBQVcsR0FBRzVCLElBQUksQ0FBQ2hJLGFBQUwsQ0FBbUIsV0FBUzJKLE1BQVQsR0FBZ0IsR0FBbkMsQ0FBcEI7O0FBQ0Esa0JBQUdDLFdBQUgsRUFBZ0I7QUFDZkEsZ0JBQUFBLFdBQVcsQ0FBQzNJLEtBQVosR0FBb0I2SSxJQUFJLENBQUNiLE9BQU8sQ0FBQ2hJLEtBQVQsQ0FBeEI7QUFDQTtBQUNELGFBTEQ7QUFNQSxXQVBELE1BT087QUFDTmdJLFlBQUFBLE9BQU8sQ0FBQ2hJLEtBQVIsR0FBZ0I2SSxJQUFJLENBQUNiLE9BQU8sQ0FBQ2hJLEtBQVQsQ0FBcEI7QUFDQTtBQUNEO0FBQ0QsT0E3QkQ7QUE4QkEsS0FyQ0Q7QUFzQ0E7O0FBRUQsV0FBU2tILFdBQVQsQ0FBcUJILElBQXJCLEVBQTJCO0FBQzFCQSxJQUFBQSxJQUFJLENBQUMzSCxTQUFMLENBQWUwQyxHQUFmLENBQW1CLFFBQW5CO0FBQ0FpRixJQUFBQSxJQUFJLENBQUNoSSxhQUFMLENBQW1CLGlCQUFuQixFQUFzQ2tFLFFBQXRDLEdBQWlELElBQWpEO0FBQ0E7O0FBQ0QsV0FBUzRFLFVBQVQsQ0FBb0JkLElBQXBCLEVBQTBCO0FBQ3pCQSxJQUFBQSxJQUFJLENBQUMzSCxTQUFMLENBQWVrRSxNQUFmLENBQXNCLFFBQXRCO0FBQ0F5RCxJQUFBQSxJQUFJLENBQUNoSSxhQUFMLENBQW1CLGlCQUFuQixFQUFzQ2tFLFFBQXRDLEdBQWlELEtBQWpEO0FBQ0EsR0FqZW1ELENBbWVwRDs7O0FBQ0EsTUFBTTZGLGNBQWMsR0FBRzVLLFFBQVEsQ0FBQ0UsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBdkI7QUFFQTBLLEVBQUFBLGNBQWMsQ0FBQ3pLLE9BQWYsQ0FBdUIsVUFBQTBLLE1BQU0sRUFBSTtBQUNoQ0EsSUFBQUEsTUFBTSxDQUFDNUssZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQU8sS0FBSyxFQUFJO0FBQ3pDQSxNQUFBQSxLQUFLLENBQUNPLGNBQU47QUFFQThKLE1BQUFBLE1BQU0sQ0FBQzlGLFFBQVAsR0FBa0IsSUFBbEI7O0FBRUEsVUFBRyxDQUFDOEYsTUFBTSxDQUFDeEssWUFBUCxDQUFvQixhQUFwQixDQUFKLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRUQsVUFBSXlLLFlBQVksR0FBRyxJQUFuQjs7QUFDQSxVQUFHRCxNQUFNLENBQUN4SyxZQUFQLENBQW9CLGNBQXBCLENBQUgsRUFBd0M7QUFDdkN5SyxRQUFBQSxZQUFZLEdBQUdDLE9BQU8sQ0FBQ0YsTUFBTSxDQUFDdkssWUFBUCxDQUFvQixjQUFwQixDQUFELENBQXRCO0FBQ0E7O0FBQ0QsVUFBRyxDQUFDd0ssWUFBSixFQUFrQjtBQUNqQjtBQUNBOztBQUVELFVBQUluRixRQUFRLEdBQUcsSUFBSUMsUUFBSixFQUFmO0FBRUFELE1BQUFBLFFBQVEsQ0FBQ3NELEdBQVQsQ0FBYUMsT0FBTyxDQUFDQyxJQUFSLENBQWFDLEdBQTFCLEVBQStCRixPQUFPLENBQUNDLElBQVIsQ0FBYUUsS0FBNUM7QUFFQXRELE1BQUFBLEtBQUssQ0FBQzhFLE1BQU0sQ0FBQ3ZLLFlBQVAsQ0FBb0IsYUFBcEIsQ0FBRCxFQUFxQztBQUFDMEYsUUFBQUEsTUFBTSxFQUFFLE1BQVQ7QUFBaUJDLFFBQUFBLElBQUksRUFBRU47QUFBdkIsT0FBckMsQ0FBTCxDQUNDTyxJQURELENBQ00sVUFBQUMsUUFBUTtBQUFBLGVBQUlBLFFBQVEsQ0FBQ0MsSUFBVCxFQUFKO0FBQUEsT0FEZCxFQUVDRixJQUZELENBRU0sVUFBQUcsSUFBSSxFQUFJO0FBQ2IsWUFBR0EsSUFBSSxDQUFDQyxNQUFMLEtBQWdCLFNBQW5CLEVBQThCO0FBQzdCO0FBQ0EsY0FBR3VFLE1BQU0sQ0FBQ3hLLFlBQVAsQ0FBb0IsZUFBcEIsQ0FBSCxFQUF5QztBQUN4QyxnQkFBTWtKLFFBQVEsR0FBR3NCLE1BQU0sQ0FBQ3ZLLFlBQVAsQ0FBb0IsZUFBcEIsQ0FBakI7O0FBQ0EsZ0JBQUdpSixRQUFRLEtBQUssTUFBaEIsRUFBd0I7QUFDdkJ2SixjQUFBQSxRQUFRLENBQUNWLFFBQVQsQ0FBa0JrSyxNQUFsQjtBQUNBLGFBRkQsTUFFTztBQUNObkssY0FBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCbUssSUFBaEIsR0FBdUJGLFFBQXZCO0FBQ0E7QUFDRCxXQVQ0QixDQVU3Qjs7O0FBQ0EsY0FBR3NCLE1BQU0sQ0FBQzVKLGFBQVAsQ0FBcUJDLFNBQXJCLENBQStCQyxRQUEvQixDQUF3QyxjQUF4QyxDQUFILEVBQTREO0FBQzNEO0FBQ0EscUJBQVM2SixPQUFULENBQWlCQyxFQUFqQixFQUFxQjtBQUNwQkEsY0FBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNDLE9BQVQsR0FBbUIsQ0FBbkI7O0FBQ0EsZUFBQyxTQUFTQyxJQUFULEdBQWdCO0FBQ2hCLG9CQUFJLENBQUNILEVBQUUsQ0FBQ0MsS0FBSCxDQUFTQyxPQUFULElBQW9CLEVBQXJCLElBQTJCLENBQS9CLEVBQWtDO0FBQ2pDRixrQkFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNHLE9BQVQsR0FBbUIsTUFBbkI7QUFDQSxpQkFGRCxNQUVPO0FBQ05DLGtCQUFBQSxxQkFBcUIsQ0FBQ0YsSUFBRCxDQUFyQjtBQUNBO0FBQ0QsZUFORDtBQU9BOztBQUFBO0FBQ0RKLFlBQUFBLE9BQU8sQ0FBQ0gsTUFBTSxDQUFDNUosYUFBUCxDQUFxQkEsYUFBdEIsQ0FBUDtBQUNBLFdBeEI0QixDQXlCN0I7OztBQUNBLGNBQUc0SixNQUFNLENBQUN4SyxZQUFQLENBQW9CLGNBQXBCLENBQUgsRUFBd0M7QUFDdkMsZ0JBQU1rTCxPQUFPLEdBQUd2TCxRQUFRLENBQUNhLGFBQVQsQ0FBdUJnSyxNQUFNLENBQUN2SyxZQUFQLENBQW9CLGNBQXBCLENBQXZCLENBQWhCO0FBQ0FpTCxZQUFBQSxPQUFPLENBQUM5QyxXQUFSLEdBQXNCakcsUUFBUSxDQUFDK0ksT0FBTyxDQUFDOUMsV0FBVCxDQUFSLEdBQWdDLENBQXREO0FBQ0E7QUFDRDs7QUFFRDVCLFFBQUFBLFNBQVMsQ0FBQ1IsSUFBSSxDQUFDQyxNQUFOLEVBQWNELElBQUksQ0FBQ00sT0FBbkIsQ0FBVDtBQUNBLE9BcENELEVBcUNDRyxLQXJDRCxDQXFDTyxVQUFBQyxLQUFLLEVBQUk7QUFDZkYsUUFBQUEsU0FBUyxDQUFDLE9BQUQsRUFBVUUsS0FBVixDQUFUO0FBQ0EsT0F2Q0Q7QUF5Q0E4RCxNQUFBQSxNQUFNLENBQUM5RixRQUFQLEdBQWtCLEtBQWxCO0FBQ0EsS0EvREQ7QUFnRUEsR0FqRUQ7O0FBdGVvRCxNQXlpQjdDeUcsV0F6aUI2QztBQTBpQm5ELHlCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQ2pCLFdBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLElBQUwsR0FBWUQsSUFBSSxDQUFDbkwsWUFBTCxDQUFrQixXQUFsQixDQUFaO0FBQ0EsV0FBS3dCLEtBQUwsR0FBYTJKLElBQUksQ0FBQ25MLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBYjtBQUNBLFdBQUtxTCxNQUFMLEdBQWNGLElBQUksQ0FBQ3ZMLGdCQUFMLENBQXNCLFFBQXRCLENBQWQ7QUFDQSxXQUFLMkssTUFBTCxHQUFjO0FBQ2JlLFFBQUFBLE1BQU0sRUFBRUgsSUFBSSxDQUFDNUssYUFBTCxDQUFtQixpQkFBbkIsQ0FESztBQUViZ0wsUUFBQUEsVUFBVSxFQUFFN0wsUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixNQUF2QjtBQUZDLE9BQWQ7QUFJQSxXQUFLZ0ksSUFBTCxHQUFZO0FBQ1hsSSxRQUFBQSxHQUFHLDRZQURRO0FBRVhtSSxRQUFBQSxJQUFJLDJmQUZPO0FBR1hDLFFBQUFBLElBQUksOFdBSE87QUFJWEMsUUFBQUEsTUFBTTtBQUpLLE9BQVo7QUFNQSxXQUFLQyxHQUFMLEdBQVcsS0FBS0MsV0FBTCxFQUFYO0FBQ0EsV0FBS0MsS0FBTCxHQUFhcE0sUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixPQUF2QixDQUFiO0FBQ0EsV0FBSzlDLEtBQUwsR0FBYWhCLFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLFdBQUt1SSxLQUFMLEdBQWFyTSxRQUFRLENBQUM4RCxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxXQUFLd0ksVUFBTCxHQUFrQixLQUFsQjtBQUNBLFdBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFFQSxXQUFLQyxVQUFMO0FBQ0E7O0FBamtCa0Q7QUFBQTtBQUFBLGFBbWtCbkQsc0JBQWE7QUFBQTs7QUFDWjtBQUNBLGFBQUtmLElBQUwsQ0FBVWxMLFlBQVYsQ0FBdUIsSUFBdkIsRUFBNkIsS0FBSzJMLEdBQWxDLEVBRlksQ0FJWjs7QUFDQSxhQUFLckIsTUFBTCxDQUFZZ0IsVUFBWixDQUF1QnRMLFlBQXZCLENBQW9DLGdCQUFwQyxFQUFzRCxPQUF0RDtBQUNBLGFBQUtzSyxNQUFMLENBQVlnQixVQUFaLENBQXVCdEwsWUFBdkIsQ0FBb0MsZ0JBQXBDLEVBQXNELE1BQU0sS0FBSzJMLEdBQWpFO0FBQ0EsYUFBS3JCLE1BQUwsQ0FBWWdCLFVBQVosQ0FBdUI3SCxTQUF2QixHQUFtQyxLQUFLOEgsSUFBTCxDQUFVbEksR0FBN0M7QUFDQSxhQUFLaUgsTUFBTCxDQUFZZ0IsVUFBWixDQUF1QjVMLGdCQUF2QixDQUF3QyxPQUF4QyxFQUFpRCxVQUFBTyxLQUFLLEVBQUk7QUFDekQsY0FBRyxDQUFDLEtBQUksQ0FBQzhMLFVBQVQsRUFBcUI7QUFDcEIsWUFBQSxLQUFJLENBQUNHLGVBQUw7QUFDQTtBQUNELFNBSkQsRUFSWSxDQWNaOztBQUNBLGFBQUtMLEtBQUwsQ0FBVzdMLFlBQVgsQ0FBd0IsTUFBeEIsRUFBZ0MsS0FBS21MLElBQXJDO0FBQ0EsYUFBS1UsS0FBTCxDQUFXN0wsWUFBWCxDQUF3QixNQUF4QixFQUFnQyxRQUFoQztBQUNBLGFBQUs2TCxLQUFMLENBQVdsTCxTQUFYLENBQXFCMEMsR0FBckIsQ0FBeUIsUUFBekIsRUFqQlksQ0FtQlo7O0FBQ0EsYUFBSzVDLEtBQUwsQ0FBV0UsU0FBWCxDQUFxQjBDLEdBQXJCLENBQXlCLE9BQXpCO0FBQ0EsYUFBSzVDLEtBQUwsQ0FBV0UsU0FBWCxDQUFxQjBDLEdBQXJCLENBQXlCLFVBQXpCO0FBRUEsYUFBS3lJLEtBQUwsQ0FBV25MLFNBQVgsQ0FBcUIwQyxHQUFyQixDQUF5QixVQUF6QjtBQUNBLFlBQUlxRSxRQUFKLENBQWEsS0FBS29FLEtBQWxCLEVBQXlCO0FBQ3hCbkUsVUFBQUEsTUFBTSxFQUFFLG1CQURnQjtBQUV4QkMsVUFBQUEsU0FBUyxFQUFFLEdBRmE7QUFHeEJ1RSxVQUFBQSxNQUFNLEVBQUU7QUFBQSxtQkFBTSxLQUFJLENBQUNDLFdBQUwsRUFBTjtBQUFBO0FBSGdCLFNBQXpCLEVBeEJZLENBOEJaOztBQUNBLGFBQUs5QixNQUFMLENBQVllLE1BQVosQ0FBbUIzTCxnQkFBbkIsQ0FBb0MsT0FBcEMsRUFBNkMsVUFBQU8sS0FBSyxFQUFJO0FBQ3JEQSxVQUFBQSxLQUFLLENBQUNPLGNBQU47O0FBRUEsVUFBQSxLQUFJLENBQUM2TCxXQUFMOztBQUNBLFVBQUEsS0FBSSxDQUFDRCxXQUFMOztBQUNBLFVBQUEsS0FBSSxDQUFDRixlQUFMO0FBQ0EsU0FORCxFQS9CWSxDQXVDWjs7QUFDQSxhQUFLSSxhQUFMO0FBQ0EsYUFBS0YsV0FBTDtBQUNBLGFBQUtHLE1BQUwsR0ExQ1ksQ0E0Q1o7O0FBQ0EsYUFBS3JCLElBQUwsQ0FBVXhMLGdCQUFWLENBQTJCLGlCQUEzQixFQUE4QztBQUFBLGlCQUFNLEtBQUksQ0FBQ3dNLGVBQUwsRUFBTjtBQUFBLFNBQTlDO0FBQ0E7QUFqbkJrRDtBQUFBO0FBQUEsYUFtbkJuRCx1QkFBYztBQUFBOztBQUNiO0FBQ0EsWUFBRyxLQUFLSCxVQUFSLEVBQW9CO0FBQ25CLGVBQUtYLE1BQUwsQ0FBWXhMLE9BQVosQ0FBb0IsVUFBQW9CLEtBQUssRUFBSTtBQUM1QixZQUFBLE1BQUksQ0FBQ2dMLFdBQUwsQ0FBaUIxTCxhQUFqQix3QkFBOENVLEtBQUssQ0FBQ21LLElBQXBELFVBQThEakQsV0FBOUQsR0FBNEVsSCxLQUFLLENBQUNPLEtBQWxGO0FBQ0EsV0FGRDtBQUlBLGVBQUsySyxlQUFMO0FBRUEsaUJBQU8sSUFBUDtBQUNBLFNBVlksQ0FZYjs7O0FBQ0EsYUFBS0osS0FBTCxDQUFXcEksV0FBWCxDQUF1QixLQUFLOEksU0FBTCxFQUF2QjtBQUVBLGVBQU8sSUFBUDtBQUNBO0FBbm9Ca0Q7QUFBQTtBQUFBLGFBcW9CbkQsdUJBQWM7QUFDYixZQUFJMUcsSUFBSSxHQUFHLEVBQVg7QUFFQSxhQUFLZ0csS0FBTCxDQUFXbk0sZ0JBQVgsQ0FBNEIsSUFBNUIsRUFBa0NDLE9BQWxDLENBQTBDLFVBQUE2TSxFQUFFLEVBQUk7QUFDL0MsY0FBSUMsR0FBRyxHQUFHLEVBQVY7QUFFQUQsVUFBQUEsRUFBRSxDQUFDOU0sZ0JBQUgsQ0FBb0IsSUFBcEIsRUFBMEJDLE9BQTFCLENBQWtDLFVBQUErTSxFQUFFLEVBQUk7QUFDdkMsZ0JBQUcsQ0FBQ0EsRUFBRSxDQUFDN00sWUFBSCxDQUFnQixXQUFoQixDQUFKLEVBQWtDO0FBQ2pDLHFCQUFPLEtBQVA7QUFDQTs7QUFDRDRNLFlBQUFBLEdBQUcsQ0FBQ0MsRUFBRSxDQUFDNU0sWUFBSCxDQUFnQixXQUFoQixDQUFELENBQUgsR0FBb0M0TSxFQUFFLENBQUN6RSxXQUF2QztBQUNBLFdBTEQ7QUFPQXBDLFVBQUFBLElBQUksQ0FBQ2pFLElBQUwsQ0FBVTZLLEdBQVY7QUFDQSxTQVhEO0FBYUEsYUFBS2IsS0FBTCxDQUFXdEssS0FBWCxHQUFtQkwsSUFBSSxDQUFDMEwsU0FBTCxDQUFlOUcsSUFBZixDQUFuQjtBQUVBLGVBQU8sSUFBUDtBQUNBO0FBeHBCa0Q7QUFBQTtBQUFBLGFBMHBCbkQsMkJBQWtCO0FBQ2pCLGFBQUtzRixNQUFMLENBQVl4TCxPQUFaLENBQW9CLFVBQUFvQixLQUFLLEVBQUk7QUFDNUIsY0FBR0EsS0FBSyxDQUFDNkwsT0FBTixDQUFjQyxXQUFkLE1BQStCLFFBQWxDLEVBQTRDO0FBQzNDOUwsWUFBQUEsS0FBSyxDQUFDK0wsYUFBTixHQUFzQixDQUF0Qjs7QUFDQSxnQkFBRyxDQUFDL0wsS0FBSyxDQUFDbEIsWUFBTixDQUFtQixhQUFuQixDQUFKLEVBQXVDO0FBQ3RDa0IsY0FBQUEsS0FBSyxDQUFDZ00sSUFBTixDQUFXdEUsR0FBWCxDQUFlMUgsS0FBSyxDQUFDTyxLQUFyQjtBQUNBO0FBQ0QsV0FMRCxNQUtPO0FBQ05QLFlBQUFBLEtBQUssQ0FBQ08sS0FBTixHQUFjLEVBQWQ7QUFDQTtBQUNELFNBVEQ7QUFXQSxhQUFLd0ssVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFFQSxlQUFPLElBQVA7QUFDQTtBQTFxQmtEO0FBQUE7QUFBQSxhQTRxQm5ELHFCQUF5QjtBQUFBOztBQUFBLFlBQWZpQixNQUFlLHVFQUFOLElBQU07QUFDeEIsWUFBTUMsSUFBSSxHQUFHek4sUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixJQUF2QixDQUFiOztBQUVBLFlBQUcwSixNQUFILEVBQVc7QUFDViw2Q0FBMEJFLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlSCxNQUFmLENBQTFCLHFDQUFrRDtBQUE5QztBQUFBLGdCQUFPcEUsR0FBUDtBQUFBLGdCQUFZdEgsS0FBWjs7QUFDSCxnQkFBTThMLElBQUksR0FBRzVOLFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUVBOEosWUFBQUEsSUFBSSxDQUFDck4sWUFBTCxDQUFrQixXQUFsQixFQUErQjZJLEdBQS9CO0FBQ0F3RSxZQUFBQSxJQUFJLENBQUNuRixXQUFMLEdBQW1CM0csS0FBbkI7QUFFQTJMLFlBQUFBLElBQUksQ0FBQ3hKLFdBQUwsQ0FBaUIySixJQUFqQjtBQUNBO0FBQ0QsU0FURCxNQVNPO0FBQ04sZUFBS2pDLE1BQUwsQ0FBWXhMLE9BQVosQ0FBb0IsVUFBQW9CLEtBQUssRUFBSTtBQUM1QixnQkFBTXFNLElBQUksR0FBRzVOLFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUVBOEosWUFBQUEsSUFBSSxDQUFDck4sWUFBTCxDQUFrQixXQUFsQixFQUErQmdCLEtBQUssQ0FBQ21LLElBQXJDO0FBQ0FrQyxZQUFBQSxJQUFJLENBQUNuRixXQUFMLEdBQW1CbEgsS0FBSyxDQUFDTyxLQUF6QjtBQUVBMkwsWUFBQUEsSUFBSSxDQUFDeEosV0FBTCxDQUFpQjJKLElBQWpCO0FBQ0EsV0FQRDtBQVFBOztBQUVELFlBQU1DLFlBQVksR0FBRzdOLFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsSUFBdkIsQ0FBckI7QUFDQStKLFFBQUFBLFlBQVksQ0FBQzNNLFNBQWIsQ0FBdUIwQyxHQUF2QixDQUEyQixjQUEzQjtBQUVBLFlBQU1rSyxRQUFRLEdBQUc5TixRQUFRLENBQUM4RCxhQUFULENBQXVCLE1BQXZCLENBQWpCO0FBQ0EsWUFBTWlLLFFBQVEsR0FBRy9OLFFBQVEsQ0FBQzhELGFBQVQsQ0FBdUIsTUFBdkIsQ0FBakI7QUFDQSxZQUFNa0ssVUFBVSxHQUFHaE8sUUFBUSxDQUFDOEQsYUFBVCxDQUF1QixNQUF2QixDQUFuQjtBQUVBZ0ssUUFBQUEsUUFBUSxDQUFDOUosU0FBVCxHQUFxQixLQUFLOEgsSUFBTCxDQUFVQyxJQUFWLEdBQWlCLEdBQXRDO0FBQTJDK0IsUUFBQUEsUUFBUSxDQUFDNU0sU0FBVCxDQUFtQjBDLEdBQW5CLENBQXVCLGtCQUF2QjtBQUMzQ21LLFFBQUFBLFFBQVEsQ0FBQy9KLFNBQVQsR0FBcUIsS0FBSzhILElBQUwsQ0FBVUUsSUFBVixHQUFpQixHQUF0QztBQUNBZ0MsUUFBQUEsVUFBVSxDQUFDaEssU0FBWCxHQUF1QixLQUFLOEgsSUFBTCxDQUFVRyxNQUFqQztBQUVBOEIsUUFBQUEsUUFBUSxDQUFDOU4sZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUM7QUFBQSxpQkFBTSxNQUFJLENBQUNnTyxTQUFMLENBQWVSLElBQWYsQ0FBTjtBQUFBLFNBQW5DO0FBQ0FPLFFBQUFBLFVBQVUsQ0FBQy9OLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDO0FBQUEsaUJBQU0sTUFBSSxDQUFDaU8sV0FBTCxDQUFpQlQsSUFBakIsQ0FBTjtBQUFBLFNBQXJDO0FBRUFJLFFBQUFBLFlBQVksQ0FBQ2hJLE1BQWIsQ0FBb0JpSSxRQUFwQjtBQUNBRCxRQUFBQSxZQUFZLENBQUNoSSxNQUFiLENBQW9Ca0ksUUFBcEI7QUFDQUYsUUFBQUEsWUFBWSxDQUFDaEksTUFBYixDQUFvQm1JLFVBQXBCO0FBRUFQLFFBQUFBLElBQUksQ0FBQ3hKLFdBQUwsQ0FBaUI0SixZQUFqQjtBQUVBLGVBQU9KLElBQVA7QUFDQTtBQXh0QmtEO0FBQUE7QUFBQSxhQTB0Qm5ELG1CQUFVQSxJQUFWLEVBQWdCO0FBQUE7O0FBQ2YsYUFBSzlCLE1BQUwsQ0FBWXhMLE9BQVosQ0FBb0IsVUFBQW9CLEtBQUssRUFBSTtBQUM1QixjQUFNTyxLQUFLLEdBQUcyTCxJQUFJLENBQUM1TSxhQUFMLHdCQUFrQ1UsS0FBSyxDQUFDbUssSUFBeEMsVUFBa0RqRCxXQUFoRTs7QUFFQSxjQUFHbEgsS0FBSyxDQUFDNkwsT0FBTixDQUFjQyxXQUFkLE1BQStCLFFBQS9CLElBQTJDLENBQUM5TCxLQUFLLENBQUNsQixZQUFOLENBQW1CLGFBQW5CLENBQS9DLEVBQWtGO0FBQ2pGa0IsWUFBQUEsS0FBSyxDQUFDZ00sSUFBTixDQUFXdEUsR0FBWCxDQUFlbkgsS0FBZjtBQUNBLFdBRkQsTUFFTztBQUNOUCxZQUFBQSxLQUFLLENBQUNPLEtBQU4sR0FBY0EsS0FBZDtBQUNBOztBQUVELFVBQUEsTUFBSSxDQUFDd0ssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUEsTUFBSSxDQUFDQyxXQUFMLEdBQW1Ca0IsSUFBbkI7O0FBRUEsVUFBQSxNQUFJLENBQUM1QyxNQUFMLENBQVlnQixVQUFaLENBQXVCcEcsS0FBdkI7QUFDQSxTQWJEO0FBY0E7QUF6dUJrRDtBQUFBO0FBQUEsYUEydUJuRCxxQkFBWWdJLElBQVosRUFBa0I7QUFDakJBLFFBQUFBLElBQUksQ0FBQ3JJLE1BQUw7QUFDQSxhQUFLdUgsV0FBTDtBQUNBO0FBOXVCa0Q7QUFBQTtBQUFBLGFBZ3ZCbkQseUJBQWdCO0FBQUE7O0FBQ2YsWUFBRyxDQUFDLEtBQUs3SyxLQUFULEVBQWdCO0FBQ2YsaUJBQU8sSUFBUDtBQUNBOztBQUVELFlBQU1xTSxNQUFNLEdBQUcxTSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxLQUFLSSxLQUFoQixDQUFmO0FBRUFxTSxRQUFBQSxNQUFNLENBQUNoTyxPQUFQLENBQWUsVUFBQTJCLEtBQUssRUFBSTtBQUN2QixVQUFBLE1BQUksQ0FBQ3VLLEtBQUwsQ0FBV3BJLFdBQVgsQ0FBdUIsTUFBSSxDQUFDOEksU0FBTCxDQUFlakwsS0FBZixDQUF2QjtBQUNBLFNBRkQ7QUFJQSxlQUFPLElBQVA7QUFDQTtBQTV2QmtEO0FBQUE7QUFBQSxhQTh2Qm5ELGtCQUFTO0FBQ1IsYUFBS2QsS0FBTCxDQUFXaUQsV0FBWCxDQUF1QixLQUFLb0ksS0FBNUI7QUFFQSxhQUFLWixJQUFMLENBQVUyQyxNQUFWLENBQWlCLEtBQUt2RCxNQUFMLENBQVlnQixVQUE3QjtBQUNBLGFBQUtKLElBQUwsQ0FBVTJDLE1BQVYsQ0FBaUIsS0FBS2hDLEtBQXRCO0FBQ0EsYUFBS1gsSUFBTCxDQUFVMkMsTUFBVixDQUFpQixLQUFLcE4sS0FBdEI7QUFFQSxlQUFPLElBQVA7QUFDQTtBQXR3QmtEO0FBQUE7QUFBQSxhQXd3Qm5ELHVCQUFjO0FBQ2IsZUFBTyxRQUFRcU4sSUFBSSxDQUFDQyxNQUFMLEdBQWNDLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkJDLEtBQTNCLENBQWlDLENBQWpDLENBQWY7QUFDQTtBQTF3QmtEOztBQUFBO0FBQUE7O0FBNndCcER4TyxFQUFBQSxRQUFRLENBQUNFLGdCQUFULENBQTBCLHlCQUExQixFQUFxREMsT0FBckQsQ0FBNkQsVUFBQU4sT0FBTyxFQUFJO0FBQ3ZFLFFBQUkyTCxXQUFKLENBQWdCM0wsT0FBaEI7QUFDQSxHQUZEO0FBR0MsQ0FoeEJEOztBQWt4QkFSLE1BQU0sQ0FBQ29QLE1BQVAsR0FBZ0IsWUFBTTtBQUNyQjtBQUNBLE1BQU1DLE1BQU0sR0FBRzFPLFFBQVEsQ0FBQ0UsZ0JBQVQsQ0FBMEIsS0FBMUIsQ0FBZjtBQUNBd08sRUFBQUEsTUFBTSxDQUFDdk8sT0FBUCxDQUFlLFVBQUF3TyxLQUFLLEVBQUk7QUFDdkIsUUFBR0EsS0FBSyxDQUFDQyxRQUFOLElBQWtCLE9BQU9ELEtBQUssQ0FBQ0UsWUFBYixJQUE2QixXQUEvQyxJQUE4REYsS0FBSyxDQUFDRSxZQUFOLElBQXNCLENBQXZGLEVBQTBGO0FBQ3pGRixNQUFBQSxLQUFLLENBQUNHLEdBQU4sR0FBWXJQLElBQUksQ0FBQ0UsaUJBQWpCO0FBQ0E7QUFDRCxHQUpEO0FBS0EsQ0FSRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNFVFRJTkdTXHJcbmNvbnN0IEJBU0VfVVJMID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG5cclxuY29uc3QgRUxFTSA9IHtcclxuXHRsb2FkZXI6ICc8ZGl2IGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgdGV4dC1wcmltYXJ5XCIgcm9sZT1cInN0YXR1c1wiPjxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+TG9hZGluZy4uLjwvc3Bhbj48L2Rpdj4nLFxyXG5cdGltYWdlX3BsYWNlaG9sZGVyOiBCQVNFX1VSTCArICcvbW9kdWxlL0FkbWluL0Fzc2V0L2ltZy9ub19pbWFnZS5qcGcnXHJcbn07XHJcblxyXG4vLyBGVU5DVElPTlNcclxuZnVuY3Rpb24gU21vb3RoU2Nyb2xsVG8oZWxlbWVudCkge1xyXG5cdGlmKGVsZW1lbnQpIHtcclxuXHRcdGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xyXG5cdFx0XHRcdGJlaGF2aW9yOiAnc21vb3RoJ1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cdC8vIFNNT09USCBTQ1JPTExcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJykuZm9yRWFjaChhbmNob3IgPT4ge1xyXG5cdFx0aWYoYW5jaG9yLmhhc0F0dHJpYnV0ZSgndGFyZ2V0JykgJiYgYW5jaG9yLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgPT09ICdfYmxhbmsnKSB7XHJcblx0XHRcdGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyIG5vZm9sbG93Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWFuY2hvci5oYXNBdHRyaWJ1dGUoJ2RhdGEtYnMtdG9nZ2xlJykpIHtcclxuXHRcdFx0YW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGFuY2hvcl9ocmVmID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHRcdFx0XHRpZihhbmNob3JfaHJlZi5jaGFyQXQoMCkgPT09ICcjJyB8fCAoYW5jaG9yX2hyZWYuY2hhckF0KDApID09PSAnLycgJiYgYW5jaG9yX2hyZWYuY2hhckF0KDEpID09PSAnIycpKSB7XHJcblx0XHRcdFx0XHRjb25zdCBzY3JvbGxfdG9fbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZXZlbnQuY3VycmVudFRhcmdldC5oYXNoKTtcclxuXHRcdFx0XHRcdGlmKHNjcm9sbF90b19ub2RlKSB7XHJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdFNtb290aFNjcm9sbFRvKHNjcm9sbF90b19ub2RlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvLyBSRVNQT05TSVZFIFRBQkxFU1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlJykuZm9yRWFjaCh0YWJsZSA9PiB7XHJcblx0XHRpZighdGFibGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYmxlLXJlc3BvbnNpdmUnKSkge1xyXG5cdFx0XHR0YWJsZS5vdXRlckhUTUwgPSAnPGRpdiBjbGFzcz1cInRhYmxlLXJlc3BvbnNpdmVcIj4nICsgdGFibGUub3V0ZXJIVE1MICsgJzwvZGl2Pic7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIEZJTEVQT05EXHJcblx0Y29uc3QgcG9uZF9pbnB1dF9kYXRhID0ge1xyXG5cdGZpbGVzOiBpbnB1dCA9PiB7XHJcblx0XHRsZXQgZmlsZXMgPSBbXTtcclxuXHRcdGlmKCFpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSkge1xyXG5cdFx0XHRyZXR1cm4gZmlsZXM7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGlucHV0X2ZpbGVzID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyk7XHJcblxyXG5cdFx0aWYoIWlucHV0X2ZpbGVzIHx8IGlucHV0X2ZpbGVzID09ICdbXScpIHtcclxuXHRcdFx0cmV0dXJuIGZpbGVzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlucHV0X2ZpbGVzID0gSlNPTi5wYXJzZShpbnB1dF9maWxlcyk7XHJcblx0XHRcclxuXHRcdGlucHV0X2ZpbGVzLmZvckVhY2goZmlsZSA9PiB7XHJcblx0XHRcdGxldCBmaWxlX29iaiA9IHtcclxuXHRcdFx0XHRzb3VyY2U6IGZpbGUudmFsdWUsXHJcblx0XHRcdFx0b3B0aW9uczoge1xyXG5cdFx0XHRcdFx0dHlwZTogJ2xvY2FsJyxcclxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmKHBvbmRfaW5wdXRfZGF0YS5hbGxvd0ltYWdlUHJldmlldyhpbnB1dCkpIHtcclxuXHRcdFx0XHRmaWxlX29iai5vcHRpb25zLm1ldGFkYXRhLnBvc3RlciA9IGZpbGUucG9zdGVyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaWxlcy5wdXNoKGZpbGVfb2JqKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmlsZXM7XHJcblx0fSxcclxuXHRhbGxvd0ltYWdlUHJldmlldzogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aWV3JykgPT0gJ2ZhbHNlJyA/IGZhbHNlIDogdHJ1ZTtcclxuXHR9LFxyXG5cdG1heFRvdGFsRmlsZVNpemU6IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWF4LXRvdGFsLXNpemUnKSA/IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXgtdG90YWwtc2l6ZScpIDogbnVsbDtcclxuXHR9LFxyXG5cdG1heEZpbGVTaXplOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW1heC1zaXplJykgPyBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF4LXNpemUnKSA6IG51bGw7XHJcblx0fSxcclxuXHRtYXhGaWxlczogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYXgtZmlsZXMnKSA/IHBhcnNlSW50KGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXgtZmlsZXMnKSkgOiBudWxsO1xyXG5cdH0sXHJcblx0c3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbzogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1hc3BlY3QtcmF0aW8nKSA/IHBhcnNlSW50KGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1hc3BlY3QtcmF0aW8nKSkgOiAwLjU2MjU7XHJcblx0fVxyXG59O1xyXG5cclxuY29uc3QgZmlsZV9pbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpO1xyXG5cclxuaWYoZmlsZV9pbnB1dHMpIHtcclxuXHRmaWxlX2lucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRcdGNvbnN0IHBvbmQgPSBGaWxlUG9uZC5jcmVhdGUoXHJcblx0XHRcdGlucHV0LCB7XHJcblx0XHRcdFx0c2VydmVyOiB7bG9hZDogJy91cGxvYWQ/bG9hZD0nfSxcclxuXHRcdFx0XHRzdG9yZUFzRmlsZTogdHJ1ZSxcclxuXHRcdFx0XHRpbnN0YW50VXBsb2FkOiBmYWxzZSxcclxuXHRcdFx0XHRhbGxvd1Byb2Nlc3M6IGZhbHNlLFxyXG5cdFx0XHRcdGFsbG93UmV2ZXJ0OiBmYWxzZSxcclxuXHRcdFx0XHRhbGxvd1Jlb3JkZXI6IHRydWUsXHJcblx0XHRcdFx0ZHJvcE9uUGFnZTogdHJ1ZSxcclxuXHRcdFx0XHRkcm9wT25FbGVtZW50OiBmaWxlX2lucHV0cy5sZW5ndGggPT0gMSA/IGZhbHNlIDogdHJ1ZSxcclxuXHRcdFx0XHRmaWxlczogcG9uZF9pbnB1dF9kYXRhLmZpbGVzKGlucHV0KSxcclxuXHRcdFx0XHRhbGxvd0ltYWdlUHJldmlldzogcG9uZF9pbnB1dF9kYXRhLmFsbG93SW1hZ2VQcmV2aWV3KGlucHV0KSxcclxuXHRcdFx0XHRtYXhUb3RhbEZpbGVTaXplOiBwb25kX2lucHV0X2RhdGEubWF4VG90YWxGaWxlU2l6ZShpbnB1dCksXHJcblx0XHRcdFx0bWF4RmlsZVNpemU6IHBvbmRfaW5wdXRfZGF0YS5tYXhGaWxlU2l6ZShpbnB1dCksXHJcblx0XHRcdFx0bWF4RmlsZXM6IHBvbmRfaW5wdXRfZGF0YS5tYXhGaWxlcyhpbnB1dCksXHJcblx0XHRcdFx0c3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbzogcG9uZF9pbnB1dF9kYXRhLnN0eWxlSXRlbVBhbmVsQXNwZWN0UmF0aW8oaW5wdXQpLFxyXG5cdFx0XHRcdGNyZWRpdHM6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0aWYoaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykpIHtcclxuXHRcdFx0cG9uZC5zZXRPcHRpb25zKHtcclxuXHRcdFx0XHRsYWJlbElkbGU6IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5cdC8vIFFVSUxMXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWFbY2xhc3MqPVwid3lzaXd5Z1wiXScpLmZvckVhY2godGV4dGFyZWEgPT4ge1xyXG5cdHRleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcblxyXG5cdGNvbnN0IHd5c2l3eWdfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdGNvbnN0IHF1aWxsX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRxdWlsbF9ub2RlLmlubmVySFRNTCA9IHRleHRhcmVhLnZhbHVlO1xyXG5cclxuXHR3eXNpd3lnX25vZGUuY2xhc3NMaXN0LmFkZCgnd3lzaXd5ZycpO1xyXG5cdHd5c2l3eWdfbm9kZS5hcHBlbmRDaGlsZChxdWlsbF9ub2RlKTtcclxuXHR0ZXh0YXJlYS5hZnRlcih3eXNpd3lnX25vZGUpO1xyXG5cclxuXHRjb25zdCBxdWlsbCA9IG5ldyBRdWlsbChxdWlsbF9ub2RlLCB7XHJcblx0XHRtb2R1bGVzOiB7XHJcblx0XHRcdHRvb2xiYXI6IHtcclxuXHRcdFx0XHRcdGNvbnRhaW5lcjogW1xyXG5cdFx0XHRcdFx0XHRbeyBoZWFkZXI6IFsyLCAzLCBmYWxzZV0gfV0sXHJcblx0XHRcdFx0XHRcdFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZSddLFxyXG5cdFx0XHRcdFx0XHRbeydhbGlnbic6IFtdfSwgeydsaXN0JzogJ29yZGVyZWQnfSwgeydsaXN0JzogJ2J1bGxldCd9XSxcclxuXHRcdFx0XHRcdFx0W3snY29sb3InOiBbXX0sIHsnYmFja2dyb3VuZCc6IFtdfV0sXHJcblx0XHRcdFx0XHRcdFsnbGluaycsICdpbWFnZScsICd2aWRlbycsICdibG9ja3F1b3RlJywgJ2NvZGUnXSxcclxuXHRcdFx0XHRcdFx0W3snaW5kZW50JzogJy0xJ30sIHsnaW5kZW50JzogJysxJ31dLFxyXG5cdFx0XHRcdFx0XHRbeydzY3JpcHQnOiAnc3ViJ30sIHsnc2NyaXB0JzogJ3N1cGVyJ31dLFxyXG5cdFx0XHRcdFx0XHRbJ2NsZWFuJ10sIFsnZXhwYW5kJ11cclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRoYW5kbGVyczoge1xyXG5cdFx0XHRcdFx0XHQnaW1hZ2UnOiBldmVudCA9PiB7XHJcblx0XHRcdFx0XHRcdFx0dXBsb2FkSW1hZ2UoKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2V4cGFuZCc6IGV2ZW50ID0+IHtcclxuXHRcdFx0XHRcdFx0XHR3eXNpd3lnX25vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsc2NyZWVuJykgPyAgbWluaW1pemUoKSA6IG1heGltaXplKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHBsYWNlaG9sZGVyOiB0ZXh0YXJlYS5wbGFjZWhvbGRlcixcclxuXHRcdHJlYWRPbmx5OiB0ZXh0YXJlYS5kaXNhYmxlZCA/IHRydWUgOiBmYWxzZSxcclxuXHRcdHRoZW1lOiAnc25vdydcclxuXHR9KTtcclxuXHJcblx0Ly8gUE9QVUxBVEVcclxuXHQvLyBxdWlsbC5zZXRDb250ZW50cyhKU09OLnBhcnNlKHRleHRhcmVhLnZhbHVlKS5vcHMpO1xyXG5cclxuXHQvLyBVUERBVEUgVEVYVEFSRUEgVkFMVUVcclxuXHRxdWlsbC5vbignZWRpdG9yLWNoYW5nZScsIGV2ZW50ID0+IHtcclxuXHRcdC8vIHRleHRhcmVhLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkocXVpbGwuZ2V0Q29udGVudHMoKSk7XHJcblx0XHR0ZXh0YXJlYS52YWx1ZSA9IHF1aWxsLnJvb3QuaW5uZXJIVE1MO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBFWFBBTkQgQlVUVE9OXHJcblx0Y29uc3QgZXhwYW5kID0gd3lzaXd5Z19ub2RlLnF1ZXJ5U2VsZWN0b3IoJy5xbC1leHBhbmQnKTtcclxuXHRmdW5jdGlvbiBtYXhpbWl6ZSgpIHtcclxuXHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRpZihleHBhbmQpIGV4cGFuZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gbWluaW1pemUoKSB7XHJcblx0XHR3eXNpd3lnX25vZGUuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbHNjcmVlbicpO1xyXG5cdFx0aWYoZXhwYW5kKSBleHBhbmQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0fVxyXG5cclxuXHQvLyBJTUFHRSBVUExPQURcclxuXHRjb25zdCBJbWFnZSA9IFF1aWxsLmltcG9ydCgnZm9ybWF0cy9pbWFnZScpO1xyXG5cdEltYWdlLmNsYXNzTmFtZSA9ICdpbWFnZS1mbHVpZCc7XHJcblx0UXVpbGwucmVnaXN0ZXIoSW1hZ2UsIHRydWUpO1xyXG5cclxuXHRmdW5jdGlvbiB1cGxvYWRJbWFnZSgpIHtcclxuXHRcdGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdmaWxlJyk7XHJcblx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FjY2VwdCcsICdpbWFnZS8qJyk7XHJcblx0XHRpbnB1dC5jbGljaygpO1xyXG5cclxuXHRcdGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XHJcblxyXG5cdFx0XHRpZihmaWxlKSB7XHJcblx0XHRcdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblx0XHRcdFx0Zm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XHJcblxyXG5cdFx0XHRcdHF1aWxsLmVuYWJsZShmYWxzZSk7XHJcblxyXG5cdFx0XHRcdGZldGNoKCcvdXBsb2FkJywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblx0XHRcdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG5cdFx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0aWYoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBzZWxlY3Rpb24gPSBxdWlsbC5nZXRTZWxlY3Rpb24oKS5pbmRleDtcclxuXHRcdFx0XHRcdFx0cXVpbGwuaW5zZXJ0RW1iZWQoc2VsZWN0aW9uLCAnaW1hZ2UnLCBCQVNFX1VSTCArICcvJyArIGRhdGEubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRcdHF1aWxsLnNldFNlbGVjdGlvbihzZWxlY3Rpb24gKyAxKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5jYXRjaChlcnJvciA9PiB7XHJcblx0XHRcdFx0XHRtYWtlQWxlcnQoJ2Vycm9yJywgZXJyb3IpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRxdWlsbC5lbmFibGUodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fVxyXG5cclxufSk7XHJcblxyXG5cdC8vIFNMSU1TRUxFQ1RcclxuXHRjb25zdCBzbGltc2VsZWN0X2RhdGEgPSB7XHJcblx0YWRkYWJsZTogc2VsZWN0ID0+IHtcclxuXHRcdGlmKCFzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRsZXQgdmFsID0gdmFsdWU7XHJcblxyXG5cdFx0XHRzd2l0Y2goc2VsZWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1hZGRhYmxlJykpIHtcclxuXHRcdFx0XHRjYXNlICd0YWcnOiB7XHJcblx0XHRcdFx0XHR2YWwgPSB2YWx1ZS5yZXBsYWNlQWxsKC9bXlxccHtMfVxcZCBdKy9naXUsICcnKS5yZXBsYWNlQWxsKC9bXFxzXSsvZywgJyAnKS50cmltKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdFx0dmFsID0gdmFsdWUucmVwbGFjZUFsbCgvW1xcc10rL2csICcgJykudHJpbSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YWxsb3dEZXNlbGVjdDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QucXVlcnlTZWxlY3Rvcignb3B0aW9uW2RhdGEtcGxhY2Vob2xkZXJdJykgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRkZXNlbGVjdExhYmVsOiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxOFwiIHkxPVwiNlwiIHgyPVwiNlwiIHkyPVwiMThcIj48L2xpbmU+PGxpbmUgeDE9XCI2XCIgeTE9XCI2XCIgeDI9XCIxOFwiIHkyPVwiMThcIj48L2xpbmU+PC9zdmc+JztcclxuXHR9LFxyXG5cdGhpZGVTZWxlY3RlZE9wdGlvbjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QubXVsdGlwbGUgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRjbG9zZU9uU2VsZWN0OiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5tdWx0aXBsZSA/IGZhbHNlIDogdHJ1ZTtcclxuXHR9LFxyXG5cdHNob3dTZWFyY2g6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKS5sZW5ndGggPiAxMCB8fCBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRwbGFjZWhvbGRlcjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoUGxhY2Vob2xkZXI6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gc2VsZWN0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlci1zZWFyY2gnKSA/IHNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXItc2VhcmNoJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoVGV4dDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgOiBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlbGVjdCcpLmZvckVhY2goc2VsZWN0ID0+IHtcclxuXHRpZihzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdFxyXG5cdG5ldyBTbGltU2VsZWN0KHtcclxuXHRcdHNlbGVjdDogc2VsZWN0LFxyXG5cdFx0YWRkYWJsZTogc2xpbXNlbGVjdF9kYXRhLmFkZGFibGUoc2VsZWN0KSxcclxuXHRcdGFsbG93RGVzZWxlY3Q6IHNsaW1zZWxlY3RfZGF0YS5hbGxvd0Rlc2VsZWN0KHNlbGVjdCksXHJcblx0XHRkZXNlbGVjdExhYmVsOiBzbGltc2VsZWN0X2RhdGEuZGVzZWxlY3RMYWJlbChzZWxlY3QpLFxyXG5cdFx0Ly8gaGlkZVNlbGVjdGVkT3B0aW9uOiBzbGltc2VsZWN0X2RhdGEuaGlkZVNlbGVjdGVkT3B0aW9uKHNlbGVjdCksIC8vIG5vdCB3b3JrIHdpdGggb3B0Z3JvdXBzXHJcblx0XHRjbG9zZU9uU2VsZWN0OiBzbGltc2VsZWN0X2RhdGEuY2xvc2VPblNlbGVjdChzZWxlY3QpLFxyXG5cdFx0c2hvd1NlYXJjaDogc2xpbXNlbGVjdF9kYXRhLnNob3dTZWFyY2goc2VsZWN0KSxcclxuXHRcdHBsYWNlaG9sZGVyOiBzbGltc2VsZWN0X2RhdGEucGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHBsYWNlaG9sZGVyVGV4dDogc2xpbXNlbGVjdF9kYXRhLnBsYWNlaG9sZGVyKHNlbGVjdCksXHJcblx0XHRzZWFyY2hQbGFjZWhvbGRlcjogc2xpbXNlbGVjdF9kYXRhLnNlYXJjaFBsYWNlaG9sZGVyKHNlbGVjdCksXHJcblx0XHRzZWFyY2hUZXh0OiBzbGltc2VsZWN0X2RhdGEuc2VhcmNoVGV4dChzZWxlY3QpLFxyXG5cdFx0c2hvd0NvbnRlbnQ6IFwiZG93blwiXHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHQvLyBTT1JUQUJMRVxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzcyo9XCJzb3J0YWJsZVwiXScpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcblx0bmV3IFNvcnRhYmxlKGVsZW1lbnQsIHtcclxuXHRcdGhhbmRsZTogJy5zb3J0YWJsZV9faGFuZGxlJyxcclxuXHRcdGFuaW1hdGlvbjogMTUwXHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHQvLyBUT0FTVFNcclxuXHRmdW5jdGlvbiBtYWtlQWxlcnQodHlwZSwgdGV4dCwgdGltZSA9IDUwMDApIHtcclxuXHRpZighdGV4dCB8fCAhdGV4dC5sZW5ndGgpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9hc3RzJyk7XHJcblx0aWYoIWNvbnRhaW5lcikge1xyXG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9hc3RzJyk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHR0b2FzdC5jbGFzc0xpc3QuYWRkKCd0b2FzdHNfX2l0ZW0nKTtcclxuXHRpZih0eXBlKSB7XHJcblx0XHR0b2FzdC5jbGFzc0xpc3QuYWRkKHR5cGUpO1xyXG5cdH1cclxuXHJcblx0bGV0IHRvYXN0X2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblx0dG9hc3RfaWNvbi5jbGFzc0xpc3QuYWRkKCd0b2FzdHNfX2ljb24nKTtcclxuXHRpZih0eXBlKSB7XHJcblx0XHR0b2FzdF9pY29uLmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3RfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHR0b2FzdF90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19fdGV4dCcpO1xyXG5cdHRvYXN0X3RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuXHR0b2FzdC5hcHBlbmRDaGlsZCh0b2FzdF9pY29uKTtcclxuXHR0b2FzdC5hcHBlbmRDaGlsZCh0b2FzdF90ZXh0KTtcclxuXHJcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcclxuXHJcblx0dG9hc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZUFsZXJ0KGNvbnRhaW5lciwgdG9hc3QpKTtcclxuXHJcblx0c2V0VGltZW91dCgoKSA9PiBjbG9zZUFsZXJ0KGNvbnRhaW5lciwgdG9hc3QpLCB0aW1lKTtcclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCkge1xyXG5cdHRvYXN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FwcGVhcicpO1xyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0dG9hc3QucmVtb3ZlKCk7XHJcblx0XHRpZihjb250YWluZXIgJiYgY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHtcclxuXHRcdFx0Y29udGFpbmVyLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH0sIDUwMCk7XHJcbn1cclxuXHJcblx0Ly8gRk9STVNcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykuZm9yRWFjaChmb3JtID0+IHtcclxuXHRmb3JtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgRUxFTS5sb2FkZXIpO1xyXG5cclxuXHRmb3JtQmVoYXZpb3IoZm9ybSk7XHJcblxyXG5cdGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZXZlbnQgPT4ge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFxyXG5cdFx0ZGlzYWJsZUZvcm0oZm9ybSk7XHJcblxyXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuXHRcdGZvcm1EYXRhLnNldChTRVRUSU5HLmNzcmYua2V5LCBTRVRUSU5HLmNzcmYudG9rZW4pO1xyXG5cclxuXHRcdGZldGNoKGZvcm0uYWN0aW9uLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuXHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0aWYoZm9ybS5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVkaXJlY3QnKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmVkaXJlY3QgPSBmb3JtLmdldEF0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpO1xyXG5cdFx0XHRcdFx0aWYocmVkaXJlY3QgPT09ICd0aGlzJykge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3Q7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGZvcm0uaGFzQXR0cmlidXRlKCdkYXRhLXJlc2V0JykpIHtcclxuXHRcdFx0XHRcdGZvcm0ucmVzZXQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xyXG5cdFx0XHRtYWtlQWxlcnQoJ2Vycm9yJywgZXJyb3IpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZW5hYmxlRm9ybShmb3JtKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmb3JtQmVoYXZpb3IoZm9ybSkge1xyXG5cdGNvbnN0IGNvbnRyb2xzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1iZWhhdmlvcl0nKTtcclxuXHJcblx0ZnVuY3Rpb24gaGlkZUl0ZW1zKGNvbnRyb2wpIHtcclxuXHRcdGxldCBoaWRlID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGlkZScpO1xyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdGlmKGhpZGUpIHtcclxuXHRcdFx0XHRoaWRlICs9ICcsJyArIGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXNob3cnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRoaWRlID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAncmFkaW8nICYmICFjb250cm9sLmNoZWNrZWQpIHtcclxuXHRcdFx0aGlkZSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRpZihoaWRlKSB7XHJcblx0XHRcdGhpZGUuc3BsaXQoJywnKS5mb3JFYWNoKHRvX2hpZGUgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiJyArIHRvX2hpZGUgKyAnXCJdJyk7XHJcblx0XHRcdFx0Y29uc3QgcGFyZW50ID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG5cdFx0XHRcdGlmKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tY29udHJvbCcpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNob3dJdGVtcyhjb250cm9sKSB7XHJcblx0XHRsZXQgc2hvdyA9IGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXNob3cnKTtcclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCcgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRzaG93ID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdyYWRpbycgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRzaG93ID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKHNob3cpIHtcclxuXHRcdFx0c2hvdy5zcGxpdCgnLCcpLmZvckVhY2godG9fc2hvdyA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCInICsgdG9fc2hvdyArICdcIl0nKTtcclxuXHRcdFx0XHRjb25zdCBwYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdFx0aWYocGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1jb250cm9sJykpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjb250cm9scy5mb3JFYWNoKGNvbnRyb2wgPT4ge1xyXG5cdFx0Ly8gb24gZm9ybSBpbml0XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAndmlzaWJpbGl0eScpIHtcclxuXHRcdFx0aGlkZUl0ZW1zKGNvbnRyb2wpO1xyXG5cdFx0XHRzaG93SXRlbXMoY29udHJvbCk7XHJcblx0XHR9XHJcblx0XHQvLyBvbiBmb3JtIGNoYW5nZVxyXG5cdFx0Y29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcblx0XHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLWJlaGF2aW9yJykgPT09ICd2aXNpYmlsaXR5Jykge1xyXG5cdFx0XHRcdGhpZGVJdGVtcyhjb250cm9sKTtcclxuXHRcdFx0XHRzaG93SXRlbXMoY29udHJvbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ2N5cl90b19sYXQnKSB7XHJcblx0XHRcdFx0aWYoY29udHJvbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLnNwbGl0KCcsJykuZm9yRWFjaCh0YXJnZXQgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXRfaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9Jyt0YXJnZXQrJ10nKTtcclxuXHRcdFx0XHRcdFx0aWYodGFyZ2V0X2l0ZW0pIHtcclxuXHRcdFx0XHRcdFx0XHR0YXJnZXRfaXRlbS52YWx1ZSA9IGN5cl90b19sYXQoY29udHJvbC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb250cm9sLnZhbHVlID0gY3lyX3RvX2xhdChjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ3NsdWcnKSB7XHJcblx0XHRcdFx0aWYoY29udHJvbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLnNwbGl0KCcsJykuZm9yRWFjaCh0YXJnZXQgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXRfaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9Jyt0YXJnZXQrJ10nKTtcclxuXHRcdFx0XHRcdFx0aWYodGFyZ2V0X2l0ZW0pIHtcclxuXHRcdFx0XHRcdFx0XHR0YXJnZXRfaXRlbS52YWx1ZSA9IHNsdWcoY29udHJvbC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb250cm9sLnZhbHVlID0gc2x1Zyhjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNhYmxlRm9ybShmb3JtKSB7XHJcblx0Zm9ybS5jbGFzc0xpc3QuYWRkKCdzdWJtaXQnKTtcclxuXHRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJykuZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGVuYWJsZUZvcm0oZm9ybSkge1xyXG5cdGZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnc3VibWl0Jyk7XHJcblx0Zm9ybS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcbi8vIERFTEVURSBCVVRUT05TXHJcbmNvbnN0IGRlbGV0ZV9idXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGVsZXRlXScpO1xyXG5cclxuZGVsZXRlX2J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcclxuXHRcdGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0aWYoIWJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtZGVsZXRlJykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjb25maXJtYXRpb24gPSB0cnVlO1xyXG5cdFx0aWYoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1jb25maXJtJykpIHtcclxuXHRcdFx0Y29uZmlybWF0aW9uID0gY29uZmlybShidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbmZpcm0nKSk7XHJcblx0XHR9XHJcblx0XHRpZighY29uZmlybWF0aW9uKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHJcblx0XHRmb3JtRGF0YS5zZXQoU0VUVElORy5jc3JmLmtleSwgU0VUVElORy5jc3JmLnRva2VuKTtcclxuXHJcblx0XHRmZXRjaChidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWRlbGV0ZScpLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuXHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0Ly8gUmVkaXJlY3RcclxuXHRcdFx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLXJlZGlyZWN0JykpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHJlZGlyZWN0ID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpO1xyXG5cdFx0XHRcdFx0aWYocmVkaXJlY3QgPT09ICd0aGlzJykge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3Q7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRhYmxlc1xyXG5cdFx0XHRcdGlmKGJ1dHRvbi5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndGFibGUtYWN0aW9uJykpIHtcclxuXHRcdFx0XHRcdC8vIGJ1dHRvbi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRmdW5jdGlvbiBmYWRlT3V0KGVsKSB7XHJcblx0XHRcdFx0XHRcdGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG5cdFx0XHRcdFx0XHQoZnVuY3Rpb24gZmFkZSgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoKGVsLnN0eWxlLm9wYWNpdHkgLT0gLjEpIDwgMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZmFkZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KSgpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGZhZGVPdXQoYnV0dG9uLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIENvdW50ZXJcclxuXHRcdFx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWNvdW50ZXInKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1jb3VudGVyJykpO1xyXG5cdFx0XHRcdFx0Y291bnRlci50ZXh0Q29udGVudCA9IHBhcnNlSW50KGNvdW50ZXIudGV4dENvbnRlbnQpIC0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xyXG5cdFx0XHRtYWtlQWxlcnQoJ2Vycm9yJywgZXJyb3IpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0YnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHRjbGFzcyBGb3JlaWduRm9ybSB7XHJcblx0Y29uc3RydWN0b3Iobm9kZSkge1xyXG5cdFx0dGhpcy5ub2RlID0gbm9kZTtcclxuXHRcdHRoaXMubmFtZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcclxuXHRcdHRoaXMudmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xyXG5cdFx0dGhpcy5pbnB1dHMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xyXG5cdFx0dGhpcy5idXR0b24gPSB7XHJcblx0XHRcdHN1Ym1pdDogbm9kZS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLFxyXG5cdFx0XHRvcGVuX21vZGFsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuXHRcdH07XHJcblx0XHR0aGlzLmljb24gPSB7XHJcblx0XHRcdGFkZDogYDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctcHJpbWFyeSBjdXJzb3ItcG9pbnRlclwiPjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1wbHVzIGFsaWduLW1pZGRsZSBmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxMlwiIHkxPVwiNVwiIHgyPVwiMTJcIiB5Mj1cIjE5XCI+PC9saW5lPjxsaW5lIHgxPVwiNVwiIHkxPVwiMTJcIiB4Mj1cIjE5XCIgeTI9XCIxMlwiPjwvbGluZT48L3N2Zz48L3NwYW4+YCxcclxuXHRcdFx0c29ydDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1tb3ZlXCI+PHBvbHlsaW5lIHBvaW50cz1cIjUgOSAyIDEyIDUgMTVcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XCI5IDUgMTIgMiAxNSA1XCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVwiMTUgMTkgMTIgMjIgOSAxOVwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cIjE5IDkgMjIgMTIgMTkgMTVcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVwiMlwiIHkxPVwiMTJcIiB4Mj1cIjIyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIyXCIgeDI9XCIxMlwiIHkyPVwiMjJcIj48L2xpbmU+PC9zdmc+YCxcclxuXHRcdFx0ZWRpdDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1lZGl0XCI+PHBhdGggZD1cIk0xMSA0SDRhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJ2LTdcIj48L3BhdGg+PHBhdGggZD1cIk0xOC41IDIuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMMTIgMTVsLTQgMSAxLTQgOS41LTkuNXpcIj48L3BhdGg+PC9zdmc+YCxcclxuXHRcdFx0ZGVsZXRlOiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLXRyYXNoXCI+PHBvbHlsaW5lIHBvaW50cz1cIjMgNiA1IDYgMjEgNlwiPjwvcG9seWxpbmU+PHBhdGggZD1cIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiPjwvcGF0aD48L3N2Zz5gXHJcblx0XHR9O1xyXG5cdFx0dGhpcy51aWQgPSB0aGlzLmdlbmVyYXRlVWlkKCk7XHJcblx0XHR0aGlzLnN0b3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdHRoaXMudGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xyXG5cdFx0dGhpcy50Ym9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XHJcblx0XHR0aGlzLmlzX2VkaXRpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuZWRpdGluZ19yb3cgPSBudWxsO1xyXG5cclxuXHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSgpIHtcclxuXHRcdC8vIFNFVCBJRCBUTyBOT0RFXHJcblx0XHR0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMudWlkKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgTU9EQUwgQlVUVE9OXHJcblx0XHR0aGlzLmJ1dHRvbi5vcGVuX21vZGFsLnNldEF0dHJpYnV0ZSgnZGF0YS1icy10b2dnbGUnLCAnbW9kYWwnKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuc2V0QXR0cmlidXRlKCdkYXRhLWJzLXRhcmdldCcsICcjJyArIHRoaXMudWlkKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuaW5uZXJIVE1MID0gdGhpcy5pY29uLmFkZDtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcblx0XHRcdGlmKCF0aGlzLmlzX2VkaXRpbmcpIHtcclxuXHRcdFx0XHR0aGlzLnJlc2V0RWRpdGluZ1JvdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBTRVQgVVAgU1RPUkVcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG5cdFx0dGhpcy5zdG9yZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgVEFCTEVcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUnKTtcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUtc20nKTtcclxuXHJcblx0XHR0aGlzLnRib2R5LmNsYXNzTGlzdC5hZGQoJ3NvcnRhYmxlJyk7XHJcblx0XHRuZXcgU29ydGFibGUodGhpcy50Ym9keSwge1xyXG5cdFx0XHRoYW5kbGU6ICcuc29ydGFibGVfX2hhbmRsZScsXHJcblx0XHRcdGFuaW1hdGlvbjogMTUwLFxyXG5cdFx0XHRvblNvcnQ6ICgpID0+IHRoaXMudXBkYXRlU3RvcmUoKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gU0VUIFVQIFNVTUlUIEJVVFRPTlxyXG5cdFx0dGhpcy5idXR0b24uc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0dGhpcy5jbGlja1N1Ym1pdCgpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVN0b3JlKCk7XHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBSRU5ERVJcclxuXHRcdHRoaXMucG9wdWxhdGVUYWJsZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHJcblx0XHQvLyBSRVNFVCBFRElUSU5HIFJPVyBJRiBNT0RBTCBDQU5DRUxFRFxyXG5cdFx0dGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHRoaXMucmVzZXRFZGl0aW5nUm93KCkpO1xyXG5cdH1cclxuXHJcblx0Y2xpY2tTdWJtaXQoKSB7XHJcblx0XHQvLyBFRElUIFJPV1xyXG5cdFx0aWYodGhpcy5pc19lZGl0aW5nKSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZWRpdGluZ19yb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBREQgUk9XXHJcblx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KCkpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlU3RvcmUoKSB7XHJcblx0XHRsZXQgZGF0YSA9IFtdO1xyXG5cclxuXHRcdHRoaXMudGJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHRyID0+IHtcclxuXHRcdFx0bGV0IG9iaiA9IHt9O1xyXG5cclxuXHRcdFx0dHIucXVlcnlTZWxlY3RvckFsbCgndGQnKS5mb3JFYWNoKHRkID0+IHtcclxuXHRcdFx0XHRpZighdGQuaGFzQXR0cmlidXRlKCdkYXRhLW5hbWUnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpbdGQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKV0gPSB0ZC50ZXh0Q29udGVudDtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRkYXRhLnB1c2gob2JqKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc3RvcmUudmFsdWUgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlc2V0RWRpdGluZ1JvdygpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRpZihpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ3NlbGVjdCcpIHtcclxuXHRcdFx0XHRpbnB1dC5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdFx0XHRpZighaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRpbnB1dC5zbGltLnNldChpbnB1dC52YWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuaXNfZWRpdGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5lZGl0aW5nX3JvdyA9IG51bGw7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVSb3cob2JqZWN0ID0gbnVsbCkge1xyXG5cdFx0Y29uc3QgdHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcblxyXG5cdFx0aWYob2JqZWN0KSB7XHJcblx0XHRcdGZvcihjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywga2V5KTtcclxuXHRcdFx0XHR0Y29sLnRleHRDb250ZW50ID0gdmFsdWU7XHJcblxyXG5cdFx0XHRcdHRyb3cuYXBwZW5kQ2hpbGQodGNvbCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywgaW5wdXQubmFtZSk7XHJcblx0XHRcdFx0dGNvbC50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cclxuXHRcdFx0XHR0cm93LmFwcGVuZENoaWxkKHRjb2wpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0Y29sX2FjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cdFx0dGNvbF9hY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLWFjdGlvbicpO1xyXG5cclxuXHRcdGNvbnN0IGJ0bl9zb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cdFx0Y29uc3QgYnRuX2VkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblx0XHRjb25zdCBidG5fZGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuXHRcdGJ0bl9zb3J0LmlubmVySFRNTCA9IHRoaXMuaWNvbi5zb3J0ICsgJyAnOyBidG5fc29ydC5jbGFzc0xpc3QuYWRkKCdzb3J0YWJsZV9faGFuZGxlJyk7XHJcblx0XHRidG5fZWRpdC5pbm5lckhUTUwgPSB0aGlzLmljb24uZWRpdCArICcgJztcclxuXHRcdGJ0bl9kZWxldGUuaW5uZXJIVE1MID0gdGhpcy5pY29uLmRlbGV0ZTtcclxuXHJcblx0XHRidG5fZWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuY2xpY2tFZGl0KHRyb3cpKTtcclxuXHRcdGJ0bl9kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmNsaWNrRGVsZXRlKHRyb3cpKTtcclxuXHRcdFxyXG5cdFx0dGNvbF9hY3Rpb25zLmFwcGVuZChidG5fc29ydCk7XHJcblx0XHR0Y29sX2FjdGlvbnMuYXBwZW5kKGJ0bl9lZGl0KTtcclxuXHRcdHRjb2xfYWN0aW9ucy5hcHBlbmQoYnRuX2RlbGV0ZSk7XHJcblxyXG5cdFx0dHJvdy5hcHBlbmRDaGlsZCh0Y29sX2FjdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiB0cm93O1xyXG5cdH1cclxuXHJcblx0Y2xpY2tFZGl0KHRyb3cpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudDtcclxuXHJcblx0XHRcdGlmKGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnc2VsZWN0JyAmJiAhaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0aW5wdXQuc2xpbS5zZXQodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaXNfZWRpdGluZyA9IHRydWU7XHJcblx0XHRcdHRoaXMuZWRpdGluZ19yb3cgPSB0cm93O1xyXG5cclxuXHRcdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbGlja0RlbGV0ZSh0cm93KSB7XHJcblx0XHR0cm93LnJlbW92ZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdH1cclxuXHJcblx0cG9wdWxhdGVUYWJsZSgpIHtcclxuXHRcdGlmKCF0aGlzLnZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHZhbHVlcyA9IEpTT04ucGFyc2UodGhpcy52YWx1ZSk7XHJcblxyXG5cdFx0dmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xyXG5cdFx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KHZhbHVlKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHRoaXMudGFibGUuYXBwZW5kQ2hpbGQodGhpcy50Ym9keSk7XHJcblxyXG5cdFx0dGhpcy5ub2RlLmJlZm9yZSh0aGlzLmJ1dHRvbi5vcGVuX21vZGFsKTtcclxuXHRcdHRoaXMubm9kZS5iZWZvcmUodGhpcy5zdG9yZSk7XHJcblx0XHR0aGlzLm5vZGUuYmVmb3JlKHRoaXMudGFibGUpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVVaWQoKSB7XHJcblx0XHRyZXR1cm4gJ2ZmLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcclxuXHR9XHJcbn1cclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzcyo9XCJmb3JlaWduLWZvcm1cIl0nKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdG5ldyBGb3JlaWduRm9ybShlbGVtZW50KTtcclxufSk7XHJcbn0pO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuXHQvLyBIQU5ETEUgQlJPS0VOIElNQUdFU1xyXG5cdGNvbnN0IGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcblx0aW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xyXG5cdFx0aWYoaW1hZ2UuY29tcGxldGUgJiYgdHlwZW9mIGltYWdlLm5hdHVyYWxXaWR0aCAhPSBcInVuZGVmaW5lZFwiICYmIGltYWdlLm5hdHVyYWxXaWR0aCA8PSAwKSB7XHJcblx0XHRcdGltYWdlLnNyYyA9IEVMRU0uaW1hZ2VfcGxhY2Vob2xkZXI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcbiJdLCJmaWxlIjoibWFpbi5qcyJ9