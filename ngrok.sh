#!/bin/bash
source .env
ngrok config add-authtoken $YOUR_AUTHTOKEN
ngrok http $PORT
