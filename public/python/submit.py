"""
Submit using Conductor Python client API 
"""

import sys
import json
from conductor.lib import conductor_submit

args = json.loads(sys.argv[1])
submission = conductor_submit.Submit(args)
response, response_code = submission.main()

response.update({"response_code": response_code})
print json.dumps(response)
