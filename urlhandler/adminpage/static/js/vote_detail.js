var dateInterfaceMap = {
    'year': 'getFullYear',
    'month': 'getMonth',
    'day': 'getDate',
    'hour': 'getHours',
    'minute': 'getMinutes'
};
var actionMap = {
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
};

var keyMap = {
    'name': 'value',
    'key': 'value',
    'description': 'value',
    'pic_url':'value',
    'start_time': 'time',
    'end_time': 'time'
};
var lockMap = {
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

function updateVote(nact) {
    var key, key2, tdate;
    for (key in nact) {
        if (keyMap[key] == 'time') {
            vote[key] = {};
            tdate = new Date(nact[key])
            for (key2 in dateInterfaceMap) {
                vote[key][key2] = tdate[dateInterfaceMap[key2]]() + ((key2 == 'month') ? 1 : 0);
            }
        } else {
            note[key] = nact[key];
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
    lockByStatus(curstatus, activity.start_time, activity.end_time);
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
    if(curstatus == 0){
        if(votestart < now){
            $('#input-start-year').popover({
                    html: true,
                    placement: 'top',
                    title:'',
                    content: '<span style="color:red;">“投票开始时间”应晚于“当前时间”</span>',
                    trigger: 'focus',
                    container: 'body'
            });
            $('#input-start-year').focus();
            return false;
        }

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

function showForm() {
    changeView('form');
}

function showProcessing() {
    changeView('processing');
}

function showResult() {
    changeView('result');
}

function changeView(id) {
    var opt = ['noscript', 'form', 'processing', 'result'], len = opt.length, i;
    for (i = 0; i < len; ++i) {
        $('#detail-' + opt[i]).hide();
    }
    $('#detail-' + id).show();
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
    $('#resetBtn').hide();
}

function lockByStatus(status, start_time, end_time) {
    // true means lock, that is true means disabled
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

    if (status >= 1) {
        $('#saveBtn').hide();
    } else {
        $('#saveBtn').show();
    }
    showPublishByStatus(status, end_time);
    showPubTipsByStatus(status);
}

function showPublishByStatus(status, linetime) {
    if ((status >= 1) && (new Date() >= getDateByObj(linetime))) {
        $('#publishBtn').hide();
        $('#resetBtn').hide();
    } else {
        $('#resetBtn').show();
        $('#publishBtn').show();
    }
}

function showPubTipsByStatus(status){
    if(status < 1){
        $('#publishBtn').tooltip({'title': '发布后不能修改“投票名称”、“投票代称”和“投票开始时间”'});
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

function beforeSubmit(formData, jqForm, options) {
    var i, len, nameMap = {
        'name': '投票名称',
        'key': '投票代称',
        'description': '投票简介',
        'pic_url': '活动配图',
        'start_time': '投票开始时间',
        'end_time': '投票结束时间'
    }, lackArray = [], dateArray = [
        'start_time', 'end_time'
    ];
    for (i = 0, len = formData.length; i < len; ++i) {
        if (!formData[i].value) {
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
    if (!data.error) {
        updateVote(data.vote);
        initializeForm(activity);
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
    setResult('ERROR!\r\nStatus:' + xhr.status + ' ' + xhr.statusText + '\r\n\r\nResponseText:\r\n' + (xhr.responseText || '<null>'));
    $('#continueBtn').click(function() {
        showForm();
    });
}

function submitComplete(xhr) {
    showResult();
}

function publishvote() {
    alert("OK");
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
    initializeForm(activity);
    return false;
});

$('.form-control').on('focus', 
    function() 
    {
        var me = $(this); 
        setTimeout(function()
            {
                me.select();
            }, 100)
    });




