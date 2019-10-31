"""
Submit using Conductor Python client API 

Don't delete
"""

import sys
import json
from conductor.lib import conductor_submit

args = json.loads(sys.argv[1])
submission = conductor_submit.Submit(args)
response, response_code = submission.main()
print response_code
print response
