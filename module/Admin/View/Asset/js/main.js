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
        if (!event.currentTarget.hasAttribute('href')) {
          return;
        }

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
          load: '/'
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
  }

  document.querySelectorAll('[data-action]').forEach(function (form) {
    form.addEventListener('click', function (event) {
      event.preventDefault();

      if (!confirmForm(form)) {
        return;
      }

      disableForm(form);
      var formData = new FormData();

      if (form.hasAttribute('data-form')) {
        formData = new FormData(document.querySelector(form.getAttribute('data-form')));
      }

      formData.set(SETTING.csrf.key, SETTING.csrf.token);
      fetch(form.getAttribute('data-action'), {
        method: form.hasAttribute('data-method') ? form.getAttribute('data-method') : 'POST',
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.status === 'success') {
          successRedirect(form);
          successCounter(form);
          successResetTargetForm(form);
          successDeleteNodes(form);
        }

        makeAlert(data.status, form.hasAttribute('data-message') ? form.getAttribute('data-message') : data.message);
      }).catch(function (error) {
        makeAlert('error', error);
      });
      enableForm(form);
    });
  });

  function confirmForm(form) {
    var confirmation = true;

    if (form.hasAttribute('data-confirm')) {
      confirmation = confirm(form.getAttribute('data-confirm'));
    }

    return confirmation;
  }

  function disableForm(form) {
    // DISABLE
    form.setAttribute('disabled', 'disabled'); // ADD CLASS

    if (form.hasAttribute('data-class') && form.hasAttribute('data-class-target')) {
      document.querySelectorAll(form.getAttribute('data-class-target')).forEach(function (target) {
        target.classList.add(form.getAttribute('data-class'));
      });
    } else if (form.hasAttribute('data-class')) {
      form.classList.add(form.getAttribute('data-class'));
    }
  }

  function enableForm(form) {
    // ENABLE
    form.removeAttribute('disabled'); // REMOVE CLASS

    if (form.hasAttribute('data-class') && form.hasAttribute('data-class-target')) {
      document.querySelectorAll(form.getAttribute('data-class-target')).forEach(function (target) {
        target.classList.remove(form.getAttribute('data-class'));
      });
    } else if (form.hasAttribute('data-class')) {
      form.classList.remove(form.getAttribute('data-class'));
    }
  }

  function successRedirect(form) {
    if (form.hasAttribute('data-redirect')) {
      var redirect = form.getAttribute('data-redirect');

      if (redirect === 'this') {
        document.location.reload();
      } else {
        window.location.href = redirect;
      }
    }

    return false;
  }

  function successCounter(form) {
    if (form.hasAttribute('data-counter')) {
      document.querySelectorAll(form.getAttribute('data-counter')).forEach(function (target) {
        var target_value = parseInt(target.textContent);
        target.textContent = target_value - 1;
      });
      return true;
    }

    return false;
  }

  function successResetTargetForm(form) {
    if (form.hasAttribute('data-form-reset')) {
      document.querySelectorAll(form.getAttribute('data-form-reset')).forEach(function (target) {
        target.reset();
      });
      return true;
    }

    return false;
  }

  function successDeleteNodes(form) {
    if (form.hasAttribute('data-delete')) {
      var target_value = form.getAttribute('data-delete');

      if (target_value === 'this') {
        fadeOut(form);
        return true;
      }

      if (target_value === 'trow') {
        var target = form.closest('tr');

        if (target) {
          fadeOut(target);
        }

        return true;
      }

      document.querySelectorAll(target_value).forEach(function (target) {
        // target.remove();
        fadeOut(target);
      });
      return true;
    }

    return false;
  }

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