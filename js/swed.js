//Predefined bank link packets according to Swedbank specifications
//Common variables
var SND_ID = "HP";
var INFO_FORMAT = "ISIK:{0};NIMI:{1} , {2}";
//Authentication request 4001
Packet4001.prototype = new RequestPacket();
Packet4001.prototype.constructor = Packet4001;
function Packet4001(){
	var packetId = "4001";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_REPLY",4,4,"3002"));
	parameters.push(new PacketParameter("VK_RETURN",60,5));
	parameters.push(new PacketParameter("VK_DATE",10,6));
	parameters.push(new PacketParameter("VK_TIME",8,7));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
Packet4001.prototype.response = function(firstName, lastName, idCode){
	var response = new Packet3002();
	response.setParam("VK_DATE", request.getParam("VK_DATE"));
	response.setParam("VK_TIME", request.getParam("VK_TIME"));
	response.setParam("VK_SND_ID", SND_ID);
	response.setParam("VK_INFO", INFO_FORMAT.format(idCode, firstName, lastName));
	return response;
}
//Authentication response 3002
Packet3002.prototype = new ResponsePacket;
Packet3002.prototype.constructor = Packet3002;
function Packet3002(){
	var packetId = "3002";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_USER",16,3));
	parameters.push(new PacketParameter("VK_DATE",10,4));
	parameters.push(new PacketParameter("VK_TIME",8,5));
	parameters.push(new PacketParameter("VK_SND_ID",10,6));
	parameters.push(new PacketParameter("VK_INFO",300,7));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
//Authentication request 4002
Packet4002.prototype = new RequestPacket();
Packet4002.prototype.constructor = Packet4002;
function Packet4002(){
	var packetId = "4002";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_REC_ID",10,4));
	parameters.push(new PacketParameter("VK_NONCE",50,5));
	parameters.push(new PacketParameter("VK_RETURN",150,6));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
Packet4002.prototype.response = function(firstName, lastName, idCode){
	var response = new Packet3003();
	response.setParam("VK_SND_ID", SND_ID);
	response.setParam("VK_REC_ID", request.getParam("VK_SND_ID"));
	response.setParam("VK_NONCE", request.getParam("VK_NONCE"));
	response.setParam("VK_INFO", INFO_FORMAT.format(idCode, firstName, lastName));
	return response;
}
//Authentication response 3002
Packet3003.prototype = new ResponsePacket();
Packet3003.prototype.constructor = Packet3003;
function Packet3003(){
	var packetId = "3003";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_REC_ID",10,4));
	parameters.push(new PacketParameter("VK_NONCE",50,5));
	parameters.push(new PacketParameter("VK_INFO",300,6));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}