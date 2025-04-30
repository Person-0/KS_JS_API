function KS_CONNECTOR(logfunc = window.log || console.log) {

    const logColors = {
        default: "yellow",
        error: "red"
    };
    const LOG = (e, type = "default") => {
        if (this.disableLogs || !e) {
            return
        }
        logfunc("%c[KS_JS_API] " + e.toString(), `color: ${logColors[type] || logColors["default"]}; background-color: #171717`)
    }

    this.disableLogs = false;
    this.tx = null;
    this.rx = null;
    this.onmessage = onKSMessage;
    this.onready = onready;
    this.isReady = false;
    this.disable = false;

    // make it so that onready is fired instantly if it was set after the api was ready.
    {
        let onreadyfunc = this.onready;
        Object.defineProperty(this, "onready", {
            get: () => {
                return onreadyfunc;
            },
            set: (e) => {
                onreadyfunc = e;
                if (this.isReady) {
                    e();
                }
            }
        })
    }

    this.send = message => {
        if (!this.tx) {
            return LOG("tx div not found", "error")
        };
        this.tx.textContent = message;
        this.tx.click();
    };

    const interval = setInterval(() => {
        if (this.disable) {
            return clearInterval(interval)
        };

        this.rx = document.getElementById("KS_TX");
        this.tx = document.getElementById("KS_RX");

        if (this.rx && this.tx) {

            new MutationObserver((mutations) => {
                for (let i = 1; i < mutations.length; i += 2) {
                    this.onmessage(mutations[i].addedNodes[0].textContent);
                }
            }).observe(this.rx, {
                childList: true
            });

            clearInterval(interval);

            LOG('API ready');
            this.onready();
            this.isReady = true;

        } else {

            if (typeof window.getGameActivity === "function") {
                const gameInfo = window.getGameActivity();
                let disableAPI = false;

                if (gameInfo.user !== "Guest") { // sandbox mode gameinfo.user is "Guest"
                    disableAPI = !gameInfo.isCustom;
                }

                if (disableAPI) {
                    LOG("Disabled due to game being pub", "error")
                    clearInterval(interval);
                    this.disable = true;
                }
            }

        }
    }, 1000);

    function onKSMessage(message) {
        LOG('message received: ' + message);
    }

    function onready() {
        LOG('warning: .onready not set');
    }

    // to be used if sending string(string array) from ks with first item being label and rest being args
    this.LabelHandlerMgr = function LabelHandlerMgr() {
        this.handlers = {};
        this.addHandler = (label, callb) => {
            this.handlers[label] = callb;
        }
        this.removeHandler = (label) => {
            delete this.handlers[label];
        }
        this.bindToAPI = (api) => {
            LOG("binding LabelHandlerMgr to API.onmessage")
            api.onmessage = (msg) => {
                if (msg.includes(",")) {
                    try {
                        const data = msg.split(",")
                        if (this.handlers[data[0]]) {
                            const label = data[0];
                            data.shift();
                            this.handlers[label](data);
                        } else {
                            LOG("LabelHandlerMgr > No label named \"" + data[0] + "\". Data recieved: " + msg, "error");
                        }
                    } catch (error) {
                        LOG("LabelHandlerMgr > Decoding api message resulted in error. message: " + msg, "error");
                        logfunc(error);
                    }
                } else {
                    if (this.handlers[msg]) {
                        this.handlers[msg]();
                    } else {
                        LOG("LabelHandlerMgr > No label named \"" + msg + "\". Data recieved: " + msg, "error");
                    }
                }
            }
        }
    }
}
