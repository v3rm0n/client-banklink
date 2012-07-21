//Predefined iPizza packets based on SEB specifications
//Authentication request 4001
Packet4001.prototype = RequestPacket.prototype;
function Packet4001(){
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,"4001"));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",15,3));
	parameters.push(new PacketParameter("VK_REPLY",4,4,"3002"));
	parameters.push(new PacketParameter("VK_RETURN",60,5));
	parameters.push(new PacketParameter("VK_DATE",10,6));
	parameters.push(new PacketParameter("VK_TIME",8,7));
	parameters.push(new PacketParameter("VK_CHARSET",10));
	parameters.push(new PacketParameter("VK_MAC",300));
	RequestPacket.call("4001", parameters);
	this.packetId = "4001";
	this.parameters = parameters;
}
Packet4001.prototype.response = function(firstName, lastName, idCode){
	var response = new Packet3002();
	response.setParam("VK_DATE", request.getParam("VK_DATE"));
	response.setParam("VK_TIME", request.getParam("VK_TIME"));
	response.setParam("VK_SND_ID", "EYP");
	response.setParam("VK_INFO", "ISIK:"+idCode+";NIMI:"+firstName+" , "+lastName);
	return response;
}
//Authentication response 3002
Packet3002.prototype = ResponsePacket.prototype;
function Packet3002(){
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,"3002"));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_USER",16,3));
	parameters.push(new PacketParameter("VK_DATE",10,4));
	parameters.push(new PacketParameter("VK_TIME",8,5));
	parameters.push(new PacketParameter("VK_SND_ID",15,6));
	parameters.push(new PacketParameter("VK_INFO",300,7));
	parameters.push(new PacketParameter("VK_CHARSET",10));
	parameters.push(new PacketParameter("VK_MAC",300));
	RequestPacket.call("3002", parameters);
	this.packetId = "3002";
	this.parameters = parameters;
}