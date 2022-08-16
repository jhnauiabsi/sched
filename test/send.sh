#!/usr/bin/env bash

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwidXNlcl9pZCI6IjUwZTQxMjc0LWZmNjItNGYyOC05Mzg0LWE3MGJiNTBjOTk2MyIsInVzZXJfdHlwZSI6IkRldiIsImlhdCI6MTY1MTA0MDIyNCwiZXhwIjoxNjUzNjMyMjI0fQ.rngq_aZNZpmMs7htV7WHmNweZMiG_FWPvI_ZTnhTOxU

curl -v -X POST http://localhost:5014/ \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Authorization: Bearer $token" \
-d @message.json