#!/bin/sh
cd /release/build/conductor-desktop

if [[ "$CI_BRANCH" == "master" ]]; then 
    releaseSuffix=latest
else
    releaseSuffix=dev-$CI_BRANCH
fi

for artifact in */
do  
    (cd $artifact && zip -ry ../conductor-desktop-${releaseSuffix}-${artifact%/}.zip .)
done