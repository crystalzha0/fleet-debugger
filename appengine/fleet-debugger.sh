#!/bin/sh
exec node index.js serve --apikey=$APIKEY --port=$PORT --daysAgo=30
