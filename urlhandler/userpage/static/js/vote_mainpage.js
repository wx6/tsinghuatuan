var vote_counter;

function commitVote() {
    if(lastid == -1)
    {
        $("#hint")[0].innerHTML = "投票数目过多或者过少"
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


function onCreate(){
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
            td1 = "<tr><td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label></div><span>人气:"+item.vote_num+"</span></div></td>"
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
}

onCreate();

function addcookie(){
    document.cookie="key=helloWorld"
    document.cookie="key1=Hi"
}

function alertcookie () {
    var name = escape("key")
    name += "="
    var allcookies = document.cookie
    var pos = document.cookie.indexOf(name)
    if(pos != -1){
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start,end); //提取cookie的值  
        alert(value)                           //对它解码 
    }
    else{
        alert("ff")
    }
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
    if(consult != vote.name){
        var cookie = "activityName=" + escape(vote.name);
        for item in vote_items{
            key = escape(vote_items.id);
            key += "False";
            cookie += key;
        }
        document.cookie = cookie;
    }
    else{
        vote_counter = 0;
        var form = document.getElementsByTagName("Input");
        for item in form{
            consult = findcookie(item.id);
            if(consult == "True"){
                item.checked = true;
                vote_counter++;
            }
        }
    }
}

function CookieOnSelect(id){
    var consult = findcookie(id);
    if(consult == "True"){
        document.cookie = escape(id) + "=False";
        vote_counter--;
    }
    else{
        document.cookie = escape(id) + "=True";
        vote_counter++;
    }
}