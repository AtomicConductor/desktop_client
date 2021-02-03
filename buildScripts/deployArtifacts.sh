#!/bin/sh

set -e

cd /artifacts/installers

aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/companion --recursive --acl public-read 

if [[ "$CI_BRANCH" == "master" ]]; then
    version="$(jq -r .version ../build/package.json)"
    echo "$version @ `date`" > current-version.txt
    aws s3 cp current-version.txt s3://${AWS_S3_BUCKET_NAME}/companion/current-version.txt --acl public-read
fi
