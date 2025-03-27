# Sending Arrays

This example sends an array with label and data to KrunkScript.

- You can add a sign ingame with text you supply from javascript.
- You can set sky color of the game from javascript.

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
function stringArray(array){return array.join(","); }
```

Wait for the API Ready message to appear,
Then you can use any of the following statements.

```js
// #000000 represents black color in hex code.
KS.send(stringArray(["skyCol","#000000"]))

KS.send(stringArray(["addSign","sign text here"]))
```

skyCol -> for setting sky color.
addSign -> for addign a sign with text.

The KrunkScript code responsible for this logic is as follows
```js
str[] action CommaSepStrToArray(str datastr){
    if(lengthOf (UTILS.replaceText(datastr, ",")) == 0){
        return str[];
    }
    
    str[] data = str[""];
    for(num i = 0; i < lengthOf datastr; i++){
        if(datastr[i] == ","){
            addTo data "";
        } else {
            data[(lengthOf data)-1] +=  datastr[i];
        }
    }

    return data;
}

action on_js_message(str msg) {
    ######################################
    # do whatever u want with msg string #
    ######################################

    str[] data = CommaSepStrToArray(msg);
        
    if(data[0] == "addSign"){
        obj sign = GAME.SCENE.addSign(26, 6, 0, 40, 10, data[1], {});
    } else if(data[0] == "skyCol"){
        GAME.SCENE.setSkyColor(data[1]);
    }
}
```