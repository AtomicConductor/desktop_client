#!/bin/bash


# remove crap
appName=`cat build/package.json | json name`
rm build/${appName}/osx64/credits.html
rm build/${appName}/linux64/credits.html

# edit plist - call the app "Conductor"
infoPlist=build/${appName}/osx64/${appName}.app/Contents/Info.plist
xmlstarlet ed --inplace -u "/plist/dict/key[text() = 'CFBundleName' or text() = 'CFBundleDisplayName']/following-sibling::string[1]" -v 'Conductor' ${infoPlist} 
