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
            td1 = "<tr><td><img src = "+ item.pic_url +" > "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label><br>投票数目:"+item.vote_num+"</div></td>"
            newHtml += td1;
            break;
        case 1:
            td2 =  "<td> <img src = "+ item.pic_url +" > "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label><br>投票数目:"+item.vote_num+"</div></td>"
            newHtml += td2;
            break;
        case (line-1):
            td3 = " <td><img src = "+ item.pic_url +" > "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label><br>投票数目:"+item.vote_num+"</div></td></tr>"
            newHtml += td3;
            break;
        default:
            td2 = "<td> <img src = "+ item.pic_url +" > "+"<div class = "+"checkbox"+"><input type ='checkbox' name="+item.id+" id="+item.id+"><label for="+item.id+"></label><br>投票数目:"+item.vote_num+"</div></td>"
            newHtml += td2;
            break;
       }
    }
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = "";
    }
}

onCreate();
