"use strict";const COLORMODE={body_attribute_key:"data-colormode",storage_key:"colormode",value_default:"default",value_dark:"dark"};function setColorMode(e){return e?(document.body.setAttribute(COLORMODE.body_attribute_key,COLORMODE.value_dark),localStorage.setItem(COLORMODE.storage_key,COLORMODE.value_dark)):(document.body.setAttribute(COLORMODE.body_attribute_key,COLORMODE.value_default),localStorage.setItem(COLORMODE.storage_key,COLORMODE.value_default)),!0}if(window.matchMedia&&null===localStorage.getItem(COLORMODE.storage_key)){const b=!!window.matchMedia("(prefers-color-scheme: dark)").matches;setColorMode(b),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{setColorMode(!!e.matches)})}else{const e=localStorage.getItem(COLORMODE.storage_key)===COLORMODE.value_dark;setColorMode(e)}document.addEventListener("click",e=>{if(!e.target.closest(".colormode"))return!1;e.preventDefault(),setColorMode(!(localStorage.getItem(COLORMODE.storage_key)===COLORMODE.value_dark))});