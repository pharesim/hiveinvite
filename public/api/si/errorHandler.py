#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import sys
import api

def throwError(errorMessage):
  api.output({"error":errorMessage})
  sys.exit()