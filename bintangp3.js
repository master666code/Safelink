function extractDomain(url) {
	var hostname;
	if (url.indexOf("://") > -1) {hostname = url.split('/')[2];}
	else {hostname = url.split('/')[0];}
	hostname = hostname.split(':')[0];
	hostname = hostname.split('?')[0];
	return hostname;
}
function exception(){
	var exception = new Array();	
	setting.exceptionurl = setting.exceptionurl;
	exception = setting.exceptionurl.split(",");
	return exception;
}

function convertstr(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

var aesCrypto={};!function(t){"use strict";t.formatter={prefix:"",stringify:function(t){var r=this.prefix;return r+=t.salt.toString(),r+=t.ciphertext.toString()},parse:function(t){var r=CryptoJS.lib.CipherParams.create({}),e=this.prefix.length;return 0!==t.indexOf(this.prefix)?r:(r.ciphertext=CryptoJS.enc.Hex.parse(t.substring(16+e)),r.salt=CryptoJS.enc.Hex.parse(t.substring(e,16+e)),r)}},t.encrypt=function(r,e){try{return CryptoJS.AES.encrypt(r,e,{format:t.formatter}).toString()}catch(n){return""}},t.decrypt=function(r,e){try{var n=CryptoJS.AES.decrypt(r,e,{format:t.formatter});return n.toString(CryptoJS.enc.Utf8)}catch(i){return""}}}(aesCrypto);

if (!setting.exceptionurl) {
	setting.exceptionurl = window.location.href;
}else {
	setting.exceptionurl += ","+window.location.href;
}
var exception = exception();
function showurl(datajson){

	var check = false;
	var no = 0;
	var exceptionlength = exception.length;
	var checklink = "";
	var checkexception = "";	
	var linktag = document.getElementsByTagName("a");
	var links =new Array();		

	var semuaartikel = datajson.feed.openSearch$totalResults.$t;
	for(var i = 0; i < semuaartikel; i++) {
		var urlartikel;
		for (var s = 0; s < datajson.feed.entry[i].link.length; s++) {
			if(datajson.feed.entry[i].link[s].rel == 'alternate') {
				urlartikel = datajson.feed.entry[i].link[s].href;
				break;
			}
		}
		links[i] = urlartikel;
		var randindex = Math.random() * links.length; 
		randindex = parseInt(randindex);
	}
	for (var i = 0; i < linktag.length; i++) {	
		check = false;
		no = 0;
		while (check == false && no < exceptionlength) {
			checklink = extractDomain(linktag[i].href);
			checkexception = extractDomain(exception[no]);
			if (checklink.match(checkexception)) {
				check = true;
			}
			no++;
		}
		if (check == false) {
			linktag[i].href = links[randindex] + setting.path + aesCrypto.encrypt(convertstr(linktag[i].href),convertstr('root'));
			linktag[i].rel = "nofollow";
			linktag[i].target = "_blank";
		}
	}	
} 
