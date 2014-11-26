from django.http import HttpResponse, Http404
from django.template import RequestContext
from weixinlib.settings import WEIXIN_TOKEN
import urllib, urllib2
import json
from weixinlib.base_support import get_access_token
from weixinlib.settings import WEIXIN_TOKEN


def generate_2D_barcodes(key):
    req_url =  'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + get_access_token()
    values = {"action_name":"QR_LIMIT_SCENE","action_info": {"scene": {"scene_id": key}}}
    req_data = json.dumps(values)
    print req_data
    req = urllib2.Request(req_url, req_data)
    res = urllib2.urlopen(req)
    try:
        res_data = res.read()
    except:
        return 'http://lib.tsinghua.edu.cn/dra/sites/all/themes/theme_for_note/images/bj.jpg'
        print "exception"
    if 'url' in res_data:
        data = eval(res_data)
        img_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data['ticket']
        print "success"
        return img_url
    else:
        print res_data
        return 'http://avatar.csdn.net/4/1/0/1_chenggong2dm.jpg'

# Get two-dimensional barcodes from weixin server
def get_2D_barcodes(key):
    img_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + str(key)
    return img_url