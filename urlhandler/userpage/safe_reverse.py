from django.core.urlresolvers import reverse
from queryhandler.settings import SITE_DOMAIN

def s_reverse_validate(openid):
	return SITE_DOMAIN + reverse('userpage.views.validate_view', kwargs={'openid': openid})


def s_reverse_activity_detail(activityid):
	return SITE_DOMAIN + reverse('userpage.views.details_view', kwargs={'activityid': activityid})


def s_reverse_ticket_detail(uid):
	return SITE_DOMAIN + reverse('userpage.views.ticket_view', kwargs={'uid':uid})

#def s_reverse_ticket_detail(uid):
#    print 'ccccccccccccccccccc'
#    return SITE_DOMAIN + reverse('userpage.views.seat_mainmenu_view')

def s_reverse_help():
	return SITE_DOMAIN + reverse('userpage.views.help_view')


def s_reverse_vote_mainpage(voteid, openid):
	return SITE_DOMAIN + reverse('userpage.views.vote_main_view', kwargs={'voteid': voteid, 'openid': openid})


def s_reverse_vote_validate_user(voteid):
	return SITE_DOMAIN + reverse('userpage.views.vote_validate_user', kwargs={'voteid': voteid})
