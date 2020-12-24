#!/usr/bin/env bash

set -e

cwd=`pwd`
script_folder=`cd $(dirname $0) && pwd`

if [ "$OSTYPE" == "darwin"* ]; then
  mkdir -p $script_folder/../build
  gcc -o $script_folder/../build/mouse $script_folder/../src/mouse.m -framework ApplicationServices -framework Foundation
else
  echo "Only macOS is supported."
fi
