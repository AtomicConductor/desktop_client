#!/bin/sh
cd /release/build/conductor_solo

aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/solo --recursive --exclude '*' --include '*.zip'