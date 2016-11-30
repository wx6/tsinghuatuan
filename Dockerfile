FROM python:2.7-onbuild

ENTRYPOINT ["./entrypoint.sh"]

CMD ["uwsgi", "--ini", "uwsgi.ini"]
