/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ThunderJS=function(){"use strict";function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})),t.push.apply(t,r)}return t}function t(o){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?n(Object(i),!0).forEach(function(e){var n,t,r;n=o,r=i[t=e],t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r}):Object.getOwnPropertyDescriptors?Object.defineProperties(o,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach(function(e){Object.defineProperty(o,e,Object.getOwnPropertyDescriptor(i,e))})}return o}var e=null;"undefined"!=typeof WebSocket&&(e=WebSocket);function u(n){if("string"==typeof n){n=(n=n.normalize().replace(/\\\\x([0-9A-Fa-f]{2})/g,"")).normalize().replace(/\\x([0-9A-Fa-f]{2})/g,""),n=JSON.parse(n)}if(!n.id&&n.method){var e=l[n.method];e&&Array.isArray(e)&&e.length&&e.forEach(function(e){e(n.params)})}}function v(c){return new Promise(function(n,t){var e,r=[(e=c)&&e.protocol||"ws://",e&&e.host||"localhost",":"+(e&&e.port||80),e&&e.endpoint||"/jsonrpc",e&&e.token?"?token="+e.token:null].join(""),o=a[r];if(o&&1===o.readyState)return n(o);if(o&&0===o.readyState){return o.addEventListener("open",function e(){o.removeEventListener("open",e),n(o)})}if(null==o){c.debug&&console.log("Opening socket to "+r),o=new s(r,c&&c.subprotocols||"notification"),(a[r]=o).addEventListener("message",function(e){c.debug&&(console.log(" "),console.log("API REPONSE:"),console.log(JSON.stringify(e.data,null,2)),console.log(" ")),function(e){if("string"==typeof e){e=(e=e.normalize().replace(/\\\\x([0-9A-Fa-f]{2})/g,"")).normalize().replace(/\\x([0-9A-Fa-f]{2})/g,""),e=JSON.parse(e)}if(e.id){var n=g[e.id];n?("result"in e?n.resolve(e.result):n.reject(e.error),delete g[e.id]):console.log("no pending request found with id "+e.id)}}(e.data)}),o.addEventListener("message",function(e){u(e.data)}),o.addEventListener("error",function(){u({method:"client.ThunderJS.events.error"}),a[r]=null});var i=function(e){a[r]=null,t(e)};o.addEventListener("close",i),o.addEventListener("open",function(){u({method:"client.ThunderJS.events.connect"}),o.removeEventListener("close",i),o.addEventListener("close",function(){u({method:"client.ThunderJS.events.disconnect"}),a[r]=null}),n(o)})}else a[r]=null,t("Socket error")})}function r(d){return{request:function(a,f,p){return new Promise(function(e,n){var t,r,o,i,c,u=y+=1,s=(t=d.versions,r=a,(i=(o=p)&&o.version)?i:t&&(t[r]||t.default)||1),l=function(e,n,t,r,o){r&&(delete r.version,r.versionAsParameter&&(r.version=r.versionAsParameter,delete r.versionAsParameter));var i={jsonrpc:"2.0",id:e,method:[n,o,t].join(".")};return!r&&!1!==r||"object"===h(r)&&0===Object.keys(r).length||(i.params=r),i}(u,a,f,p,s);d.debug&&(console.log(" "),console.log("API REQUEST:"),console.log(JSON.stringify(l,null,2)),console.log(" ")),g[u]={body:l,resolve:e,reject:n},c=l,v(d).then(function(e){e.send(JSON.stringify(c))}).catch(function(e){n(e)})})}}}var s=e,g={},l={},a={},y=0,o={DeviceInfo:{freeRam:function(e){return this.call("systeminfo",e).then(function(e){return e.freeram})},version:function(e){return this.call("systeminfo",e).then(function(e){return e.version})}}};function i(n,t,e,r){var o=this,i=function(e,n,t,r){var o=f(e,n);if(!l[o]){l[o]=[];if(e!=="ThunderJS"){var i="register";var c=o.split(".").slice(0,-1).join(".");var u={event:n,id:c};this.api.request(e,i,u).catch(function(e){if(typeof r==="function")r(e.message)})}}return l[o].push(t),l[o].length-1}.call(this,n,t,e,r);return{dispose:function(){var e=f(n,t);void 0!==l[e]&&(l[e].splice(i,1),0===l[e].length&&function(e,n,t){var r=f(e,n);if(delete l[r],e!=="ThunderJS"){var o="unregister";var i=r.split(".").slice(0,-1).join(".");var c={event:n,id:i};this.api.request(e,o,c).catch(function(e){if(typeof t==="function")t(e.message)})}}.call(o,n,t,r))}}}function f(e,n){return["client",e,"events",n].join(".")}var c=function t(e){return{options:e,api:r(e),plugin:!1,call:function(){var e=Array.prototype.slice.call(arguments);this.plugin&&e[0]!==this.plugin&&e.unshift(this.plugin);var n=e[0],t=e[1];return"function"==typeof this[n][t]?this[n][t](e[2]):this.api.request.apply(this,e)},registerPlugin:function(e,n){this[e]=p(Object.assign(Object.create(t),n,{plugin:e}))},subscribe:function(){},on:function(){var e=Array.prototype.slice.call(arguments);return-1!==["connect","disconnect","error"].indexOf(e[0])?e.unshift("ThunderJS"):this.plugin&&e[0]!==this.plugin&&e.unshift(this.plugin),i.apply(this,e)},once:function(){console.log("todo ...")}}},p=function e(n){return new Proxy(n,{get:function(r,o){var i=r[o];return"api"===o?r.api:void 0!==i?"function"==typeof i?-1<["on","once","subscribe"].indexOf(o)?function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return i.apply(this,n)}:function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return function(t,e){"object"===h(t)&&("object"!==h(t)||t.then&&"function"==typeof t.then)||(t=new Promise(function(e,n){(t instanceof Error==!1?e:n)(t)}));var n="function"==typeof e[e.length-1]?e[e.length-1]:null;if(!n)return t;t.then(function(e){return n(null,e)}).catch(function(e){return n(e)})}(i.apply(this,n),n)}:"object"===h(i)?e(Object.assign(Object.create(c(r.options)),i,{plugin:o})):i:!1===r.plugin?e(Object.assign(Object.create(c(r.options)),{},{plugin:o})):function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return n.unshift(o),r.call.apply(this,n)}}})};return function(e){return void 0===e.token&&"undefined"!=typeof window&&window.thunder&&"function"==typeof window.thunder.token&&(e.token=window.thunder.token()),p(t({},c(e),{},o))}}();
