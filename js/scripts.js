//Classes
//Packet
function Packet(packetId, parameters){
	this.packetId = packetId;
	this.parameters = parameters || [];
}
Packet.prototype.getParams = function(){
	return this.parameters;
}
Packet.prototype.setParam = function(paramName, paramValue){
	this.parameters[paramName] = paramValue;
}
Packet.prototype.getParam = function(paramName){
	return this.parameters[paramName];
}
Packet.prototype.toMac = function(){
	function pad(length) {
    	var str = '' + length;
    	while (str.length < 3)
        	str = '0' + str;
		return str;
	}
	var macString = "";
	for(param in this.parameters){
		if(param != "VK_MAC")
			macString += pad(this.getParam(param).length)+this.getParam(param);
	}
	return macString;
}
//Sign parameters and return URL
Packet.prototype.sign = function(){
	var rsa = new RSAKey();
	rsa.readPrivateKeyFromPEMString(MERCHANT_PRIVATE_KEY);
	var signature = rsa.signString(this.toMac(), "sha1");
	this.setParam("VK_MAC", signature);
}
//Verifiy request parameters
Packet.prototype.verify = function(){
	var x509 = new X509();
	x509.readCertPEM(MERCHANT_CERT);
	return x509.subjectPublicKeyRSA.verifyString(this.toMac(), this.getParam("VK_MAC"));
}
Packet.prototype.html = function(){
	var 	result = "<table class='table table-bordered table-striped'><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>";
		for(param in this.parameters)
			result += "<tr><td>"+param+"</td><td>"+this.parameters[param]+"</td></tr>";
		result += "</tbody></table>";
	return	result;
}
Packet.prototype.queryString = function(){
	this.sign();
	var query = "?";
	for(param in this.getParams())
		query += param+"="+this.getParam(param)+"&";
	return query;
}
Packet.init = function(){
	var urlParams = {};
    	var	match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
	var packet = new Packet(urlParams['VK_SERVICE']);
	for(param in urlParams){
		if(param.indexOf("VK_") == 0)
			packet.setParam(param,urlParams[param]);
	}
	return packet;
}
//Certs and stuff
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
