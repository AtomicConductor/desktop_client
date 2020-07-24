"""
Submit using Conductor Python client API 
"""

import sys
import json

if len(sys.argv) == 3:
    module_path = sys.argv[2]
    sys.path.insert(0, module_path)
    print "Prepending {} to Python sys.path".format(module_path)

args = json.loads(sys.argv[1])

try:
    print "Attempt to import conductor_submit from the new ciocore"
    from ciocore import conductor_submit
except ImportError:
    print "Import from ciocore failed"
    print "Fallback to conductor.lib"
    from conductor.lib import conductor_submit

args = json.loads(sys.argv[1])
submission = conductor_submit.Submit(args)
response, response_code = submission.main()

response.update({"response_code": response_code})
print json.dumps(response)
