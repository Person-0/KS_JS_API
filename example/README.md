# Example
- Install the [userscript](https://raw.githubusercontent.com/BluZed/KS_JS_API/refs/heads/main/example/script.user.js)
- Host the map from [map data](https://raw.githubusercontent.com/BluZed/KS_JS_API/refs/heads/main/example/mapdata.txt)
- Open Devtools console (normally Ctrl+Shift+i or F12)
- Wait for KS_JS_API Enabled message.
- Can now use commands like the following in the browser console
```js
// set sky color to #ffffff (remove # as it is not supported to be sent, instead the # is added in ks directly)
KS.send(["setSkyCol","ffffff"].join("_")) //label skyColorHexCodeWithout#
or
// add a cube to the map. args = x, y, z, w, h, l
KS.send(["cube",0,0,0,10,10,10].join("_")) //label x y z w h l
```
Check the KS and JS code in editor and compare with results.
