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

var BASE_URL = window.location.protocol + '//' + window.location.host;
document.addEventListener('DOMContentLoaded', function () {
  // CONSTANTS
  var FORMS = document.querySelectorAll('form');
  var SELECTS = document.querySelectorAll('select');
  var LOADER = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>'; // FILEPOND

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
  FORMS.forEach(function (form) {
    var file_inputs = form.querySelectorAll('input[type="file"]');

    if (!file_inputs) {
      return;
    }

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
  }); // QUILL

  FORMS.forEach(function (form) {
    form.querySelectorAll('textarea[class*="wysiwyg"]').forEach(function (textarea) {
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
    });
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
  SELECTS.forEach(function (select) {
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


  FORMS.forEach(function (form) {
    form.insertAdjacentHTML('beforeend', LOADER);
    formBehavior(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      disableForm(form);
      var formData = new FormData(form);
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

      fetch(button.getAttribute('data-delete'), {
        method: 'POST'
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

  FORMS.forEach(function (form) {
    form.querySelectorAll('[class*="foreign-form"]').forEach(function (element) {
      new ForeignForm(element);
    });
  });
});

window.onload = function () {
  // HANDLE BROKEN IMAGES
  var images = document.querySelectorAll("img");
  images.forEach(function (image) {
    if (image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
      image.src = BASE_URL + '/module/Admin/Asset/img/no_image.jpg';
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiQkFTRV9VUkwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaG9zdCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIkZPUk1TIiwicXVlcnlTZWxlY3RvckFsbCIsIlNFTEVDVFMiLCJMT0FERVIiLCJwb25kX2lucHV0X2RhdGEiLCJmaWxlcyIsImlucHV0IiwiaGFzQXR0cmlidXRlIiwiaW5wdXRfZmlsZXMiLCJnZXRBdHRyaWJ1dGUiLCJKU09OIiwicGFyc2UiLCJmb3JFYWNoIiwiZmlsZSIsImZpbGVfb2JqIiwic291cmNlIiwidmFsdWUiLCJvcHRpb25zIiwidHlwZSIsIm1ldGFkYXRhIiwiYWxsb3dJbWFnZVByZXZpZXciLCJwb3N0ZXIiLCJwdXNoIiwibWF4VG90YWxGaWxlU2l6ZSIsIm1heEZpbGVTaXplIiwibWF4RmlsZXMiLCJwYXJzZUludCIsInN0eWxlSXRlbVBhbmVsQXNwZWN0UmF0aW8iLCJmb3JtIiwiZmlsZV9pbnB1dHMiLCJwb25kIiwiRmlsZVBvbmQiLCJjcmVhdGUiLCJzZXJ2ZXIiLCJsb2FkIiwic3RvcmVBc0ZpbGUiLCJpbnN0YW50VXBsb2FkIiwiYWxsb3dQcm9jZXNzIiwiYWxsb3dSZXZlcnQiLCJhbGxvd1Jlb3JkZXIiLCJkcm9wT25QYWdlIiwiZHJvcE9uRWxlbWVudCIsImxlbmd0aCIsImNyZWRpdHMiLCJzZXRPcHRpb25zIiwibGFiZWxJZGxlIiwidGV4dGFyZWEiLCJjbGFzc0xpc3QiLCJhZGQiLCJ3eXNpd3lnX25vZGUiLCJjcmVhdGVFbGVtZW50IiwicXVpbGxfbm9kZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiYWZ0ZXIiLCJxdWlsbCIsIlF1aWxsIiwibW9kdWxlcyIsInRvb2xiYXIiLCJjb250YWluZXIiLCJoZWFkZXIiLCJoYW5kbGVycyIsImV2ZW50IiwidXBsb2FkSW1hZ2UiLCJjb250YWlucyIsIm1pbmltaXplIiwibWF4aW1pemUiLCJwbGFjZWhvbGRlciIsInJlYWRPbmx5IiwiZGlzYWJsZWQiLCJ0aGVtZSIsIm9uIiwicm9vdCIsImV4cGFuZCIsInF1ZXJ5U2VsZWN0b3IiLCJyZW1vdmUiLCJJbWFnZSIsImltcG9ydCIsImNsYXNzTmFtZSIsInJlZ2lzdGVyIiwic2V0QXR0cmlidXRlIiwiY2xpY2siLCJvbmNoYW5nZSIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJlbmFibGUiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsInN0YXR1cyIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbiIsImluZGV4IiwiaW5zZXJ0RW1iZWQiLCJtZXNzYWdlIiwic2V0U2VsZWN0aW9uIiwibWFrZUFsZXJ0IiwiY2F0Y2giLCJlcnJvciIsInNsaW1zZWxlY3RfZGF0YSIsImFkZGFibGUiLCJzZWxlY3QiLCJ2YWwiLCJyZXBsYWNlQWxsIiwidHJpbSIsImFsbG93RGVzZWxlY3QiLCJkZXNlbGVjdExhYmVsIiwiaGlkZVNlbGVjdGVkT3B0aW9uIiwibXVsdGlwbGUiLCJjbG9zZU9uU2VsZWN0Iiwic2hvd1NlYXJjaCIsInNlYXJjaFBsYWNlaG9sZGVyIiwic2VhcmNoVGV4dCIsIlNsaW1TZWxlY3QiLCJwbGFjZWhvbGRlclRleHQiLCJzaG93Q29udGVudCIsImVsZW1lbnQiLCJTb3J0YWJsZSIsImhhbmRsZSIsImFuaW1hdGlvbiIsInRleHQiLCJ0aW1lIiwidG9hc3QiLCJ0b2FzdF9pY29uIiwidG9hc3RfdGV4dCIsInRleHRDb250ZW50IiwiY2xvc2VBbGVydCIsInNldFRpbWVvdXQiLCJjaGlsZEVsZW1lbnRDb3VudCIsImluc2VydEFkamFjZW50SFRNTCIsImZvcm1CZWhhdmlvciIsInByZXZlbnREZWZhdWx0IiwiZGlzYWJsZUZvcm0iLCJhY3Rpb24iLCJyZWRpcmVjdCIsInJlbG9hZCIsImhyZWYiLCJyZXNldCIsImVuYWJsZUZvcm0iLCJjb250cm9scyIsImhpZGVJdGVtcyIsImNvbnRyb2wiLCJoaWRlIiwiY2hlY2tlZCIsInNwbGl0IiwidG9faGlkZSIsIml0ZW0iLCJwYXJlbnQiLCJwYXJlbnRFbGVtZW50Iiwic2hvd0l0ZW1zIiwic2hvdyIsInRvX3Nob3ciLCJ0YXJnZXQiLCJ0YXJnZXRfaXRlbSIsImN5cl90b19sYXQiLCJzbHVnIiwiZGVsZXRlX2J1dHRvbnMiLCJidXR0b24iLCJjb25maXJtYXRpb24iLCJjb25maXJtIiwiZmFkZU91dCIsImVsIiwic3R5bGUiLCJvcGFjaXR5IiwiZmFkZSIsImRpc3BsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjb3VudGVyIiwiRm9yZWlnbkZvcm0iLCJub2RlIiwibmFtZSIsImlucHV0cyIsInN1Ym1pdCIsIm9wZW5fbW9kYWwiLCJpY29uIiwic29ydCIsImVkaXQiLCJkZWxldGUiLCJ1aWQiLCJnZW5lcmF0ZVVpZCIsInN0b3JlIiwidGFibGUiLCJ0Ym9keSIsImlzX2VkaXRpbmciLCJlZGl0aW5nX3JvdyIsImluaXRpYWxpemUiLCJyZXNldEVkaXRpbmdSb3ciLCJvblNvcnQiLCJ1cGRhdGVTdG9yZSIsImNsaWNrU3VibWl0IiwicG9wdWxhdGVUYWJsZSIsInJlbmRlciIsImNyZWF0ZVJvdyIsInRyIiwib2JqIiwidGQiLCJzdHJpbmdpZnkiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzZWxlY3RlZEluZGV4Iiwic2xpbSIsInNldCIsIm9iamVjdCIsInRyb3ciLCJPYmplY3QiLCJlbnRyaWVzIiwia2V5IiwidGNvbCIsInRjb2xfYWN0aW9ucyIsImJ0bl9zb3J0IiwiYnRuX2VkaXQiLCJidG5fZGVsZXRlIiwiY2xpY2tFZGl0IiwiY2xpY2tEZWxldGUiLCJ2YWx1ZXMiLCJiZWZvcmUiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzbGljZSIsIm9ubG9hZCIsImltYWdlcyIsImltYWdlIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJzcmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEs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QU1DLE1BQU0sR0FBR3BPLFFBQVEsQ0FBQ0csZ0JBQVQsQ0FBMEIsS0FBMUIsQ0FBZjtBQUNBaU8sRUFBQUEsTUFBTSxDQUFDdE4sT0FBUCxDQUFlLFVBQUF1TixLQUFLLEVBQUk7QUFDdkIsUUFBR0EsS0FBSyxDQUFDQyxRQUFOLElBQWtCLE9BQU9ELEtBQUssQ0FBQ0UsWUFBYixJQUE2QixXQUEvQyxJQUE4REYsS0FBSyxDQUFDRSxZQUFOLElBQXNCLENBQXZGLEVBQTBGO0FBQ3pGRixNQUFBQSxLQUFLLENBQUNHLEdBQU4sR0FBWTdPLFFBQVEsR0FBRyxzQ0FBdkI7QUFDQTtBQUNELEdBSkQ7QUFLQSxDQVJEIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQkFTRV9VUkwgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cdC8vIENPTlNUQU5UU1xyXG5cdGNvbnN0IEZPUk1TID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xyXG5cdGNvbnN0IFNFTEVDVFMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzZWxlY3QnKTtcclxuXHRjb25zdCBMT0FERVIgPSAnPGRpdiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHRleHQtcHJpbWFyeVwiIHJvbGU9XCJzdGF0dXNcIj48c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPkxvYWRpbmcuLi48L3NwYW4+PC9kaXY+JztcclxuXHJcblx0Ly8gRklMRVBPTkRcclxuXHRjb25zdCBwb25kX2lucHV0X2RhdGEgPSB7XHJcblx0ZmlsZXM6IGlucHV0ID0+IHtcclxuXHRcdGxldCBmaWxlcyA9IFtdO1xyXG5cdFx0aWYoIWlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKSB7XHJcblx0XHRcdHJldHVybiBmaWxlcztcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaW5wdXRfZmlsZXMgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKTtcclxuXHJcblx0XHRpZighaW5wdXRfZmlsZXMgfHwgaW5wdXRfZmlsZXMgPT0gJ1tdJykge1xyXG5cdFx0XHRyZXR1cm4gZmlsZXM7XHJcblx0XHR9XHJcblxyXG5cdFx0aW5wdXRfZmlsZXMgPSBKU09OLnBhcnNlKGlucHV0X2ZpbGVzKTtcclxuXHRcdFxyXG5cdFx0aW5wdXRfZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuXHRcdFx0bGV0IGZpbGVfb2JqID0ge1xyXG5cdFx0XHRcdHNvdXJjZTogZmlsZS52YWx1ZSxcclxuXHRcdFx0XHRvcHRpb25zOiB7XHJcblx0XHRcdFx0XHR0eXBlOiAnbG9jYWwnLFxyXG5cdFx0XHRcdFx0bWV0YWRhdGE6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYocG9uZF9pbnB1dF9kYXRhLmFsbG93SW1hZ2VQcmV2aWV3KGlucHV0KSkge1xyXG5cdFx0XHRcdGZpbGVfb2JqLm9wdGlvbnMubWV0YWRhdGEucG9zdGVyID0gZmlsZS5wb3N0ZXI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZpbGVzLnB1c2goZmlsZV9vYmopO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBmaWxlcztcclxuXHR9LFxyXG5cdGFsbG93SW1hZ2VQcmV2aWV3OiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpZXcnKSA9PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlO1xyXG5cdH0sXHJcblx0bWF4VG90YWxGaWxlU2l6ZTogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYXgtdG90YWwtc2l6ZScpID8gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLW1heC10b3RhbC1zaXplJykgOiBudWxsO1xyXG5cdH0sXHJcblx0bWF4RmlsZVNpemU6IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWF4LXNpemUnKSA/IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXgtc2l6ZScpIDogbnVsbDtcclxuXHR9LFxyXG5cdG1heEZpbGVzOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW1heC1maWxlcycpID8gcGFyc2VJbnQoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLW1heC1maWxlcycpKSA6IG51bGw7XHJcblx0fSxcclxuXHRzdHlsZUl0ZW1QYW5lbEFzcGVjdFJhdGlvOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLWFzcGVjdC1yYXRpbycpID8gcGFyc2VJbnQoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWFzcGVjdC1yYXRpbycpKSA6IDAuNTYyNTtcclxuXHR9XHJcbn07XHJcblxyXG5GT1JNUy5mb3JFYWNoKGZvcm0gPT4ge1xyXG5cdGNvbnN0IGZpbGVfaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpO1xyXG5cdGlmKCFmaWxlX2lucHV0cykge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHRmaWxlX2lucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRcdGNvbnN0IHBvbmQgPSBGaWxlUG9uZC5jcmVhdGUoXHJcblx0XHRcdGlucHV0LCB7XHJcblx0XHRcdFx0c2VydmVyOiB7bG9hZDogJy91cGxvYWQ/bG9hZD0nfSxcclxuXHRcdFx0XHRzdG9yZUFzRmlsZTogdHJ1ZSxcclxuXHRcdFx0XHRpbnN0YW50VXBsb2FkOiBmYWxzZSxcclxuXHRcdFx0XHRhbGxvd1Byb2Nlc3M6IGZhbHNlLFxyXG5cdFx0XHRcdGFsbG93UmV2ZXJ0OiBmYWxzZSxcclxuXHRcdFx0XHRhbGxvd1Jlb3JkZXI6IHRydWUsXHJcblx0XHRcdFx0ZHJvcE9uUGFnZTogdHJ1ZSxcclxuXHRcdFx0XHRkcm9wT25FbGVtZW50OiBmaWxlX2lucHV0cy5sZW5ndGggPT0gMSA/IGZhbHNlIDogdHJ1ZSxcclxuXHRcdFx0XHRmaWxlczogcG9uZF9pbnB1dF9kYXRhLmZpbGVzKGlucHV0KSxcclxuXHRcdFx0XHRhbGxvd0ltYWdlUHJldmlldzogcG9uZF9pbnB1dF9kYXRhLmFsbG93SW1hZ2VQcmV2aWV3KGlucHV0KSxcclxuXHRcdFx0XHRtYXhUb3RhbEZpbGVTaXplOiBwb25kX2lucHV0X2RhdGEubWF4VG90YWxGaWxlU2l6ZShpbnB1dCksXHJcblx0XHRcdFx0bWF4RmlsZVNpemU6IHBvbmRfaW5wdXRfZGF0YS5tYXhGaWxlU2l6ZShpbnB1dCksXHJcblx0XHRcdFx0bWF4RmlsZXM6IHBvbmRfaW5wdXRfZGF0YS5tYXhGaWxlcyhpbnB1dCksXHJcblx0XHRcdFx0c3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbzogcG9uZF9pbnB1dF9kYXRhLnN0eWxlSXRlbVBhbmVsQXNwZWN0UmF0aW8oaW5wdXQpLFxyXG5cdFx0XHRcdGNyZWRpdHM6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0aWYoaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykpIHtcclxuXHRcdFx0cG9uZC5zZXRPcHRpb25zKHtcclxuXHRcdFx0XHRsYWJlbElkbGU6IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTtcclxuXHJcblx0Ly8gUVVJTExcclxuXHRGT1JNUy5mb3JFYWNoKGZvcm0gPT4ge1xyXG5cdGZvcm0ucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWFbY2xhc3MqPVwid3lzaXd5Z1wiXScpLmZvckVhY2godGV4dGFyZWEgPT4ge1xyXG5cdFx0dGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuXHJcblx0XHRjb25zdCB3eXNpd3lnX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnN0IHF1aWxsX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdHF1aWxsX25vZGUuaW5uZXJIVE1MID0gdGV4dGFyZWEudmFsdWU7XHJcblxyXG5cdFx0d3lzaXd5Z19ub2RlLmNsYXNzTGlzdC5hZGQoJ3d5c2l3eWcnKTtcclxuXHRcdHd5c2l3eWdfbm9kZS5hcHBlbmRDaGlsZChxdWlsbF9ub2RlKTtcclxuXHRcdHRleHRhcmVhLmFmdGVyKHd5c2l3eWdfbm9kZSk7XHJcblxyXG5cdFx0Y29uc3QgcXVpbGwgPSBuZXcgUXVpbGwocXVpbGxfbm9kZSwge1xyXG5cdFx0XHRtb2R1bGVzOiB7XHJcblx0XHRcdFx0dG9vbGJhcjoge1xyXG5cdFx0XHRcdFx0XHRjb250YWluZXI6IFtcclxuXHRcdFx0XHRcdFx0XHRbeyBoZWFkZXI6IFsyLCAzLCBmYWxzZV0gfV0sXHJcblx0XHRcdFx0XHRcdFx0Wydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlJ10sXHJcblx0XHRcdFx0XHRcdFx0W3snYWxpZ24nOiBbXX0sIHsnbGlzdCc6ICdvcmRlcmVkJ30sIHsnbGlzdCc6ICdidWxsZXQnfV0sXHJcblx0XHRcdFx0XHRcdFx0W3snY29sb3InOiBbXX0sIHsnYmFja2dyb3VuZCc6IFtdfV0sXHJcblx0XHRcdFx0XHRcdFx0WydsaW5rJywgJ2ltYWdlJywgJ3ZpZGVvJywgJ2Jsb2NrcXVvdGUnLCAnY29kZSddLFxyXG5cdFx0XHRcdFx0XHRcdFt7J2luZGVudCc6ICctMSd9LCB7J2luZGVudCc6ICcrMSd9XSxcclxuXHRcdFx0XHRcdFx0XHRbeydzY3JpcHQnOiAnc3ViJ30sIHsnc2NyaXB0JzogJ3N1cGVyJ31dLFxyXG5cdFx0XHRcdFx0XHRcdFsnY2xlYW4nXSwgWydleHBhbmQnXVxyXG5cdFx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0XHRoYW5kbGVyczoge1xyXG5cdFx0XHRcdFx0XHRcdCdpbWFnZSc6IGV2ZW50ID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdHVwbG9hZEltYWdlKCk7XHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHQnZXhwYW5kJzogZXZlbnQgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0d3lzaXd5Z19ub2RlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbHNjcmVlbicpID8gIG1pbmltaXplKCkgOiBtYXhpbWl6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cGxhY2Vob2xkZXI6IHRleHRhcmVhLnBsYWNlaG9sZGVyLFxyXG5cdFx0XHRyZWFkT25seTogdGV4dGFyZWEuZGlzYWJsZWQgPyB0cnVlIDogZmFsc2UsXHJcblx0XHRcdHRoZW1lOiAnc25vdydcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFBPUFVMQVRFXHJcblx0XHQvLyBxdWlsbC5zZXRDb250ZW50cyhKU09OLnBhcnNlKHRleHRhcmVhLnZhbHVlKS5vcHMpO1xyXG5cclxuXHRcdC8vIFVQREFURSBURVhUQVJFQSBWQUxVRVxyXG5cdFx0cXVpbGwub24oJ2VkaXRvci1jaGFuZ2UnLCBldmVudCA9PiB7XHJcblx0XHRcdC8vIHRleHRhcmVhLnZhbHVlID0gSlNPTi5zdHJpbmdpZnkocXVpbGwuZ2V0Q29udGVudHMoKSk7XHJcblx0XHRcdHRleHRhcmVhLnZhbHVlID0gcXVpbGwucm9vdC5pbm5lckhUTUw7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBFWFBBTkQgQlVUVE9OXHJcblx0XHRjb25zdCBleHBhbmQgPSB3eXNpd3lnX25vZGUucXVlcnlTZWxlY3RvcignLnFsLWV4cGFuZCcpO1xyXG5cdFx0ZnVuY3Rpb24gbWF4aW1pemUoKSB7XHJcblx0XHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdGlmKGV4cGFuZCkgZXhwYW5kLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWluaW1pemUoKSB7XHJcblx0XHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdGlmKGV4cGFuZCkgZXhwYW5kLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElNQUdFIFVQTE9BRFxyXG5cdFx0Y29uc3QgSW1hZ2UgPSBRdWlsbC5pbXBvcnQoJ2Zvcm1hdHMvaW1hZ2UnKTtcclxuXHRcdEltYWdlLmNsYXNzTmFtZSA9ICdpbWFnZS1mbHVpZCc7XHJcblx0XHRRdWlsbC5yZWdpc3RlcihJbWFnZSwgdHJ1ZSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gdXBsb2FkSW1hZ2UoKSB7XHJcblx0XHRcdGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCdhY2NlcHQnLCAnaW1hZ2UvKicpO1xyXG5cdFx0XHRpbnB1dC5jbGljaygpO1xyXG5cclxuXHRcdFx0aW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xyXG5cclxuXHRcdFx0XHRpZihmaWxlKSB7XHJcblx0XHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdFx0XHRcdGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG5cclxuXHRcdFx0XHRcdHF1aWxsLmVuYWJsZShmYWxzZSk7XHJcblxyXG5cdFx0XHRcdFx0ZmV0Y2goJy91cGxvYWQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdFx0XHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuXHRcdFx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VsZWN0aW9uID0gcXVpbGwuZ2V0U2VsZWN0aW9uKCkuaW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0cXVpbGwuaW5zZXJ0RW1iZWQoc2VsZWN0aW9uLCAnaW1hZ2UnLCBCQVNFX1VSTCArICcvJyArIGRhdGEubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRcdFx0cXVpbGwuc2V0U2VsZWN0aW9uKHNlbGVjdGlvbiArIDEpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5jYXRjaChlcnJvciA9PiB7XHJcblx0XHRcdFx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRxdWlsbC5lbmFibGUodHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxufSk7XHJcblxyXG5cdC8vIFNMSU1TRUxFQ1RcclxuXHRjb25zdCBzbGltc2VsZWN0X2RhdGEgPSB7XHJcblx0YWRkYWJsZTogc2VsZWN0ID0+IHtcclxuXHRcdGlmKCFzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRsZXQgdmFsID0gdmFsdWU7XHJcblxyXG5cdFx0XHRzd2l0Y2goc2VsZWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1hZGRhYmxlJykpIHtcclxuXHRcdFx0XHRjYXNlICd0YWcnOiB7XHJcblx0XHRcdFx0XHR2YWwgPSB2YWx1ZS5yZXBsYWNlQWxsKC9bXlxccHtMfVxcZCBdKy9naXUsICcnKS5yZXBsYWNlQWxsKC9bXFxzXSsvZywgJyAnKS50cmltKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdFx0dmFsID0gdmFsdWUucmVwbGFjZUFsbCgvW1xcc10rL2csICcgJykudHJpbSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YWxsb3dEZXNlbGVjdDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QucXVlcnlTZWxlY3Rvcignb3B0aW9uW2RhdGEtcGxhY2Vob2xkZXJdJykgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRkZXNlbGVjdExhYmVsOiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxOFwiIHkxPVwiNlwiIHgyPVwiNlwiIHkyPVwiMThcIj48L2xpbmU+PGxpbmUgeDE9XCI2XCIgeTE9XCI2XCIgeDI9XCIxOFwiIHkyPVwiMThcIj48L2xpbmU+PC9zdmc+JztcclxuXHR9LFxyXG5cdGhpZGVTZWxlY3RlZE9wdGlvbjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QubXVsdGlwbGUgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRjbG9zZU9uU2VsZWN0OiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5tdWx0aXBsZSA/IGZhbHNlIDogdHJ1ZTtcclxuXHR9LFxyXG5cdHNob3dTZWFyY2g6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKS5sZW5ndGggPiAxMCB8fCBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRwbGFjZWhvbGRlcjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoUGxhY2Vob2xkZXI6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gc2VsZWN0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlci1zZWFyY2gnKSA/IHNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXItc2VhcmNoJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoVGV4dDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgOiBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcblNFTEVDVFMuZm9yRWFjaChzZWxlY3QgPT4ge1xyXG5cdGlmKHNlbGVjdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbmF0aXZlJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0XHJcblx0bmV3IFNsaW1TZWxlY3Qoe1xyXG5cdFx0c2VsZWN0OiBzZWxlY3QsXHJcblx0XHRhZGRhYmxlOiBzbGltc2VsZWN0X2RhdGEuYWRkYWJsZShzZWxlY3QpLFxyXG5cdFx0YWxsb3dEZXNlbGVjdDogc2xpbXNlbGVjdF9kYXRhLmFsbG93RGVzZWxlY3Qoc2VsZWN0KSxcclxuXHRcdGRlc2VsZWN0TGFiZWw6IHNsaW1zZWxlY3RfZGF0YS5kZXNlbGVjdExhYmVsKHNlbGVjdCksXHJcblx0XHQvLyBoaWRlU2VsZWN0ZWRPcHRpb246IHNsaW1zZWxlY3RfZGF0YS5oaWRlU2VsZWN0ZWRPcHRpb24oc2VsZWN0KSwgLy8gbm90IHdvcmsgd2l0aCBvcHRncm91cHNcclxuXHRcdGNsb3NlT25TZWxlY3Q6IHNsaW1zZWxlY3RfZGF0YS5jbG9zZU9uU2VsZWN0KHNlbGVjdCksXHJcblx0XHRzaG93U2VhcmNoOiBzbGltc2VsZWN0X2RhdGEuc2hvd1NlYXJjaChzZWxlY3QpLFxyXG5cdFx0cGxhY2Vob2xkZXI6IHNsaW1zZWxlY3RfZGF0YS5wbGFjZWhvbGRlcihzZWxlY3QpLFxyXG5cdFx0cGxhY2Vob2xkZXJUZXh0OiBzbGltc2VsZWN0X2RhdGEucGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHNlYXJjaFBsYWNlaG9sZGVyOiBzbGltc2VsZWN0X2RhdGEuc2VhcmNoUGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHNlYXJjaFRleHQ6IHNsaW1zZWxlY3RfZGF0YS5zZWFyY2hUZXh0KHNlbGVjdCksXHJcblx0XHRzaG93Q29udGVudDogXCJkb3duXCJcclxuXHR9KTtcclxufSk7XHJcblxyXG5cdC8vIFNPUlRBQkxFXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzKj1cInNvcnRhYmxlXCJdJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRuZXcgU29ydGFibGUoZWxlbWVudCwge1xyXG5cdFx0aGFuZGxlOiAnLnNvcnRhYmxlX19oYW5kbGUnLFxyXG5cdFx0YW5pbWF0aW9uOiAxNTBcclxuXHR9KTtcclxufSk7XHJcblxyXG5cdC8vIFRPQVNUU1xyXG5cdGZ1bmN0aW9uIG1ha2VBbGVydCh0eXBlLCB0ZXh0LCB0aW1lID0gNTAwMCkge1xyXG5cdGlmKCF0ZXh0IHx8ICF0ZXh0Lmxlbmd0aCkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2FzdHMnKTtcclxuXHRpZighY29udGFpbmVyKSB7XHJcblx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b2FzdHMnKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHR9XHJcblxyXG5cdGxldCB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19faXRlbScpO1xyXG5cdGlmKHR5cGUpIHtcclxuXHRcdHRvYXN0LmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3RfaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHR0b2FzdF9pY29uLmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19faWNvbicpO1xyXG5cdGlmKHR5cGUpIHtcclxuXHRcdHRvYXN0X2ljb24uY2xhc3NMaXN0LmFkZCh0eXBlKTtcclxuXHR9XHJcblxyXG5cdGxldCB0b2FzdF90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cdHRvYXN0X3RleHQuY2xhc3NMaXN0LmFkZCgndG9hc3RzX190ZXh0Jyk7XHJcblx0dG9hc3RfdGV4dC50ZXh0Q29udGVudCA9IHRleHQ7XHJcblxyXG5cdHRvYXN0LmFwcGVuZENoaWxkKHRvYXN0X2ljb24pO1xyXG5cdHRvYXN0LmFwcGVuZENoaWxkKHRvYXN0X3RleHQpO1xyXG5cclxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xyXG5cclxuXHR0b2FzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCkpO1xyXG5cclxuXHRzZXRUaW1lb3V0KCgpID0+IGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCksIHRpbWUpO1xyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VBbGVydChjb250YWluZXIsIHRvYXN0KSB7XHJcblx0dG9hc3QuY2xhc3NMaXN0LmFkZCgnZGlzYXBwZWFyJyk7XHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHR0b2FzdC5yZW1vdmUoKTtcclxuXHRcdGlmKGNvbnRhaW5lciAmJiBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkge1xyXG5cdFx0XHRjb250YWluZXIucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fSwgNTAwKTtcclxufVxyXG5cclxuXHQvLyBGT1JNU1xyXG5cdEZPUk1TLmZvckVhY2goZm9ybSA9PiB7XHJcblx0Zm9ybS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIExPQURFUik7XHJcblxyXG5cdGZvcm1CZWhhdmlvcihmb3JtKTtcclxuXHJcblx0Zm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBldmVudCA9PiB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHJcblx0XHRkaXNhYmxlRm9ybShmb3JtKTtcclxuXHJcblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG5cdFx0ZmV0Y2goZm9ybS5hY3Rpb24sIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG5cdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdGlmKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRpZihmb3JtLmhhc0F0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpKSB7XHJcblx0XHRcdFx0XHRjb25zdCByZWRpcmVjdCA9IGZvcm0uZ2V0QXR0cmlidXRlKCdkYXRhLXJlZGlyZWN0Jyk7XHJcblx0XHRcdFx0XHRpZihyZWRpcmVjdCA9PT0gJ3RoaXMnKSB7XHJcblx0XHRcdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSByZWRpcmVjdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoZm9ybS5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVzZXQnKSkge1xyXG5cdFx0XHRcdFx0Zm9ybS5yZXNldCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bWFrZUFsZXJ0KGRhdGEuc3RhdHVzLCBkYXRhLm1lc3NhZ2UpO1xyXG5cdFx0fSlcclxuXHRcdC5jYXRjaChlcnJvciA9PiB7XHJcblx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRlbmFibGVGb3JtKGZvcm0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGZvcm1CZWhhdmlvcihmb3JtKSB7XHJcblx0Y29uc3QgY29udHJvbHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWJlaGF2aW9yXScpO1xyXG5cclxuXHRmdW5jdGlvbiBoaWRlSXRlbXMoY29udHJvbCkge1xyXG5cdFx0bGV0IGhpZGUgPSBjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1oaWRlJyk7XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnY2hlY2tib3gnICYmICFjb250cm9sLmNoZWNrZWQpIHtcclxuXHRcdFx0aWYoaGlkZSkge1xyXG5cdFx0XHRcdGhpZGUgKz0gJywnICsgY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhpZGUgPSBjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1zaG93Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdyYWRpbycgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRoaWRlID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKGhpZGUpIHtcclxuXHRcdFx0aGlkZS5zcGxpdCgnLCcpLmZvckVhY2godG9faGlkZSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCInICsgdG9faGlkZSArICdcIl0nKTtcclxuXHRcdFx0XHRjb25zdCBwYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdFx0aWYocGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1jb250cm9sJykpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2hvd0l0ZW1zKGNvbnRyb2wpIHtcclxuXHRcdGxldCBzaG93ID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdHNob3cgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3JhZGlvJyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdHNob3cgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0aWYoc2hvdykge1xyXG5cdFx0XHRzaG93LnNwbGl0KCcsJykuZm9yRWFjaCh0b19zaG93ID0+IHtcclxuXHRcdFx0XHRjb25zdCBpdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cIicgKyB0b19zaG93ICsgJ1wiXScpO1xyXG5cdFx0XHRcdGNvbnN0IHBhcmVudCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcclxuXHRcdFx0XHRpZihwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWNvbnRyb2wnKSkge1xyXG5cdFx0XHRcdFx0cGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNvbnRyb2xzLmZvckVhY2goY29udHJvbCA9PiB7XHJcblx0XHQvLyBvbiBmb3JtIGluaXRcclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLWJlaGF2aW9yJykgPT09ICd2aXNpYmlsaXR5Jykge1xyXG5cdFx0XHRoaWRlSXRlbXMoY29udHJvbCk7XHJcblx0XHRcdHNob3dJdGVtcyhjb250cm9sKTtcclxuXHRcdH1cclxuXHRcdC8vIG9uIGZvcm0gY2hhbmdlXHJcblx0XHRjb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ3Zpc2liaWxpdHknKSB7XHJcblx0XHRcdFx0aGlkZUl0ZW1zKGNvbnRyb2wpO1xyXG5cdFx0XHRcdHNob3dJdGVtcyhjb250cm9sKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAnY3lyX3RvX2xhdCcpIHtcclxuXHRcdFx0XHRpZihjb250cm9sLmhhc0F0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG5cdFx0XHRcdFx0Y29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jykuc3BsaXQoJywnKS5mb3JFYWNoKHRhcmdldCA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldF9pdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT0nK3RhcmdldCsnXScpO1xyXG5cdFx0XHRcdFx0XHRpZih0YXJnZXRfaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdHRhcmdldF9pdGVtLnZhbHVlID0gY3lyX3RvX2xhdChjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wudmFsdWUgPSBjeXJfdG9fbGF0KGNvbnRyb2wudmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAnc2x1ZycpIHtcclxuXHRcdFx0XHRpZihjb250cm9sLmhhc0F0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG5cdFx0XHRcdFx0Y29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jykuc3BsaXQoJywnKS5mb3JFYWNoKHRhcmdldCA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldF9pdGVtID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT0nK3RhcmdldCsnXScpO1xyXG5cdFx0XHRcdFx0XHRpZih0YXJnZXRfaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRcdHRhcmdldF9pdGVtLnZhbHVlID0gc2x1Zyhjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wudmFsdWUgPSBzbHVnKGNvbnRyb2wudmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc2FibGVGb3JtKGZvcm0pIHtcclxuXHRmb3JtLmNsYXNzTGlzdC5hZGQoJ3N1Ym1pdCcpO1xyXG5cdGZvcm0ucXVlcnlTZWxlY3RvcignW3R5cGU9XCJzdWJtaXRcIl0nKS5kaXNhYmxlZCA9IHRydWU7XHJcbn1cclxuZnVuY3Rpb24gZW5hYmxlRm9ybShmb3JtKSB7XHJcblx0Zm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdzdWJtaXQnKTtcclxuXHRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJykuZGlzYWJsZWQgPSBmYWxzZTtcclxufVxyXG5cclxuLy8gREVMRVRFIEJVVFRPTlNcclxuY29uc3QgZGVsZXRlX2J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kZWxldGVdJyk7XHJcblxyXG5kZWxldGVfYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcblx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFxyXG5cdFx0YnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcblx0XHRpZighYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1kZWxldGUnKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNvbmZpcm1hdGlvbiA9IHRydWU7XHJcblx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWNvbmZpcm0nKSkge1xyXG5cdFx0XHRjb25maXJtYXRpb24gPSBjb25maXJtKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29uZmlybScpKTtcclxuXHRcdH1cclxuXHRcdGlmKCFjb25maXJtYXRpb24pIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZldGNoKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVsZXRlJyksIHttZXRob2Q6ICdQT1NUJ30pXHJcblx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcblx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0aWYoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG5cdFx0XHRcdC8vIFJlZGlyZWN0XHJcblx0XHRcdFx0aWYoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpKSB7XHJcblx0XHRcdFx0XHRjb25zdCByZWRpcmVjdCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVkaXJlY3QnKTtcclxuXHRcdFx0XHRcdGlmKHJlZGlyZWN0ID09PSAndGhpcycpIHtcclxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUYWJsZXNcclxuXHRcdFx0XHRpZihidXR0b24ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYmxlLWFjdGlvbicpKSB7XHJcblx0XHRcdFx0XHQvLyBidXR0b24ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0ZnVuY3Rpb24gZmFkZU91dChlbCkge1xyXG5cdFx0XHRcdFx0XHRlbC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuXHRcdFx0XHRcdFx0KGZ1bmN0aW9uIGZhZGUoKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKChlbC5zdHlsZS5vcGFjaXR5IC09IC4xKSA8IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZhZGUpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSkoKTtcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRmYWRlT3V0KGJ1dHRvbi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBDb3VudGVyXHJcblx0XHRcdFx0aWYoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1jb3VudGVyJykpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtY291bnRlcicpKTtcclxuXHRcdFx0XHRcdGNvdW50ZXIudGV4dENvbnRlbnQgPSBwYXJzZUludChjb3VudGVyLnRleHRDb250ZW50KSAtIDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtYWtlQWxlcnQoZGF0YS5zdGF0dXMsIGRhdGEubWVzc2FnZSk7XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcclxuXHRcdFx0bWFrZUFsZXJ0KCdlcnJvcicsIGVycm9yKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdH0pO1xyXG59KTtcclxuXHRjbGFzcyBGb3JlaWduRm9ybSB7XHJcblx0Y29uc3RydWN0b3Iobm9kZSkge1xyXG5cdFx0dGhpcy5ub2RlID0gbm9kZTtcclxuXHRcdHRoaXMubmFtZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcclxuXHRcdHRoaXMudmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xyXG5cdFx0dGhpcy5pbnB1dHMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xyXG5cdFx0dGhpcy5idXR0b24gPSB7XHJcblx0XHRcdHN1Ym1pdDogbm9kZS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLFxyXG5cdFx0XHRvcGVuX21vZGFsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuXHRcdH07XHJcblx0XHR0aGlzLmljb24gPSB7XHJcblx0XHRcdGFkZDogYDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctcHJpbWFyeSBjdXJzb3ItcG9pbnRlclwiPjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1wbHVzIGFsaWduLW1pZGRsZSBmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxMlwiIHkxPVwiNVwiIHgyPVwiMTJcIiB5Mj1cIjE5XCI+PC9saW5lPjxsaW5lIHgxPVwiNVwiIHkxPVwiMTJcIiB4Mj1cIjE5XCIgeTI9XCIxMlwiPjwvbGluZT48L3N2Zz48L3NwYW4+YCxcclxuXHRcdFx0c29ydDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1tb3ZlXCI+PHBvbHlsaW5lIHBvaW50cz1cIjUgOSAyIDEyIDUgMTVcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XCI5IDUgMTIgMiAxNSA1XCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVwiMTUgMTkgMTIgMjIgOSAxOVwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cIjE5IDkgMjIgMTIgMTkgMTVcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVwiMlwiIHkxPVwiMTJcIiB4Mj1cIjIyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIyXCIgeDI9XCIxMlwiIHkyPVwiMjJcIj48L2xpbmU+PC9zdmc+YCxcclxuXHRcdFx0ZWRpdDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1lZGl0XCI+PHBhdGggZD1cIk0xMSA0SDRhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJ2LTdcIj48L3BhdGg+PHBhdGggZD1cIk0xOC41IDIuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMMTIgMTVsLTQgMSAxLTQgOS41LTkuNXpcIj48L3BhdGg+PC9zdmc+YCxcclxuXHRcdFx0ZGVsZXRlOiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLXRyYXNoXCI+PHBvbHlsaW5lIHBvaW50cz1cIjMgNiA1IDYgMjEgNlwiPjwvcG9seWxpbmU+PHBhdGggZD1cIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiPjwvcGF0aD48L3N2Zz5gXHJcblx0XHR9O1xyXG5cdFx0dGhpcy51aWQgPSB0aGlzLmdlbmVyYXRlVWlkKCk7XHJcblx0XHR0aGlzLnN0b3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdHRoaXMudGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xyXG5cdFx0dGhpcy50Ym9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XHJcblx0XHR0aGlzLmlzX2VkaXRpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuZWRpdGluZ19yb3cgPSBudWxsO1xyXG5cclxuXHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSgpIHtcclxuXHRcdC8vIFNFVCBJRCBUTyBOT0RFXHJcblx0XHR0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMudWlkKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgTU9EQUwgQlVUVE9OXHJcblx0XHR0aGlzLmJ1dHRvbi5vcGVuX21vZGFsLnNldEF0dHJpYnV0ZSgnZGF0YS1icy10b2dnbGUnLCAnbW9kYWwnKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuc2V0QXR0cmlidXRlKCdkYXRhLWJzLXRhcmdldCcsICcjJyArIHRoaXMudWlkKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuaW5uZXJIVE1MID0gdGhpcy5pY29uLmFkZDtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcblx0XHRcdGlmKCF0aGlzLmlzX2VkaXRpbmcpIHtcclxuXHRcdFx0XHR0aGlzLnJlc2V0RWRpdGluZ1JvdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBTRVQgVVAgU1RPUkVcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG5cdFx0dGhpcy5zdG9yZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgVEFCTEVcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUnKTtcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUtc20nKTtcclxuXHJcblx0XHR0aGlzLnRib2R5LmNsYXNzTGlzdC5hZGQoJ3NvcnRhYmxlJyk7XHJcblx0XHRuZXcgU29ydGFibGUodGhpcy50Ym9keSwge1xyXG5cdFx0XHRoYW5kbGU6ICcuc29ydGFibGVfX2hhbmRsZScsXHJcblx0XHRcdGFuaW1hdGlvbjogMTUwLFxyXG5cdFx0XHRvblNvcnQ6ICgpID0+IHRoaXMudXBkYXRlU3RvcmUoKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gU0VUIFVQIFNVTUlUIEJVVFRPTlxyXG5cdFx0dGhpcy5idXR0b24uc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0dGhpcy5jbGlja1N1Ym1pdCgpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVN0b3JlKCk7XHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBSRU5ERVJcclxuXHRcdHRoaXMucG9wdWxhdGVUYWJsZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHJcblx0XHQvLyBSRVNFVCBFRElUSU5HIFJPVyBJRiBNT0RBTCBDQU5DRUxFRFxyXG5cdFx0dGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHRoaXMucmVzZXRFZGl0aW5nUm93KCkpO1xyXG5cdH1cclxuXHJcblx0Y2xpY2tTdWJtaXQoKSB7XHJcblx0XHQvLyBFRElUIFJPV1xyXG5cdFx0aWYodGhpcy5pc19lZGl0aW5nKSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZWRpdGluZ19yb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBREQgUk9XXHJcblx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KCkpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlU3RvcmUoKSB7XHJcblx0XHRsZXQgZGF0YSA9IFtdO1xyXG5cclxuXHRcdHRoaXMudGJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHRyID0+IHtcclxuXHRcdFx0bGV0IG9iaiA9IHt9O1xyXG5cclxuXHRcdFx0dHIucXVlcnlTZWxlY3RvckFsbCgndGQnKS5mb3JFYWNoKHRkID0+IHtcclxuXHRcdFx0XHRpZighdGQuaGFzQXR0cmlidXRlKCdkYXRhLW5hbWUnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpbdGQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKV0gPSB0ZC50ZXh0Q29udGVudDtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRkYXRhLnB1c2gob2JqKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc3RvcmUudmFsdWUgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlc2V0RWRpdGluZ1JvdygpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRpZihpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ3NlbGVjdCcpIHtcclxuXHRcdFx0XHRpbnB1dC5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdFx0XHRpZighaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRpbnB1dC5zbGltLnNldChpbnB1dC52YWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuaXNfZWRpdGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5lZGl0aW5nX3JvdyA9IG51bGw7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVSb3cob2JqZWN0ID0gbnVsbCkge1xyXG5cdFx0Y29uc3QgdHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcblxyXG5cdFx0aWYob2JqZWN0KSB7XHJcblx0XHRcdGZvcihjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywga2V5KTtcclxuXHRcdFx0XHR0Y29sLnRleHRDb250ZW50ID0gdmFsdWU7XHJcblxyXG5cdFx0XHRcdHRyb3cuYXBwZW5kQ2hpbGQodGNvbCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywgaW5wdXQubmFtZSk7XHJcblx0XHRcdFx0dGNvbC50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cclxuXHRcdFx0XHR0cm93LmFwcGVuZENoaWxkKHRjb2wpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0Y29sX2FjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cdFx0dGNvbF9hY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLWFjdGlvbicpO1xyXG5cclxuXHRcdGNvbnN0IGJ0bl9zb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cdFx0Y29uc3QgYnRuX2VkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblx0XHRjb25zdCBidG5fZGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuXHRcdGJ0bl9zb3J0LmlubmVySFRNTCA9IHRoaXMuaWNvbi5zb3J0ICsgJyAnOyBidG5fc29ydC5jbGFzc0xpc3QuYWRkKCdzb3J0YWJsZV9faGFuZGxlJyk7XHJcblx0XHRidG5fZWRpdC5pbm5lckhUTUwgPSB0aGlzLmljb24uZWRpdCArICcgJztcclxuXHRcdGJ0bl9kZWxldGUuaW5uZXJIVE1MID0gdGhpcy5pY29uLmRlbGV0ZTtcclxuXHJcblx0XHRidG5fZWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuY2xpY2tFZGl0KHRyb3cpKTtcclxuXHRcdGJ0bl9kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmNsaWNrRGVsZXRlKHRyb3cpKTtcclxuXHRcdFxyXG5cdFx0dGNvbF9hY3Rpb25zLmFwcGVuZChidG5fc29ydCk7XHJcblx0XHR0Y29sX2FjdGlvbnMuYXBwZW5kKGJ0bl9lZGl0KTtcclxuXHRcdHRjb2xfYWN0aW9ucy5hcHBlbmQoYnRuX2RlbGV0ZSk7XHJcblxyXG5cdFx0dHJvdy5hcHBlbmRDaGlsZCh0Y29sX2FjdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiB0cm93O1xyXG5cdH1cclxuXHJcblx0Y2xpY2tFZGl0KHRyb3cpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudDtcclxuXHJcblx0XHRcdGlmKGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnc2VsZWN0JyAmJiAhaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0aW5wdXQuc2xpbS5zZXQodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaXNfZWRpdGluZyA9IHRydWU7XHJcblx0XHRcdHRoaXMuZWRpdGluZ19yb3cgPSB0cm93O1xyXG5cclxuXHRcdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbGlja0RlbGV0ZSh0cm93KSB7XHJcblx0XHR0cm93LnJlbW92ZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdH1cclxuXHJcblx0cG9wdWxhdGVUYWJsZSgpIHtcclxuXHRcdGlmKCF0aGlzLnZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHZhbHVlcyA9IEpTT04ucGFyc2UodGhpcy52YWx1ZSk7XHJcblxyXG5cdFx0dmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xyXG5cdFx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KHZhbHVlKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHRoaXMudGFibGUuYXBwZW5kQ2hpbGQodGhpcy50Ym9keSk7XHJcblxyXG5cdFx0dGhpcy5ub2RlLmJlZm9yZSh0aGlzLmJ1dHRvbi5vcGVuX21vZGFsKTtcclxuXHRcdHRoaXMubm9kZS5iZWZvcmUodGhpcy5zdG9yZSk7XHJcblx0XHR0aGlzLm5vZGUuYmVmb3JlKHRoaXMudGFibGUpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVVaWQoKSB7XHJcblx0XHRyZXR1cm4gJ2ZmLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcclxuXHR9XHJcbn1cclxuXHJcbkZPUk1TLmZvckVhY2goZm9ybSA9PiB7XHJcblx0Zm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3MqPVwiZm9yZWlnbi1mb3JtXCJdJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdG5ldyBGb3JlaWduRm9ybShlbGVtZW50KTtcclxuXHR9KTtcclxufSk7XHJcbn0pO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuXHQvLyBIQU5ETEUgQlJPS0VOIElNQUdFU1xyXG5cdGNvbnN0IGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcblx0aW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xyXG5cdFx0aWYoaW1hZ2UuY29tcGxldGUgJiYgdHlwZW9mIGltYWdlLm5hdHVyYWxXaWR0aCAhPSBcInVuZGVmaW5lZFwiICYmIGltYWdlLm5hdHVyYWxXaWR0aCA8PSAwKSB7XHJcblx0XHRcdGltYWdlLnNyYyA9IEJBU0VfVVJMICsgJy9tb2R1bGUvQWRtaW4vQXNzZXQvaW1nL25vX2ltYWdlLmpwZyc7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07Il0sImZpbGUiOiJtYWluLmpzIn0=