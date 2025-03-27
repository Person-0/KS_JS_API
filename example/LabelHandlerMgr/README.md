# Using LabelHandlerMgr

This example allows you to remove blocks added via KrunkScript and also fetch player position data in javascript.

1. Load the map from [map.txt](./map.txt) in editor and then play in sandbox mode.
2. Open DevTools
3. In the console, paste the minified KS_API JS source and press enter.

Now,

Type in 

```js
const KS = new KS_CONNECTOR();

const handlermgr = new KS.LabelHandlerMgr();
handlermgr.bindToAPI(KS);

handlermgr.addHandler("playerPosition",(data)=>{
    const [x, y, z] = data;
    window.log(`Player: (${x},${y},${z})`) 
})

KS.onready = () => { 
    window.log("API Ready.") 
}

function stringArray(array){return array.join(",");}
```

Wait for the API Ready message to appear,
Then you can use any of the following statements.

```js
// Only use if you are spawned in. Else KS throws an error which might scare you 
// Returns in the position of you in the map
// By firing the "playerPosition" handler we added before.
KS.send(stringArray(["getPlayerPosition"]))

// Removes block from scene that has been saved with key a/b/c in the blocks obj in KS.
// Blocks from left to right -> a, b, c
KS.send(stringArray(["remove_block", "a"]))
KS.send(stringArray(["remove_block", "b"]))
KS.send(stringArray(["remove_block", "c"]))
```

The KrunkScript code responsible for this logic is as follows
```js
obj blocks = {};

action send_js_message(str[] msg) {
    GAME.UI.updateDIVText(TX_ID, "KS_flush");
    GAME.UI.updateDIVText(TX_ID, (((str)msg)+""));
}

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
        
    if(data[0] == "remove_block"){
        if(data[1] == "a"){
            blocks.a.delete();
        } else if(data[1] == "b"){
            blocks.b.delete();
        } else if(data[1] == "c"){
            blocks.c.delete();
        }
    } else if(data[0] == "getPlayerPosition"){
        obj me = GAME.PLAYERS.getSelf();
        send_js_message(str["playerPosition", (str)me.position.x, (str)me.position.y, (str)me.position.z]);
    }
}

public action start() {
    GAME.UI.addDIV(TX_ID, false);
    GAME.UI.addDIV(RX_ID, false);

    blocks.c = GAME.SCENE.addCube("", "#000000", 24, 0, 31, 10, 10, 10, {});
    blocks.b = GAME.SCENE.addCube("", "#000000", 24, 0, 0, 10, 10, 10, {});
    blocks.a = GAME.SCENE.addCube("", "#000000", 24, 0, -31, 10, 10, 10, {});
}
```