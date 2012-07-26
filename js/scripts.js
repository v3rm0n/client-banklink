//Define console log function if not exists
console = console || {log: function(){}};
//Add format method to String so we can do printf
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
//Time and date format functions
//Example new Date().formatDate("{0}.{1}.{2}"); -> "24.07.2012"
Date.prototype.formatDate = function(format){
	var format = format || "{0}.{1}.{2}";
	var d = this.getDate();
	var m = this.getMonth()+1;
	var y = this.getFullYear();
	return format.format((d<10?"0"+d:d),(m<10?"0"+m:m),y);
}
//Example new Date().formatTime("{0}:{1}:{2}") -> "12:48:55"
Date.prototype.formatTime = function(format){
	var format = format || "{0}:{1}:{2}";
	var h = this.getHours();
	var min = this.getMinutes();
	var s = this.getSeconds();
	return format.format((h<10?"0"+h:h),(min<10?"0"+min:min),(s<10?"0"+s:s));
}
getUrlParams = function(){
	var urlParams = {};
	var	match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
	return urlParams;
}
getUrlParam = function(name){
	var urlParams = getUrlParams();
	return urlParams[name];
}
//Classes
//Packet
function Packet(packetId, parameters){
	this.packetId = packetId;
	this.parameters = parameters || [];
}
Packet.prototype.setParam = function(paramName, paramValue){
	for(i=0;i<this.parameters.length;i++){
		var param = this.parameters[i];
		if(param.name == paramName){
			if(paramValue.length <= param.length){
				param.value = $.trim(paramValue);
				return;
			}
			alert("Parameter "+param.name+" value too long!["+paramValue.length+","+param.length+"]");
		}
	}
	alert("Parameter "+paramName+" doesn't exist!");
}
Packet.prototype.getParam = function(paramName){
	for(i=0;i<this.parameters.length;i++){
		if(this.parameters[i].name == paramName){
			return this.parameters[i].value;
		}
	}
	alert("Parameter "+paramName+" doesn't exist!");
}
Packet.prototype.toMac = function(){
	function pad(length){
    	var str = '' + length;
    	while (str.length < 3)
        	str = '0' + str;
		return str;
	}
	var macString = "";
	for(i=0;i<this.parameters.length;i++){
		var param = this.parameters[i];
		if(param.order != 0){
			macString += pad(param.value.length)+param.value;
		}
	}
	return macString;
}
//"Abstract" methods
Packet.prototype.privateKey = function(){
	alert("Not implemented!");
}
Packet.prototype.certificate = function(){
	alert("Not implemented!");
}
//Sign parameters and return URL
Packet.prototype.sign = function(){
	var rsa = new RSAKey();
	rsa.readPrivateKeyFromPEMString(MERCHANT_PRIVATE_KEY);
	var signature = rsa.signString(this.toMac(), "sha1");
	var b64 = hex2b64(signature);
	this.setParam("VK_MAC", b64);
}
//Verifiy request parameters
Packet.prototype.verify = function(){
	var x509 = new X509();
	x509.readCertPEM(MERCHANT_CERT);
	var mac = decodeURIComponent(this.getParam("VK_MAC"));
	var signature = b64tohex(mac);
	return x509.subjectPublicKeyRSA.verifyString(this.toMac(), signature);
}
Packet.prototype.html = function(){
	var result = "<table class='table table-bordered table-striped'><thead><tr><th>Parameeter</th><th>Väärtus</th></tr></thead><tbody>";
	for(i=0;i<this.parameters.length;i++){
		var param = this.parameters[i];
		if(param.name != "VK_MAC"){
			result += "<tr><td>"+param.name+"</td><td>"+param.value+"</td></tr>";
		}
	}
	result += "</tbody></table>";
	return	result;
}
Packet.prototype.queryString = function(){
	this.sign();
	var query = "?";
	for(i=0;i<this.parameters.length;i++){
		var param = this.parameters[i];
		query += param.name+"="+encodeURIComponent(param.value)+"&";
	}
	return query;
}
Packet.init = function(){
	var urlParams = getUrlParams();
	var packet;
	if(urlParams["VK_SERVICE"] != undefined){
		eval("packet = new Packet"+urlParams["VK_SERVICE"]+"();");
	}
	else{
		return null;
	} 
	for(param in urlParams){
		if(param.indexOf("VK_") == 0)
			packet.setParam(param, urlParams[param]);
	}
	return packet;
}
//RequestPacket
RequestPacket.prototype = new Packet();
RequestPacket.prototype.constructor = RequestPacket;
function RequestPacket(packetId,parameters){
	Packet.call(packetId,parameters);
	this.packetId = packetId;
	this.parameters = parameters || [];
}
RequestPacket.prototype.privateKey = function(){
	return BANK_PRIVATE_KEY;
}
RequestPacket.prototype.certificate = function(){
	return BANK_CERT;
}
//"Abstract" functions
RequestPacket.prototype.response = function(firstName, lastName, idCode){
	alert("Not implemented!");
}
//Response packet
ResponsePacket.prototype = new Packet();
ResponsePacket.prototype.constructor = ResponsePacket;
function ResponsePacket(packetId, parameters){
	Packet.call(packetId,parameters);
	this.packetId = packetId;
	this.parameters = parameters || [];
}
ResponsePacket.prototype.privateKey = function(){
	return MERCHANT_PRIVATE_KEY;
}
ResponsePacket.prototype.certificate = function(){
	return MERCHANT_CERT;
}
//PacketParameter
function PacketParameter(name, length, order, value){
	this.name = name;
	this.length = length;
	this.order = order || 0;
	this.value = value || "";
}
//Certs and keys
var MERCHANT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\
MIICWwIBAAKBgQDRhGF7X4A0ZVlEg594WmODVVUIiiPQs04aLmvfg8SborHss5gQ\
Xu0aIdUT6nb5rTh5hD2yfpF2WIW6M8z0WxRhwicgXwi80H1aLPf6lEPPLvN29EhQ\
NjBpkFkAJUbS8uuhJEeKw0cE49g80eBBF4BCqSL6PFQbP9/rByxdxEoAIQIDAQAB\
AoGAA9/q3Zk6ib2GFRpKDLO/O2KMnAfR+b4XJ6zMGeoZ7Lbpi3MW0Nawk9ckVaX0\
ZVGqxbSIX5Cvp/yjHHpww+QbUFrw/gCjLiiYjM9E8C3uAF5AKJ0r4GBPl4u8K4bp\
bXeSxSB60/wPQFiQAJVcA5xhZVzqNuF3EjuKdHsw+dk+dPECQQDubX/lVGFgD/xY\
uchz56Yc7VHX+58BUkNSewSzwJRbcueqknXRWwj97SXqpnYfKqZq78dnEF10SWsr\
/NMKi+7XAkEA4PVqDv/OZAbWr4syXZNv/Mpl4r5suzYMMUD9U8B2JIRnrhmGZPzL\
x23N9J4hEJ+Xh8tSKVc80jOkrvGlSv+BxwJAaTOtjA3YTV+gU7Hdza53sCnSw/8F\
YLrgc6NOJtYhX9xqdevbyn1lkU0zPr8mPYg/F84m6MXixm2iuSz8HZoyzwJARi2p\
aYZ5/5B2lwroqnKdZBJMGKFpUDn7Mb5hiSgocxnvMkv6NjT66Xsi3iYakJII9q8C\
Ma1qZvT/cigmdbAh7wJAQNXyoizuGEltiSaBXx4H29EdXNYWDJ9SS5f070BRbAIl\
dqRh3rcNvpY6BKJqFapda1DjdcncZECMizT/GMrc1w==\
-----END RSA PRIVATE KEY-----";
var MERCHANT_CERT="-----BEGIN CERTIFICATE-----\
MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJK\
UDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1\
MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8w\
DQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9Cz\
Thoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQ\
fVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/\
3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1\
ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/M\
LyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K\
3OK+u3ivTSj3zwjtpudY5Xo=\
-----END CERTIFICATE-----";
var BANK_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\
MIICWwIBAAKBgQDRhGF7X4A0ZVlEg594WmODVVUIiiPQs04aLmvfg8SborHss5gQ\
Xu0aIdUT6nb5rTh5hD2yfpF2WIW6M8z0WxRhwicgXwi80H1aLPf6lEPPLvN29EhQ\
NjBpkFkAJUbS8uuhJEeKw0cE49g80eBBF4BCqSL6PFQbP9/rByxdxEoAIQIDAQAB\
AoGAA9/q3Zk6ib2GFRpKDLO/O2KMnAfR+b4XJ6zMGeoZ7Lbpi3MW0Nawk9ckVaX0\
ZVGqxbSIX5Cvp/yjHHpww+QbUFrw/gCjLiiYjM9E8C3uAF5AKJ0r4GBPl4u8K4bp\
bXeSxSB60/wPQFiQAJVcA5xhZVzqNuF3EjuKdHsw+dk+dPECQQDubX/lVGFgD/xY\
uchz56Yc7VHX+58BUkNSewSzwJRbcueqknXRWwj97SXqpnYfKqZq78dnEF10SWsr\
/NMKi+7XAkEA4PVqDv/OZAbWr4syXZNv/Mpl4r5suzYMMUD9U8B2JIRnrhmGZPzL\
x23N9J4hEJ+Xh8tSKVc80jOkrvGlSv+BxwJAaTOtjA3YTV+gU7Hdza53sCnSw/8F\
YLrgc6NOJtYhX9xqdevbyn1lkU0zPr8mPYg/F84m6MXixm2iuSz8HZoyzwJARi2p\
aYZ5/5B2lwroqnKdZBJMGKFpUDn7Mb5hiSgocxnvMkv6NjT66Xsi3iYakJII9q8C\
Ma1qZvT/cigmdbAh7wJAQNXyoizuGEltiSaBXx4H29EdXNYWDJ9SS5f070BRbAIl\
dqRh3rcNvpY6BKJqFapda1DjdcncZECMizT/GMrc1w==\
-----END RSA PRIVATE KEY-----";
var BANK_CERT="-----BEGIN CERTIFICATE-----\
MIIBvTCCASYCCQD55fNzc0WF7TANBgkqhkiG9w0BAQUFADAjMQswCQYDVQQGEwJK\
UDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwHhcNMTAwNTI4MDIwODUxWhcNMjAwNTI1\
MDIwODUxWjAjMQswCQYDVQQGEwJKUDEUMBIGA1UEChMLMDAtVEVTVC1SU0EwgZ8w\
DQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANGEYXtfgDRlWUSDn3haY4NVVQiKI9Cz\
Thoua9+DxJuiseyzmBBe7Roh1RPqdvmtOHmEPbJ+kXZYhbozzPRbFGHCJyBfCLzQ\
fVos9/qUQ88u83b0SFA2MGmQWQAlRtLy66EkR4rDRwTj2DzR4EEXgEKpIvo8VBs/\
3+sHLF3ESgAhAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAEZ6mXFFq3AzfaqWHmCy1\
ARjlauYAa8ZmUFnLm0emg9dkVBJ63aEqARhtok6bDQDzSJxiLpCEF6G4b/Nv/M/M\
LyhP+OoOTmETMegAVQMq71choVJyOFE5BtQa6M/lCHEOya5QUfoRF2HF9EjRF44K\
3OK+u3ivTSj3zwjtpudY5Xo=\
-----END CERTIFICATE-----";
