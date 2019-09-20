#!/bin/sh
cd /release/build/conductor-desktop

aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/conductor-desktop --recursive --exclude '*' --include '*.zip'

if [[ "$CI_BRANCH" == "master" ]]; then 
    version="$(jq -r .version ../package.json)"
    echo "$version @ `date`" > current-version.txt
    aws s3 cp current-version.txt s3://${AWS_S3_BUCKET_NAME}/conductor-desktop/current-version.txt
fi