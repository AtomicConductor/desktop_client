import sys
# import os
import json
# import conductor
from conductor.lib import downloader, downloader2

# , loggeria

for arg in sys.argv[1:]:
    print arg

if len(sys.argv[1:]) != 1:
    raise ValueError("Provide a JSON args dict.")
    # sys.stdout.write(env[k])
    # sys.stdout.flush()

# print("This website stores cookies on your computer.")
# print("These cookies are used to collect information about")
# print("A single cookie will be used in your")

# args_dict = vars(args)

# Code switcher between new downloader and old downloader
# HARD set windows users to old downloader

args_dict = json.loads(sys.argv[1])

if sys.platform == "win32":
    downloader2.run_downloader(args_dict)
if args_dict.get("task_id") and not args_dict.get("job_id"):
    raise ValueError('Must supply a job_id with task_id.')

if args_dict.get("job_id") or args_dict.get("alt"):
    downloader2.run_downloader(args_dict)
else:
    downloader.run_downloader(args_dict)
