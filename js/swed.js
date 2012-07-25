//Predefined bank link packets according to Swedbank specifications
//Common variables
var SND_ID = "HP";
var SND_ACC = "22101234567";
var SND_NAME = "Maksja Nimi";
//Authentication services
var INFO_FORMAT = "ISIK:{0};NIMI:{1} {2}";
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
	//TODO: VK_DATE and VK_TIME should be generated not read from request
	response.setParam("VK_DATE", this.getParam("VK_DATE"));
	response.setParam("VK_TIME", this.getParam("VK_TIME"));
	response.setParam("VK_SND_ID", SND_ID);
	response.setParam("VK_LANG", this.getParam("VK_LANG"));
	response.setParam("VK_ENCODING", this.getParam("VK_ENCODING"));
	response.setParam("VK_INFO", INFO_FORMAT.format(idCode, firstName, lastName));
	response.sign();
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
	ResponsePacket.call(packetId, parameters);
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
	response.setParam("VK_REC_ID", this.getParam("VK_SND_ID"));
	response.setParam("VK_NONCE", this.getParam("VK_NONCE"));
	response.setParam("VK_LANG", this.getParam("VK_LANG"));
	response.setParam("VK_ENCODING", this.getParam("VK_ENCODING"));
	response.setParam("VK_INFO", INFO_FORMAT.format(idCode, firstName, lastName));
	response.sign();
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
	ResponsePacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
//Payment services
//Payment request 1001
Packet1001.prototype = new RequestPacket();
Packet1001.prototype.constructor = Packet1001;
function Packet1001(){
	var packetId = "1001";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_STAMP",20,4));
	parameters.push(new PacketParameter("VK_AMOUNT",17,5));
	parameters.push(new PacketParameter("VK_CURR",3,6));
	parameters.push(new PacketParameter("VK_ACC",16,7));
	parameters.push(new PacketParameter("VK_NAME",30,8));
	parameters.push(new PacketParameter("VK_REF",20,9));
	parameters.push(new PacketParameter("VK_MSG",70,10));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_RETURN",60));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
Packet1001.prototype.response = function(success, auto){
	if(success){
		var response = new Packet1101();
		response.setParam("VK_SND_ID", SND_ID);
		response.setParam("VK_REC_ID", this.getParam("VK_SND_ID"));
		response.setParam("VK_STAMP", this.getParam("VK_STAMP"));
		//VK_T_NO maksekorralduse number
		response.setParam("VK_AMOUNT", this.getParam("VK_AMOUNT"));
		response.setParam("VK_CURR", this.getParam("VK_CURR"));
		response.setParam("VK_REC_ACC", this.getParam("VK_ACC"));
		response.setParam("VK_REC_NAME", this.getParam("VK_NAME"));
		response.setParam("VK_SND_ACC", SND_ACC);
		response.setParam("VK_SND_NAME", SND_NAME);
		response.setParam("VK_REF", this.getParam("VK_REF"));
		response.setParam("VK_MSG", this.getParam("VK_MSG"));
		//VK_T_DATE
		response.setParam("VK_LANG", this.getParam("VK_LANG"));
		response.setParam("VK_AUTO", auto ? "Y":"N");
		response.setParam("VK_ENCODING", this.getParam("VK_ENCODING"));
		response.sign();
		return response;
	}
	else {
		var response = new Packet1901();
		return response;
	}
}
//Payment request 1002
Packet1002.prototype = new RequestPacket();
Packet1002.prototype.constructor = Packet1002;
function Packet1002(){
	var packetId = "1002";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_STAMP",20,4));
	parameters.push(new PacketParameter("VK_AMOUNT",17,5));
	parameters.push(new PacketParameter("VK_CURR",3,6));
	parameters.push(new PacketParameter("VK_REF",20,7));
	parameters.push(new PacketParameter("VK_MSG",70,8));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_RETURN",60));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
//Payment response 1101
Packet1101.prototype = new RequestPacket();
Packet1101.prototype.constructor = Packet1101;
function Packet1101(){
	var packetId = "1101";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_REC_ID",10,4));
	parameters.push(new PacketParameter("VK_STAMP",20,5));
	parameters.push(new PacketParameter("VK_T_NO",5,6));
	parameters.push(new PacketParameter("VK_AMOUNT",17,7));
	parameters.push(new PacketParameter("VK_CURR",3,8));
	parameters.push(new PacketParameter("VK_REC_ACC",16,9));
	parameters.push(new PacketParameter("VK_REC_NAME",30,10));
	parameters.push(new PacketParameter("VK_SND_ACC",16,11));
	parameters.push(new PacketParameter("VK_SND_NAME",40,12));
	parameters.push(new PacketParameter("VK_REF",20,13));
	parameters.push(new PacketParameter("VK_MSG",70,14));
	parameters.push(new PacketParameter("VK_T_DATE",10,15));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_AUTO",1));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
//Payment response 1901
Packet1901.prototype = new RequestPacket();
Packet1901.prototype.constructor = Packet1901;
function Packet1901(){
	var packetId = "1901";
	var parameters = [];
	parameters.push(new PacketParameter("VK_SERVICE",4,1,packetId));
	parameters.push(new PacketParameter("VK_VERSION",3,2,"008"));
	parameters.push(new PacketParameter("VK_SND_ID",10,3));
	parameters.push(new PacketParameter("VK_REC_ID",10,4));
	parameters.push(new PacketParameter("VK_STAMP",20,5));
	parameters.push(new PacketParameter("VK_REF",20,6));
	parameters.push(new PacketParameter("VK_MSG",70,7));
	parameters.push(new PacketParameter("VK_MAC",700));
	parameters.push(new PacketParameter("VK_LANG",3));
	parameters.push(new PacketParameter("VK_AUTO",1));
	parameters.push(new PacketParameter("VK_ENCODING",10));
	RequestPacket.call(packetId, parameters);
	this.packetId = packetId;
	this.parameters = parameters;
}
