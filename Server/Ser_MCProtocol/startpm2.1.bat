@echo off

TIMEOUT 15

cd C:\Server_PLC
pm2 start Write.js
-1