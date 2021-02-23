#!/bin/bash

set -e

# Install builder builds for the platform given by $1
platform=$1

version="$(jq -r .version  /artifacts/build/package.json)"

# Build: Override the version and destination
builder build ./installer/companion.xml ${platform} --setvars project.version=${version} project.outputDirectory=/artifacts/installers --license /opt/license.xml

# builder makes both dmg and app, but we don't want the app because it is seen as a folder in aws.
rm -rf /artifacts/installers/*.app
