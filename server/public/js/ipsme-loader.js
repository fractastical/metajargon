import * as sharedworker_reflector from 'https://unpkg.com/@ipsme/reflector-webbr-ws@0.4.4';
import * as IPSME_MsgEnv from 'https://unpkg.com/@ipsme/msgenv-broadcastchannel@0.3.8';

function ipsme_handler_(msg) {
	console.log('ipsme_handler_: msg: ', msg);
}
IPSME_MsgEnv.subscribe(ipsme_handler_);


sharedworker_reflector.load(window, "./js/ipsme-reflector.js", function () {
	// initialization code ...
  console.log("IPSME INIT"); 
  IPSME_MsgEnv.publish("metalive");

});
