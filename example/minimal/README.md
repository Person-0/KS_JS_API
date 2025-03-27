# Minimal Example

This example adds a sign with any text you send from javascript.

1. Load the map from [map.txt](./map.txt) in editor and then play in sandbox mode.
2. Open DevTools
3. In the console, paste the minified KS_API JS source and press enter.

Now,

Type in 

```js
const KS = new KS_CONNECTOR()
KS.onready = () => { 
    window.log("API Ready.") 
}
```

Wait for the API Ready message to appear,
Then you can use any of the following statements.

```js
// adds a sign with text "sign text here"
KS.send("sign text here") 
```

The KrunkScript code responsible for this logic is as follows
```js
action on_js_message(str msg) {
    ######################################
    # do whatever u want with msg string #
    ######################################
    obj sign = GAME.SCENE.addSign(26, 6, 0, 40, 10, msg, {});
}
```