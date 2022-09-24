"use strict";function fadeOut(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(!t)return!1;t.style.opacity=1,function s(){(t.style.opacity-=.1)<0?(e?t.style.display="none":t.remove(),a instanceof Function?a():window[a]instanceof Function&&window[a]()):requestAnimationFrame(s)}()}function smoothScroll(t){t&&t.scrollIntoView({behavior:"smooth"})}function smoothScrollTop(){window.scrollTo({behavior:"smooth",top:0})}console.log("%cMade by Zakandaiev","background:#222e3c;color:#fff;padding:10px;font-weight:bold;"),document.querySelectorAll("table").forEach((t=>{t.parentElement.classList.contains("table-responsive")||(t.outerHTML='<div class="table-responsive">'+t.outerHTML+"</div>")})),document.querySelectorAll("a").forEach((t=>{if(t.hasAttribute("data-bs-toggle")||!t.hasAttribute("href"))return!1;t.addEventListener("click",(t=>{const e=t.currentTarget.getAttribute("href");if("#"===e)t.preventDefault(),smoothScrollToTop();else if("#"===e.charAt(0)||"/"===e.charAt(0)&&"#"===e.charAt(1)){if(!t.currentTarget.hash)return!1;const e=document.querySelector(t.currentTarget.hash);e&&(t.preventDefault(),smoothScroll(e))}}))})),document.querySelectorAll("a").forEach((t=>{t.hasAttribute("target")&&"_blank"===t.getAttribute("target")&&t.setAttribute("rel","noopener noreferrer nofollow")})),document.querySelectorAll("a").forEach((t=>{t.hasAttribute("href")&&t.href.startsWith("tel:")&&(t.href="tel:"+t.href.replaceAll(/[^\d+]/g,""))}));const tooltipTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),tooltipList=tooltipTriggerList.map((function(t){return new bootstrap.Tooltip(t)}));document.querySelectorAll(".spinner-action").forEach((t=>{SETTING.loader&&t.insertAdjacentHTML("beforeend",SETTING.loader)})),window.onload=()=>{document.querySelectorAll("img").forEach((t=>{t.complete&&void 0!==t.naturalWidth&&t.naturalWidth<=0&&(t.src=SETTING.image_placeholder)}))};class Form{constructor(t){var e;let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.node=t,this.options=a,this.loader=a.loader?a.loader:null,this.action=this.node.action,this.method=this.node.method?this.node.method:"POST",this.data_focus=null!==(e=this.node.getAttribute("data-focus"))&&void 0!==e?e:"",this.data_confirm=this.node.getAttribute("data-confirm"),this.data_reset=!!this.node.hasAttribute("data-reset"),this.data_class=this.node.getAttribute("data-class"),this.data_redirect=this.node.getAttribute("data-redirect"),this.data_message=this.node.getAttribute("data-message"),this.action&&this.initialize()}initialize(){this.loader&&this.node.insertAdjacentHTML("beforeend",this.loader),this.focusElement(),this.node.addEventListener("submit",(t=>{if(t.preventDefault(),!this.confirmation())return!1;this.disableForm(),fetch(this.action,{method:this.method,body:this.getFormData()}).then((t=>t.json())).then((t=>{var e;"success"===t.status?(this.successRedirect(t),this.successResetForm(),SETTING.toast(t.status,null!==(e=this.data_message)&&void 0!==e?e:t.message)):SETTING.toast(t.status,this.data_message?this.data_message:t.message)})).catch((t=>{SETTING.toast("error",t)})).finally((()=>{this.enableForm()}))}))}focusElement(){if(!this.node.hasAttribute("data-focus"))return!1;let t="[name]";this.data_focus.length>0&&(t='[name="'+this.data_focus+'"]');const e=this.node.querySelector(t);return e&&e.focus(),!0}confirmation(){let t=!0;return this.data_confirm&&(t=confirm(this.data_confirm)),t}getFormData(){let t=new FormData(this.node);return this.options.data&&this.options.data.forEach((e=>{e.key&&t.set(e.key,e.value?e.value:null)})),t}disableForm(){return this.node.setAttribute("disabled","disabled"),this.node.classList.add("submit"),this.node.querySelector('[type="submit"]').disabled=!0,this.data_class&&this.node.classList.add(this.data_class),!0}enableForm(){return this.node.removeAttribute("disabled","disabled"),this.node.classList.remove("submit"),this.node.querySelector('[type="submit"]').disabled=!1,this.data_class&&this.node.classList.remove(this.data_class),!0}successRedirect(t){return this.data_redirect&&("this"===this.data_redirect?document.location.reload():window.location.href=decodeURI(this.data_redirect).replaceAll(/({\w+})/g,null==t?void 0:t.message)),!1}successResetForm(){return!!this.data_reset&&(this.node.reset(),!0)}}document.querySelectorAll("form").forEach((t=>{new Form(t,{loader:SETTING.loader,data:[{key:SETTING.csrf.key,value:SETTING.csrf.token}]})}));class DataAction{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.node=t,this.options=e,this.data_action=this.node.getAttribute("data-action"),this.data_event=this.node.hasAttribute("data-event")?this.node.getAttribute("data-event"):"click",this.data_method=this.node.hasAttribute("data-method")?this.node.getAttribute("data-method"):"POST",this.data_confirm=this.node.getAttribute("data-confirm"),this.data_fields=this.node.getAttribute("data-fields"),this.data_form=this.node.getAttribute("data-form"),this.data_form_reset=this.node.getAttribute("data-form-reset"),this.data_class=this.node.getAttribute("data-class"),this.data_class_target=this.node.getAttribute("data-class-target"),this.data_redirect=this.node.getAttribute("data-redirect"),this.data_counter=this.node.getAttribute("data-counter"),this.data_counter_plus=!!this.node.hasAttribute("data-counter-plus"),this.data_delete=this.node.getAttribute("data-delete"),this.data_message=this.node.getAttribute("data-message"),this.data_action&&this.initialize()}initialize(){this.node.addEventListener(this.data_event,(t=>{if(t.preventDefault(),!this.confirmation())return!1;this.disableNodes(),fetch(this.data_action,{method:this.data_method,body:this.getFormData()}).then((t=>t.json())).then((t=>{var e;"success"===t.status?(this.successRedirect(t),this.successCounter(),this.successResetTargetForm(),this.successDeleteNodes(),SETTING.toast(t.status,null!==(e=this.data_message)&&void 0!==e?e:t.message)):SETTING.toast(t.status,this.data_message?this.data_message:t.message)})).catch((t=>{SETTING.toast("error",t)})).finally((()=>{this.enableNodes()}))}))}confirmation(){let t=!0;return this.data_confirm&&(t=confirm(this.data_confirm)),t}getFormData(){let t=new FormData;this.data_form&&(t=new FormData(document.querySelector(this.data_form)));let e=[];return this.data_fields&&(e=e.concat(JSON.parse(this.data_fields))),this.options.data&&(e=e.concat(this.options.data)),e.forEach((e=>{e.key&&t.set(e.key,e.value?e.value:null)})),t}disableNodes(){return this.node.setAttribute("disabled","disabled"),this.node.classList.add("submit"),this.data_class&&this.data_class_target?document.querySelectorAll(this.data_class_target).forEach((t=>{t.classList.add(this.data_class)})):this.data_class&&this.node.classList.add(this.data_class),!0}enableNodes(){return this.node.removeAttribute("disabled","disabled"),this.node.classList.remove("submit"),this.data_class&&this.data_class_target?document.querySelectorAll(this.data_class_target).forEach((t=>{t.classList.remove(this.data_class)})):this.data_class&&this.node.classList.remove(this.data_class),!0}successRedirect(t){return this.data_redirect&&("this"===this.data_redirect?document.location.reload():window.location.href=decodeURI(this.data_redirect).replaceAll(/({\w+})/g,null==t?void 0:t.message)),!1}successCounter(){return!!this.data_counter&&(document.querySelectorAll(this.data_counter).forEach((t=>{const e=parseInt(t.textContent);t.textContent=this.data_counter_plus?e+1:e-1})),!0)}successResetTargetForm(){return!!this.data_form_reset&&(document.querySelectorAll(this.data_form_reset).forEach((t=>{t.reset()})),!0)}successDeleteNodes(){if(!this.data_delete)return!1;if("this"===this.data_delete)return fadeOut(this.node),!0;if("trow"===this.data_delete){const t=this.node.closest("tr");return t&&fadeOut(t),!0}return document.querySelectorAll(this.data_delete).forEach((t=>{fadeOut(t)})),!0}}document.querySelectorAll("[data-action]").forEach((t=>{new DataAction(t,{data:[{key:SETTING.csrf.key,value:SETTING.csrf.token}]})}));class DataBehabior{constructor(t){this.node=t,this.data_behavior=this.node.getAttribute("data-behavior"),this.data_event=this.node.hasAttribute("data-event")?this.node.getAttribute("data-event"):"change",this.data_hide=this.node.getAttribute("data-hide"),this.data_show=this.node.getAttribute("data-show"),this.data_target=this.node.getAttribute("data-target"),this.data_behavior&&this.initialize()}initialize(){this.visibilityHide(),this.visibilityShow(),this.toLower(),this.toUpper(),this.cyrToLat(),this.slug(),this.node.addEventListener(this.data_event,(()=>{this.visibilityHide(),this.visibilityShow(),this.toLower(),this.toUpper(),this.cyrToLat(),this.slug()}))}visibilityHide(){if("visibility"!==this.data_behavior)return!1;let t=this.data_hide;return"checkbox"!==this.node.type||this.node.checked||(t?t+=","+this.data_show:t=this.data_show),"radio"!==this.node.type||this.node.checked||(t=null),t&&t.split(",").forEach((t=>{const e=document.querySelector('[name="'+t+'"]');if(!e)return!1;const a=e.parentElement;a&&a.classList.contains("form-group")?a.classList.add("hidden"):e.classList.add("hidden")})),!0}visibilityShow(){if("visibility"!==this.data_behavior)return!1;let t=this.data_show;return"checkbox"!==this.node.type||this.node.checked||(t=null),"radio"!==this.node.type||this.node.checked||(t=null),t&&t.split(",").forEach((t=>{const e=document.querySelector('[name="'+t+'"]');if(!e)return!1;const a=e.parentElement;a&&a.classList.contains("form-group")?a.classList.remove("hidden"):e.classList.remove("hidden")})),!0}toLower(){return"lowercase"===this.data_behavior&&(this.data_target?this.data_target.split(",").forEach((t=>{const e=document.querySelector("[name="+t+"]");e&&(e.value=this.node.value.toLocaleLowerCase())})):this.node.value=this.node.value.toLocaleLowerCase(),!0)}toUpper(){return"uppercase"===this.data_behavior&&(this.data_target?this.data_target.split(",").forEach((t=>{const e=document.querySelector("[name="+t+"]");e&&(e.value=this.node.value.toLocaleUpperCase())})):this.node.value=this.node.value.toLocaleUpperCase(),!0)}cyrToLat(){return"cyrToLat"===this.data_behavior&&(this.data_target?this.data_target.split(",").forEach((t=>{const e=document.querySelector("[name="+t+"]");e&&(e.value=cyrToLat(this.node.value))})):this.node.value=cyrToLat(this.node.value),!0)}slug(){return!!this.data_behavior.includes("slug")&&(this.data_target?this.data_target.split(",").forEach((t=>{const e=document.querySelector("[name="+t+"]");e&&(e.value=slug(this.node.value,"slug_"===this.data_behavior?"_":null))})):this.node.value=slug(this.node.value,"slug_"===this.data_behavior?"_":null),!0)}}document.querySelectorAll("[data-behavior]").forEach((t=>{new DataBehabior(t)}));class ForeignForm{constructor(t){this.is_edit=!1,this.active_row=null,this.uid=this.generateUid(),this.initStore(t),this.initModal(),this.initButtons(),this.initTable(),this.populateTable(),this.updateStore(),this.render()}generateUid(){return"ff-"+Math.random().toString(36).slice(2)}initStore(t){return this.store=t,this.name=this.store.name,this.value=this.store.value,this.store.setAttribute("data-id",this.uid),this.store.setAttribute("type","hidden"),this.store.classList.add("hidden"),this.store.textContent="",!0}initModal(){this.modal=this.store.nextElementSibling,this.inputs=this.modal.querySelectorAll("[name]"),this.inputs.forEach((t=>{t.name=t.name.replace("[]","")})),setTimeout((()=>{this.inputs.forEach((t=>{"file"===t.type&&this.initFileInput(t)}))}),1e3),this.modal.setAttribute("id",this.uid);const t=new bootstrap.Modal(this.modal);return this.modal.bs=t,this.modal.addEventListener("hidden.bs.modal",(()=>this.buttonClick("cancel"))),!0}initFileInput(t){var e;return null==t||null===(e=t.pond)||void 0===e||e.setOptions({instantUpload:!0,allowRevert:!0,server:{process:{url:"/upload/",ondata:t=>(t.set(SETTING.csrf.key,SETTING.csrf.token),t)},revert:{url:"/upload/",ondata:t=>(t.set(SETTING.csrf.key,SETTING.csrf.token),t)}}}),!0}initButtons(){return this.submit=this.modal.querySelector('[type="submit"]'),this.submit.addEventListener("click",(t=>this.buttonClick("submit",t))),this.add=document.createElement("span"),this.add.setAttribute("data-bs-toggle","modal"),this.add.setAttribute("data-bs-target","#"+this.uid),this.add.classList.add("badge","bg-primary","cursor-pointer"),this.add.innerHTML=SETTING.icon.add,this.add.addEventListener("click",(()=>this.buttonClick("add"))),!0}updateButtons(){const t=this.submit.querySelector(".add"),e=this.submit.querySelector(".edit");return this.is_edit?(t&&(t.style.display="none"),e&&(e.style.display="initial")):(t&&(t.style.display="initial"),e&&(e.style.display="none")),!0}initTable(){return this.table=document.createElement("table"),this.thead=document.createElement("thead"),this.tbody=document.createElement("tbody"),this.table.classList.add("table"),this.table.classList.add("table-sm"),this.table.classList.add("foreign-form__table"),this.createThead(),this.tbody.classList.add("sortable"),this.tbody.setAttribute("data-handle",".sortable__handle"),this.tbody.onEnd=()=>this.updateStore(),!0}createThead(){const t=document.createElement("tr");this.inputs.forEach((e=>{const a=document.createElement("th");a.innerText=e.getAttribute("data-label"),t.appendChild(a)}));const e=document.createElement("th");return e.classList.add("table-action"),e.appendChild(this.add),t.appendChild(e),this.thead.appendChild(t),!0}populateTable(){if(!this.value)return!1;return JSON.parse(this.value).forEach((t=>{this.active_row=this.createRow(),this.updateRow(t),this.tbody.appendChild(this.active_row)})),!0}updateStore(){let t=[];return this.tbody.querySelectorAll("tr").forEach((e=>{let a={};e.querySelectorAll("td").forEach((t=>{if(!t.hasAttribute("data-name"))return!1;a[t.getAttribute("data-name")]=t.getAttribute("data-value")})),t.push(a)})),this.store.value=JSON.stringify(t),!0}render(){return this.table.appendChild(this.thead),this.table.appendChild(this.tbody),this.store.before(this.table),!0}createRow(){const t=document.createElement("tr");this.inputs.forEach((e=>{const a=document.createElement("td");a.setAttribute("data-name",e.name),a.setAttribute("data-value",""),t.appendChild(a)}));const e=document.createElement("td");e.classList.add("table-action");const a=document.createElement("span"),s=document.createElement("span"),i=document.createElement("span");return a.innerHTML=SETTING.icon.sort+" ",a.classList.add("sortable__handle"),s.innerHTML=SETTING.icon.edit+" ",i.innerHTML=SETTING.icon.delete,s.addEventListener("click",(()=>this.buttonClick("edit",t))),i.addEventListener("click",(()=>this.buttonClick("delete",t))),e.append(a),e.append(s),e.append(i),t.appendChild(e),t}buttonClick(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;switch(t){case"add":return this.is_edit=!1,this.resetInputs(),this.updateButtons(),!0;case"edit":return this.active_row=e,this.is_edit=!0,this.resetInputs(),this.updateButtons(!0),this.populateInputs(),this.modal.bs.show(),!0;case"delete":return this.is_edit=!1,fadeOut(e,!1,(()=>this.updateStore())),!0;case"cancel":return this.is_edit=!1,this.resetInputs(),!0;case"submit":{e.preventDefault(),this.is_edit||(this.active_row=this.createRow());const t=this.getInputsValue();return!!t&&(this.updateRow(t),this.is_edit||this.tbody.appendChild(this.active_row),this.updateStore(),this.modal.bs.hide(),!0)}}}updateRow(t){return!!t&&(this.inputs.forEach((e=>{const a=this.active_row.querySelector(`[data-name="${e.name}"]`);if(!a)return!1;this.setColValue(e,a,t[e.name])})),!0)}setColValue(t,e){var a;let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i=s;switch(t.type){case"file":{i="";let e=[];t.pond&&t.pond.getFiles().forEach((t=>{if([6,8].includes(t.status))return!1;e.push(t.serverId)})),s&&"["===s[0]&&(e=e.concat(JSON.parse(s)));const a=this.generateUid();e.forEach((t=>{const e=t,s=BASE_URL+"/"+e,o=["jpg","jpeg","png","gif","svg","webp"].includes(null==e?void 0:e.split(".").pop().toLowerCase());i+=o?`<a href="${s}" target="_blank" data-fancybox="${a}">${SETTING.icon.image}</a>`:`<a href="${s}" target="_blank">${SETTING.icon.file}</a>`,i+=" "})),s=JSON.stringify(e);break}case"select-one":{var o,r,l;let e=null!==(o=null==t||null===(r=t.slim)||void 0===r?void 0:r.selected())&&void 0!==o?o:null!==(l=s)&&void 0!==l?l:"";const a=t.querySelector('option[value="'+e+'"]');a&&(i=a.text),s=e;break}case"select-multiple":{var n,d,c;let e=null!==(n=null==t||null===(d=t.slim)||void 0===d?void 0:d.selected())&&void 0!==n?n:null!==(c=JSON.parse(s))&&void 0!==c?c:[],a=[];e.forEach((e=>{const s=t.querySelector('option[value="'+e+'"]');s&&a.push(s.text)})),i=a.join(", "),s=JSON.stringify(e);break}case"checkbox":var h,u;if(t.checked)i=null!==(h=SETTING.icon.checkbox_true)&&void 0!==h?h:"+";else i=null!==(u=SETTING.icon.checkbox_false)&&void 0!==u?u:"-";s=t.checked;break;case"date":var m;i=null===(m=new Date(s))||void 0===m?void 0:m.toLocaleDateString();break;case"datetime-local":var p;i=null===(p=new Date(s))||void 0===p?void 0:p.toLocaleString()}return e.innerHTML=i,e.setAttribute("data-value",null!==(a=s)&&void 0!==a?a:""),!0}resetInputs(){return this.inputs.forEach((t=>{this.setInputValue(t,null)})),!0}populateInputs(){return this.active_row.querySelectorAll("[data-name]").forEach((t=>{this.inputs.forEach((e=>{e.name===t.getAttribute("data-name")&&this.setInputValue(e,t.getAttribute("data-value"))}))})),!0}setInputValue(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;switch(t.type){case"file":{let a=[];e&&JSON.parse(e).forEach((e=>{let s={source:e,options:{type:"local",metadata:{}}};pond_input_data.allowImagePreview(t)&&(s.options.metadata.poster=BASE_URL+"/"+e),a.push(s)})),t.pond.setOptions({files:a});break}case"select-one":case"select-multiple":var a;if(t.selectedIndex=null!==(a=e)&&void 0!==a?a:0,!t.hasAttribute("data-native")){var s;if("select-multiple"===t.type)e=JSON.parse(e),e=null!==(s=e)&&void 0!==s?s:[];t.slim.set(e)}break;case"checkbox":t.checked=!(!e||"true"!=e);break;case"textarea":t.classList.contains("wysiwyg")?t.quill.root.innerHTML=e:t.value=e;break;default:t.value=e}return!0}getInputsValue(){let t={},e=!0;return this.inputs.forEach((a=>{const s=a.value.replace(/(<([^>]+)>)/gi,"").length;if(a.hasAttribute("data-required")&&s<=0){var i,o,r,l;const t=function(e){for(var a=arguments.length,s=new Array(a>1?a-1:0),i=1;i<a;i++)s[i-1]=arguments[i];return s.length?t(e=e.replace(t.token||"%",s.shift()),...s):e};e=!1;let s=null!==(i=null===(o=SETTING)||void 0===o||null===(r=o.foreignForm)||void 0===r?void 0:r.required_message)&&void 0!==i?i:"% is required";s=t(s,null!==(l=a.getAttribute("data-label"))&&void 0!==l?l:a.name),SETTING.toast("error",s)}t[a.name]=a.value})),e?t:e}}document.querySelectorAll('[class*="foreign-form"]').forEach((t=>{t.classList.contains("foreign-form")&&new ForeignForm(t)}));const pond_input_data={files:t=>{let e=[];if(!t.hasAttribute("data-value"))return e;let a=t.getAttribute("data-value");return a&&"[]"!=a?(a=JSON.parse(a),a.forEach((a=>{let s={source:a.value,options:{type:"local",metadata:{}}};pond_input_data.allowImagePreview(t)&&(s.options.metadata.poster=a.poster),e.push(s)})),e):e},allowImagePreview:t=>"false"!=t.getAttribute("data-preview"),maxTotalFileSize:t=>t.hasAttribute("data-max-total-size")?t.getAttribute("data-max-total-size"):null,maxFileSize:t=>t.hasAttribute("data-max-size")?t.getAttribute("data-max-size"):null,maxFiles:t=>t.hasAttribute("data-max-files")?parseInt(t.getAttribute("data-max-files")):null,styleItemPanelAspectRatio:t=>t.hasAttribute("data-aspect-ratio")?parseInt(t.getAttribute("data-aspect-ratio")):.5625},file_inputs=document.querySelectorAll('input[type="file"]');file_inputs&&file_inputs.forEach((t=>{const e=FilePond.create(t,{server:{load:"/"},storeAsFile:!0,instantUpload:!1,allowProcess:!1,allowRevert:!1,allowReorder:!0,dropOnPage:!0,dropOnElement:1!=file_inputs.length,files:pond_input_data.files(t),allowImagePreview:pond_input_data.allowImagePreview(t),maxTotalFileSize:pond_input_data.maxTotalFileSize(t),maxFileSize:pond_input_data.maxFileSize(t),maxFiles:pond_input_data.maxFiles(t),styleItemPanelAspectRatio:pond_input_data.styleItemPanelAspectRatio(t),credits:!1});t.hasAttribute("data-placeholder")&&e.setOptions({labelIdle:t.getAttribute("data-placeholder")}),"undefined"!=typeof LOCALE_FILEPOND&&e.setOptions(LOCALE_FILEPOND),t.pond=e})),document.querySelectorAll("[data-mask]").forEach((t=>{const e={},a=t.getAttribute("data-mask");switch(e.lazy=!!t.hasAttribute("data-lazy"),a){case"tel":case"phone":e.mask=/^[\d\+\(\)-_ ]+$/;break;default:e.mask=a}const s=IMask(t,e);t.mask=s})),document.querySelectorAll('textarea[class*="wysiwyg"]').forEach((t=>{t.classList.add("hidden");const e=document.createElement("div"),a=document.createElement("div");a.innerHTML=t.value,e.classList.add("wysiwyg"),e.appendChild(a),t.after(e),Quill.import("ui/icons").expand='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="maximize feather feather-maximize align-middle"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="minimize feather feather-minimize align-middle"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>';const s=new Quill(a,{modules:{toolbar:{container:[[{header:[!1,3,2]}],["bold","italic","underline","strike"],[{align:[]},{list:"ordered"},{list:"bullet"}],[{color:[]},{background:[]}],["link","image","video","blockquote","code"],[{indent:"-1"},{indent:"+1"}],[{script:"sub"},{script:"super"}],["clean"],["expand"]],handlers:{image:t=>{!function(){const t=document.createElement("input");t.setAttribute("type","file"),t.setAttribute("accept","image/*"),t.click(),t.onchange=()=>{const e=t.files[0];if(e){let t=new FormData;t.append("file",e),t.append(SETTING.csrf.key,SETTING.csrf.token),s.enable(!1),fetch(BASE_URL+"/upload/",{method:"POST",body:t}).then((t=>t.text())).then((t=>{const e=s.getSelection().index,a=BASE_URL+"/"+t;s.insertEmbed(e,"image",a),s.setSelection(e+1)})).catch((t=>{SETTING.toast("error",t)})).finally((()=>{s.enable(!0)}))}}}()},expand:t=>{const a=e.querySelector(".ql-expand");e.classList.contains("fullscreen")?(e.classList.remove("fullscreen"),a&&a.classList.remove("active")):(e.classList.add("fullscreen"),a&&a.classList.add("active"))}}}},placeholder:t.placeholder,readOnly:!!t.disabled,theme:"snow"});s.on("editor-change",(e=>{t.value=s.root.innerHTML}));const i=Quill.import("formats/image");i.className="image-fluid",Quill.register(i,!0),t.quill=s}));const slimselect_data={addable:t=>!!t.hasAttribute("data-addable")&&(e=>{let a=e;if("tag"===t.getAttribute("data-addable"))a=e.replaceAll(/[^\p{L}\d ]+/giu,"").replaceAll(/[\s]+/g," ").trim();else a=e.replaceAll(/[\s]+/g," ").trim();return a}),allowDeselect:t=>!!t.querySelector("option[data-placeholder]"),deselectLabel:t=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-sm"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',hideSelectedOption:t=>!!t.multiple,closeOnSelect:t=>!t.multiple,showSearch:t=>!!(t.querySelectorAll("option").length>10||t.hasAttribute("data-addable")),placeholder:t=>t.hasAttribute("data-placeholder")?t.getAttribute("data-placeholder"):null,searchPlaceholder:t=>t.hasAttribute("data-placeholder-search")?t.getAttribute("data-placeholder-search"):null,searchText:t=>t.hasAttribute("data-placeholder-search-text")?t.getAttribute("data-placeholder-search-text"):null};document.querySelectorAll("select").forEach((t=>{if(t.hasAttribute("data-native"))return!1;new SlimSelect({select:t,addable:slimselect_data.addable(t),allowDeselect:slimselect_data.allowDeselect(t),deselectLabel:slimselect_data.deselectLabel(t),closeOnSelect:slimselect_data.closeOnSelect(t),showSearch:slimselect_data.showSearch(t),placeholder:slimselect_data.placeholder(t),placeholderText:slimselect_data.placeholder(t),searchPlaceholder:slimselect_data.searchPlaceholder(t),searchText:slimselect_data.searchText(t),showContent:"down"})}));const makeSortable=function(t){return new Sortable(t,{multiDrag:!!t.hasAttribute("data-multi"),group:!!t.hasAttribute("data-multi")&&t.getAttribute("data-multi"),handle:!!t.hasAttribute("data-handle")&&t.getAttribute("data-handle"),filter:t.hasAttribute("data-disabled")?t.getAttribute("data-disabled"):".sortable__disabled",ghostClass:t.hasAttribute("data-ghost")?t.getAttribute("data-ghost"):"sortable__ghost",fallbackOnBody:!1,swapThreshold:.5,animation:150,onEnd:e=>{t.onEnd&&t.onEnd instanceof Function&&t.onEnd(),t.hasAttribute("data-callback")&&window[t.getAttribute("data-callback")]&&window[t.getAttribute("data-callback")](e)}})};document.querySelectorAll('[class*="sortable"]').forEach((t=>{if(t.classList.contains("sortable")){const e=makeSortable(t);t.sortable=e}}));