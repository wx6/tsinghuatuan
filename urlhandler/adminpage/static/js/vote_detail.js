/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-11-30
 * Time: 上午11:43
 */
/*
var datetimepicker_option = {
    format: "yyyy年mm月dd日 - hh:ii",
    autoclose: true,
    pickerPosition: "bottom-left",
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    language: 'zh-CN'
};

$(".form_datetime").datetimepicker(datetimepicker_option);

function enableDatetimePicker(dom) {
    dom.datetimepicker(datetimepicker_option);
    dom.children('.input-group-addon').css('cursor', 'pointer').children().css('cursor', 'pointer');
}
l
function disableDatetimePicker(dom) {
    dom.datetimepicker('remove');
    dom.children('.input-group-addon').css('cursor', 'no-drop').children().css('cursor', 'no-drop');
}
*/
var dateInterfaceMap = {
    'year': 'getFullYear',
    'month': 'getMonth',
    'day': 'getDate',
    'hour': 'getHours',
    'minute': 'getMinutes'
}, actionMap = {
    'value': function(dom, value) {
        dom.val(value);
    },
    'text': function(dom, value) {
        dom.text(value);
    },
    'time': function(dom, value) {
        if (value instanceof Object) {
            var parts = dom.children(), i, len, part;
            for (i = 0, len = parts.length; i < len; ++i) {
                part = $(parts[i]).children();
                if (part.attr('date-part')) {
                    part.val(value[part.attr('date-part')]);
                }
            }
        }
    }
}, keyMap = {
    'name': 'value',
    'key': 'value',
    'description': 'value',
    'start_time': 'time',
    'end_time': 'time',
    'pic_url': 'value',
    'max_num' : 'value'
}, lockMap = {
    'value': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'text': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'time': function(dom, lock) {
        var parts = dom.children(), i, len, part;
        for (i = 0, len = parts.length; i < len; ++i) {
            part = $(parts[i]).children();
            if (part.attr('date-part')) {
                part.prop('disabled', lock);
            }
        }
        dom.prop('disabled', lock);
    }
};

var curstatus = 0;

function updateActivity(nact) {
    var key, key2, tdate;
    for (key in nact) {
        if (keyMap[key] == 'time') {
            vote[key] = {};
            tdate = new Date(nact[key])
            for (key2 in dateInterfaceMap) {
                vote[key][key2] = tdate[dateInterfaceMap[key2]]() + ((key2 == 'month') ? 1 : 0);
            }
        }
        else {
            vote[key] = nact[key];
        }
    }
}

function initializeForm(vote) {
    var key;
    for (key in keyMap) {
        actionMap[keyMap[key]]($('#input-' + key), vote[key]);
    }
    if (!vote.id) {
        $('#input-name').val('');
        //新增活动，自动生成年份
        var curyear = new Date().getFullYear();
        var curmonth = new Date().getMonth() + 1;
        $('#input-start-year').val(curyear);
        $('#input-end-year').val(curyear);
        $('#input-start-month').val(curmonth);
        $('#input-end-month').val(curmonth);
        $('#input-start-minute').val(0);
        $('#input-end-minute').val(0);
    }
    curstatus = vote.status;
    lockByStatus(curstatus, vote.start_time, vote.end_time);
}

function check_percent(p) {
    if (p > 100.0) {
        return 100.0;
    } else {
        return p;
    }
}

function checktime(){
    var votestart = new Date($('#input-start-year').val(), $('#input-start-month').val()-1, $('#input-start-day').val(), $('#input-start-hour').val(), $('#input-start-minute').val());
    var voteend = new Date($('#input-end-year').val(), $('#input-end-month').val()-1, $('#input-end-day').val(), $('#input-end-hour').val(), $('#input-end-minute').val());
    var now = new Date();
    if(voteend < votestart){
        $('#input-end-year').popover({
            html: true,
            placement: 'top',
            title:'',
            content: '<span style="color:red;">“投票结束时间”应晚于“投票开始时间”</span>',
            trigger: 'focus',
            container: 'body'
        });
         $('#input-end-year').focus();
        return false;
    }
    return true;
}

function initialProgress(checked, ordered, total) {
    $('#tickets-checked').css('width', check_percent(100.0 * checked / total) + '%')
        .tooltip('destroy').tooltip({'title': '已检入：' + checked + '/' + ordered + '=' + (100.0 * checked / ordered).toFixed(2) + '%'});
    $('#tickets-ordered').css('width', check_percent(100.0 * (ordered - checked) / total) + '%')
        .tooltip('destroy').tooltip({'title': '订票总数：' + ordered + '/' + total + '=' + (100.0 * ordered / total).toFixed(2) + '%' + '，其中未检票：' + (ordered - checked) + '/' + ordered + '=' + (100.0 * (ordered - checked) / ordered).toFixed(2) + '%'});
    $('#tickets-remain').css('width', check_percent(100.0 * (total - ordered) / total) + '%')
        .tooltip('destroy').tooltip({'title': '余票：' + (total - ordered) + '/' + total + '=' + (100.0 * (total - ordered) / total).toFixed(2) + '%'});
}

function changeView(id) {
    var opt = ['noscript', 'form', 'processing', 'result', 'vote_result'], len = opt.length, i;
    for (i = 0; i < len; ++i) {
        $('#detail-' + opt[i]).hide();
    }
    $('#detail-' + id).show();
}

function showForm() {
    changeView('form');
}

function showProcessing() {
    changeView('processing');
}

function showResult() {
    changeView('result');
}

function showVoteResult() {
    changeView('vote_result');
}

function setResult(str) {
    $('#resultHolder').text(str);
}

function appendResult(str) {
    var dom = $('#resultHolder');
    dom.text(dom.text() + str + '\r\n');
}

function lockForm() {
    var key;
    for (key in keyMap) {
        lockMap[keyMap[key]]($('#input-' + key), true);
    }
    $('#publishBtn').hide();
    $('#saveBtn').hide();
    //$('#resetBtn').hide();
}

function lockByStatus(status, start_time, end_time) {
    // true means lock, that is true means disabled
    var now = new Date();
    if (!start_time){
        $('#resultBtn').hide();
        return;
    }
    var statusLockMap = {
        // saved but not published
        '0': {
        },
        // published but not determined
        '1': {
            'name': true,
            'key': true,
            'start_time': function() {
                return (new Date() >= getDateByObj(end_time));
            },
            'end_time': function() {
                return (new Date() >= getDateByObj(end_time));
            }
        }
    }, key;
    for (key in keyMap) {
        var flag = !!statusLockMap[status][key];
        if (typeof statusLockMap[status][key] == 'function') {
            flag = statusLockMap[status][key]();
        }
        lockMap[keyMap[key]]($('#input-' + key), flag);
    }
    lockItemsByStatus(status, start_time);
    if (status >= 1) {
        $('#saveBtn').hide();
    } else {
        $('#saveBtn').show();
    }
    showPublishByStatus(status, start_time, end_time);
    showPubTipsByStatus(status);
}

function showPublishByStatus(status, start_time, linetime) {
    if (status >= 1){
        $('#resultBtn').show();
    }
    else{
        $('#resultBtn').hide();
    }
    if (new Date() < getDateByObj(start_time) || status < 1){
        $('#addItem').show();
        $('.vote_delete').show();
    }
    else{
        $('#addItem').hide();
        $('.vote_delete').hide();       
    }
    if ((status >= 1) && (new Date() >= getDateByObj(linetime))) {
        $('#publishBtn').hide();
        //$('#resetBtn').hide();
        //$('#addItem').hide();
        //$('#resultBtn').show();
    } else {
        //$('#resultBtn').hide();
        //$('#addItem').show();
        //$('#resetBtn').show();
        $('#publishBtn').show();
    }
}

function showPubTipsByStatus(status){
    if(status < 1){
        $('#publishBtn').tooltip({'title': '发布后不能修改“活动名称”、“活动代称”和“订票开始时间”'});
        $('#saveBtn').tooltip({'title': '暂存后可以“继续修改”'});
    }
}

function getDateString(tmpDate) {
    return tmpDate.year + '-' + tmpDate.month + '-' + tmpDate.day + ' ' + tmpDate.hour + ':' + tmpDate.minute + ':00';
}

function getDateByObj(obj) {
    return new Date(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute);
}

function wrapDateString(dom, formData, name) {
    var parts = dom.children(), i, len, tmpDate = {}, part;
    for (i = 0, len = parts.length; i < len; ++i) {
        part = $(parts[i]).children();
        if (part.attr('date-part')) {
            if (part.val().length == 0) {
                return false;
            } else {
                tmpDate[part.attr('date-part')] = parseInt(part.val());
            }
        }
    }
    formData.push({
        name: name,
        required: false,
        type: 'string',
        value: getDateString(tmpDate)
    });
    return true;
}

// important
function beforeSubmit(formData, jqForm, options) {
    var i, len, nameMap = {
        'name': '活动名称',
        'key': '活动代码',
        'description': '活动简介',
        'start_time': '活动开始时间',
        'end_time': '活动结束时间',
        'pic_url': '活动配图',
        'max_num' : '每人投票量上限'
    }, lackArray = [], dateArray = [
        'start_time', 'end_time'
    ];
    for (i = 0, len = formData.length; i < len; ++i) {
        if (!formData[i].value && nameMap[formData[i].name]) {
            lackArray.push(nameMap[formData[i].name]);
        }
    }
    for (i = 0, len = dateArray.length; i < len; ++i) {
        if (!$('#input-' + dateArray[i]).prop('disabled')) {
            if (!wrapDateString($('#input-' + dateArray[i]), formData, dateArray[i])) {
                lackArray.push(nameMap[dateArray[i]]);
            }
        }
    }
    detectVoteChoiceError(formData,lackArray);
    if (lackArray.length > 0) {
        setResult('以下字段是必须的，请补充完整后再提交：\r\n' + lackArray.join('、'));
        $('#continueBtn').click(function() {
            showForm();
        });
        showResult();
        return false;
    }
    if (vote.id) {
        formData.push({
            name: 'id',
            required: false,
            type: 'number',
            value: vote.id.toString()
        });
    }
    return true;
}

function beforePublish(formData, jqForm, options) {
    if (beforeSubmit(formData, jqForm, options)) {
        showProcessing();
        if (vote.id) {
            formData.push({
                name: 'id',
                required: false,
                type: 'number',
                value: vote.id.toString()
            });
        }
        formData.push({
            name: 'publish',
            required: false,
            type: 'number',
            value: '1'
        });
        return true;
    } else {
        return false;
    }
}

function submitResponse(data) {
    console.log("success");
    if (!data.error) {
        updateActivity(data.vote);
        init_vote_choice(vote);
        initializeForm(vote);
        appendResult('成功');
    } else {
        appendResult('错误：' + data.error);
    }
    if (data.warning) {
        appendResult('警告：' + data.warning);
    }
    if (data.updateUrl) {
        $('#continueBtn').click(function() {
            window.location.href = data.updateUrl;
        });
    } else {
        $('#continueBtn').click(function() {
            showForm();
        });
    }

}

function submitError(xhr) {
    console.log("error");
    setResult('ERROR!\r\nStatus:' + xhr.status + ' ' + xhr.statusText + '\r\n\r\nResponseText:\r\n' + (xhr.responseText || '<null>'));
    $('#continueBtn').click(function() {
        showForm();
    });
}

function submitComplete(xhr) {
    showResult();
}


function publishVote() {
    if(!$('#vote-form')[0].checkValidity || $('#vote-form')[0].checkValidity()){
        if(!checktime())
            return false;
        showProcessing();
        setResult('');
        var options = {
            dataType: 'json',
            beforeSubmit: beforePublish,
            success: submitResponse,
            error: submitError,
            complete: submitComplete
        };
        $('#vote-form').ajaxSubmit(options);
        return false;
    } else {
        $('#saveBtn').click();
    }
    return false;
}

init_vote_choice(vote);
initializeForm(vote);
showForm();

$('#vote-form').submit(function() {
    showProcessing();
    setResult('');
    var options = {
        dataType: 'json',
        beforeSubmit: beforeSubmit,
        success: submitResponse,
        error: submitError,
        complete: submitComplete
    };
    $(this).ajaxSubmit(options);
    return false;
}).on('reset', function() {
    initializeForm(vote);
    return false;
});

$('.form-control').on('focus', function() {var me = $(this); setTimeout(function(){me.select();}, 100)});

function addchoice() {
    vote_choice_count = $('.vote_delete').length + 1;
    $('<details open="open" id="vote_choice_'+vote_choice_count.toString()+'" class="vote_choice"><summary class="vote_option_summary">投票项'+vote_choice_count.toString()+'<span class="vote_delete" title="删除"></span></summary><div class="dynamic"><div class="form-group"><label for="input-item" class="col-sm-2 control-label">投票项名称</label><div class="col-sm-10"><input type="text" name="name'+vote_choice_count.toString()+'" class="form-control"placeholder="投票项的名称，如刘强老师"></div></div><div class="form-group"><label for="input-item_description" class="col-sm-2 control-label">投票项简介</label><div class="col-sm-10"><input type="text" name="description'+vote_choice_count.toString()+'" class="form-control"  placeholder="投票项的简介，如刘强老师为软件学院老师，开设软件工程等课程"></div></div><div class="form-group"><label for="input-item_pic_url" class="col-sm-2 control-label">投票项图片</label><div class="col-sm-10"><input type="text" name="pic_url'+vote_choice_count.toString()+'" class="form-control" placeholder="请填入图片链接"></div></div></div></details>').insertBefore("#bottom_botton");
    dymBotton();
};

function dymBotton (){
    $('.vote_delete').click(function(){
        vote_choice_count = $('.vote_delete').length-1;
        $(this).parent().parent().remove();
        $.each($(".vote_choice"),function(i,item){
            $(item).find("summary").html("投票项"+(i+1).toString()+'<span class="vote_delete" title="删除"></span>');
            $(item).attr('id',"vote_choice_"+(i+1).toString());
         });
        dymBotton();
    });
    //dymBotton();
}

$('.vote_delete').click(function(){
    vote_choice_count = $('.vote_delete').length-1;
    $(this).parent().parent().remove();
    $.each($(".vote_choice"),function(i,item){
        $(item).find("summary").html("投票项"+(i+1).toString()+'<span class="vote_delete" title="删除"></span>');
        $(item).attr('id',"vote_choice_"+(i+1).toString());
    });
    dymBotton();
});

function init_vote_choice(vote){
    if (vote.items.length==0){
        return;
    }
    var count = vote.items.length-vote_choice_count;
    while(count > 0){
        addchoice();
        --count;
    }
    show_vote_choice(vote);
}

function show_vote_choice(vote) {
    count = 0;
    while(count < vote.items.length){
        $("input[name='name"+(count+1).toString()+"']").val(vote.items[count].name);
        $("input[name='description"+(count+1).toString()+"']").val(vote.items[count].description);
        $("input[name='pic_url"+(count+1).toString()+"']").val(vote.items[count].pic_url);
        ++count;
    }
}

function detectVoteChoiceError(formData,lackArray){
    if (vote_choice_count < 1){
        lackArray.push('投票项不能为空');
        return false;
    }
    var i,j,flag;
    flag = false;
    for (i = 0; i < vote_choice_count; i++){
        for (j = 0; j < formData.length; j++){
            if (!formData[j].value && formData[j].name=='name'+(i+1).toString()){
                lackArray.push('投票项'+(i+1).toString()+'的投票项名称');
                flag = true;
            }
            if (!formData[j].value && formData[j].name=='description'+(i+1).toString()){
                lackArray.push('投票项'+(i+1).toString()+'的投票项名称');
                flag = true;
            }
            if (!formData[j].value && formData[j].name=='pic_url'+(i+1).toString()){
               lackArray.push('投票项'+(i+1).toString()+'的投票项名称');
               flag = true;
            }
        }
    }
    if (flag){
        return false;
    }
    formData.push({
            name: 'item_num',
            required: false,
            type: 'number',
            value: vote_choice_count.toString()
    });
    return true;
}

function lockItemsByStatus(status, start_time){
    if (status < 1 || new Date() < getDateByObj(start_time)){
        var i;
        for (i = 0; i < vote_choice_count; i++){
            $("input[name='name"+(i+1).toString()+"']").prop('disabled',false);
            $("input[name='description"+(i+1).toString()+"']").prop('disabled',false);
            $("input[name='pic_url"+(i+1).toString()+"']").prop('disabled',false);
        }
    }
    else{
        var i;
        for (i = 0; i < vote_choice_count; i++){
            $("input[name='name"+(i+1).toString()+"']").prop('disabled',true);
            $("input[name='description"+(i+1).toString()+"']").prop('disabled',true);
            $("input[name='pic_url"+(i+1).toString()+"']").prop('disabled',true);
        }
    }
}

function seeVoteResult(){
    updateVoteResult();
    showVoteResult();
}

function updateVoteResult (){
    $("#tbody-vote_result").empty();
    //$('#returnBtn').attr("href","/detail/"+vote.id+"/");
    var item,i;
    var items = vote.items;
    qsort(items);
    for (i = 0; i < items.length; i++){
        item = vote.items[i];
        var tr = $('<tr></tr>');
        $("<td></td>").html(item.name).appendTo(tr);
        $("<td></td>").html((item.vote_num).toString()).appendTo(tr);
        //$("<td></td>").html(item.name).appendTo(tr);
        $('#tbody-vote_result').append(tr);
    }
}

function returnToVoteDetail(){
    showForm();
}

function qsort(arr){
    return quickSort(arr,0,arr.length-1);
    function quickSort(arr,l,r){            
        if(l<r){         
            var mid=arr[parseInt((l+r)/2)].vote_num,i=l-1,j=r+1;         
            while(true){
                while(arr[++i].vote_num<mid);
                while(arr[--j].vote_num>mid);             
                if(i>=j)break;
                var temp=arr[i];
                arr[i]=arr[j];
                arr[j]=temp;
            }       
            quickSort(arr,l,i-1);
            quickSort(arr,j+1,r);
        }
        return arr;
    }
}