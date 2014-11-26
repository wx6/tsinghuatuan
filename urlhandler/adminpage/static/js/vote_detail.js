function addchoice() {
        vote_choice_count++;
        $('<details open="open" id="vote_choice_'+vote_choice_count.toString()+'"class="vote_choice"><summary class="vote_option_summary">投票项'+vote_choice_count.toString()+'<span class="vote_delete" title="删除"></span></summary><div class="dynamic"><div class="form-group"><label for="input-item" class="col-sm-2 control-label">投票项名称</label><div class="col-sm-10"><input type="text" maxlength="12" name="item" class="form-control"placeholder="投票项的名称，如刘强老师"></div></div><div class="form-group"><label for="input-item_description" class="col-sm-2 control-label">投票项简介</label><div class="col-sm-10"><input type="text" maxlength="12" name="item_description" class="form-control"  placeholder="投票项的简介，如刘强老师为软件学院老师，开设软件工程等课程"></div></div><div class="form-group"><label for="input-item_pic_url" class="col-sm-2 control-label">投票项图片</label><div class="col-sm-10"><input type="text" maxlength="12" name="item_pic_url" class="form-control" placeholder="请填入图片链接"></div></div></div></details>').insertBefore("#bottom_botton");
};

$(function(){
    $('.vote_delete').live("click", function(){
        vote_choice_count--;
        $(this).parent().parent().remove();
        $.each($(".vote_choice"),function(i,item){
            $(item).find("summary").html("投票项"+(i+1).toString()+'<span class="vote_delete" title="删除"></span>');
            $(item).attr('id',"vote_choice_"+(i+1).toString());
        });
    });
});