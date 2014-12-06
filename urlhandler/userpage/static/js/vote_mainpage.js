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
    var newHtml;
    var td1,td2,td3;
    for (item in {{vote.items}})
    {
       if(newHtml && (count % line) == 0 )
       {
           $("table").append(newHtml);
           newHtml = null;
       }
       switch(count % line)
       {
        case 0: 
            td1 = "<tr><td> <img src = "+{{ item.pic_url }}+" > "+" <span></span><input type ='checkbox' name="+{{item.name}}+">投票数目:{{item.vote_num}}</td>"
            break;
        case 1:
            td2 = "<td> <img src = "+{{ item.pic_url }}+" > "+" <span></span><input type ='checkbox' name="+{{item.name}}+">投票数目:{{item.vote_num}}</td>"
            break;
        case 2:
            td3 = "<td> <img src = "+{{ item.pic_url }}+" > "+" <span></span><input type ='checkbox' name="+{{item.name}}+">投票数目:{{item.vote_num}}</td></tr>"
            break;
        default:
            break;
       }

    }
    if(newHtml)
    {
        $("table").append(newHtml);
        newHtml = null;
    }
}