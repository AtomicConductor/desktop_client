#!/bin/bash

set -e

# Install builder builds for the platform given by $1
platform=$1

version="$(jq -r .version  /artifacts/build/package.json)"

# We don't number the filename for master. In this way, we don't have to keep
# changing the download links in docs and main site.

if [ "$CI_BRANCH" == "master" ]; then
    version=latest
else
    version="${version}-dev-$(echo $CI_BRANCH | tr '/' '-')"
fi

# Delete leftovers from prior runs.
rm -f /artifacts/installers/companion*

builder build ./installer/companion.xml ${platform} --setvars project.version=${version} project.outputDirectory=/artifacts/installers --license /opt/license.xml

# builder makes both dmg and app, but we don't want the app because it is seen as a folder in aws.
rm -rf /artifacts/installers/*.app
