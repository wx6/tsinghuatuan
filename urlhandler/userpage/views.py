# -*- coding:utf-8 -*-

from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response, render
from urlhandler.models import User, Activity, Ticket
from urlhandler.settings import STATIC_URL
import urllib, urllib2
from datetime import datetime, timedelta
from django.utils import timezone
from userpage.safe_reverse import *
from weixinlib.settings import WEIXIN_TOKEN
from userpage.barcode import *
import json
from django.views.decorators.csrf import csrf_exempt

from weixinlib.base_support import get_access_token
from urlhandler.models import Vote, VoteItem, SingleVote


def home(request):
    return render_to_response('mobile_base.html')


# Get timestamp and return it to front end
# Recently Modified by: Liu Junlin
# Date: 2014-11-17 16:32
def get_timestamp():
    req_url = 'http://auth.igeek.asia/v1/time'
    req = urllib2.Request(url=req_url)
    res_data = urllib2.urlopen(req)
    return res_data.read()


###################### Validate ######################
# request.GET['openid'] must be provided.
def validate_view(request, openid):
    timestamp = get_timestamp()

    if User.objects.filter(weixin_id=openid, status=1).exists():
        isValidated = 1
    else:
        isValidated = 0
    studentid = ''
    if request.GET:
        studentid = request.GET.get('studentid', '')
    return render_to_response('validation_student.html', {
        'openid': openid,
        'studentid': studentid,
        'isValidated': isValidated,
        # 'now': datetime.datetime.now() + datetime.timedelta(seconds=-5),
        'now': datetime.now() + timedelta(seconds=-5),
        'timestamp': timestamp
    }, context_instance=RequestContext(request))


# Validate Format:
# METHOD 1: learn.tsinghua
# url: https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp
# form: { userid:2011013236, userpass:***, submit1: 登录 }
# success: check substring 'loginteacher_action.jsp'
# validate: userid is number
def validate_through_learn(userid, userpass):
    req_data = urllib.urlencode({'userid': userid, 'userpass': userpass, 'submit1': u'登录'.encode('gb2312')})
    request_url = 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'
    req = urllib2.Request(url=request_url, data=req_data)
    res_data = urllib2.urlopen(req)
    try:
        res = res_data.read()
    except:
        return 'Error'
    if 'loginteacher_action.jsp' in res:
        return 'Accepted'
    else:
        return 'Rejected'


# METHOD 2 is not valid, because student.tsinghua has not linked to Internet
# METHOD 2: student.tsinghua
# url: http://student.tsinghua.edu.cn/checkUser.do?redirectURL=%2Fqingxiaotuan.do
# form: { username:2011013236, password:encryptedString(***) }
# success: response response is null / check response status code == 302
# validate: username is number
def validate_through_student(userid, userpass):
    return 'Error'


# Function: To validate student number through AuthTHU provided by Chen Huarong
# Recently Modified by: Liu Junlin
# Date: 2014-11-17 16:32
def validate_through_auth(userpass):
    req_url = 'http://auth.igeek.asia/v1'
    req_data = urllib.urlencode({'secret': userpass})
    req = urllib2.Request(url=req_url, data=req_data)
    res_data = urllib2.urlopen(req).read()
    res_dict = eval(res_data)
    if res_dict['code'] == 0:
        return 'Accepted'
    else:
        return 'Rejected'


# Recently Modified by: Liu Junlin
# Date: 2014-11-17 16:32
def validate_post(request):
    if (not request.POST) or (not 'openid' in request.POST) or \
            (not 'username' in request.POST) or (not 'password' in request.POST):
        raise Http404
    userid = request.POST['username']
    if not userid.isdigit():
        raise Http404
    # userpass = request.POST['password'].encode('gb2312')
    # validate_result = validate_through_learn(userid, userpass)
    userpass = request.POST['password']
    validate_result = validate_through_auth(userpass)
    if validate_result == 'Accepted':
        openid = request.POST['openid']
        try:
            User.objects.filter(stu_id=userid).update(status=0)
            User.objects.filter(weixin_id=openid).update(status=0)
        except:
            return HttpResponse('Error')
        try:
            currentUser = User.objects.get(stu_id=userid)
            currentUser.weixin_id = openid
            currentUser.status = 1
            try:
                currentUser.save()
            except:
                return HttpResponse('Error')
        except:
            try:
                newuser = User.objects.create(weixin_id=openid, stu_id=userid, status=1)
                newuser.save()
            except:
                return HttpResponse('Error')
    return HttpResponse(validate_result)


###################### Activity Detail ######################

def details_view(request, activityid):
    activity = Activity.objects.filter(id=activityid)
    if not activity.exists():
        raise Http404  #current activity is invalid
    act_name = activity[0].name
    act_key = activity[0].key
    act_place = activity[0].place
    act_bookstart = activity[0].book_start
    act_bookend = activity[0].book_end
    act_begintime = activity[0].start_time
    act_endtime = activity[0].end_time
    act_totaltickets = activity[0].total_tickets
    act_text = activity[0].description
    act_ticket_remian = activity[0].remain_tickets
    act_abstract = act_text
    MAX_LEN = 256
    act_text_status = 0
    if len(act_text) > MAX_LEN:
        act_text_status = 1
        act_abstract = act_text[0:MAX_LEN] + u'...'
    act_photo = activity[0].pic_url
    cur_time = timezone.now()  # use the setting UTC
    act_seconds = 0
    if act_bookstart <= cur_time <= act_bookend:
        act_delta = act_bookend - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 0  # during book time
    elif cur_time < act_bookstart:
        act_delta = act_bookstart - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 1  # before book time
    else:
        act_status = 2  # after book time
    variables = RequestContext(request, {'act_name': act_name, 'act_text': act_text, 'act_photo': act_photo,
                                         'act_bookstart': act_bookstart, 'act_bookend': act_bookend,
                                         'act_begintime': act_begintime,
                                         'act_endtime': act_endtime, 'act_totaltickets': act_totaltickets,
                                         'act_key': act_key,
                                         'act_place': act_place, 'act_status': act_status, 'act_seconds': act_seconds,
                                         'cur_time': cur_time,
                                         'act_abstract': act_abstract, 'act_text_status': act_text_status,
                                         'act_ticket_remian': act_ticket_remian})
    return render_to_response('activitydetails.html', variables)


def ticket_view(request, uid):
    ticket = Ticket.objects.filter(unique_id=uid)
    if not ticket.exists():
        raise Http404  #current activity is invalid
    activity = Activity.objects.filter(id=ticket[0].activity_id)
    act_id = activity[0].id
    act_name = activity[0].name
    act_key = activity[0].key
    act_begintime = activity[0].start_time
    act_endtime = activity[0].end_time
    act_place = activity[0].place
    ticket_status = ticket[0].status
    now = datetime.now()
    if act_endtime < now:  #表示活动已经结束
        ticket_status = 3
    ticket_seat = ticket[0].seat

    if (ticket[0].seat_id == 0):
        seat_row = 0
        seat_column = 0
    else:
        ticket_seat_id = ticket[0].seat_id - activity[0].seat_start + 1
        seat_row = ticket_seat_id / 10 + 1
        seat_column = ticket_seat_id % 10 + 1

    # act_photo = activity[0].pic_url
    act_photo = generate_2D_barcodes(1)
    print 'act_photo is %s' % act_photo
    variables = RequestContext(request, {'uid': uid,
                                         'act_id': act_id,
                                         'act_name': act_name,
                                         'act_place': act_place,
                                         'act_begintime': act_begintime,
                                         'act_endtime': act_endtime,
                                         'act_photo': act_photo,
                                         'ticket_status': ticket_status,
                                         'ticket_seat': ticket_seat,
                                         'seat_row':seat_row,
                                         'seat_column':seat_column,
                                         'act_key': act_key})
    return render_to_response('activityticket.html', variables)


def help_view(request):
    variables = RequestContext(request, {'name': u'“紫荆之声”'})
    return render_to_response('help.html', variables)


def activity_menu_view(request, actid):
    activity = Activity.objects.get(id=actid)
    return render_to_response('activitymenu.html', {'activity': activity})


def helpact_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_activity.html', variables)


def helpclub_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_club.html', variables)


def helplecture_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_lecture.html', variables)


# Functions below are about choosing seats.
# By: Liu Junlin

def seat_mainmenu_view(request, uid):
    variables = RequestContext(request, {'uid': uid})

    tickets = Ticket.objects.filter(unique_id = uid)
    location = tickets[0].activity.seat_status

    if location == 0:
        pass

    if location == 1:
        pass

    if location == 2:
        seat_status_array = get_seat_status_tsinghua_hall(tickets[0])
        variables = RequestContext(request, {'seat_status': seat_status_array,
                                             'uid': uid})
        return render_to_response('seat_tsinghua_hall.html', variables)


    return render_to_response('seat_mainmenu.html', variables)


def seat_submenu(request, uid, block_id):
    variables = RequestContext(request, {'uid': uid, 'block_id': block_id})
    return render_to_response('seat_submenu.html', variables)


class DatetimeJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return json.JSONEncoder.default(self, obj)


@csrf_exempt # To avoid http 403 error.
def choose_seat_post(request, uid):
    if not request.POST:
        raise Http404

    post = request.POST
    rtnJSON = {}

    try:
        tickets = Ticket.objects.filter(unique_id = uid)
        current_ticket = tickets[0]

        if (current_ticket.status == 2) or (current_ticket.activity.start_time < datetime.now()):
            rtnJSON['error'] = u'已经过了选座位的时间啦'
            return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder),content_type='application/json')

        if current_ticket.status == 0:
            rtnJSON['error'] = u'这张票已经被你取消啦'
            return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder),content_type='application/json')

        seat_chosen = get_seat_chosen(post, current_ticket)
        tickets = Ticket.objects.filter(seat_id = seat_chosen)

        if tickets.exists():
            rtnJSON['error'] = u'这个座位已被其它小伙伴抢到了= ='
        else:
            current_ticket.seat_id = seat_chosen
            current_ticket.save()

    except Exception as e:
        rtnJSON['error'] = str(e)

    return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder), content_type='application/json')


def get_seat_chosen(post, ticket):
    location = ticket.activity.seat_status

    if location == 0:
        pass

    if location == 1:
        pass

    if location == 2:
        row = int(post['row'])
        column = int(post['column'])
        seat_id = (row - 1) * 10 + column + ticket.activity.seat_start - 1
        return seat_id


def get_seat_status_tsinghua_hall(ticket):
    activity = ticket.activity
    res = []
    for x in range(1, 5):
        row = []
        for y in range(1, 11):
            seat_id = (x - 1) * 10 + y
            seat_id = activity.seat_start + seat_id - 1
            if seat_id == ticket.seat_id:
                row.append(4)
            else:
                tickets = Ticket.objects.filter(seat_id = seat_id)
                if tickets.exists():
                    row.append(2)
                else:
                    row.append(1)
        res.append(row)
    return res



# Functions below are about voting
# By: LiuJunlin
def vote_main_view(request, voteid, stuid):
    vote = Vote.objects.get(id=voteid)
    voteDict = {}
    voteDict['id'] = voteid
    voteDict['name'] = vote.name
    voteDict['description'] = vote.description
    voteDict['pic_url'] = vote.pic_url
    voteDict['end_time'] = vote.end_time
    voteDict['max_num'] = vote.max_num
    voteDict['items'] = []

    voteItems = VoteItem.objects.filter(vote_key=vote.key)
    for item in  voteItems:
        itemDict = {}
        itemDict['name'] = item.name
        itemDict['pic_url'] = item.pic_url
        itemDict['description'] = item.description
        itemDict['vote_num'] = int(item.vote_num)
        itemDict['id'] = int(item.id)
        voteDict['items'].append(itemDict)

    return render_to_response('vote_mainpage.html', {
        'vote': voteDict,
        'stuid': stuid
    }, context_instance=RequestContext(request))


@csrf_exempt
def vote_user_post(request, voteid, stuid):
    if not request.POST:
        raise Http404

    post = request.POST
    rtnJSON = {}
    print post

    try:
        print 'test point 2 in vote_user_post'
        vote = Vote.objects.get(id=voteid)
        voteItems = VoteItem.objects.filter(vote_key=vote.key)

        for item in voteItems:
            singleVotes = SingleVote.objects.filter(stu_id=stuid, item_id=item.id)
            if singleVotes.exists():
                rtnJSON['error'] = u'你已经投过票啦！'
                return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder),content_type='application/json')

        print 'test point 3 in vote_user_post'
        for item in voteItems:
            k = str(item.id)
            if (k in post) and (post[k] == 'on'):
                preVote = {}
                preVote['item_id'] = item.id
                preVote['stu_id'] = stuid
                SingleVote.objects.create(**preVote)
                item.vote_num = item.vote_num + 1
                item.save()

    except Exception as e:
        print 'Error occured!!!!!' + str(e)
        rtnJSON['error'] = str(e)

    HttpResponse(json.dumps(rtnJSON), content_type='application/json')


def vote_item_detail(request, itemid):
    vote = VoteItem.objects.get(id=itemid)
    voteDict = {}
    voteDict['name'] = vote.name
    voteDict['pic_url'] = vote.pic_url
    voteDict['description'] = vote.description

    return render_to_response('vote_item_detail.html', {
        'vote': voteDict,
    }, context_instance=RequestContext(request))
