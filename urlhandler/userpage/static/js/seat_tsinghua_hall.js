function setTableId(){
	var tds = document.getElementsByTagName("td")
	var i = 0
	for (i = 0; i < tds.length; i++){
		tds[i].id = i
	}
}

function commitSeat() {
    var options = {
        dataType: 'json',
        success: function (data) {
        	console.log(data)
        	console.log(data.error==null)
        	if(data.error==null)
        	{
        		$("#success").show()
            	$("#seatArea").hide()	
            }
            else
            {
   				console.log("error");
            	$("#failure").show()
    			$("#seatArea").hide()
            }
		},
        error: function (xhr) {
    		$("#failure").show()
    		$("#seatArea").hide()									
    	}
    };
    $('#seatForm').ajaxSubmit(options);
    return false;
}


function changeState(id){
	var td = document.getElementById(id)
	if(td.className == 1){
		if(lastid != -1){
		var ltd = document.getElementById(lastid)
		ltd.className = 1
		ltd.innerHTML = "<span></span><img src='http://wx6.igeek.asia/static1/img/selectable.png' style='width:25px;height:20px;'/>"
		}
		td.className = 3
		td.innerHTML = "<span></span><img src='http://wx6.igeek.asia/static1/img/selected.png' style='width:25px;height:20px;'/>"
		lastid = id
		changeRecord(id)
	}
	return false;
}

function changeRecord(id){
	row = parseInt(1 + id / length)
	column = 1 + id % length 
	 $("#seatForm [name=row]")[0].value = row;
	 $("#seatForm [name=column]")[0].value = column;
}

setTableId()
var length = 10
var row = 0, column = 0
var lastid = -1 
$(".1").append("<img src= 'http://wx6.igeek.asia/static1/img/selectable.png'  style='width:25px;height:20px;'/>")
$(".2").append("<img src= 'http://wx6.igeek.asia/static1/img/unselectable.png' style='width:25px;height:20px;'/>")
$(".3").append("<img src= 'http://wx6.igeek.asia/static1/img/selected.png' style='width:25px;height:20px;'/>")
$(".4").append("<img src= 'http://wx6.igeek.asia/static1/img/lastselect.png'  style='width:25px;height:20px;'/>")
