#!/usr/bin/python
from subprocess import Popen,PIPE
import signal
import traceback
from os import kill
from sys import exit
import logging as log
log.basicConfig(level=log.DEBUG)

pid = None
def signal_handler(signal, frame):
  global pid
  print('Killing Child %s'%pid)
  kill(pid,9)
  exit(0)

from time import time
import socket
import scha
scha_host='shackles.shack'
scha_port=9151
scha_store=0
r = scha.connect(host=scha_host, port=scha_port, store=scha_store)
def all_scha_window(arr, host="test.tracker", port=9152):
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect((host, port))
  msg=""
  for l in arr:
    path = l[0]
    data = l[1]
    try: ts = int(l[2])
    except: ts = int(time())
    msg+="%s %s %d\n"%(path,data,ts)
  log.info(msg)
  s.sendall(msg)
  s.close()

def send_scha(path,data,ts):
  try: ts = int(ts)
  except: ts = int(time())
  log.debug("hmset %s %d %s"%(path,ts,data))
  r.hmset(path,{str(ts):data})

def to_scha_window(path,data,ts=None,host="test.tracker",port=9152):
  #send_scha(path,data,ts)
  all_scha_window([(path,data,ts)],host,port)

def main():
  global pid
  cmd = Popen(["/usr/test.tracker/client.pipe"], stdout=PIPE,stderr=PIPE,stdin=PIPE)
  tracker = -1
  """
  flag1         = 0
  flag2         = 0
  flag3         = 1
  max_distance  = 255
  min_distance  = 100
  id            = 1
  channel       = 218
  bark          = 485
  """
  pid = cmd.pid
  tracker = -1
  distance = None
  channel_switch = -1
  for line in iter(cmd.stderr.readline, b''):
    log.debug("received: %s" %line.rstrip("\n"))
    if line.startswith("peer_window"):
      peer_window = line.split(" ")[-1].strip()
    if line.startswith("distance"):
      distance= line.split(" ")[-1].strip()
    elif line.startswith("id"):
      ident = int(line.split(" ")[-1],16)
    elif line.startswith("hss_id"):
      hss_id = int(line.split(" ")[-1],16)
      log.debug(ident)
      if ident == 5:
        all_scha_window([
        ("scha.tracker.servers.peer_port.peer_window",peer_window),
        ("scha.tracker.servers.peer_port.distance",distance),
        ("scha.tracker.servers.peer_port.tracker",tracker),
        ("scha.tracker.servers.peer_port.channel_switch",channel_switch),
        ("scha.tracker.servers.peer_port.channel",channel),
        ("scha.tracker.servers.peer_port.id",ident),
        ("scha.tracker.servers.peer_port.ss_id",ss_id),
        ("scha.tracker.servers.peer_port.hss_id",hss_id)
        ])

  cmd.wait()

if __name__ == "__main__":
  signal.signal(signal.SIGINT, signal_handler)
  signal.signal(signal.SIGSEGV, signal_handler)
  signal.signal(signal.SIGCHLD, signal_handler)
  signal.signal(signal.SIGTERM, signal_handler)
  log.debug("startup")
  try:
    main()
  except Exception as e:
    log.error("Error, quit")
    log.error(traceback.format_exc())
    signal_handler(0,0)
