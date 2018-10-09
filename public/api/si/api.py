#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import json

def output(values):
  print("Content-Type: application/json")
  print()
  print(json.dumps(values))