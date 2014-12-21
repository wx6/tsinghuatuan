var lastSelect;

function commitVote() {
    var name_list = generateVoteNames();
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
    var options = generateOptions();
    $('#voteItem').ajaxSubmit(options);
    return false;
} 

function generateVoteNames()
{
    var name_list = "您要投的是：";
    var names = $(".voteitem");
    var votes = $("input");
    for(var i = 0; i < names.length; i++){
        if(votes[i].checked)
            name_list += names[i].innerHTML + ","
    }
    name_list = name_list.substring(0, name_list.length-1);
    return name_list;
}

function generateOptions()
{
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
                alert("网络错误")
        }
    };
    return options;
}

function successLoad(data)
{
    $("button").remove();
    $(".checkbox").remove();
    location.reload(true);
}


function addImg()
{
    for (var count = 0; count < vote_items.length;count++)
    {
        $(".itemimg")[count].src = vote_items[count].pic_url;
    }
}


function addCheckBox()
{
     for (var count = 0; count < vote_items.length;count++)
    {
        var item = vote_items[count];
        var checkboxTag = "<input type ='checkbox' name="+item.id+" id='"+item.id+"'";
        var onclickTag = "onclick = "+"CookieOnSelect(this.id)>";
        var labelTag = "<label for="+item.id+"></label>";
        $($(".addcheckbox")[count]).append("<div class = 'checkbox'>"+checkboxTag+onclickTag+labelTag + "</div>");
    }
}

// function createSingalCheckBox(count,line,vote_items)
// {
//     var item = vote_items[count];
//     var checkboxTag = "<input type ='checkbox' name="+item.id+" id='"+item.id+"'";
//     var onclickTag = "onclick = "+"CookieOnSelect(this.id)>";
//     var labelTag = "<label for="+item.id+"></label>";
//     var cb = "";
//     switch(count % line)
//     {
//         case 0: 
//             td = "<tr><td><div class = 'checkbox'>"+checkboxTag+onclickTag+labelTag + "</div></td>";
//             break;
//         case 1:
//             td =  "<td><div class = 'checkbox'>"+checkboxTag+onclickTag+labelTag + "</div></td>";
//             break;
//         case (line-1):
//             td = "<td><div class = 'checkbox'>"+checkboxTag+onclickTag+labelTag + "</div></td></tr>";
//             break;
//         default:
//             td = "<td><div class = 'checkbox'>"+checkboxTag+onclickTag+labelTag + "</div></td>";
//             break;

//        }
//     return td;
// }



function addVoteNumber()
{
    for (var count = 0; count < vote_items.length;count++)
    {
        var item = vote_items[count];
        $(".votes2")[count].innerHTML =  "人气:"+item.vote_num;
    }
}


function createBasicVoteItem()
{
    var newHtml = "";
    var newCb = "";
    var newVotes = "";
    var blankDiv ="<div style='height:1px;'></div>"
    var blankCheckBox = "<tr><td class='addcheckbox'></td><td class='addcheckbox'></td><td class='addcheckbox'></td></tr>"
    for (count = 0;count < vote_items.length;count++)
    {
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml+blankDiv+newCb+blankCheckBox+newVotes);
           newHtml = "";
           newCb = "";
           newVotes = "";
       }
       newHtml += createSingalItem(count,line,vote_items);
       newCb += createSingalItemName(count,line,vote_items);
       newVotes += createSingalVotes(count,line,vote_items);
    }
    if(count % line != 0)
    {
        newHtml += "</tr>";
        newCb += "</tr>";
        newVotes += "</tr>";
    }
    if(newHtml)
    {
        $("table").append(newHtml+blankDiv+newCb+blankCheckBox+newVotes);
        newHtml = "";
        newCb = "";
        newVotes = "";
    }
}

function createSingalVotes(count,line,vote_items)
{
    var left = 2.5;
    var item = vote_items[count];
    var voteTag =  "<p class='votes2'></p>";

    var td = "<td>"+voteTag+"</td>";

    switch(count % line)
    {
        case 0:
            td = "<tr>" + td; 
            //td = "<tr><td style='position:relative;left:"+left+"%;'>"+voteTag+"</td>";
            break;
        case 1:
            //td =  "<td style='position:relative;left:"+left+"%;'>"+voteTag+"</td>";
            break;
        case (line-1):
            td = td + "</tr>";
            //td = "<td style='position:relative;left:"+left+"%;'>"+voteTag+"</td></tr>";
            break;
        default:
            //td = "<td style='position:relative;left:"+left+"%;'>"+voteTag+"</td>";
            break;
       }
    return td;
}

function createSingalItemName(count,line,vote_items)
{
    var left = 2.5;
    var item = vote_items[count];
    var nameTag =  "<p class='voteitem'>"+item.name+"</p>";

    var td = "<td>"+nameTag+"</td>";

    switch(count % line)
    {
        case 0:
            td = "<tr>" + td; 
            //td = "<tr><td style='position:relative;left:"+left+"%;'>"+nameTag+"</td>";
            break;
        case 1:
            //td =  "<td style='position:relative;left:"+left+"%;'>"+nameTag+"</td>";
            break;
        case (line-1):
            td = td + "</tr>";
            //td = "<td style='position:relative;left:"+left+"%;'>"+nameTag+"</td></tr>";
            break;
        default:
            //td = "<td style='position:relative;left:"+left+"%;'>"+nameTag+"</td>";
            break;
       }
    return td;
}

function createSingalItem(count,line,vote_items)
{
    var item = vote_items[count];
    var imgTag =  "<img class='itemimg' style = '"+"width:"+size+"px;height:"+size+"px;'/>";
    var selectedImgTag = "<img src='"+selectedImg+"' style='opacity=0.5;'>"+"</img>";
    
    var td =  "<td><div class='table' style='position:relative;'>"+imgTag+"</div>" 
            + "<div style='position:relative;bottom:-"+(size)+"px;margin-bottom:-"+(size)+"px;z-index=2;'>" + selectedImgTag + "</div>" + "</td>";

    switch(count % line)
    {
        case 0: 
            td = "<tr>" + td;
            // td = "<tr><td style='position:relative;left:"+left+"%;'><div class="+"table"+">"+imgTag+selectedImgTag+"<br></br><span class='votes'></span></div></td>";
            break;
        case 1:
            // td =  "<td style='position:relative;left:"+left+"%;'><div class="+"table"+">"+imgTag+selectedImgTag+"<br></br><span class='votes'></span></div></td>";
            break;
        case (line-1):
            td = td + "</tr>";
            //td = "<td style='position:relative;left:"+left+"%;'><div class="+"table"+">"+imgTag+selectedImgTag+"<br></br><span class='votes'></span></div></td></tr>";
            break;
        default:
            // td = "<td style='position:relative;left:"+left+"%;'><div class="+"table"+">"+imgTag+selectedImgTag+"<br></br><span class='votes'></span></div></td>";
            break;
    }
    return td;
}

function adjustImg()
{
    // var img = $(".itemimg");
    // for(var i = 0; i < img.length; i++){
    //     img[i].style.width = document.body.clientWidth * 0.3+"px";
    //     img[i].style.height = document.body.clientWidth * 0.3+"px";
    // }
    var table = $(".table")
    for(var i = 0; i < table.length; i++){
        table[i].style.height = document.body.clientWidth * 0.3+"px";
    }
}

function onCreate_ended()
{
    $("#info")[0].innerHTML = "投票活动已经结束，点击名称查看详情。"
    $("button").remove();
    createBasicVoteItem();
    adjustImg();
    addVoteNumber();
    addImg();
}

function onCreate_unstarted()
{
    $("#info")[0].innerHTML = "活动尚未开始，点击名称查看详情。" 
    $("button").remove();
    var size = document.body.clientWidth * 0.3;
    createBasicVoteItem();
    adjustImg();
    addImg();
}

function onCreate_unvoted(){
    $("#info")[0].innerHTML = "您可以投" + maxVote + "项，点击名称查看详情"
    $("button").show();
    createBasicVoteItem();
    adjustImg();
    $(".table span").html("");
    CookieOnLoad();
    addVoteNumber();
    addCheckBox();
    addImg();
}

function onCreate_voted(){
    var name_list = generateVoteNames();
    $("#info")[0].innerHTML = "您已经投了："+name_list+"，点击名称查看详情。"
    $("button").remove();
    createBasicVoteItem();
    adjustImg();
    addVoteNumber();
    addImg();
}

function onCreate(){
    if(started == 0)
    {
        console.log("test point 1");
        onCreate_unstarted();
    }
    else if(ended == 1)
    {
        console.log("test point 2");
        onCreate_ended()
    }
    else if(voted == 0)
    {
        console.log("test point 3");
        onCreate_unvoted();
    }
    else
    {
        console.log("test point 4");
        onCreate_voted();
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
        return(value);                           //对它解码 
    }
    else{
        return("");
    }
}

function CookieOnLoad(){
    var consult = findcookie("activityID");
    if(consult != voteId)
        initCookie(voteId, vote_items);
    else
        loadCookie();
}

function initCookie(id, items){
    var n = "activityID=" + id;
    document.cookie = n;
    for (var i = 0; i < items.length; i++){
        document.cookie = items[i].id + "=false";
    }
}

function loadCookie(){
    votenum = 0;
    var form = document.getElementsByTagName("Input");
    for(var i = 0; i < form.length; i++){
        consult = findcookie(form[i].id);
        if(consult == "true" && votenum < maxVote){
            form[i].checked = true;
            lastSelect = form[i].id;
            votenum++;
        }
    }
}

function CookieOnSelect(id){
//    var consult = findcookie(id);
//    if(consult == "true"){
//        document.cookie = escape(id) + "=false";
//        votenum--;
//    }
//    else{
//        if(votenum >= maxVote)
//            voteNumOverflow(maxVote,id);
//        else{
//            lastSelect = id;
//            document.cookie = escape(id) + "=true";
//            votenum++;
//        }
//    }
    var input = document.getElementById(id);
    document.cookie = escape(id) + "=" + input.checked;
    votenum += input.checked? 1 : -1;
    if(votenum > maxVote)
        voteNumOverflow(maxVote,id);
    else
        lastSelect = id;
}

function orientationChange() { 
        adjustImg();
    };

function voteNumOverflow(vtLim,id){
    if(maxVote == 1){
        var input = document.getElementById(lastSelect);
        input.checked = false;
        document.cookie = escape(lastSelect) + "=false";
        document.cookie = escape(id) + "=true";
        lastSelect = id;
        votenum--;
    }
    else{
        var input = document.getElementById(id);
        input.checked = false;
        votenum--;
        alert("您的投票数已经达到上限！");
    }
}

// 初始化WeixinApi，等待分享
WeixinApi.ready(function(Api) {

    // 微信分享的数据
    var wxData = {
        "appId": "wxa04c8f42f836340b", // 服务号可以填写appId
        "imgUrl" : vote_pic_url,
        "link" : 'http://mp.weixin.qq.com/s?__biz=MzA5MjEzOTQwNA==&mid=201830666&idx=1&sn=018376ab9e5b5fc6aedb3c56ee5e3db4#rd',
        "desc" : vote_description,
        "title" : vote_name
    };

    // 分享的回调
    var wxCallbacks = {
        // 收藏操作不执行回调，默认是开启(true)的
        favorite : false,

        // 分享操作开始之前
        ready : function() {
            // 你可以在这里对分享的数据进行重组
        },
        // 分享被用户自动取消
        cancel : function(resp) {
            // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
        },
        // 分享失败了
        fail : function(resp) {
            // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
            alert("分享失败，msg=" + resp.err_msg);
        },
        // 分享成功
        confirm : function(resp) {
            // 分享成功了，我们是不是可以做一些分享统计呢？
        },
        // 整个分享过程结束
        all : function(resp,shareTo) {
            // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
        }
    };

    // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
    Api.shareToFriend(wxData, wxCallbacks);

    // 点击分享到朋友圈，会执行下面这个代码
    Api.shareToTimeline(wxData, wxCallbacks);

    // 点击分享到腾讯微博，会执行下面这个代码
    Api.shareToWeibo(wxData, wxCallbacks);

    // iOS上，可以直接调用这个API进行分享，一句话搞定
    Api.generalShare(wxData,wxCallbacks);
});

onCreate();

// 添加事件监听 
addEventListener('load', function(){ 
    orientationChange(); 
    //window.onorientationchange = orientationChange; 
    //setTimeout(function(){ window.scrollTo(0, 1); }, 100);
});