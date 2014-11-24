function setTableId(){
	var tds = document.getElementsByTagName("td")
	var i = 0
	for (i = 0; i < tds.length; i++){
		tds[i].id = i
	}
}

function changeState(id){
	var td = document.getElementById(id)
	if(td.className == 1){
		if(lastid != -1){
		var ltd = document.getElementById(lastid)
		ltd.className = 1
		ltd.innerHTML = "<span></span><img src='../img/可选座位.png' style='width:100px;height:85px;'/>"
		}
		td.className = 3
		td.innerHTML = "<span></span><img src='../img/选择座位.png' style='width:100px;height:85px;'/>"
		lastid = id
	}
	changeRecord(id)
}

function changeRecord(id){
	row = parseInt(1 + id / length)
	column = 1 + id % length 
}

setTableId()
var length = 10
var row = 0, column = 0
var lastid = -1 
$(".1").append("<img src= '../img/可选座位.png'  style='width:100px;height:85px;'/>")
$(".2").append("<img src= '../img/不可选座位.png'  style='width:100px;height:85px;'/>")
$(".3").append("<img src= '../img/选择座位.png'  style='width:100px;height:85px;'/>")
$(".4").append("<img src= '../img/上次选择座位.png'  style='width:100px;height:85px;'/>")