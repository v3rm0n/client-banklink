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
	for(param in this.parameters)
		macString += pad(this.getParam(param).length)+this.getParam(param);
	return macString;
}
//Sign parameters and return URL
Packet.prototype.sign = function(){
	$.get("rsa/merchant_cert.cer", function(data){
		var rsa = new RSAKey();
		rsa.readPrivateKeyFromPEMString(data);
		var signature = rsa.signString(this.toMac(), "sha1");
		setParam("VK_MAC", signature);
	});
}
//Verifiy request parameters
Packet.prototype.verify = function(){
	$.get("rsa/merchant_cert.cer", function(data){
		var x509 = new X509();
		x509.readCertPEM(data);
		return x509.subjectPublicKeyRSA.verifyString(this.toMac(), this.getParam("VK_MAC"));
	});
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
