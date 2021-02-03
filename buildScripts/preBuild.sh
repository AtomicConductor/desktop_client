#!/bin/bash

# Removes react and redux devtools.
json -I -f package.json -e "this['chromium-args']=''"
