#!/bin/sh

set -e

cd /artifacts/installers
ls -lrt

# All installers are made available with an identifier: version-branch
# Examples:
# companion-0.4.1-my_fix-osx-installer.dmg
# companion-0.4.2-master-osx-installer.dmg
version="$(jq -r .version ../build/package.json)"
identifier="${version}-$(echo $CI_BRANCH | tr '/' '-')"

mv companion*dmg companion-${identifier}-osx-installer.dmg
mv companion*exe companion-${identifier}-windows-installer.exe
mv companion*run companion-${identifier}-linux-installer.run
aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/companion --recursive --acl public-read

# If on master, copy the files, with identifier latest.
if [ "$CI_BRANCH" == "master" ]; then

    mv companion*dmg companion-latest-osx-installer.dmg
    mv companion*exe companion-latest-windows-installer.exe
    mv companion*run companion-latest-linux-installer.run

    aws s3 cp companion-latest-osx-installer.dmg        s3://${AWS_S3_BUCKET_NAME}/companion/companion-latest-osx-installer.dmg --acl public-read
    aws s3 cp companion-latest-windows-installer.exe    s3://${AWS_S3_BUCKET_NAME}/companion/companion-latest-windows-installer.exe --acl public-read
    aws s3 cp companion-latest-linux-installer.run      s3://${AWS_S3_BUCKET_NAME}/companion/companion-latest-linux-installer.run --acl public-read

    # Place current-version.txt alongside the build so we can reference it in the docs.
    echo "$version @ `date`" > current-version.txt
    aws s3 cp current-version.txt s3://${AWS_S3_BUCKET_NAME}/companion/current-version.txt --acl public-read
fi