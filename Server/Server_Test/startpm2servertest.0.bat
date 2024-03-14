@echo off

TIMEOUT 15

cd C:\Server_Test
pm2 start Server.js
-1