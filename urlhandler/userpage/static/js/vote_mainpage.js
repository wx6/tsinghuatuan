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