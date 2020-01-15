#!/bin/sh
cd /release/build/companion

if [[ "$CI_BRANCH" == "master" ]]; then
    releaseSuffix=latest
else
    releaseSuffix=dev-$CI_BRANCH
fi

for artifact in */
do
    (cd $artifact && zip -ry ../conductor-companion-${releaseSuffix}-${artifact%/}.zip .)
done
