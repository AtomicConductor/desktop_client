#!/bin/sh

set -e

cd /release/build/conductor-companion

if [[ "$CI_BRANCH" == "master" ]]; then
    releaseSuffix=latest
else
    releaseSuffix="dev-$(echo $CI_BRANCH | tr '/' '-')"
fi

for artifact in */
do
    (cd "$artifact" && zip -ry "../conductor-companion-${releaseSuffix}-${artifact%/}.zip" .)
done
