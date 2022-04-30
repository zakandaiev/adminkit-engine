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
          if (!event.currentTarget.hash) {
            return;
          }

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
    var quill_icons = Quill.import('ui/icons');
    quill_icons['expand'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="maximize feather feather-maximize align-middle"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="minimize feather feather-minimize align-middle"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>';
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
              var expand = wysiwyg_node.querySelector('.ql-expand');

              function maximize() {
                wysiwyg_node.classList.add('fullscreen');
                if (expand) expand.classList.add('active');
              }

              function minimize() {
                wysiwyg_node.classList.remove('fullscreen');
                if (expand) expand.classList.remove('active');
              }

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
    }); // IMAGE UPLOAD

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiQkFTRV9VUkwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiaG9zdCIsIlNFVFRJTkciLCJsb2FkZXIiLCJpbWFnZV9wbGFjZWhvbGRlciIsIlNtb290aFNjcm9sbFRvIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3IiwiYmVoYXZpb3IiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImFuY2hvciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImV2ZW50IiwiYW5jaG9yX2hyZWYiLCJjdXJyZW50VGFyZ2V0IiwiY2hhckF0IiwiaGFzaCIsInNjcm9sbF90b19ub2RlIiwicXVlcnlTZWxlY3RvciIsInByZXZlbnREZWZhdWx0IiwidGFibGUiLCJwYXJlbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJvdXRlckhUTUwiLCJwb25kX2lucHV0X2RhdGEiLCJmaWxlcyIsImlucHV0IiwiaW5wdXRfZmlsZXMiLCJKU09OIiwicGFyc2UiLCJmaWxlIiwiZmlsZV9vYmoiLCJzb3VyY2UiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJ0eXBlIiwibWV0YWRhdGEiLCJhbGxvd0ltYWdlUHJldmlldyIsInBvc3RlciIsInB1c2giLCJtYXhUb3RhbEZpbGVTaXplIiwibWF4RmlsZVNpemUiLCJtYXhGaWxlcyIsInBhcnNlSW50Iiwic3R5bGVJdGVtUGFuZWxBc3BlY3RSYXRpbyIsImZpbGVfaW5wdXRzIiwicG9uZCIsIkZpbGVQb25kIiwiY3JlYXRlIiwic2VydmVyIiwibG9hZCIsInN0b3JlQXNGaWxlIiwiaW5zdGFudFVwbG9hZCIsImFsbG93UHJvY2VzcyIsImFsbG93UmV2ZXJ0IiwiYWxsb3dSZW9yZGVyIiwiZHJvcE9uUGFnZSIsImRyb3BPbkVsZW1lbnQiLCJsZW5ndGgiLCJjcmVkaXRzIiwic2V0T3B0aW9ucyIsImxhYmVsSWRsZSIsInRleHRhcmVhIiwiYWRkIiwid3lzaXd5Z19ub2RlIiwiY3JlYXRlRWxlbWVudCIsInF1aWxsX25vZGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImFmdGVyIiwicXVpbGxfaWNvbnMiLCJRdWlsbCIsImltcG9ydCIsInF1aWxsIiwibW9kdWxlcyIsInRvb2xiYXIiLCJjb250YWluZXIiLCJoZWFkZXIiLCJoYW5kbGVycyIsInVwbG9hZEltYWdlIiwiZXhwYW5kIiwibWF4aW1pemUiLCJtaW5pbWl6ZSIsInJlbW92ZSIsInBsYWNlaG9sZGVyIiwicmVhZE9ubHkiLCJkaXNhYmxlZCIsInRoZW1lIiwib24iLCJyb290IiwiSW1hZ2UiLCJjbGFzc05hbWUiLCJyZWdpc3RlciIsImNsaWNrIiwib25jaGFuZ2UiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwiZW5hYmxlIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5IiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJzdGF0dXMiLCJzZWxlY3Rpb24iLCJnZXRTZWxlY3Rpb24iLCJpbmRleCIsImluc2VydEVtYmVkIiwibWVzc2FnZSIsInNldFNlbGVjdGlvbiIsIm1ha2VBbGVydCIsImNhdGNoIiwiZXJyb3IiLCJzbGltc2VsZWN0X2RhdGEiLCJhZGRhYmxlIiwic2VsZWN0IiwidmFsIiwicmVwbGFjZUFsbCIsInRyaW0iLCJhbGxvd0Rlc2VsZWN0IiwiZGVzZWxlY3RMYWJlbCIsImhpZGVTZWxlY3RlZE9wdGlvbiIsIm11bHRpcGxlIiwiY2xvc2VPblNlbGVjdCIsInNob3dTZWFyY2giLCJzZWFyY2hQbGFjZWhvbGRlciIsInNlYXJjaFRleHQiLCJTbGltU2VsZWN0IiwicGxhY2Vob2xkZXJUZXh0Iiwic2hvd0NvbnRlbnQiLCJTb3J0YWJsZSIsImhhbmRsZSIsImFuaW1hdGlvbiIsInRleHQiLCJ0aW1lIiwidG9hc3QiLCJ0b2FzdF9pY29uIiwidG9hc3RfdGV4dCIsInRleHRDb250ZW50IiwiY2xvc2VBbGVydCIsInNldFRpbWVvdXQiLCJjaGlsZEVsZW1lbnRDb3VudCIsImZvcm0iLCJpbnNlcnRBZGphY2VudEhUTUwiLCJmb3JtQmVoYXZpb3IiLCJkaXNhYmxlRm9ybSIsInNldCIsImNzcmYiLCJrZXkiLCJ0b2tlbiIsImFjdGlvbiIsInJlZGlyZWN0IiwicmVsb2FkIiwiaHJlZiIsInJlc2V0IiwiZW5hYmxlRm9ybSIsImNvbnRyb2xzIiwiaGlkZUl0ZW1zIiwiY29udHJvbCIsImhpZGUiLCJjaGVja2VkIiwic3BsaXQiLCJ0b19oaWRlIiwiaXRlbSIsInBhcmVudCIsInNob3dJdGVtcyIsInNob3ciLCJ0b19zaG93IiwidGFyZ2V0IiwidGFyZ2V0X2l0ZW0iLCJjeXJfdG9fbGF0Iiwic2x1ZyIsImRlbGV0ZV9idXR0b25zIiwiYnV0dG9uIiwiY29uZmlybWF0aW9uIiwiY29uZmlybSIsImZhZGVPdXQiLCJlbCIsInN0eWxlIiwib3BhY2l0eSIsImZhZGUiLCJkaXNwbGF5IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY291bnRlciIsIkZvcmVpZ25Gb3JtIiwibm9kZSIsIm5hbWUiLCJpbnB1dHMiLCJzdWJtaXQiLCJvcGVuX21vZGFsIiwiaWNvbiIsInNvcnQiLCJlZGl0IiwiZGVsZXRlIiwidWlkIiwiZ2VuZXJhdGVVaWQiLCJzdG9yZSIsInRib2R5IiwiaXNfZWRpdGluZyIsImVkaXRpbmdfcm93IiwiaW5pdGlhbGl6ZSIsInJlc2V0RWRpdGluZ1JvdyIsIm9uU29ydCIsInVwZGF0ZVN0b3JlIiwiY2xpY2tTdWJtaXQiLCJwb3B1bGF0ZVRhYmxlIiwicmVuZGVyIiwiY3JlYXRlUm93IiwidHIiLCJvYmoiLCJ0ZCIsInN0cmluZ2lmeSIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInNlbGVjdGVkSW5kZXgiLCJzbGltIiwib2JqZWN0IiwidHJvdyIsIk9iamVjdCIsImVudHJpZXMiLCJ0Y29sIiwidGNvbF9hY3Rpb25zIiwiYnRuX3NvcnQiLCJidG5fZWRpdCIsImJ0bl9kZWxldGUiLCJjbGlja0VkaXQiLCJjbGlja0RlbGV0ZSIsInZhbHVlcyIsImJlZm9yZSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsInNsaWNlIiwib25sb2FkIiwiaW1hZ2VzIiwiaW1hZ2UiLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsInNyYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLElBQU1BLFFBQVEsR0FBR0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxRQUFoQixHQUEyQixJQUEzQixHQUFrQ0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCRSxJQUFuRTtBQUVBQyxPQUFPLENBQUNDLE1BQVIsR0FBaUIsOEdBQWpCO0FBQ0FELE9BQU8sQ0FBQ0UsaUJBQVIsR0FBNEJQLFFBQVEsR0FBRywyQ0FBdkMsQyxDQUVBOztBQUNBLFNBQVNRLGNBQVQsQ0FBd0JDLE9BQXhCLEVBQWlDO0FBQ2hDLE1BQUdBLE9BQUgsRUFBWTtBQUNYQSxJQUFBQSxPQUFPLENBQUNDLGNBQVIsQ0FBdUI7QUFDckJDLE1BQUFBLFFBQVEsRUFBRTtBQURXLEtBQXZCO0FBR0E7QUFDRDs7QUFFREMsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNuRDtBQUNBRCxFQUFBQSxRQUFRLENBQUNFLGdCQUFULENBQTBCLEdBQTFCLEVBQStCQyxPQUEvQixDQUF1QyxVQUFBQyxNQUFNLEVBQUk7QUFDaEQsUUFBR0EsTUFBTSxDQUFDQyxZQUFQLENBQW9CLFFBQXBCLEtBQWlDRCxNQUFNLENBQUNFLFlBQVAsQ0FBb0IsUUFBcEIsTUFBa0MsUUFBdEUsRUFBZ0Y7QUFDL0VGLE1BQUFBLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQixLQUFwQixFQUEyQiw4QkFBM0I7QUFDQTs7QUFFRCxRQUFHLENBQUNILE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQixnQkFBcEIsQ0FBSixFQUEyQztBQUMxQ0QsTUFBQUEsTUFBTSxDQUFDSCxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxVQUFBTyxLQUFLLEVBQUk7QUFD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QUssQ0FBQ0UsWUFBTixJQUFzQixDQUF2RixFQUEwRjtBQUN6RkYsTUFBQUEsS0FBSyxDQUFDRyxHQUFOLEdBQVlyUCxPQUFPLENBQUNFLGlCQUFwQjtBQUNBO0FBQ0QsR0FKRDtBQUtBLENBUkQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTRVRUSU5HU1xyXG5jb25zdCBCQVNFX1VSTCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuXHJcblNFVFRJTkcubG9hZGVyID0gJzxkaXYgY2xhc3M9XCJzcGlubmVyLWJvcmRlciB0ZXh0LXByaW1hcnlcIiByb2xlPVwic3RhdHVzXCI+PHNwYW4gY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj5Mb2FkaW5nLi4uPC9zcGFuPjwvZGl2Pic7XHJcblNFVFRJTkcuaW1hZ2VfcGxhY2Vob2xkZXIgPSBCQVNFX1VSTCArICcvbW9kdWxlL0FkbWluL1ZpZXcvQXNzZXQvaW1nL25vX2ltYWdlLmpwZyc7XHJcblxyXG4vLyBGVU5DVElPTlNcclxuZnVuY3Rpb24gU21vb3RoU2Nyb2xsVG8oZWxlbWVudCkge1xyXG5cdGlmKGVsZW1lbnQpIHtcclxuXHRcdGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xyXG5cdFx0XHRcdGJlaGF2aW9yOiAnc21vb3RoJ1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cdC8vIFNNT09USCBTQ1JPTExcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJykuZm9yRWFjaChhbmNob3IgPT4ge1xyXG5cdFx0aWYoYW5jaG9yLmhhc0F0dHJpYnV0ZSgndGFyZ2V0JykgJiYgYW5jaG9yLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgPT09ICdfYmxhbmsnKSB7XHJcblx0XHRcdGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyIG5vZm9sbG93Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIWFuY2hvci5oYXNBdHRyaWJ1dGUoJ2RhdGEtYnMtdG9nZ2xlJykpIHtcclxuXHRcdFx0YW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGFuY2hvcl9ocmVmID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHRcdFx0XHRpZihhbmNob3JfaHJlZi5jaGFyQXQoMCkgPT09ICcjJyB8fCAoYW5jaG9yX2hyZWYuY2hhckF0KDApID09PSAnLycgJiYgYW5jaG9yX2hyZWYuY2hhckF0KDEpID09PSAnIycpKSB7XHJcblx0XHRcdFx0XHRpZighZXZlbnQuY3VycmVudFRhcmdldC5oYXNoKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Y29uc3Qgc2Nyb2xsX3RvX25vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGV2ZW50LmN1cnJlbnRUYXJnZXQuaGFzaCk7XHJcblx0XHRcdFx0XHRpZihzY3JvbGxfdG9fbm9kZSkge1xyXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRTbW9vdGhTY3JvbGxUbyhzY3JvbGxfdG9fbm9kZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gUkVTUE9OU0lWRSBUQUJMRVNcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZScpLmZvckVhY2godGFibGUgPT4ge1xyXG5cdFx0aWYoIXRhYmxlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJsZS1yZXNwb25zaXZlJykpIHtcclxuXHRcdFx0dGFibGUub3V0ZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJ0YWJsZS1yZXNwb25zaXZlXCI+JyArIHRhYmxlLm91dGVySFRNTCArICc8L2Rpdj4nO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvLyBGSUxFUE9ORFxyXG5cdGNvbnN0IHBvbmRfaW5wdXRfZGF0YSA9IHtcclxuXHRmaWxlczogaW5wdXQgPT4ge1xyXG5cdFx0bGV0IGZpbGVzID0gW107XHJcblx0XHRpZighaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLXZhbHVlJykpIHtcclxuXHRcdFx0cmV0dXJuIGZpbGVzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpbnB1dF9maWxlcyA9IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xyXG5cclxuXHRcdGlmKCFpbnB1dF9maWxlcyB8fCBpbnB1dF9maWxlcyA9PSAnW10nKSB7XHJcblx0XHRcdHJldHVybiBmaWxlcztcclxuXHRcdH1cclxuXHJcblx0XHRpbnB1dF9maWxlcyA9IEpTT04ucGFyc2UoaW5wdXRfZmlsZXMpO1xyXG5cdFx0XHJcblx0XHRpbnB1dF9maWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xyXG5cdFx0XHRsZXQgZmlsZV9vYmogPSB7XHJcblx0XHRcdFx0c291cmNlOiBmaWxlLnZhbHVlLFxyXG5cdFx0XHRcdG9wdGlvbnM6IHtcclxuXHRcdFx0XHRcdHR5cGU6ICdsb2NhbCcsXHJcblx0XHRcdFx0XHRtZXRhZGF0YToge31cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZihwb25kX2lucHV0X2RhdGEuYWxsb3dJbWFnZVByZXZpZXcoaW5wdXQpKSB7XHJcblx0XHRcdFx0ZmlsZV9vYmoub3B0aW9ucy5tZXRhZGF0YS5wb3N0ZXIgPSBmaWxlLnBvc3RlcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmlsZXMucHVzaChmaWxlX29iaik7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZpbGVzO1xyXG5cdH0sXHJcblx0YWxsb3dJbWFnZVByZXZpZXc6IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlldycpID09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XHJcblx0fSxcclxuXHRtYXhUb3RhbEZpbGVTaXplOiBpbnB1dCA9PiB7XHJcblx0XHRyZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW1heC10b3RhbC1zaXplJykgPyBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF4LXRvdGFsLXNpemUnKSA6IG51bGw7XHJcblx0fSxcclxuXHRtYXhGaWxlU2l6ZTogaW5wdXQgPT4ge1xyXG5cdFx0cmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYXgtc2l6ZScpID8gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLW1heC1zaXplJykgOiBudWxsO1xyXG5cdH0sXHJcblx0bWF4RmlsZXM6IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWF4LWZpbGVzJykgPyBwYXJzZUludChpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF4LWZpbGVzJykpIDogbnVsbDtcclxuXHR9LFxyXG5cdHN0eWxlSXRlbVBhbmVsQXNwZWN0UmF0aW86IGlucHV0ID0+IHtcclxuXHRcdHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtYXNwZWN0LXJhdGlvJykgPyBwYXJzZUludChpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNwZWN0LXJhdGlvJykpIDogMC41NjI1O1xyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IGZpbGVfaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKTtcclxuXHJcbmlmKGZpbGVfaW5wdXRzKSB7XHJcblx0ZmlsZV9pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRjb25zdCBwb25kID0gRmlsZVBvbmQuY3JlYXRlKFxyXG5cdFx0XHRpbnB1dCwge1xyXG5cdFx0XHRcdHNlcnZlcjoge2xvYWQ6ICcvdXBsb2FkP2xvYWQ9J30sXHJcblx0XHRcdFx0c3RvcmVBc0ZpbGU6IHRydWUsXHJcblx0XHRcdFx0aW5zdGFudFVwbG9hZDogZmFsc2UsXHJcblx0XHRcdFx0YWxsb3dQcm9jZXNzOiBmYWxzZSxcclxuXHRcdFx0XHRhbGxvd1JldmVydDogZmFsc2UsXHJcblx0XHRcdFx0YWxsb3dSZW9yZGVyOiB0cnVlLFxyXG5cdFx0XHRcdGRyb3BPblBhZ2U6IHRydWUsXHJcblx0XHRcdFx0ZHJvcE9uRWxlbWVudDogZmlsZV9pbnB1dHMubGVuZ3RoID09IDEgPyBmYWxzZSA6IHRydWUsXHJcblx0XHRcdFx0ZmlsZXM6IHBvbmRfaW5wdXRfZGF0YS5maWxlcyhpbnB1dCksXHJcblx0XHRcdFx0YWxsb3dJbWFnZVByZXZpZXc6IHBvbmRfaW5wdXRfZGF0YS5hbGxvd0ltYWdlUHJldmlldyhpbnB1dCksXHJcblx0XHRcdFx0bWF4VG90YWxGaWxlU2l6ZTogcG9uZF9pbnB1dF9kYXRhLm1heFRvdGFsRmlsZVNpemUoaW5wdXQpLFxyXG5cdFx0XHRcdG1heEZpbGVTaXplOiBwb25kX2lucHV0X2RhdGEubWF4RmlsZVNpemUoaW5wdXQpLFxyXG5cdFx0XHRcdG1heEZpbGVzOiBwb25kX2lucHV0X2RhdGEubWF4RmlsZXMoaW5wdXQpLFxyXG5cdFx0XHRcdHN0eWxlSXRlbVBhbmVsQXNwZWN0UmF0aW86IHBvbmRfaW5wdXRfZGF0YS5zdHlsZUl0ZW1QYW5lbEFzcGVjdFJhdGlvKGlucHV0KSxcclxuXHRcdFx0XHRjcmVkaXRzOiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cclxuXHRcdGlmKGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicpKSB7XHJcblx0XHRcdHBvbmQuc2V0T3B0aW9ucyh7XHJcblx0XHRcdFx0bGFiZWxJZGxlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuXHQvLyBRVUlMTFxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhW2NsYXNzKj1cInd5c2l3eWdcIl0nKS5mb3JFYWNoKHRleHRhcmVhID0+IHtcclxuXHR0ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG5cclxuXHRjb25zdCB3eXNpd3lnX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRjb25zdCBxdWlsbF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0cXVpbGxfbm9kZS5pbm5lckhUTUwgPSB0ZXh0YXJlYS52YWx1ZTtcclxuXHJcblx0d3lzaXd5Z19ub2RlLmNsYXNzTGlzdC5hZGQoJ3d5c2l3eWcnKTtcclxuXHR3eXNpd3lnX25vZGUuYXBwZW5kQ2hpbGQocXVpbGxfbm9kZSk7XHJcblx0dGV4dGFyZWEuYWZ0ZXIod3lzaXd5Z19ub2RlKTtcclxuXHJcblx0bGV0IHF1aWxsX2ljb25zID0gUXVpbGwuaW1wb3J0KCd1aS9pY29ucycpO1xyXG5cdHF1aWxsX2ljb25zWydleHBhbmQnXSA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJtYXhpbWl6ZSBmZWF0aGVyIGZlYXRoZXItbWF4aW1pemUgYWxpZ24tbWlkZGxlXCI+PHBhdGggZD1cIk04IDNINWEyIDIgMCAwMC0yIDJ2M20xOCAwVjVhMiAyIDAgMDAtMi0yaC0zbTAgMThoM2EyIDIgMCAwMDItMnYtM00zIDE2djNhMiAyIDAgMDAyIDJoM1wiLz48L3N2Zz48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJtaW5pbWl6ZSBmZWF0aGVyIGZlYXRoZXItbWluaW1pemUgYWxpZ24tbWlkZGxlXCI+PHBhdGggZD1cIk04IDN2M2EyIDIgMCAwMS0yIDJIM20xOCAwaC0zYTIgMiAwIDAxLTItMlYzbTAgMTh2LTNhMiAyIDAgMDEyLTJoM00zIDE2aDNhMiAyIDAgMDEyIDJ2M1wiLz48L3N2Zz4nO1xyXG5cclxuXHRjb25zdCBxdWlsbCA9IG5ldyBRdWlsbChxdWlsbF9ub2RlLCB7XHJcblx0XHRtb2R1bGVzOiB7XHJcblx0XHRcdHRvb2xiYXI6IHtcclxuXHRcdFx0XHRcdGNvbnRhaW5lcjogW1xyXG5cdFx0XHRcdFx0XHRbeyBoZWFkZXI6IFsyLCAzLCBmYWxzZV0gfV0sXHJcblx0XHRcdFx0XHRcdFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZSddLFxyXG5cdFx0XHRcdFx0XHRbeydhbGlnbic6IFtdfSwgeydsaXN0JzogJ29yZGVyZWQnfSwgeydsaXN0JzogJ2J1bGxldCd9XSxcclxuXHRcdFx0XHRcdFx0W3snY29sb3InOiBbXX0sIHsnYmFja2dyb3VuZCc6IFtdfV0sXHJcblx0XHRcdFx0XHRcdFsnbGluaycsICdpbWFnZScsICd2aWRlbycsICdibG9ja3F1b3RlJywgJ2NvZGUnXSxcclxuXHRcdFx0XHRcdFx0W3snaW5kZW50JzogJy0xJ30sIHsnaW5kZW50JzogJysxJ31dLFxyXG5cdFx0XHRcdFx0XHRbeydzY3JpcHQnOiAnc3ViJ30sIHsnc2NyaXB0JzogJ3N1cGVyJ31dLFxyXG5cdFx0XHRcdFx0XHRbJ2NsZWFuJ10sIFsnZXhwYW5kJ11cclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRoYW5kbGVyczoge1xyXG5cdFx0XHRcdFx0XHQnaW1hZ2UnOiBldmVudCA9PiB7XHJcblx0XHRcdFx0XHRcdFx0dXBsb2FkSW1hZ2UoKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0J2V4cGFuZCc6IGV2ZW50ID0+IHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBleHBhbmQgPSB3eXNpd3lnX25vZGUucXVlcnlTZWxlY3RvcignLnFsLWV4cGFuZCcpO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIG1heGltaXplKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d3lzaXd5Z19ub2RlLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGV4cGFuZCkgZXhwYW5kLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBtaW5pbWl6ZSgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihleHBhbmQpIGV4cGFuZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHd5c2l3eWdfbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGxzY3JlZW4nKSA/ICBtaW5pbWl6ZSgpIDogbWF4aW1pemUoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cGxhY2Vob2xkZXI6IHRleHRhcmVhLnBsYWNlaG9sZGVyLFxyXG5cdFx0cmVhZE9ubHk6IHRleHRhcmVhLmRpc2FibGVkID8gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0dGhlbWU6ICdzbm93J1xyXG5cdH0pO1xyXG5cclxuXHQvLyBQT1BVTEFURVxyXG5cdC8vIHF1aWxsLnNldENvbnRlbnRzKEpTT04ucGFyc2UodGV4dGFyZWEudmFsdWUpLm9wcyk7XHJcblxyXG5cdC8vIFVQREFURSBURVhUQVJFQSBWQUxVRVxyXG5cdHF1aWxsLm9uKCdlZGl0b3ItY2hhbmdlJywgZXZlbnQgPT4ge1xyXG5cdFx0Ly8gdGV4dGFyZWEudmFsdWUgPSBKU09OLnN0cmluZ2lmeShxdWlsbC5nZXRDb250ZW50cygpKTtcclxuXHRcdHRleHRhcmVhLnZhbHVlID0gcXVpbGwucm9vdC5pbm5lckhUTUw7XHJcblx0fSk7XHJcblxyXG5cdC8vIElNQUdFIFVQTE9BRFxyXG5cdGNvbnN0IEltYWdlID0gUXVpbGwuaW1wb3J0KCdmb3JtYXRzL2ltYWdlJyk7XHJcblx0SW1hZ2UuY2xhc3NOYW1lID0gJ2ltYWdlLWZsdWlkJztcclxuXHRRdWlsbC5yZWdpc3RlcihJbWFnZSwgdHJ1ZSk7XHJcblxyXG5cdGZ1bmN0aW9uIHVwbG9hZEltYWdlKCkge1xyXG5cdFx0Y29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0aW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuXHRcdGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgJ2ltYWdlLyonKTtcclxuXHRcdGlucHV0LmNsaWNrKCk7XHJcblxyXG5cdFx0aW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcclxuXHJcblx0XHRcdGlmKGZpbGUpIHtcclxuXHRcdFx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuXHJcblx0XHRcdFx0cXVpbGwuZW5hYmxlKGZhbHNlKTtcclxuXHJcblx0XHRcdFx0ZmV0Y2goJy91cGxvYWQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdFx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcblx0XHRcdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHNlbGVjdGlvbiA9IHF1aWxsLmdldFNlbGVjdGlvbigpLmluZGV4O1xyXG5cdFx0XHRcdFx0XHRxdWlsbC5pbnNlcnRFbWJlZChzZWxlY3Rpb24sICdpbWFnZScsIEJBU0VfVVJMICsgJy8nICsgZGF0YS5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdFx0cXVpbGwuc2V0U2VsZWN0aW9uKHNlbGVjdGlvbiArIDEpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bWFrZUFsZXJ0KGRhdGEuc3RhdHVzLCBkYXRhLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmNhdGNoKGVycm9yID0+IHtcclxuXHRcdFx0XHRcdG1ha2VBbGVydCgnZXJyb3InLCBlcnJvcik7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHF1aWxsLmVuYWJsZSh0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcblxyXG5cdC8vIFNMSU1TRUxFQ1RcclxuXHRjb25zdCBzbGltc2VsZWN0X2RhdGEgPSB7XHJcblx0YWRkYWJsZTogc2VsZWN0ID0+IHtcclxuXHRcdGlmKCFzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRsZXQgdmFsID0gdmFsdWU7XHJcblxyXG5cdFx0XHRzd2l0Y2goc2VsZWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1hZGRhYmxlJykpIHtcclxuXHRcdFx0XHRjYXNlICd0YWcnOiB7XHJcblx0XHRcdFx0XHR2YWwgPSB2YWx1ZS5yZXBsYWNlQWxsKC9bXlxccHtMfVxcZCBdKy9naXUsICcnKS5yZXBsYWNlQWxsKC9bXFxzXSsvZywgJyAnKS50cmltKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdFx0dmFsID0gdmFsdWUucmVwbGFjZUFsbCgvW1xcc10rL2csICcgJykudHJpbSgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YWxsb3dEZXNlbGVjdDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QucXVlcnlTZWxlY3Rvcignb3B0aW9uW2RhdGEtcGxhY2Vob2xkZXJdJykgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRkZXNlbGVjdExhYmVsOiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxOFwiIHkxPVwiNlwiIHgyPVwiNlwiIHkyPVwiMThcIj48L2xpbmU+PGxpbmUgeDE9XCI2XCIgeTE9XCI2XCIgeDI9XCIxOFwiIHkyPVwiMThcIj48L2xpbmU+PC9zdmc+JztcclxuXHR9LFxyXG5cdGhpZGVTZWxlY3RlZE9wdGlvbjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QubXVsdGlwbGUgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRjbG9zZU9uU2VsZWN0OiBzZWxlY3QgPT4ge1xyXG5cdFx0cmV0dXJuIHNlbGVjdC5tdWx0aXBsZSA/IGZhbHNlIDogdHJ1ZTtcclxuXHR9LFxyXG5cdHNob3dTZWFyY2g6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKS5sZW5ndGggPiAxMCB8fCBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLWFkZGFibGUnKSkgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRwbGFjZWhvbGRlcjogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoUGxhY2Vob2xkZXI6IHNlbGVjdCA9PiB7XHJcblx0XHRyZXR1cm4gc2VsZWN0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlci1zZWFyY2gnKSA/IHNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXItc2VhcmNoJykgOiBudWxsO1xyXG5cdH0sXHJcblx0c2VhcmNoVGV4dDogc2VsZWN0ID0+IHtcclxuXHRcdHJldHVybiBzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgPyBzZWxlY3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyLXNlYXJjaC10ZXh0JykgOiBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlbGVjdCcpLmZvckVhY2goc2VsZWN0ID0+IHtcclxuXHRpZihzZWxlY3QuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdFxyXG5cdG5ldyBTbGltU2VsZWN0KHtcclxuXHRcdHNlbGVjdDogc2VsZWN0LFxyXG5cdFx0YWRkYWJsZTogc2xpbXNlbGVjdF9kYXRhLmFkZGFibGUoc2VsZWN0KSxcclxuXHRcdGFsbG93RGVzZWxlY3Q6IHNsaW1zZWxlY3RfZGF0YS5hbGxvd0Rlc2VsZWN0KHNlbGVjdCksXHJcblx0XHRkZXNlbGVjdExhYmVsOiBzbGltc2VsZWN0X2RhdGEuZGVzZWxlY3RMYWJlbChzZWxlY3QpLFxyXG5cdFx0Ly8gaGlkZVNlbGVjdGVkT3B0aW9uOiBzbGltc2VsZWN0X2RhdGEuaGlkZVNlbGVjdGVkT3B0aW9uKHNlbGVjdCksIC8vIG5vdCB3b3JrIHdpdGggb3B0Z3JvdXBzXHJcblx0XHRjbG9zZU9uU2VsZWN0OiBzbGltc2VsZWN0X2RhdGEuY2xvc2VPblNlbGVjdChzZWxlY3QpLFxyXG5cdFx0c2hvd1NlYXJjaDogc2xpbXNlbGVjdF9kYXRhLnNob3dTZWFyY2goc2VsZWN0KSxcclxuXHRcdHBsYWNlaG9sZGVyOiBzbGltc2VsZWN0X2RhdGEucGxhY2Vob2xkZXIoc2VsZWN0KSxcclxuXHRcdHBsYWNlaG9sZGVyVGV4dDogc2xpbXNlbGVjdF9kYXRhLnBsYWNlaG9sZGVyKHNlbGVjdCksXHJcblx0XHRzZWFyY2hQbGFjZWhvbGRlcjogc2xpbXNlbGVjdF9kYXRhLnNlYXJjaFBsYWNlaG9sZGVyKHNlbGVjdCksXHJcblx0XHRzZWFyY2hUZXh0OiBzbGltc2VsZWN0X2RhdGEuc2VhcmNoVGV4dChzZWxlY3QpLFxyXG5cdFx0c2hvd0NvbnRlbnQ6IFwiZG93blwiXHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHQvLyBTT1JUQUJMRVxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzcyo9XCJzb3J0YWJsZVwiXScpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcblx0bmV3IFNvcnRhYmxlKGVsZW1lbnQsIHtcclxuXHRcdGhhbmRsZTogJy5zb3J0YWJsZV9faGFuZGxlJyxcclxuXHRcdGFuaW1hdGlvbjogMTUwXHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHQvLyBUT0FTVFNcclxuXHRmdW5jdGlvbiBtYWtlQWxlcnQodHlwZSwgdGV4dCwgdGltZSA9IDUwMDApIHtcclxuXHRpZighdGV4dCB8fCAhdGV4dC5sZW5ndGgpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9hc3RzJyk7XHJcblx0aWYoIWNvbnRhaW5lcikge1xyXG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9hc3RzJyk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHR0b2FzdC5jbGFzc0xpc3QuYWRkKCd0b2FzdHNfX2l0ZW0nKTtcclxuXHRpZih0eXBlKSB7XHJcblx0XHR0b2FzdC5jbGFzc0xpc3QuYWRkKHR5cGUpO1xyXG5cdH1cclxuXHJcblx0bGV0IHRvYXN0X2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblx0dG9hc3RfaWNvbi5jbGFzc0xpc3QuYWRkKCd0b2FzdHNfX2ljb24nKTtcclxuXHRpZih0eXBlKSB7XHJcblx0XHR0b2FzdF9pY29uLmNsYXNzTGlzdC5hZGQodHlwZSk7XHJcblx0fVxyXG5cclxuXHRsZXQgdG9hc3RfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHR0b2FzdF90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0c19fdGV4dCcpO1xyXG5cdHRvYXN0X3RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuXHR0b2FzdC5hcHBlbmRDaGlsZCh0b2FzdF9pY29uKTtcclxuXHR0b2FzdC5hcHBlbmRDaGlsZCh0b2FzdF90ZXh0KTtcclxuXHJcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcclxuXHJcblx0dG9hc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZUFsZXJ0KGNvbnRhaW5lciwgdG9hc3QpKTtcclxuXHJcblx0c2V0VGltZW91dCgoKSA9PiBjbG9zZUFsZXJ0KGNvbnRhaW5lciwgdG9hc3QpLCB0aW1lKTtcclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlQWxlcnQoY29udGFpbmVyLCB0b2FzdCkge1xyXG5cdHRvYXN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FwcGVhcicpO1xyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0dG9hc3QucmVtb3ZlKCk7XHJcblx0XHRpZihjb250YWluZXIgJiYgY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHtcclxuXHRcdFx0Y29udGFpbmVyLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH0sIDUwMCk7XHJcbn1cclxuXHJcblx0Ly8gRk9STVNcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykuZm9yRWFjaChmb3JtID0+IHtcclxuXHRmb3JtLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgU0VUVElORy5sb2FkZXIpO1xyXG5cclxuXHRmb3JtQmVoYXZpb3IoZm9ybSk7XHJcblxyXG5cdGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZXZlbnQgPT4ge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFxyXG5cdFx0ZGlzYWJsZUZvcm0oZm9ybSk7XHJcblxyXG5cdFx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuXHRcdGZvcm1EYXRhLnNldChTRVRUSU5HLmNzcmYua2V5LCBTRVRUSU5HLmNzcmYudG9rZW4pO1xyXG5cclxuXHRcdGZldGNoKGZvcm0uYWN0aW9uLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuXHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0aWYoZm9ybS5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVkaXJlY3QnKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmVkaXJlY3QgPSBmb3JtLmdldEF0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpO1xyXG5cdFx0XHRcdFx0aWYocmVkaXJlY3QgPT09ICd0aGlzJykge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3Q7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGZvcm0uaGFzQXR0cmlidXRlKCdkYXRhLXJlc2V0JykpIHtcclxuXHRcdFx0XHRcdGZvcm0ucmVzZXQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xyXG5cdFx0XHRtYWtlQWxlcnQoJ2Vycm9yJywgZXJyb3IpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZW5hYmxlRm9ybShmb3JtKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmb3JtQmVoYXZpb3IoZm9ybSkge1xyXG5cdGNvbnN0IGNvbnRyb2xzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1iZWhhdmlvcl0nKTtcclxuXHJcblx0ZnVuY3Rpb24gaGlkZUl0ZW1zKGNvbnRyb2wpIHtcclxuXHRcdGxldCBoaWRlID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGlkZScpO1xyXG5cdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JyAmJiAhY29udHJvbC5jaGVja2VkKSB7XHJcblx0XHRcdGlmKGhpZGUpIHtcclxuXHRcdFx0XHRoaWRlICs9ICcsJyArIGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXNob3cnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRoaWRlID0gY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAncmFkaW8nICYmICFjb250cm9sLmNoZWNrZWQpIHtcclxuXHRcdFx0aGlkZSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRpZihoaWRlKSB7XHJcblx0XHRcdGhpZGUuc3BsaXQoJywnKS5mb3JFYWNoKHRvX2hpZGUgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiJyArIHRvX2hpZGUgKyAnXCJdJyk7XHJcblx0XHRcdFx0Y29uc3QgcGFyZW50ID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG5cdFx0XHRcdGlmKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tY29udHJvbCcpKSB7XHJcblx0XHRcdFx0XHRwYXJlbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNob3dJdGVtcyhjb250cm9sKSB7XHJcblx0XHRsZXQgc2hvdyA9IGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXNob3cnKTtcclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCcgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRzaG93ID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdyYWRpbycgJiYgIWNvbnRyb2wuY2hlY2tlZCkge1xyXG5cdFx0XHRzaG93ID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKHNob3cpIHtcclxuXHRcdFx0c2hvdy5zcGxpdCgnLCcpLmZvckVhY2godG9fc2hvdyA9PiB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCInICsgdG9fc2hvdyArICdcIl0nKTtcclxuXHRcdFx0XHRjb25zdCBwYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdFx0aWYocGFyZW50LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1jb250cm9sJykpIHtcclxuXHRcdFx0XHRcdHBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjb250cm9scy5mb3JFYWNoKGNvbnRyb2wgPT4ge1xyXG5cdFx0Ly8gb24gZm9ybSBpbml0XHJcblx0XHRpZihjb250cm9sLmdldEF0dHJpYnV0ZSgnZGF0YS1iZWhhdmlvcicpID09PSAndmlzaWJpbGl0eScpIHtcclxuXHRcdFx0aGlkZUl0ZW1zKGNvbnRyb2wpO1xyXG5cdFx0XHRzaG93SXRlbXMoY29udHJvbCk7XHJcblx0XHR9XHJcblx0XHQvLyBvbiBmb3JtIGNoYW5nZVxyXG5cdFx0Y29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcblx0XHRcdGlmKGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLWJlaGF2aW9yJykgPT09ICd2aXNpYmlsaXR5Jykge1xyXG5cdFx0XHRcdGhpZGVJdGVtcyhjb250cm9sKTtcclxuXHRcdFx0XHRzaG93SXRlbXMoY29udHJvbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ2N5cl90b19sYXQnKSB7XHJcblx0XHRcdFx0aWYoY29udHJvbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLnNwbGl0KCcsJykuZm9yRWFjaCh0YXJnZXQgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXRfaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9Jyt0YXJnZXQrJ10nKTtcclxuXHRcdFx0XHRcdFx0aWYodGFyZ2V0X2l0ZW0pIHtcclxuXHRcdFx0XHRcdFx0XHR0YXJnZXRfaXRlbS52YWx1ZSA9IGN5cl90b19sYXQoY29udHJvbC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb250cm9sLnZhbHVlID0gY3lyX3RvX2xhdChjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29udHJvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVoYXZpb3InKSA9PT0gJ3NsdWcnKSB7XHJcblx0XHRcdFx0aWYoY29udHJvbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2wuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLnNwbGl0KCcsJykuZm9yRWFjaCh0YXJnZXQgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zdCB0YXJnZXRfaXRlbSA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9Jyt0YXJnZXQrJ10nKTtcclxuXHRcdFx0XHRcdFx0aWYodGFyZ2V0X2l0ZW0pIHtcclxuXHRcdFx0XHRcdFx0XHR0YXJnZXRfaXRlbS52YWx1ZSA9IHNsdWcoY29udHJvbC52YWx1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb250cm9sLnZhbHVlID0gc2x1Zyhjb250cm9sLnZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNhYmxlRm9ybShmb3JtKSB7XHJcblx0Zm9ybS5jbGFzc0xpc3QuYWRkKCdzdWJtaXQnKTtcclxuXHRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJykuZGlzYWJsZWQgPSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGVuYWJsZUZvcm0oZm9ybSkge1xyXG5cdGZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnc3VibWl0Jyk7XHJcblx0Zm9ybS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLmRpc2FibGVkID0gZmFsc2U7XHJcbn1cclxuXHJcbi8vIERFTEVURSBCVVRUT05TXHJcbmNvbnN0IGRlbGV0ZV9idXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGVsZXRlXScpO1xyXG5cclxuZGVsZXRlX2J1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcclxuXHRcdGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0aWYoIWJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtZGVsZXRlJykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjb25maXJtYXRpb24gPSB0cnVlO1xyXG5cdFx0aWYoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnZGF0YS1jb25maXJtJykpIHtcclxuXHRcdFx0Y29uZmlybWF0aW9uID0gY29uZmlybShidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbmZpcm0nKSk7XHJcblx0XHR9XHJcblx0XHRpZighY29uZmlybWF0aW9uKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuXHJcblx0XHRmb3JtRGF0YS5zZXQoU0VUVElORy5jc3JmLmtleSwgU0VUVElORy5jc3JmLnRva2VuKTtcclxuXHJcblx0XHRmZXRjaChidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWRlbGV0ZScpLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuXHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0Ly8gUmVkaXJlY3RcclxuXHRcdFx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLXJlZGlyZWN0JykpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHJlZGlyZWN0ID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZWRpcmVjdCcpO1xyXG5cdFx0XHRcdFx0aWYocmVkaXJlY3QgPT09ICd0aGlzJykge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3Q7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRhYmxlc1xyXG5cdFx0XHRcdGlmKGJ1dHRvbi5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndGFibGUtYWN0aW9uJykpIHtcclxuXHRcdFx0XHRcdC8vIGJ1dHRvbi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRmdW5jdGlvbiBmYWRlT3V0KGVsKSB7XHJcblx0XHRcdFx0XHRcdGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG5cdFx0XHRcdFx0XHQoZnVuY3Rpb24gZmFkZSgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoKGVsLnN0eWxlLm9wYWNpdHkgLT0gLjEpIDwgMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZmFkZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KSgpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGZhZGVPdXQoYnV0dG9uLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIENvdW50ZXJcclxuXHRcdFx0XHRpZihidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLWNvdW50ZXInKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1jb3VudGVyJykpO1xyXG5cdFx0XHRcdFx0Y291bnRlci50ZXh0Q29udGVudCA9IHBhcnNlSW50KGNvdW50ZXIudGV4dENvbnRlbnQpIC0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1ha2VBbGVydChkYXRhLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xyXG5cdFx0XHRtYWtlQWxlcnQoJ2Vycm9yJywgZXJyb3IpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0YnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHRjbGFzcyBGb3JlaWduRm9ybSB7XHJcblx0Y29uc3RydWN0b3Iobm9kZSkge1xyXG5cdFx0dGhpcy5ub2RlID0gbm9kZTtcclxuXHRcdHRoaXMubmFtZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcclxuXHRcdHRoaXMudmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xyXG5cdFx0dGhpcy5pbnB1dHMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xyXG5cdFx0dGhpcy5idXR0b24gPSB7XHJcblx0XHRcdHN1Ym1pdDogbm9kZS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpLFxyXG5cdFx0XHRvcGVuX21vZGFsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuXHRcdH07XHJcblx0XHR0aGlzLmljb24gPSB7XHJcblx0XHRcdGFkZDogYDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctcHJpbWFyeSBjdXJzb3ItcG9pbnRlclwiPjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1wbHVzIGFsaWduLW1pZGRsZSBmZWF0aGVyLXNtXCI+PGxpbmUgeDE9XCIxMlwiIHkxPVwiNVwiIHgyPVwiMTJcIiB5Mj1cIjE5XCI+PC9saW5lPjxsaW5lIHgxPVwiNVwiIHkxPVwiMTJcIiB4Mj1cIjE5XCIgeTI9XCIxMlwiPjwvbGluZT48L3N2Zz48L3NwYW4+YCxcclxuXHRcdFx0c29ydDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1tb3ZlXCI+PHBvbHlsaW5lIHBvaW50cz1cIjUgOSAyIDEyIDUgMTVcIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9XCI5IDUgMTIgMiAxNSA1XCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPVwiMTUgMTkgMTIgMjIgOSAxOVwiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz1cIjE5IDkgMjIgMTIgMTkgMTVcIj48L3BvbHlsaW5lPjxsaW5lIHgxPVwiMlwiIHkxPVwiMTJcIiB4Mj1cIjIyXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjEyXCIgeTE9XCIyXCIgeDI9XCIxMlwiIHkyPVwiMjJcIj48L2xpbmU+PC9zdmc+YCxcclxuXHRcdFx0ZWRpdDogYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImZlYXRoZXIgZmVhdGhlci1lZGl0XCI+PHBhdGggZD1cIk0xMSA0SDRhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJ2LTdcIj48L3BhdGg+PHBhdGggZD1cIk0xOC41IDIuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMMTIgMTVsLTQgMSAxLTQgOS41LTkuNXpcIj48L3BhdGg+PC9zdmc+YCxcclxuXHRcdFx0ZGVsZXRlOiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiZmVhdGhlciBmZWF0aGVyLXRyYXNoXCI+PHBvbHlsaW5lIHBvaW50cz1cIjMgNiA1IDYgMjEgNlwiPjwvcG9seWxpbmU+PHBhdGggZD1cIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiPjwvcGF0aD48L3N2Zz5gXHJcblx0XHR9O1xyXG5cdFx0dGhpcy51aWQgPSB0aGlzLmdlbmVyYXRlVWlkKCk7XHJcblx0XHR0aGlzLnN0b3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHRcdHRoaXMudGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xyXG5cdFx0dGhpcy50Ym9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XHJcblx0XHR0aGlzLmlzX2VkaXRpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuZWRpdGluZ19yb3cgPSBudWxsO1xyXG5cclxuXHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSgpIHtcclxuXHRcdC8vIFNFVCBJRCBUTyBOT0RFXHJcblx0XHR0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMudWlkKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgTU9EQUwgQlVUVE9OXHJcblx0XHR0aGlzLmJ1dHRvbi5vcGVuX21vZGFsLnNldEF0dHJpYnV0ZSgnZGF0YS1icy10b2dnbGUnLCAnbW9kYWwnKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuc2V0QXR0cmlidXRlKCdkYXRhLWJzLXRhcmdldCcsICcjJyArIHRoaXMudWlkKTtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuaW5uZXJIVE1MID0gdGhpcy5pY29uLmFkZDtcclxuXHRcdHRoaXMuYnV0dG9uLm9wZW5fbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcblx0XHRcdGlmKCF0aGlzLmlzX2VkaXRpbmcpIHtcclxuXHRcdFx0XHR0aGlzLnJlc2V0RWRpdGluZ1JvdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBTRVQgVVAgU1RPUkVcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5uYW1lKTtcclxuXHRcdHRoaXMuc3RvcmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG5cdFx0dGhpcy5zdG9yZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuXHJcblx0XHQvLyBTRVQgVVAgVEFCTEVcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUnKTtcclxuXHRcdHRoaXMudGFibGUuY2xhc3NMaXN0LmFkZCgndGFibGUtc20nKTtcclxuXHJcblx0XHR0aGlzLnRib2R5LmNsYXNzTGlzdC5hZGQoJ3NvcnRhYmxlJyk7XHJcblx0XHRuZXcgU29ydGFibGUodGhpcy50Ym9keSwge1xyXG5cdFx0XHRoYW5kbGU6ICcuc29ydGFibGVfX2hhbmRsZScsXHJcblx0XHRcdGFuaW1hdGlvbjogMTUwLFxyXG5cdFx0XHRvblNvcnQ6ICgpID0+IHRoaXMudXBkYXRlU3RvcmUoKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gU0VUIFVQIFNVTUlUIEJVVFRPTlxyXG5cdFx0dGhpcy5idXR0b24uc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0dGhpcy5jbGlja1N1Ym1pdCgpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVN0b3JlKCk7XHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBSRU5ERVJcclxuXHRcdHRoaXMucG9wdWxhdGVUYWJsZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHJcblx0XHQvLyBSRVNFVCBFRElUSU5HIFJPVyBJRiBNT0RBTCBDQU5DRUxFRFxyXG5cdFx0dGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHRoaXMucmVzZXRFZGl0aW5nUm93KCkpO1xyXG5cdH1cclxuXHJcblx0Y2xpY2tTdWJtaXQoKSB7XHJcblx0XHQvLyBFRElUIFJPV1xyXG5cdFx0aWYodGhpcy5pc19lZGl0aW5nKSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZWRpdGluZ19yb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMucmVzZXRFZGl0aW5nUm93KCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBREQgUk9XXHJcblx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KCkpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlU3RvcmUoKSB7XHJcblx0XHRsZXQgZGF0YSA9IFtdO1xyXG5cclxuXHRcdHRoaXMudGJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHRyID0+IHtcclxuXHRcdFx0bGV0IG9iaiA9IHt9O1xyXG5cclxuXHRcdFx0dHIucXVlcnlTZWxlY3RvckFsbCgndGQnKS5mb3JFYWNoKHRkID0+IHtcclxuXHRcdFx0XHRpZighdGQuaGFzQXR0cmlidXRlKCdkYXRhLW5hbWUnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpbdGQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKV0gPSB0ZC50ZXh0Q29udGVudDtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRkYXRhLnB1c2gob2JqKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc3RvcmUudmFsdWUgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlc2V0RWRpdGluZ1JvdygpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRpZihpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ3NlbGVjdCcpIHtcclxuXHRcdFx0XHRpbnB1dC5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdFx0XHRpZighaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRpbnB1dC5zbGltLnNldChpbnB1dC52YWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gJyc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuaXNfZWRpdGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5lZGl0aW5nX3JvdyA9IG51bGw7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVSb3cob2JqZWN0ID0gbnVsbCkge1xyXG5cdFx0Y29uc3QgdHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcblxyXG5cdFx0aWYob2JqZWN0KSB7XHJcblx0XHRcdGZvcihjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywga2V5KTtcclxuXHRcdFx0XHR0Y29sLnRleHRDb250ZW50ID0gdmFsdWU7XHJcblxyXG5cdFx0XHRcdHRyb3cuYXBwZW5kQ2hpbGQodGNvbCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cclxuXHRcdFx0XHR0Y29sLnNldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJywgaW5wdXQubmFtZSk7XHJcblx0XHRcdFx0dGNvbC50ZXh0Q29udGVudCA9IGlucHV0LnZhbHVlO1xyXG5cclxuXHRcdFx0XHR0cm93LmFwcGVuZENoaWxkKHRjb2wpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0Y29sX2FjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG5cdFx0dGNvbF9hY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLWFjdGlvbicpO1xyXG5cclxuXHRcdGNvbnN0IGJ0bl9zb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cdFx0Y29uc3QgYnRuX2VkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblx0XHRjb25zdCBidG5fZGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuXHRcdGJ0bl9zb3J0LmlubmVySFRNTCA9IHRoaXMuaWNvbi5zb3J0ICsgJyAnOyBidG5fc29ydC5jbGFzc0xpc3QuYWRkKCdzb3J0YWJsZV9faGFuZGxlJyk7XHJcblx0XHRidG5fZWRpdC5pbm5lckhUTUwgPSB0aGlzLmljb24uZWRpdCArICcgJztcclxuXHRcdGJ0bl9kZWxldGUuaW5uZXJIVE1MID0gdGhpcy5pY29uLmRlbGV0ZTtcclxuXHJcblx0XHRidG5fZWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuY2xpY2tFZGl0KHRyb3cpKTtcclxuXHRcdGJ0bl9kZWxldGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmNsaWNrRGVsZXRlKHRyb3cpKTtcclxuXHRcdFxyXG5cdFx0dGNvbF9hY3Rpb25zLmFwcGVuZChidG5fc29ydCk7XHJcblx0XHR0Y29sX2FjdGlvbnMuYXBwZW5kKGJ0bl9lZGl0KTtcclxuXHRcdHRjb2xfYWN0aW9ucy5hcHBlbmQoYnRuX2RlbGV0ZSk7XHJcblxyXG5cdFx0dHJvdy5hcHBlbmRDaGlsZCh0Y29sX2FjdGlvbnMpO1xyXG5cclxuXHRcdHJldHVybiB0cm93O1xyXG5cdH1cclxuXHJcblx0Y2xpY2tFZGl0KHRyb3cpIHtcclxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyb3cucXVlcnlTZWxlY3RvcihgW2RhdGEtbmFtZT1cIiR7aW5wdXQubmFtZX1cIl1gKS50ZXh0Q29udGVudDtcclxuXHJcblx0XHRcdGlmKGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnc2VsZWN0JyAmJiAhaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLW5hdGl2ZScpKSB7XHJcblx0XHRcdFx0aW5wdXQuc2xpbS5zZXQodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuaXNfZWRpdGluZyA9IHRydWU7XHJcblx0XHRcdHRoaXMuZWRpdGluZ19yb3cgPSB0cm93O1xyXG5cclxuXHRcdFx0dGhpcy5idXR0b24ub3Blbl9tb2RhbC5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbGlja0RlbGV0ZSh0cm93KSB7XHJcblx0XHR0cm93LnJlbW92ZSgpO1xyXG5cdFx0dGhpcy51cGRhdGVTdG9yZSgpO1xyXG5cdH1cclxuXHJcblx0cG9wdWxhdGVUYWJsZSgpIHtcclxuXHRcdGlmKCF0aGlzLnZhbHVlKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHZhbHVlcyA9IEpTT04ucGFyc2UodGhpcy52YWx1ZSk7XHJcblxyXG5cdFx0dmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xyXG5cdFx0XHR0aGlzLnRib2R5LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlUm93KHZhbHVlKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHRoaXMudGFibGUuYXBwZW5kQ2hpbGQodGhpcy50Ym9keSk7XHJcblxyXG5cdFx0dGhpcy5ub2RlLmJlZm9yZSh0aGlzLmJ1dHRvbi5vcGVuX21vZGFsKTtcclxuXHRcdHRoaXMubm9kZS5iZWZvcmUodGhpcy5zdG9yZSk7XHJcblx0XHR0aGlzLm5vZGUuYmVmb3JlKHRoaXMudGFibGUpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVVaWQoKSB7XHJcblx0XHRyZXR1cm4gJ2ZmLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcclxuXHR9XHJcbn1cclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzcyo9XCJmb3JlaWduLWZvcm1cIl0nKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdG5ldyBGb3JlaWduRm9ybShlbGVtZW50KTtcclxufSk7XHJcbn0pO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuXHQvLyBIQU5ETEUgQlJPS0VOIElNQUdFU1xyXG5cdGNvbnN0IGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcblx0aW1hZ2VzLmZvckVhY2goaW1hZ2UgPT4ge1xyXG5cdFx0aWYoaW1hZ2UuY29tcGxldGUgJiYgdHlwZW9mIGltYWdlLm5hdHVyYWxXaWR0aCAhPSBcInVuZGVmaW5lZFwiICYmIGltYWdlLm5hdHVyYWxXaWR0aCA8PSAwKSB7XHJcblx0XHRcdGltYWdlLnNyYyA9IFNFVFRJTkcuaW1hZ2VfcGxhY2Vob2xkZXI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcbiJdLCJmaWxlIjoibWFpbi5qcyJ9