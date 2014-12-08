var lastSelect;

function commitVote() {
    var name_list = "您选择了：";
    var names = $(".voteitem");
    var votes = $("input");
    for(var i = 0; i < names.length; i++){
        if(votes[i].checked)
            name_list += names[i].innerHTML + ","
    }
    name_list[name_list.length - 1] = "."
	if(confirm(name_list))
        ;
	else{
   	    return false;
	}
    if(votenum <=0 || votenum > maxVote)
    {
        $("#hint")[0].innerHTML = "请投票后再提交"
        return false
    }
    var options = {
        dataType: 'json',
        success: function (data) {
            if(data.error==null)
            {
                $("#success").show()
                $("#voteArea").hide()   
            }
            else
            {
                $("#errorinfo")[0].innerHTML = data.error
                $("#failure").show()
                $("#voteArea").hide()
            }
        },
        error: function (xhr) {
            if(data.error == null)
            {
                $("#errorinfo")[0].innerHTML = "网络错误"
            }
            else
            {
                 $("#errorinfo")[0].innerHTML = data.error
            }
            $("#failure").show()
            $("#voteArea").hide()                                   
        }
    };
    $('#voteItem').ajaxSubmit(options);
    return false;
} 


function onCreate_unvoted(){
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
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
            td1 = "<tr><td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem;>"+item.name+"</p><div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+" onclick = "+"CookieOnSelect(this.id)"+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
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
    CookieOnLoad();
}

function onCreate_voted(){
    var line = 3;
    var count = 0;
    var newHtml = "";
    var td1,td2,td3;
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
            td1 = "<tr><td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem'>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<p class='voteitem;>"+item.name+"</p><span>人气:"+item.vote_num+"</span></div></td>"
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
    $("button").remove();
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
}

function onCreate(){
    if(voted == 0)
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
        return(value)                           //对它解码 
    }
    else{
        return("")
    }
}

function CookieOnLoad(){
    var name = "activityName";
    var consult = findcookie(name);
    var key = "";
    if(consult != ""+vote_name){
        document.cookie = "activityName=" + vote_name;
        for (var i = 0; i < vote_items.length; i++){
            document.cookie = vote_items[i].id += "=False";
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
