var lastSelect;

function commitVote() {
    var name_list = "您要投的是：";
    var names = $(".voteitem");
    var votes = $("input");
    for(var i = 0; i < names.length; i++){
        if(votes[i].checked)
            name_list += names[i].innerHTML + ","
    }
    name_list = name_list.substring(0, name_list.length-1);
	if(votenum <=0 )
    {
		alert("请投票之后再提交")
        return false
    }
    if(confirm(name_list))
        ;
    else{
        return false;
    }
    
    var options = {
        dataType: 'json',
        success: function (data) {
            if(data.error==null)
            {
				successLoad(data);
            }
            else
            {
                alert(data.error)
            }
        },
        error: function (xhr) {
            if(xhr.error == null)
            {
                alert("网络错误")
            }
            else
            {
                 alert("网络错误")
            }
        }
    };
    $('#voteItem').ajaxSubmit(options);
    return false;
} 

function successLoad(data)
{
	$("button").remove();
	$(".checkbox").remove();
    /*
	var item = data.items;
	for(var i = 0; i < item.length;i++)
	{
		$(".table span")[i].innerHTML = "人气:"+item[i].vote_num;
	}
    var name_list = "";
    for(var i = 0; i < item.length; i++){
        if(item[i].voted == 1)
        {
            name_list += item[i].name+"、";
        }
    }
    name_list = name_list.substring(0,name_list.length-1)

    $("#info")[0].innerHTML = "您已经投了："+name_list+"，点击图片查看详情。"
    */

	location.reload(true);
}

function onCreate_ended()
{
    $("#info")[0].innerHTML = "投票活动已经结束，点击图片查看详情。"
    $("button").remove();
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
    var size = document.body.clientWidth * 0.3;
    for (count = 0;count < vote_items.length;count++)
    {
        var item = vote_items[count];
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml);
           newHtml = "";
       }
       switch(count % line)
       {
        case 0: 
            td1 = "<tr><td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem;>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
       }
    }
    if(count % line != 0)
        newHtml += "</tr>";
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = "";
    }
    var img = $("a img");
    for(var i = 0; i < img.length; i++){
        img[i].style.width = document.body.clientWidth * 0.3;
        img[i].style.height = document.body.clientWidth * 0.3;
    }
}

function onCreate_unstarted()
{
    $("#info")[0].innerHTML = "活动尚未开始，点击图片查看详情。" 
    $("button").remove();
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
    var size = document.body.clientWidth * 0.3;
    for (count = 0;count < vote_items.length;count++)
    {
        var item = vote_items[count];
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml);
           newHtml = "";
       }
       switch(count % line)
       {
        case 0: 
            td1 = "<tr><td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span></span></div></td>"
            newHtml +=
             td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span></span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span></span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem;>"+item.name+"</p><span></span></div></td>"
            newHtml += td2;
            break;
       }
    }
    if(count % line != 0)
        newHtml += "</tr>";
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = "";
    }
    var img = $("a img");
    for(var i = 0; i < img.length; i++){
        img[i].style.width = document.body.clientWidth * 0.3;
        img[i].style.height = document.body.clientWidth * 0.3;
    }
}

function onCreate_unvoted(){
    $("#info")[0].innerHTML = "您可以投" + maxVote + "项，点击图片查看详情"
	$("button").show();
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
    var size = document.body.clientWidth * 0.3;
    for (count = 0;count < vote_items.length;count++)
    {
        var item = vote_items[count];
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml);
           newHtml = "";
       }
       switch(count % line)
       {
        case 0: 
            td1 = "<tr><td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem;>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
       }
    }
    if(count % line != 0)
        newHtml += "</tr>";
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = "";
    }
    var img = $("a img");
    for(var i = 0; i < img.length; i++){
        img[i].style.width = document.body.clientWidth * 0.3;
        img[i].style.height = document.body.clientWidth * 0.3;
    }
	$(".table span").html("");
    CookieOnLoad();
}

function onCreate_voted(){
    var name_list = "";
    for(var i = 0; i < vote_items.length; i++){
        if(vote_items[i].voted == 1)
        {
            name_list += vote_items[i].name+"、";
//            $($(".table")[i]).append("<p>已投票<p>")
        }
    }
    name_list = name_list.substring(0,name_list.length-1)
    $("#info")[0].innerHTML = "您已经投了："+name_list+"，点击图片查看详情。"
    $("button").remove();
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
    var size = document.body.clientWidth * 0.3;
    for (count = 0;count < vote_items.length;count++)
    {
        var item = vote_items[count];
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml);
           newHtml = "";
       }
       switch(count % line)
       {
        case 0: 
            td1 = "<tr><td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href=" + item.url + "><img src = "+ item.pic_url +" style = "+"width:"+size+"px;height:"+size+"px></a> "+"<p class='voteitem;>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
       }
    }
    if(count % line != 0)
        newHtml += "</tr>";
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = "";
    }

    var img = $("a img");
    for(var i = 0; i < img.length; i++){
        img[i].style.width = document.body.clientWidth * 0.3;
        img[i].style.height = document.body.clientWidth * 0.3;
    }
}

function onCreate(){
    if(started == 0)
    {
        onCreate_unstarted();
    }
    else if(ended == 1)
    {
        onCreate_ended()
    }
    else if(voted == 0)
        onCreate_unvoted();
    else
        onCreate_voted();
}

function findcookie (key) {
    var name = escape(key);
    name += "=";
    var allcookies = document.cookie;
    var pos = document.cookie.indexOf(name)
    if(pos != -1){
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start,end); //提取cookie的值  
        return(value);                           //对它解码 
    }
    else{
        return("");
    }
}

function CookieOnLoad(){
    var name = "activityID";
    var consult = findcookie(name);
    var key = "";
    if(consult != voteId){
        var n = "activityID=" + voteId;
        document.cookie = n;
        for (var i = 0; i < vote_items.length; i++){
            document.cookie = vote_items[i].id + "=False";
        }
    }
    else{
        votenum = 0;
        var form = document.getElementsByTagName("Input");
        for(var i = 0; i < form.length; i++){
            consult = findcookie(form[i].id);
            if(consult == "True"){
                form[i].checked = true;
                lastSelect = form[i].id;
                votenum++;
                if(votenum >= maxVote)
                    break;
            }
        }
    }
}

function CookieOnSelect(id){
    var consult = findcookie(id);
    if(consult == "True"){
        document.cookie = escape(id) + "=False";
        votenum--;
    }
    else{
        if(votenum >= maxVote){
            if(maxVote == 1){
                var input = document.getElementById(lastSelect);
                input.checked = false;
                document.cookie = escape(lastSelect) + "=False";
                document.cookie = escape(id) + "=True";
                lastSelect = id;
            }
            else{
                var input = document.getElementById(id);
                input.checked = false;
                alert("您的投票数已经达到上限！");
            }
        }
        else{
            lastSelect = id;
            document.cookie = escape(id) + "=True";
            votenum++;
        }
    }
}

onCreate();
