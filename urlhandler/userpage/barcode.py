from django.http import HttpResponse, Http404
from django.template import RequestContext
from weixinlib.settings import WEIXIN_TOKEN
import urllib, urllib2


def generate_2D_barcodes(request, key):
	req_url =  'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + WEIXIN_TOKEN
	values = {"action_name":"QR_LIMIT_SCENE","action_info": {"scene": {"scene_id": key}}}
	req_data = urllib.urlencode(values)
	req = urllib2.Request(req_url, req_data)
	res = urllib2.urlopen(req)
	try:
		res_data = res.read()
	except:
		return "error"
	if "ticket" in res_data:
		data = eval(res_data)
		return data['ticket']
	else:
		return "error"

def get_2D_barcodes(key):
	img_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + str(key)
	return img_url