#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import errorHandler
import sqlite3
import config

conn = sqlite3.connect(config.config.db.file)
conn.row_factory = sqlite3.Row
c = conn.cursor()

def select(table,fields,condition,order):
  query = 'SELECT '
  length = len(fields)
  t = ()
  for count,field in enumerate(fields):
    query = query+field
    if count+1 != length:
      query = query+', '
  query = query+' FROM '+table+' WHERE '
  if type(condition) is dict:
    length2 = len(condition)
    count2 = 0
    for key,value in condition.items():
      count2 = count2+1
      if value == 'is null':
        query = query+key+' '+value
      else:
        query = query+key+'=?'
        t = t + (value,)
      if count2 != length2:
        query = query+' and '
  else:
    query = query+condition
  query = query+' ORDER BY '+order
  c.execute(query,t)
  return c.fetchall()


def insert(table,values):
  query = 'INSERT OR IGNORE INTO '+table+' ('
  length = len(values)
  count = 0
  t = ()
  valuesquery = ') VALUES ('
  for key,value in values.items():
    query = query+key
    if value == 'CURRENT_TIMESTAMP':
      valuesquery = valuesquery+value
    else:
      valuesquery = valuesquery+'?'
      t = t + (value,)
    count = count + 1
    if count < length:
      query = query+', '
      valuesquery = valuesquery+','
  query = query+valuesquery+')'
  try:
    with conn:
      c.execute(query,t)
  except Exception as e:
    errorHandler.throwError("Failed writing to database, please try again; "+str(e))


def update(table,values,condition):
  query = 'UPDATE '+table+' SET '
  length = len(values)
  count = 0
  t = ()
  for key,value in values.items():
    query = query+key+'='
    if value == 'CURRENT_TIMESTAMP':
      query = query+value
    else:
      query = query+'?'
      t = t + (value,)
    count = count + 1
    if count < length:
      query = query+', '
  query = query+' WHERE '
  for key,value in condition.items():
    query = query+key+'=?'
    t = t + (value,)
    count = count + 1
    if count < length:
      query = query+' and '
  try:
    with conn:
      c.execute(query,t)
  except Exception as e:
    errorHandler.throwError("Failed writing to database, please try again; "+str(e))


def delete(table,condition):
  query = 'DELETE FROM '+table+' WHERE '
  t = ()
  length = len(condition)
  count = 0
  for key,value in condition.items():
    count = count+1
    query = query+key+'=?'
    t = t + (value,)
    if count < length:
      query = query+' and '
  try:
    with conn:
      c.execute(query,t)
  except Exception as e:
    errorHandler.throwError("Failed to access database, please reload the page; "+str(e))