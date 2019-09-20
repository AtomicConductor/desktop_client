#!/bin/bash

appName="conductor-desktop" 
mv build/${appName}/osx64 build/${appName}/macos64
rm build/${appName}/macos64/credits.html
rm build/${appName}/linux64/credits.html