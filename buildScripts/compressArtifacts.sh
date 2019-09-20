#!/bin/sh
cd /release/build/conductor-desktop

if [[ "$CI_BRANCH" != "master" ]]; then 
    releaseSuffix=dev-$CI_BRANCH-
fi

for artifact in */
do  
    (cd $artifact && zip -ry ../conductor-desktop-latest-${releaseSuffix}${artifact%/}.zip .)
done