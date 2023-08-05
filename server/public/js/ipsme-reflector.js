'use strict';

// console.log('OUT', __name({variableName}) );

function labelsToBigInt_$2(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

function l_LL(obj, x) {
	let obj_new= {};
	for (var [k,v] of Object.entries(obj))
		obj_new[k]= v<<x;
	return obj_new;
}

//-------------------------------------------------------------------------------------------------

function handler_default_$2( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
let BitLogr$2 = class BitLogr {
	constructor() {
		this._handler_log= handler_default_$2;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr$2.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_$2(this._Bint_labels, obj);

		BitLogr$2.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
};

// console.log('OUT', __name({variableName}) );

function labelsToBigInt_$1(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_$1( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
let BitLogr$1 = class BitLogr {
	constructor() {
		this._handler_log= handler_default_$1;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr$1.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_$1(this._Bint_labels, obj);

		BitLogr$1.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
};

let LOGR_$2= new BitLogr$1();

const l_$2 = {
	MsgEnv : 0b1 << 0,	// MsgEnv
	CXNS : 0b1 << 1,	// connections
	REFL : 0b1 << 2,	// reflection
};
LOGR_$2.labels= l_$2;

// https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const __name$1 = obj => Object.keys(obj)[0];
// console.log('OUT', __name({variableName}) );

//-------------------------------------------------------------------------------------------------

var cfg_$1= (function() {
    let _options= {};

    // options= {
    // channel : 'IPSME',
    //     prefix : '',
    //     logr : ...
    // }

    return {
        get channel() {
			return (_options.channel === undefined) ? 'IPSME' : _options.channel;
        },
        get prefix() { 
			return (_options.prefix === undefined) ? '' : _options.prefix;
        },
		get options() { return _options; },
		set options(obj) {
			_options= obj;
            if (_options.logr && _options.logr[ __name$1(l_$2) ] )
			    LOGR_$2.toggled= _options.logr;
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

function subscribe(handler) {
    if (handler.broadcastChannel !== undefined)
        return;
    LOGR_$2.log(l_$2.CXNS, cfg_$1.prefix +'MsgEnv: subscribe');
    handler.broadcastChannel= new BroadcastChannel(cfg_$1.channel);
    handler.broadcastChannel.onmessage= function(event) {
        const msg= event.data;
        LOGR_$2.log(l_$2.REFL, cfg_$1.prefix +'MsgEnv: bc.onmessage: ', msg);
        this(msg);
    }.bind(handler);
}

var bc_= undefined;

function publish(msg) {
    if (! bc_)
        bc_= new BroadcastChannel(cfg_$1.channel);

    LOGR_$2.log(l_$2.REFL, cfg_$1.prefix +'MsgEnv: bc.postMessage: ', msg);
    bc_.postMessage(msg);
}

// console.log('OUT', __name({variableName}) );

function labelsToBigInt_(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
class BitLogr {
	constructor() {
		this._handler_log= handler_default_;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_(this._Bint_labels, obj);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
}

let LOGR_$1= new BitLogr();

const l_$1 = {
	MsgCache : 0b1 << 0,	// MsgCache
	ADD_REMOVE : 0b1 << 1,	// add/remove
};
LOGR_$1.labels= l_$1;

// https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const __name = obj => Object.keys(obj)[0];
// console.log('OUT', __name({variableName}) );

//-------------------------------------------------------------------------------------------------

const knr_DEFAULT_TTL_MILLISECONDS= 30000;
const knr_POLL_RES_MILLISECONDS= 1000;

let options_= {};

class MsgContext {
	constructor(nr_TTL_ms= knr_DEFAULT_TTL_MILLISECONDS, context) {
		this._TTL_ms= nr_TTL_ms;
		this._context= context;
		this._expired= false;
		this._timeout_ID= setTimeout(function(msg_context) {
				msg_context.expire();
			}, this._TTL_ms, this);
	}

	expire() {
		this._expired= true;
		clearTimeout(this._timeout_ID);
	}

	get TTL() { return this._TTL_ms; }
	get context() { return this._context; }
	get expired() { return this._expired; }
}

class MsgCache {
	constructor(nr_poll_res_milliseconds= knr_POLL_RES_MILLISECONDS) {
		this._map_messages= new Map();

		const intervalFired= function(msg_cache) {
			for (const [msg, context] of msg_cache._map_messages.entries()) {
				if (context.expired) {
					msg_cache._map_messages.delete(msg);
					LOGR_$1.log(l_$1.ADD_REMOVE, 'msgCache: expired: *DELETED msg: ', msg, context.TTL);
				}
			}
		};
		this._interval_ID= setInterval(intervalFired, nr_poll_res_milliseconds, this);
	}
	cache(msg, context) {
		LOGR_$1.log(l_$1.ADD_REMOVE, 'msgCache: cache: ', msg);
		this._map_messages.set(msg, context);
	}
	contains(msg) {
		let context= this._map_messages.get(msg);
		return [ context !== undefined, context ];
	}
	exists(msg) {
		return this._map_messages.has(msg);
	}
	expire(msg) {
		let [ b_res, context ]= this.contains(msg);
		if (! b_res) 
			return;
		
		context.expire();
		this._map_messages.delete(msg);
	}

	static set options(obj) {
		options_= obj;
		if (options_.logr && options_.logr[ __name(l_$1) ] )
			LOGR_$1.toggled= options_.logr;
	}
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var Event = /** @class */ (function () {
    function Event(type, target) {
        this.target = target;
        this.type = type;
    }
    return Event;
}());
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(error, target) {
        var _this = _super.call(this, 'error', target) || this;
        _this.message = error.message;
        _this.error = error;
        return _this;
    }
    return ErrorEvent;
}(Event));
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(code, reason, target) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _this = _super.call(this, 'close', target) || this;
        _this.wasClean = true;
        _this.code = code;
        _this.reason = reason;
        return _this;
    }
    return CloseEvent;
}(Event));

/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
var getGlobalWebSocket = function () {
    if (typeof WebSocket !== 'undefined') {
        // @ts-ignore
        return WebSocket;
    }
};
/**
 * Returns true if given argument looks like a WebSocket class
 */
var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
var DEFAULT = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    minUptime: 5000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    maxEnqueuedMessages: Infinity,
    startClosed: false,
    debug: false,
};
var ReconnectingWebSocket = /** @class */ (function () {
    function ReconnectingWebSocket(url, protocols, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._listeners = {
            error: [],
            message: [],
            open: [],
            close: [],
        };
        this._retryCount = -1;
        this._shouldReconnect = true;
        this._connectLock = false;
        this._binaryType = 'blob';
        this._closeCalled = false;
        this._messageQueue = [];
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
         */
        this.onclose = null;
        /**
         * An event listener to be called when an error occurs
         */
        this.onerror = null;
        /**
         * An event listener to be called when a message is received from the server
         */
        this.onmessage = null;
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
         * this indicates that the connection is ready to send and receive data
         */
        this.onopen = null;
        this._handleOpen = function (event) {
            _this._debug('open event');
            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
            clearTimeout(_this._connectTimeout);
            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
            _this._ws.binaryType = _this._binaryType;
            // send enqueued messages (messages sent before websocket open event)
            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
            _this._messageQueue = [];
            if (_this.onopen) {
                _this.onopen(event);
            }
            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleMessage = function (event) {
            _this._debug('message event');
            if (_this.onmessage) {
                _this.onmessage(event);
            }
            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleError = function (event) {
            _this._debug('error event', event.message);
            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
            if (_this.onerror) {
                _this.onerror(event);
            }
            _this._debug('exec error listeners');
            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
            _this._connect();
        };
        this._handleClose = function (event) {
            _this._debug('close event');
            _this._clearTimeouts();
            if (_this._shouldReconnect) {
                _this._connect();
            }
            if (_this.onclose) {
                _this.onclose(event);
            }
            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._url = url;
        this._protocols = protocols;
        this._options = options;
        if (this._options.startClosed) {
            this._shouldReconnect = false;
        }
        this._connect();
    }
    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
        get: function () {
            return ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
        get: function () {
            return ReconnectingWebSocket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
        get: function () {
            return ReconnectingWebSocket.CLOSING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
        get: function () {
            return ReconnectingWebSocket.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
        get: function () {
            return this._ws ? this._ws.binaryType : this._binaryType;
        },
        set: function (value) {
            this._binaryType = value;
            if (this._ws) {
                this._ws.binaryType = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
        /**
         * Returns the number or connection retries
         */
        get: function () {
            return Math.max(this._retryCount, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
        /**
         * The number of bytes of data that have been queued using calls to send() but not yet
         * transmitted to the network. This value resets to zero once all queued data has been sent.
         * This value does not reset to zero when the connection is closed; if you keep calling send(),
         * this will continue to climb. Read only
         */
        get: function () {
            var bytes = this._messageQueue.reduce(function (acc, message) {
                if (typeof message === 'string') {
                    acc += message.length; // not byte size
                }
                else if (message instanceof Blob) {
                    acc += message.size;
                }
                else {
                    acc += message.byteLength;
                }
                return acc;
            }, 0);
            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
        /**
         * The extensions selected by the server. This is currently only the empty string or a list of
         * extensions as negotiated by the connection
         */
        get: function () {
            return this._ws ? this._ws.extensions : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
        /**
         * A string indicating the name of the sub-protocol the server selected;
         * this will be one of the strings specified in the protocols parameter when creating the
         * WebSocket object
         */
        get: function () {
            return this._ws ? this._ws.protocol : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
        /**
         * The current state of the connection; this is one of the Ready state constants
         */
        get: function () {
            if (this._ws) {
                return this._ws.readyState;
            }
            return this._options.startClosed
                ? ReconnectingWebSocket.CLOSED
                : ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
        /**
         * The URL as resolved by the constructor
         */
        get: function () {
            return this._ws ? this._ws.url : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
     * CLOSED, this method does nothing
     */
    ReconnectingWebSocket.prototype.close = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._closeCalled = true;
        this._shouldReconnect = false;
        this._clearTimeouts();
        if (!this._ws) {
            this._debug('close enqueued: no ws instance');
            return;
        }
        if (this._ws.readyState === this.CLOSED) {
            this._debug('close: already closed');
            return;
        }
        this._ws.close(code, reason);
    };
    /**
     * Closes the WebSocket connection or connection attempt and connects again.
     * Resets retry counter;
     */
    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
        this._shouldReconnect = true;
        this._closeCalled = false;
        this._retryCount = -1;
        if (!this._ws || this._ws.readyState === this.CLOSED) {
            this._connect();
        }
        else {
            this._disconnect(code, reason);
            this._connect();
        }
    };
    /**
     * Enqueue specified data to be transmitted to the server over the WebSocket connection
     */
    ReconnectingWebSocket.prototype.send = function (data) {
        if (this._ws && this._ws.readyState === this.OPEN) {
            this._debug('send', data);
            this._ws.send(data);
        }
        else {
            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
            if (this._messageQueue.length < maxEnqueuedMessages) {
                this._debug('enqueue', data);
                this._messageQueue.push(data);
            }
        }
    };
    /**
     * Register an event handler of a specific event type
     */
    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type].push(listener);
        }
    };
    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        var listeners = this._listeners[event.type];
        if (listeners) {
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var listener = listeners_1_1.value;
                    this._callEventListener(event, listener);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return true;
    };
    /**
     * Removes an event listener
     */
    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
        }
    };
    ReconnectingWebSocket.prototype._debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._options.debug) {
            // not using spread because compiled version uses Symbols
            // tslint:disable-next-line
            console.log.apply(console, __spread(['RWS>'], args));
        }
    };
    ReconnectingWebSocket.prototype._getNextDelay = function () {
        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
        var delay = 0;
        if (this._retryCount > 0) {
            delay =
                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
            if (delay > maxReconnectionDelay) {
                delay = maxReconnectionDelay;
            }
        }
        this._debug('next delay', delay);
        return delay;
    };
    ReconnectingWebSocket.prototype._wait = function () {
        var _this = this;
        return new Promise(function (resolve) {
            setTimeout(resolve, _this._getNextDelay());
        });
    };
    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
        if (typeof urlProvider === 'string') {
            return Promise.resolve(urlProvider);
        }
        if (typeof urlProvider === 'function') {
            var url = urlProvider();
            if (typeof url === 'string') {
                return Promise.resolve(url);
            }
            if (!!url.then) {
                return url;
            }
        }
        throw Error('Invalid URL');
    };
    ReconnectingWebSocket.prototype._connect = function () {
        var _this = this;
        if (this._connectLock || !this._shouldReconnect) {
            return;
        }
        this._connectLock = true;
        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
        if (this._retryCount >= maxRetries) {
            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
            return;
        }
        this._retryCount++;
        this._debug('connect', this._retryCount);
        this._removeListeners();
        if (!isWebSocket(WebSocket)) {
            throw Error('No valid WebSocket class provided');
        }
        this._wait()
            .then(function () { return _this._getNextUrl(_this._url); })
            .then(function (url) {
            // close could be called before creating the ws
            if (_this._closeCalled) {
                return;
            }
            _this._debug('connect', { url: url, protocols: _this._protocols });
            _this._ws = _this._protocols
                ? new WebSocket(url, _this._protocols)
                : new WebSocket(url);
            _this._ws.binaryType = _this._binaryType;
            _this._connectLock = false;
            _this._addListeners();
            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
        });
    };
    ReconnectingWebSocket.prototype._handleTimeout = function () {
        this._debug('timeout event');
        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
    };
    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._clearTimeouts();
        if (!this._ws) {
            return;
        }
        this._removeListeners();
        try {
            this._ws.close(code, reason);
            this._handleClose(new CloseEvent(code, reason, this));
        }
        catch (error) {
            // ignore
        }
    };
    ReconnectingWebSocket.prototype._acceptOpen = function () {
        this._debug('accept open');
        this._retryCount = 0;
    };
    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
        if ('handleEvent' in listener) {
            // @ts-ignore
            listener.handleEvent(event);
        }
        else {
            // @ts-ignore
            listener(event);
        }
    };
    ReconnectingWebSocket.prototype._removeListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('removeListeners');
        this._ws.removeEventListener('open', this._handleOpen);
        this._ws.removeEventListener('close', this._handleClose);
        this._ws.removeEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.removeEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._addListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('addListeners');
        this._ws.addEventListener('open', this._handleOpen);
        this._ws.addEventListener('close', this._handleClose);
        this._ws.addEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.addEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._clearTimeouts = function () {
        clearTimeout(this._connectTimeout);
        clearTimeout(this._uptimeTimeout);
    };
    return ReconnectingWebSocket;
}());

const l_ = {
	// Reflector_IPC_main : 0b1 << 0,
	DUPS				: 0b1 << 1,	// duplicates
	... l_LL(l_$2, 4),
	... l_LL(l_$1, 8),
};

//-------------------------------------------------------------------------------------------------

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
var rws_= undefined;

let msgcache_= undefined;
const knr_MSG_EXPIRATION_ms= 4000;

let LOGR_= new BitLogr$2();
LOGR_.labels= l_;

const str_default_ws_url_= 'ws://localhost:8023';

var cfg_= (function() {
    let _options= {};

	// const reflector_options= {
	// 	url : "ws://localhost:8082",
	// 	rws : {
	// 		maxRetries: 20,
	// 		debug: true
	// 	},
	// 	log : cfg_.logr
	// }

    return {
		get url() {
			return (_options.url === undefined) ? str_default_ws_url_ : _options.url;
		},
		get rws() {
			return (_options.rws === undefined) ? {} : _options.rws;
		},
		get logr() {
			return (_options.logr === undefined) ? 0 : _options.logr;
		},
		get options() { return _options; },
		set options(obj) {
			_options= obj;
		},
		is_empty: function () {
			// https://bobbyhadz.com/blog/javascript-check-if-object-is-empty
			return Object.keys(_options).length === 0;
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// bc -> ws

function handler_(msg)
{

	if (msg === undefined)
		return;

	// IPSME doesn't dictate that strings should be passed. The javascript broadcast ME allows
	// for objects to be passed, but the web socket doesn't support them, so drop non-strings.

	if (typeof(msg) !== 'string') 
		return;

	let str_msg= msg;

	msgcache_.cache(str_msg, new MsgContext(knr_MSG_EXPIRATION_ms));

	LOGR_.log(l_.REFL, 'REFL-ws: send: bc -> ws -- ', str_msg);
	if (rws_ && (rws_.readyState === WebSocket.OPEN))
		rws_.send(str_msg);
}

// TODO: the config options are set are global are init'd, so this never outputs debug info
subscribe(handler_);

//-------------------------------------------------------------------------------------------------
// bc <- ws

function ws_handler_open_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: open: ', event);
	port_.postMessage({ sharedworker : 'INITd!' });
}

function ws_handler_close_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: close: ', event);
}

function ws_handler_onmessage_ (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	let [ b_res, ctx ]= msgcache_.contains(str_msg);
	if (b_res) {
		LOGR_.log(l_.DUPS, 'REFL-ws: *DUP | <- ws -- ', str_msg); 
		return;
	}

	LOGR_.log(l_.REFL, 'REFL-ws: publish: bc <- ws -- ', str_msg);
	publish(str_msg);
}

function ws_handler_onerror_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: err: ', event);
}

//-------------------------------------------------------------------------------------------------

var port_;

onconnect = function (e) {
	port_ = e.ports[0];

	// ----

	port_.onmessage= function (e) {
		// port.postMessage(workerResult);

		LOGR_.log(l_.CXNS, 'REFL: port.onmessage: options: ', cfg_.options);
			
		if (rws_) {
			// We are here when another page also loads the sharedworker
			// prevent cfg_.options from possibly being clobbered by a second instance
			
			if (rws_.readyState === WebSocket.OPEN)
				port_.postMessage({ sharedworker : 'INITd!' });

			return;
		}

		cfg_.options= e.data;

		cfg_$1.options= {
			prefix : 'REFL-ws: ',
			logr : cfg_.options.logr
		};

		MsgCache.options= cfg_.options;

		if (! msgcache_)
		msgcache_= new MsgCache();

		rws_= new ReconnectingWebSocket(cfg_.url, [], cfg_.rws); // wss://
		rws_.onopen= ws_handler_open_;
		rws_.onclose= ws_handler_close_;
		rws_.onmessage= ws_handler_onmessage_;
		rws_.onerror= ws_handler_onerror_;

		LOGR_.log(l_.CXNS, 'REFL: rws:', rws_);
	};
};

//-------------------------------------------------------------------------------------------------
