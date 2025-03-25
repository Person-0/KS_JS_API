function KS_CONNECTOR(window, CPT = 25, _enableLogs = true) {
    const _consolelog = window.console.log;
    this.enableLogs = _enableLogs;
    const logColors = {default: "yellow", error: "red"};
    const LOG = (e,type = "default") => {
        if(!this.enableLogs || !e){ return }
        _consolelog("%c[KS_JS_API] "+e.toString(), `color: ${logColors[type] || logColors["default"]}; background-color: #171717`)
    }
    let API_OBJECT = null;
    let disableAPI = false;
    this.isReady = false;
    Object.defineProperty(this, "onready", {
        set:(e)=>{
            if(this.isReady){
                e()
                return
            }
            this._actual_onready_ = e;
        },
        get:()=>{ return this._actual_onready_ || null }
    })
    this.handlers = {"log": _consolelog}
    this.setHandler = (label, callb) => {  this.handlers[label] = callb  }
    this.removeHandler = (label) => { delete this.handlers[label] }
    this.send = (text) => {
        if(!API_OBJECT){return LOG("(NOT READY) API_OBJECT_NONEXISTENT Could not send message!", "error")}
        let queue = [];
        for(const char of text){
            if(API_OBJECT.charlist.includes(char)){
                const index = API_OBJECT.charlist.indexOf(char)
                if(index > Math.pow(2,API_OBJECT.charLen)){
                    LOG("FATAL PACKET LOSS. INDEX > 2**CHARLEN. RARE ERROR ENCOUNTERED", "error")
                } else {
                    let binrep = get_binary_num(index,API_OBJECT.charLen);
                    queue = queue.concat(binrep);
                }
            }
        };
        let cur = 0;
        (function sendq(){
            let isfin = false;
            for(let _ = 0; _ < CPT; _++){
                if(cur < queue.length){
                    if(queue[cur]){
                        API_OBJECT.C_one.click()
                    } else {
                        API_OBJECT.C_zero.click()
                    }
                    cur += 1;
                } else {
                    API_OBJECT.C_flush.click()
                    isfin = true;
                }
            }
            if(!isfin){requestIdleCallback(sendq)}
        })();
    }
    const KS_recieve_rawtext = (args) => {
        if(this.handlers[args[0]]){
            const key = args[0]
            args.shift()
            this.handlers[key](args)
        } else {
            LOG("Message recieved from KS but no handler present. Label: "+args[0], "error")
        }
    }
    checkCall(()=>{return window.getGameActivity}, ()=>{
        const gameInfo = window.getGameActivity();
        if(gameInfo.user === "Guest"){
            disableAPI = false;
        } else {
            disableAPI = !gameInfo.isCustom;
        }
        LOG(disableAPI ? "Disabled due to game being pub" : null, "error")
    })
    window.console.log = (...args) => {
        let dontReturn = false;
        if(!disableAPI && args[0] && args[0].includes("[KRUNKSCRIPT] ")){
            if(!API_OBJECT){
                try{
                    const jsonextract = args[0].substring(args[0].indexOf("{"), args[0].lastIndexOf("}")+1)
                    const data = JSON.parse(jsonextract)
                    if(data.isKSJSOBJ){
                        API_OBJECT = data;
                        LOG("KS JS API Ready!")
                        API_OBJECT.C_one = document.getElementById("KS_JS_DIV1")
                        API_OBJECT.C_zero = document.getElementById("KS_JS_DIV0")
                        API_OBJECT.C_flush = document.getElementById("KS_JS_flush")
                        this.isReady = true;
                        if(typeof this.onready === "function"){this.onready()};
                        dontReturn = true;
                    }
                }catch{}
            } else {
                if(args[0].includes("[JSMSG]")){
                    try{KS_recieve_rawtext(
                        JSON.parse(args[0].replace("%c[KRUNKSCRIPT]","").replace("[JSMSG]",""))
                    )}catch(err){_consolelog(err)}
                    dontReturn = true;
                }
            }
        }
        if(dontReturn){ return };
        return _consolelog(...args);
    };
    function get_binary_num(n, len) {
        let outp = [];
        let next = n;
        while (next > 0) {
            outp.unshift(next % 2);
            next = Math.floor(next / 2);
        }
        while (outp.length < len) {
            outp.unshift(0);
        }
        return outp;
    }
    function checkCall(check,call){
        (new Promise((e)=>{
            let done = false;
            let i = setInterval(()=>{
                if(check()){
                    done = true;
                    clearInterval(i)
                }
                if(done){
                    done=false;
                    e();
                }
            },100)
            })
        ).then(call)
    }
}
