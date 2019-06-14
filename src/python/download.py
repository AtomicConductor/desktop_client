import sys
import os
import conductor
from conductor.lib import downloader, downloader2, loggeria
# simple argument echo script


env = os.environ
for k in env:
    print "{} = {}".format(k, env[k])
    # sys.stdout.write(env[k])
    # sys.stdout.flush()

# print("This website stores cookies on your computer.")
# print("These cookies are used to collect information about how you interact with our website.")
# print("A single cookie will be used in your browser to remember your preference/")
