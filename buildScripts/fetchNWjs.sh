#!/bin/bash

set -e

# We download NWJS with wget because nw-builder's downloader is unreliable.
# If we put files in the /cache directory, nw-builder willl skip download.

nwjs_version="$(jq -r .nwBuilder.version  ./package.json)"

# Fetch, unzip, and move
url=https://dl.nwjs.io/v${nwjs_version}

# Try mirror
# url=https://cnpmjs.org/mirrors/nwjs/v${nwjs_version}

win_folder=nwjs-v${nwjs_version}-win-x64
mac_folder=nwjs-v${nwjs_version}-osx-x64
lin_folder=nwjs-v${nwjs_version}-linux-x64

win_url=${url}/${win_folder}.zip
mac_url=${url}/${mac_folder}.zip
lin_url=${url}/${lin_folder}.tar.gz


 
echo "Downloading ${win_url}..."
wget ${win_url} 
unzip ${win_folder}.zip

echo "Downloading ${mac_url}..."
wget ${mac_url} 
unzip ${mac_folder}.zip

echo "Downloading ${lin_url}..."
wget ${lin_url} 
tar xvf ${lin_folder}.tar.gz

echo "Done downloading, cleaning up"
rm *.tar.gz *.zip
echo "Removed archives"

version_dir=/work/cache/${nwjs_version}-normal/

echo "Ensure version dir exists in /cache"
rm -rf $version_dir
mkdir -p $version_dir
echo "Done ${version_dir}"

echo "Move files to ${version_dir}"
mv ${win_folder} ${version_dir}/win64
mv ${mac_folder} ${version_dir}/osx64
mv ${lin_folder} ${version_dir}/linux64
echo "Done moving files"

echo "Fetch NWJS"


