import time
import json
import sys

for i in range(2):
    print("Some long {} line of log foo bar yum impedit quo vitae dolor dolore praesentium. Non cupiditate placeat et non. Et quia velit. Provident porro ut nam eum et vel neque ut. Odio sint aperiam impedit labore explicabo dolores. Voluptatem qui numquam ".format(i))
    time.sleep(1)

# raise ValueError("There was a bad value")

# response = {
#     "body": "job submitted.",
#     "status": "success",
#     "uri": "/jobs/00123",
#     "jobid": "00123",
#     "response_code": 201
# }

response = {
    "body": "something",
    "uri": "/something",
    "jobid": "something",
    "response_code": 500

}

print json.dumps(response)