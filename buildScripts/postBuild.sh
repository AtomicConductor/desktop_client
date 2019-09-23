#!/bin/bash

appName="conductor-desktop" 
mv build/${appName}/osx64 build/${appName}/macos64
rm build/${appName}/macos64/credits.html
rm build/${appName}/linux64/credits.html

infoPlist=build/${appName}/macos64/${appName}.app/Contents/Info.plist
xmlstarlet ed --inplace -u "/plist/dict/key[text() = 'CFBundleName' or text() = 'CFBundleDisplayName']/following-sibling::string[1]" -v 'Conductor Desktop' ${infoPlist} 