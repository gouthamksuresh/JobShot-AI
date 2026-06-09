import urllib.request
import json
import time

url = "https://jobshot-ai.onrender.com/generate"
payload = {
    "job_description": "Looking for a DevOps engineer with Python experience.",
    "company": "TestCorp",
    "role": "DevOps Engineer",
    "hr_email": "hr@test.com"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as res:
        pass
except urllib.error.HTTPError as e:
    print("500 ERROR BODY:")
    print(e.read().decode('utf-8'))
