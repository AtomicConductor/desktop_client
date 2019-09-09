#!/bin/sh
cd /release/build/conductor

aws s3 cp ./ s3://${AWS_S3_BUCKET_NAME}/desktop-app --recursive --exclude '*' --include '*.zip'