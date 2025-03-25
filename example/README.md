# Example
- Install the [userscript](https://raw.githubusercontent.com/BluZed/KS_JS_API/refs/heads/main/example/script.user.js)
- Host the map from [map data](https://raw.githubusercontent.com/BluZed/KS_JS_API/refs/heads/main/example/mapdata.txt)
- Open Devtools console (normally Ctrl+Shift+i or F12)
- Wait for KS_JS_API Enabled message.
- Can now use commands like
```js
KS.send(["setSkyCol","ffffff"].join("_")) //label skyColorHexCodeWithout#
or
KS.send(["cube",0,0,0,10,10,10].join("_")) //label x y z w h l
```
Check the KS and JS code in editor and compare with results.
