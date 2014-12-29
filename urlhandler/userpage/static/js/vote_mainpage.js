var lastSelect;

function commitVote() {
    var name_list = generateVoteNames();
    if(votenum <= 0) {
        alert("请投票之后再提交");
        return false;
    }
    var conf = confirm(name_list);
    if (conf == false) {
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
    var votes = $(".item-val");
    for(var i = 0; i < names.length; i++) {
        if($(votes[i]).attr("value") == "on") {
            name_list += names[i].innerHTML + ", "
        }
    }
    name_list = name_list.substring(0, name_list.length - 2);
    return name_list;
}

function generateOptions()
{
    var options = {
        dataType: 'json',
        success: function (data) {
            if(data.error == null) {
                successLoad(data);
            } else {
                alert(data.error);
            }
        },
        error: function (xhr) {
            console.log(xhr);
            alert("网络错误");
        }
    };
    return options;
}

function successLoad(data)
{
    $("button").remove();
    location.reload(true);
}


function addImg()
{
    for (var count = 0; count < vote_items.length; count++) 
    {
        $(".itemimg")[count].src = vote_items[count].pic_url;
    }
}

function addVoteNumber()
{
    for (var count = 0; count < vote_items.length; count++)
    {
        var item = vote_items[count];
        var html = "<div class='vote-number-box'>"
                    + "<div class='vote-number'>" 
                    + "人气:" + item.vote_num
                    + "</div>"
                    // + "<a class='detail-entry' href='" + item.url + "'>"
                    // + "<img src='" + detailImg + "'/>"
                    // + "</a>" + "<div style='clear:both;'></div>"
                    + "</div>";
        $(".votes2")[count].innerHTML = html;
    }

    //adjustVoteNumber();
}

function adjustVoteNumber() {

    function toNumber(width) {
        return parseFloat(width.substring(0, width.length - 2));
    }

    var w1 = toNumber($(".vote-number").css("width"));
    var w0 = toNumber($(".vote-number").parent().css("width"));
    var w2 = toNumber($(".vote-number").next().css("width"));

    $(".vote-number").css("margin-left", (w0 - w1 - w2 - 10) / 2 + "px");
}

function bindClickEvent() {
    $(".item-td").click(function(){
        CookieOnSelect($(this).attr("id"));
    });
}

function getItemBox(item, id) {
    var box = 
    '<div class="item-box" style="background:url(' + item.pic_url + ');">' + 
        '<div class="item-name">' + 
            '名称:' + item.name + 
        '</div>' + 
        '<div class="item-description">' + 
            '来源:' + item.description +
        '</div>' + 
        '<div class="item-vote">' + 
            '人气' + 
        '</div>' + 
        '<div class="item-tick">' +
            '<img src="' + selectedImg + '">' +
        '</div>' +
        '<div style="clear:both;">' +
        '</div>' +
    '</div>';

    return box;
}

function createVoteItem() {
    for (var i = 0; i < vote_items.length; i++) {
        var item = vote_items[i];
        var box = getItemBox(item, i);
        console.log('Current Item:' + i);
        $('#itemList').append(box);
    }
}

function createBasicVoteItem()
{
    createVoteItem();
    /*
    var newHtml = "";
    var newCb = "";
    var newVotes = "";
    var blankDiv ="<div style='height:1px;'></div>"

    for (count = 0; count < vote_items.length; count++)
    {
        if(newHtml && (count % line) == 0) {
            $("table").append(newHtml+blankDiv+newCb+newVotes);
            newHtml = "";
            newCb = "";
            newVotes = "";
        }
        newHtml += createSingleItem(count,line,vote_items);
        newCb += createSingleItemName(count,line,vote_items);
        newVotes += createSingleVotes(count,line,vote_items);
    }

    if(count % line != 0) {
        newHtml += "</tr>";
        newCb += "</tr>";
        newVotes += "</tr>";
    }
    
    if(newHtml) {
        $("table").append(newHtml+blankDiv+newCb+newVotes);
        newHtml = "";
        newCb = "";
        newVotes = "";
    }
    */
}

function createSingleVotes(count,line,vote_items)
{
    var item = vote_items[count];
    var voteTag =  "<div class='votes2'></div>";

    var td = "<td>"+voteTag+"</td>";

    if (count % line == 0) {
        td = "<tr>" + td;
    } else if (count % line == (line - 1)) {
        td = td + "</tr>";
    }

    return td;
}

function createSingleItemName(count,line,vote_items)
{
    var item = vote_items[count];
    var nameTag = "<a class='detail-link' href='" + 'javascript:void(0)' + "'>" + "<p class='voteitem'>"+item.name+"</p></a>";

    var td = "<td>"+nameTag+"</td>";

    if (count % line == 0) {
        td = "<tr>" + td;
    } else if (count % line == (line - 1)) {
        td = td + "</tr>";
    }

    return td;
}

function createSingleItem(count,line,vote_items)
{
    var item = vote_items[count];
    var imgTag =  "<img class='itemimg' style = '" + "width:" + size + "px;height:" + size + "px;'/>";
    var selectedImgTag = "<img src='" + selectedImg + "' style='width:" + size + "px;height:" + size + "px;'>" + "</img>";
    
    var td =  "<td class='item-td' id='" + (item.id) + "'>"
            + "<input type='text' class='item-val' style='display:none;' name='" + (item.id) + "' value='off'/>"
            + "<div class='table' style='position:relative;'>" + imgTag + "</div>" 
            + "<div class='tick' style='display:none;position:relative;bottom:" + (6+size) + "px;margin-bottom:-" + (6+size) + "px;z-index=2;'>"
            + selectedImgTag + "</div>" + "</td>";

    if (count % line == 0) {
        td = "<tr>" + td;
    } else if (count % line == (line - 1)) {
        td = td + "</tr>";
    }
    
    return td;
}

function adjustImg()
{
    var table = $(".table");
    for(var i = 0; i < table.length; i++) {
        table[i].style.height = size + "px";
    }
}

function onCreate_ended() {
    $("#info")[0].innerHTML = "投票已经结束"
    $("button").remove();
    createBasicVoteItem();
    adjustImg();
    addVoteNumber();
    addImg();
}

function onCreate_unstarted() {
    $("#info")[0].innerHTML = "投票尚未开始" 
    $("button").remove();
    createBasicVoteItem();
    adjustImg();
    addImg();
}

function onCreate_unvoted() {
    $("#info")[0].innerHTML = "你最多可投" + maxVote + "项，点击图片可投票"
    $("button").show();
    createBasicVoteItem();
    // bindClickEvent();
    // adjustImg();
    // CookieOnLoad();
    // addImg();
}

function onCreate_voted() {
    $("#info")[0].innerHTML = "你已经投过票啦，感谢你的参与"
    $("button").remove();
    createBasicVoteItem();
    adjustImg();
    addVoteNumber();
    addImg();
}

function orientationChange() { 
    //adjustImg();
    //adjustVoteNumber();
}

function createExtraInfo() {
    $('title').text(activity_page_title);
    $('#activity_title').text(activity_title);

    for (var i in activity_extra_info) {
        if(i == 1) {
            $('#activity_extra_info').append('<div>'+'<label id="info">'+activity_extra_info[i].c+'</label>'+'</div>');
        } else {
            $('#activity_extra_info').append('<div>'+'<label>'+activity_extra_info[i].c+'</label>'+'</div>');
        }
    }

    $('#activity_title_image').css({
        "background" : "url(" + activity_title_image + ") no-repeat",
        "height" : "100px",
        "background-position" : "center"
    });
    
}

function onCreate(){
    createExtraInfo();
    if(started == 0) {
        onCreate_unstarted();
    } else if(ended == 1) {
        onCreate_ended();
    } else if(voted == 0) {
        onCreate_unvoted();
    } else {
        onCreate_voted();
    }
}


function findcookie (key) {
    var name = escape(key);
    name += "=";
    var allcookies = document.cookie;
    var pos = document.cookie.indexOf(name)
    if(pos != -1) {
        //cookie值开始的位置
        var start = pos + name.length;
        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置                 
        var end = allcookies.indexOf(";",start);
        //如果end值为-1说明cookie列表里只有一个cookie          
        if (end == -1) end = allcookies.length;
        //提取cookie的值       
        var value = allcookies.substring(start,end);
        //对它解码    
        return (value);                           
    } else {
        return ("");
    }
}

function CookieOnLoad() {
    var result = findcookie("activityID");
    if(result != voteId) {
        initCookie(voteId, vote_items);
    } else {
        loadCookie();
    }
}

function initCookie(id, items) {
    var n = "activityID=" + id;
    document.cookie = n;
    for (var i = 0; i < items.length; i++){
        document.cookie = items[i].id + "=false";
    }
}

function loadCookie() {
    votenum = 0;
    var tds = $(".item-td");
    for(var i = 0; i < tds.length; i++) {
        var id = $(tds[i]).attr("id");
        var result = findcookie(id);
        if(result == "true" && votenum < maxVote) {
            changeItemCover(id);
            lastSelect = id;
        }
    }
}

function changeItemCover(id) {
    var td = $("#" + id);
    var tick = td.children(".tick");
    var item = td.children(".table");
    var val = td.children(".item-val");
        
    if (val.attr("value") == "off") {
        tick.show();
        val.attr("value", "on");
        item.css("opacity", "0.4");
        votenum = votenum + 1;
        document.cookie = escape(id) + "=true";
    } else {
        tick.hide();
        val.attr("value", "off");
        item.css("opacity", "1.0");
        votenum = votenum - 1;
        document.cookie = escape(id) + "=false";
    }
}

function CookieOnSelect(id) {
    changeItemCover(id);
    if(votenum > maxVote) {
        voteNumOverflow(maxVote, id);
    } else {
        lastSelect = id;
    } 
}

function voteNumOverflow(vtLim, id) {
    if(vtLim == 1) {
        changeItemCover(lastSelect);
        lastSelect = id;
    } else {
        changeItemCover(id);
        alert("您的投票数已经达到上限，不能再投啦！");
    }
}

onCreate();




/*
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
*/
