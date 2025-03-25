// ==UserScript==
// @name         new KS js script
// @namespace    BluZed
// @version      1.0
// @match        https://krunker.io/*
// @match        https://*.browserfps.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @noframes
// ==/UserScript==

const KS = new KS_CONNECTOR(unsafeWindow);
KS.onready = () => { KS.send("hello from js"); };
unsafeWindow.KS = KS;

// minified module
function KS_CONNECTOR(e,t=25,s=!0){const n=e.console.log;this.enableLogs=s;const l={default:"yellow",error:"red"},r=(e,t="default")=>{this.enableLogs&&e&&n("%c[KS_JS_API] "+e.toString(),`color: ${l[t]||l.default}; background-color: #171717`)};let o=null,i=!1;this.isReady=!1,Object.defineProperty(this,"onready",{set:e=>{this.isReady?e():this._actual_onready_=e},get:()=>this._actual_onready_||null}),this.handlers={log:n},this.setHandler=(e,t)=>{this.handlers[e]=t},this.removeHandler=e=>{delete this.handlers[e]},this.send=e=>{if(!o)return r("(NOT READY) API_OBJECT_NONEXISTENT Could not send message!","error");let s=[];for(const t of e)if(o.charlist.includes(t)){const e=o.charlist.indexOf(t);if(e>Math.pow(2,o.charLen))r("FATAL PACKET LOSS. INDEX > 2**CHARLEN. RARE ERROR ENCOUNTERED","error");else{let t=h(e,o.charLen);s=s.concat(t)}}let n=0;!function e(){let l=!1;for(let e=0;e<t;e++)n<s.length?(s[n]?o.C_one.click():o.C_zero.click(),n+=1):(o.C_flush.click(),l=!0);l||requestIdleCallback(e)}()};const a=e=>{if(this.handlers[e[0]]){const t=e[0];e.shift(),this.handlers[t](e)}else r("Message recieved from KS but no handler present. Label: "+e[0],"error")};var c,d;function h(e,t){let s=[],n=e;for(;n>0;)s.unshift(n%2),n=Math.floor(n/2);for(;s.length<t;)s.unshift(0);return s}c=()=>e.getGameActivity,d=()=>{const t=e.getGameActivity();i="Guest"!==t.user&&!t.isCustom,r(i?"Disabled due to game being pub":null,"error")},new Promise((e=>{let t=!1,s=setInterval((()=>{c()&&(t=!0,clearInterval(s)),t&&(t=!1,e())}),100)})).then(d),e.console.log=(...e)=>{let t=!1;if(!i&&e[0]&&e[0].includes("[KRUNKSCRIPT] "))if(o){if(e[0].includes("[JSMSG]")){try{a(JSON.parse(e[0].replace("%c[KRUNKSCRIPT]","").replace("[JSMSG]","")))}catch(e){n(e)}t=!0}}else try{const s=e[0].substring(e[0].indexOf("{"),e[0].lastIndexOf("}")+1),n=JSON.parse(s);n.isKSJSOBJ&&(o=n,r("KS JS API Ready!"),o.C_one=document.getElementById("KS_JS_DIV1"),o.C_zero=document.getElementById("KS_JS_DIV0"),o.C_flush=document.getElementById("KS_JS_flush"),this.isReady=!0,"function"==typeof this.onready&&this.onready(),t=!0)}catch{}if(!t)return n(...e)}}
