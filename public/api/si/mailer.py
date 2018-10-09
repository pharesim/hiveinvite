#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import errorHandler
from smtplib import SMTP_SSL as SMTP
from email.mime.text import MIMEText
import config

def sendmail(recipient,subject,message):
  SMTPserver  = config.config.smtp.server
  SMTPuser    = config.config.smtp.user
  SMTPpass    = config.config.smtp.password
  sender      = config.config.smtp.sender
  destination = [recipient]
  try:
    msg = MIMEText(message, 'plain')
    msg['Subject']= subject
    msg['From']   = sender 

    mail = SMTP(SMTPserver)
    mail.set_debuglevel(False)
    mail.login(SMTPuser, SMTPpass)
    try:
        mail.sendmail(sender, destination, msg.as_string())
    finally:
        mail.quit()
  except Exception:
    errorHandler.throwError('Sending mail failed')