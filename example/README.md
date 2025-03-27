# Examples

This directory contains some examples on how to use this API.
Open any directory to read their description on their readme files.

As for debugging purposes, you all should know that krunker disables the default `console.log` in the js devtools console while loading the game. Instead, you can log anything you want to with `window.log` that krunker also assigns.

**This is only applicable for https://krunker.io and is subject to change depending on what the Krunker devs decide to do.**

```js
// This will not work once the game is loading / has loaded.
console.log("hello world") 

// This will work once the game is loading / has loaded.
window.log("hello world")

// You may do something like to make it work regardless of game load state.
const log = (e) => {
    if(window.log){
        window.log(e);
    } else {
        console.log(e);
    }
}
```
<br>

**If you have an example you would like to share, I would appreciate it if you create a pull request for it! You can also directly message me on discord.** 
