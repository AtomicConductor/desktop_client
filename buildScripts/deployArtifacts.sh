#!/bin/sh

set -e

cd /artifacts/installers
ls -lrt

aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/companion --recursive --acl public-read
rename -n 's/companion-(.*)(linux|osx|windows)\-installer\.(.*)/companion-latest-$2-installer.$3/' companion*

# Upload build as `latest` version.
if [ "$CI_BRANCH" == "master" ]; then
    version="$(jq -r .version ../build/package.json)"
    echo "$version @ `date`" > current-version.txt

    # Update the latest version.
    rename -n 's/companion-(.*)(linux|osx|windows)\-installer\.(.*)/companion-latest-$2-installer.$3/' companion*
    aws s3 cp companion-latest-* / s3://${AWS_S3_BUCKET_NAME}/companion --recursive --acl public-read

    aws s3 cp current-version.txt s3://${AWS_S3_BUCKET_NAME}/companion/current-version.txt --acl public-read
fi
