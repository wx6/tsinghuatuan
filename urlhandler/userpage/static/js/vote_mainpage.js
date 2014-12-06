function commitVote() {
    var options = {
        dataType: 'json',
        success: function (data) {
            if(data.error==null)
            {
                  
            }
            else
            {
               
            }
        },
        error: function (xhr) {
                                           
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
            td1 = "<tr><td><div class="+"table"+"><a href='http://wx6.igeek.asia/u/vote_item_detail/"+item.id+"'><img src = "+ item.pic_url +" ></a> "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label></div><span>投票数目:"+item.vote_num+"</span></div></td>"
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
