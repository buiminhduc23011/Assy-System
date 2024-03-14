@echo off

TIMEOUT 10

cd C:\Server_PLC
pm2 start Server.js
-1