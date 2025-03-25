
# KS_JS_API
Connect KrunkScript with JavaScript & send string messages back and forth!

## ***How does this work?***
KrunkScript allows adding custom divs with onclick event listeners in the browser dom.

The onclick event listeners fire even if you click them through javascript i.e using the .click() method on the element.

The KS code creates a parent div and adds 3 child divs inside with ids 0,1 and flush. 
The three divs are used along with js .click() method to send information to KS in binary encoded character indexes , which are defined in a KS object and can be edited (though not recommended).
The data is stored temporarily in a str variable. When data from JS has been transferred completely, flush div is clicked and data is passed on to the handler action.

JS hooks the global console.log method to filter out messages from KrunkScript and according to the allowed chars list length, the number of bits is adjusted in KS and passed on to JS by a simple console.log in the starting of the game.


## ***How to use this?***
This can be used with the [Tampermonkey browser extension](https://www.tampermonkey.net/)  OR any Krunker client that supports userscripts with instant document-start injection (eg. [KraXen72/crankshaft](https://github.com/KraXen72/crankshaft)).

Make sure to add this in JavaScript script meta.
```
// @run-at       document-start
```
And do not forget to add this in case you're using tampermonkey.
```
// @grant        unsafeWindow
```
<br>

In case the following instructions are too hard to follow, a video is in progress.
***You should also check-out the example directory.***

Firstly the custom map should have the following code present in Scripting tab in the editor:

##### == KRUNKSCRIPT PART ==
 < Top of the file >
 ```js
 obj KS_JS_API = {
	isKSJSOBJ: true,
	charlist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 _",
	input: "",
	charLen: 0
};
action send_js_message(str[] msg){GAME.log("[JSMSG]",msg);}

action on_js_message(str msg) {
    ######################################
    # do whatever u want with msg string #
    ######################################
    
	GAME.log(msg);
}


str action handle_input_chr(str bininput) {
    str inputstr = "";
	for(num i = 0; i < lengthOf bininput; i+=(num) KS_JS_API.charLen){
		num charInd = 0;
		for(num e = ((num) KS_JS_API.charLen) -1; e > -1 ; e=e-1){
			charInd += Math.pow(2, 5-e) * (num) bininput[i+e];
		}
		inputstr += (str) KS_JS_API.charlist[charInd];
	}
    return inputstr;
}
 ```
< onDivClicked action > (modify if exists already)
```js
# User clicked a DIV (ID)
str temp = "";
public action onDIVClicked(str id) {
	if(id == "KS_JS_flush"){
		if(lengthOf (str) KS_JS_API.input > 1){
			on_js_message((str) KS_JS_API.input);
	        KS_JS_API.input = "";
		}
	} else {
		if(id == "KS_JS_DIV0"){
		    temp += "0";
	    } else if(id == "KS_JS_DIV1"){
		    temp += "1";
	    }
		if(lengthOf temp > ((num) KS_JS_API.charLen)-1){
			(str) KS_JS_API.input += handle_input_chr(temp);
		    temp = "";
		}
	}
    # ========= continue your code ===============
}
```
< start action >  (modify if exists already)
```js
# Runs when the game starts
public action start() {
	GAME.UI.addDIV("KS_JS_CONNECTOR", false, "");
    GAME.UI.addDIV("KS_JS_DIV1", false, "", "KS_JS_CONNECTOR");
    GAME.UI.addDIV("KS_JS_DIV0", false, "", "KS_JS_CONNECTOR");
    GAME.UI.addDIV("KS_JS_flush", false, "", "KS_JS_CONNECTOR");
    while (Math.pow(2, (num) KS_JS_API.charLen) < (lengthOf KS_JS_API.charlist)){
	    (num) KS_JS_API.charLen += 1;
    };
    GAME.log(KS_JS_API); # important dont remove
    # ========= continue your code ===============
}
```
All of the above should be present for optimal functioning. 
It is reccomended to code in KrunkScript **AFTER** setting this up to avoid clashes between your code and this code and for better debugging.

##### == JAVASCRIPT PART ==
Secondly, add this in your JavaScript code at the bottom/top.
Unminified pretty source is available as source.js file in this repo.
```js
function KS_CONNECTOR(e,t=25,s=!0){const n=e.console.log;this.enableLogs=s;const l={default:"yellow",error:"red"},r=(e,t="default")=>{this.enableLogs&&e&&n("%c[KS_JS_API] "+e.toString(),`color: ${l[t]||l.default}; background-color: #171717`)};let o=null,i=!1;this.isReady=!1,Object.defineProperty(this,"onready",{set:e=>{this.isReady?e():this._actual_onready_=e},get:()=>this._actual_onready_||null}),this.handlers={log:n},this.setHandler=(e,t)=>{this.handlers[e]=t},this.removeHandler=e=>{delete this.handlers[e]},this.send=e=>{if(!o)return r("(NOT READY) API_OBJECT_NONEXISTENT Could not send message!","error");let s=[];for(const t of e)if(o.charlist.includes(t)){const e=o.charlist.indexOf(t);if(e>Math.pow(2,o.charLen))r("FATAL PACKET LOSS. INDEX > 2**CHARLEN. RARE ERROR ENCOUNTERED","error");else{let t=h(e,o.charLen);s=s.concat(t)}}let n=0;!function e(){let l=!1;for(let e=0;e<t;e++)n<s.length?(s[n]?o.C_one.click():o.C_zero.click(),n+=1):(o.C_flush.click(),l=!0);l||requestIdleCallback(e)}()};const a=e=>{if(this.handlers[e[0]]){const t=e[0];e.shift(),this.handlers[t](e)}else r("Message recieved from KS but no handler present. Label: "+e[0],"error")};var c,d;function h(e,t){let s=[],n=e;for(;n>0;)s.unshift(n%2),n=Math.floor(n/2);for(;s.length<t;)s.unshift(0);return s}c=()=>e.getGameActivity,d=()=>{const t=e.getGameActivity();i="Guest"!==t.user&&!t.isCustom,r(i?"Disabled due to game being pub":null,"error")},new Promise((e=>{let t=!1,s=setInterval((()=>{c()&&(t=!0,clearInterval(s)),t&&(t=!1,e())}),100)})).then(d),e.console.log=(...e)=>{let t=!1;if(!i&&e[0]&&e[0].includes("[KRUNKSCRIPT] "))if(o){if(e[0].includes("[JSMSG]")){try{a(JSON.parse(e[0].replace("%c[KRUNKSCRIPT]","").replace("[JSMSG]","")))}catch(e){n(e)}t=!0}}else try{const s=e[0].substring(e[0].indexOf("{"),e[0].lastIndexOf("}")+1),n=JSON.parse(s);n.isKSJSOBJ&&(o=n,r("KS JS API Ready!"),o.C_one=document.getElementById("KS_JS_DIV1"),o.C_zero=document.getElementById("KS_JS_DIV0"),o.C_flush=document.getElementById("KS_JS_flush"),this.isReady=!0,"function"==typeof this.onready&&this.onready(),t=!0)}catch{}if(!t)return n(...e)}}
```
##### == SETUP COMPLETE ==
Now in you JavaScript code, you can do the following:
```js
// KS_CONNECTOR(global window object, message send rate (default = 25), enable API logs (default = true))
const KS = new KS_CONNECTOR(unsafeWindow); //unsafeWindow in tampermonkey, window in any other script.
KS.onready = () => { KS.send("hello from js"); };

function handler_label_function(data) {
    // do stuff with data (array containing other strings sent from KS)
}
KS.setHandler("handler_label", handler_label_function)
KS.removeHandler("handler_label") // removes handler for "handler_label"
```

And in KrunkScript, you can do this whenever needed.
```js
str[] message_to_send = str["handler_label", "test1", "test2"];
send_js_message(message_to_send); # calls handler with label "handler_label" with data supplied other than the label as an array argument.
```
To listen to messages from JS to KS, modify the existing `on_js_message` action that is present near the top of the KS code.

# JS API Methods
```js
// i.e const KS = new KS_JS_API(...args...)
constructor(
    // tampermonkey - unsafeWindow, otherwise - window.
    global_window_object, 
    // higher = faster + more chances of failure or crashes.
    [int] message send rate (default = 25), 
    // keep enabled for easier debugging. 
    [bool] enable api logs (default = true)
)

// sets the handler for a label
.setHandler(
    // label i.e the first string in the string array sent from KS
    (str) label, 
    // function to call with remaining data as an array argument
    (func) callback
)

// removes the callback function set with .setHandler for the specified label.
.removeHandler((str) label)

// sends a message to KS
.send((str) msg)
```

# KS API METHODS 
In KrunkScript, you can do this whenever needed.
The following KS code sends a message to JS to call the handler with label "handler_label" with data supplied other than the label as an array argument.
```js
str[] message_to_send = str["handler_label", "test1", "test2"];
send_js_message(message_to_send); 
```
To listen to messages *from* JS *to* KS, modify the existing **`on_js_message` action** that is present near the top of the KS code.
Check the example directory for more info.
