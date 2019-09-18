#!/bin/sh
cd /release/build/conductor_solo

version="$(jq -r .version ../package.json)"

if [[ "$CI_BRANCH" != "master" ]]; then 
    releaseSuffix=dev-$CI_BRANCH-
fi

for artifact in */
do 
    (cd $artifact && zip -ry ../conductor-solo-$version-${releaseSuffix}${artifact%/}.zip .)
done