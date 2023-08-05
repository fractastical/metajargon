import * as sharedworker_reflector from 'https://unpkg.com/@ipsme/reflector-webbr-ws@0.4.4';
import * as IPSME_MsgEnv from 'https://unpkg.com/@ipsme/msgenv-broadcastchannel@0.3.8';
import { TwoPhW, JSON_MsgWarp, JSON_MsgEngage, JSON_MsgAckWarp, JSON_MsgAckEngage, l as l_2PhW } from 'https://unpkg.com/@rootintf/protocol-2phw0.6.11';

function ipsme_handler_(msg) 
{
	console.log('ipsme_handler_: ', msg); 

	try {

		if (twoPhW.handler_msg(msg))
			return true;
	
	}
	catch(e) {
		console.log(e)
	}
	  
	LOGR_.log(l_.DROPS, "ipsme_handler_: DROP! ", msg);
}
IPSME_MsgEnv.subscribe(ipsme_handler_);


var twoPhW= new TwoPhW();

twoPhW.config.receiver( callback_msgWarp_, callback_msgEngage_ );
twoPhW.config.sender( callback_msgAckWarp_, callback_msgAckEngage_ );
twoPhW.config.callback_msgOptions= callback_msgOptions_;


function callback_msgAckWarp_(msg, json_msgAckWarp) 
{
	// console.log('callback_Ack_Warp: Ack: ', json_Ack);

	if (! json_msgAckWarp.ack.ok) {
		console.log('callback_msgAbort_: JSON_MsgWarp : ', json_msgAckWarp.ack.expired);

		setStatus('IN WORLD'); // ACKNOWLEDGE/ABORT
		portalActivate(portal_, false);
		return;
	}

	const json_msgWarp= json_msgAckWarp._msg;

	const json_msgEngage= JSON_MsgEngage.create_with_MsgWarp(json_msgWarp)
	json_msgEngage.referer= karr_referer_;

	console.log('callback_Ack_Warp: publish: Engage: ', json_msgEngage);
	IPSME_MsgEnv.publish( JSON.stringify(json_msgEngage) );

	setStatus('ENGAGE'); // ENGAGE/ABORT
	return true;
}

function callback_msgAckEngage_(msg, json_msgAckEngage)
{
	console.log('callback_Ack_Engage: Ack: ', json_msgAckEngage);

	setUser({ id : "", authentication : "" }, "");

	IPSME_MsgEnv.unsubscribe( ipsme_handler_ );

	// window.location.replace( str_page_blank ); // doesn't add to history
	window.location.href= kstr_page_blank_;
	return true;
}

//-------------------------------------------------------------------------------------------------
// Receiver

function callback_msgWarp_(msg, json_msgWarp)
{
	// console.log('callback_Warp: Warp: ', json_Warp);

	const json_User= json_msgWarp.warp.user;
	const json_Hyperport= json_msgWarp.warp.hyperport;

	//TODO: validate hyperport
	// console.log('json_User', json_User);
	// console.log('json_Hyperport', json_Hyperport);

	// -----

	const str_destination_URN= extract_URN_(json_Hyperport.destination.URL);
	const str_this_URN= extract_URN_(window.location.href);
	if (str_destination_URN !== str_this_URN)
		return false;

	// -----

	const portals= Array.from( document.getElementsByTagName('portal') );
	const nr_index= portals.find( el => {
		return el.getAttribute('uuid') === json_Hyperport.portal;
	});
	if (nr_index === undefined)
		return false;

	// -----

	const json_msgAckWarp= JSON_MsgAckWarp.create_with_msgOk(json_msgWarp, true);
	json_msgAckWarp.referer= karr_referer_;

	console.log('callback_Warp: publish Ack Warp: ', json_msgAckWarp); 
	IPSME_MsgEnv.publish( JSON.stringify(json_msgAckWarp) );

	setUser(json_User, 'PREPARE'); // PREPARE/ABORT
	return true;
}

function callback_msgEngage_(msg, json_msgEngage)
{
	// console.log('callback_Engage: Engage: ', json_Engage);

	const json_msgAckEngage= JSON_MsgAckEngage.create_with_msgOk(json_msgEngage, true);
	json_msgAckEngage.referer= karr_referer_;

	console.log('callback_Engage: publish: Ack Engage: ', json_msgAckEngage);
	IPSME_MsgEnv.publish( JSON.stringify(json_msgAckEngage) );

	setStatus('IN WORLD'); // ACKNOWLEDGE/ABORT
	return true;
}


sharedworker_reflector.load(window, "./js/ipsme-reflector.js", function () {
	// initialization code ...
  console.log("IPSME INIT"); 
  IPSME_MsgEnv.publish("metalive");

});
