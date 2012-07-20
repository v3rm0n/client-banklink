(function() {
	//Initialize
	$(function(){
		var request = Packet.initFromRequest();
		var action = request.getParameterValue("VK_RETURN");
		var params = [];
		response = new Packet("3003",params);
		$("#bankForm").attr("action",action);
	});

	//Classes
	//Packet
	function Packet(packetId, parameters){
		this.packetId = packetId;
		this.parameters = parameters || [];
	}
	Packet.prototype.getParameters = function(){
		return this.parameters;
	}
	Packet.prototype.setParameterValue = function(paramName, paramValue){
		this.parameters[paramName] = paramValue;
	}
	Packet.prototype.getParameterValue = function(paramName){
		return this.parameters[paramName];
	}
	Packet.initFromRequest = function(){
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
				packet.setParameterValue(param,urlParams[param]);
		}
		return packet;
	}
}());
