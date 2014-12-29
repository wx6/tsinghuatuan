var lastSelect;

function commitVote() {
    var name_list = generateVoteNames();
    if(votenum <= 0) {
        alert("你还没有选择节目哦！");
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
            alert("很抱歉，好像发生了奇怪的错误= =");
        }
    };
    return options;
}

function successLoad(data)
{
    $("button").remove();
    location.reload(true);
}


function addImg() {
    for (var i = 0; i < vote_items.length; i++) {
        $($('.item-box')[i]).css({
            'background' :  'url(' + vote_items[i].pic_url + (i % 6) + '.png)',
            'background-size' : 'cover'
        });
    }
}

function addVoteNumber() {
    for (var i = 0; i < vote_items.length; i++) {
        $($('.item-vote')[i]).html('人气: ' + vote_items[i].vote_num);
    }
}

function changeItemCover(id) {
    var td = $("#" + id);
    var tick = td.children(".item-tick");
    var val = td.children(".item-val");
        
    if (val.attr("value") == "off") {
        tick.show();
        val.attr("value", "on");
        votenum = votenum + 1;
    } else {
        tick.hide();
        val.attr("value", "off");
        votenum = votenum - 1;
    }
}

function selectItem(id) {
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

function bindClickEvent() {
    $(".item-box").click(function(){
        selectItem($(this).attr("id"));
    });
}

function createItemBox(item, id) {
    var box = 
    '<div class="item-box" id="' + item.id + '">' +
        '<input type="text" class="item-val" style="display:none;" name="' + (item.id) + '" value="off"/>' +
        '<div class="item-name">' + 
            '名称: ' + item.name + 
        '</div>' + 
        '<div class="item-description">' + 
            '来源: ' + item.description +
        '</div>' + 
        '<div class="item-vote">' + 
        '</div>' + 
        '<div class="item-tick" style="display:none;">' +
            '<img src="' + selectedImg + '">' +
        '</div>' +
    '</div>';

    return box;
}

function createVoteItem() {
    for (var i = 0; i < vote_items.length; i++) {
        var item = vote_items[i];
        var box = createItemBox(item, i);
        console.log('Current Item:' + i);
        $('#itemList').append(box);
    }
}

function createBasicVoteItem()
{
    createVoteItem();
}

function onCreate_ended() {
    $("#info")[0].innerHTML = "投票已经结束"
    $("button").remove();
    createBasicVoteItem();
    addVoteNumber();
    addImg();
}

function onCreate_unstarted() {
    $("#info")[0].innerHTML = "投票尚未开始" 
    $("button").remove();
    createBasicVoteItem();
    addImg();
}

function onCreate_unvoted() {
    $("#info")[0].innerHTML = "你最多可投" + maxVote + "项，点击图片可投票"
    $("button").show();
    createBasicVoteItem();
    bindClickEvent();
    addImg();
}

function onCreate_voted() {
    $("#info")[0].innerHTML = "你已经投过票啦，感谢你的参与"
    $("button").remove();
    createBasicVoteItem();
    addVoteNumber();
    addImg();
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

onCreate();





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

