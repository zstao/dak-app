#!/bin/bash
_DIR=$(pwd)
_SOURCE="/server-mocks/db.js"
_TARGET=$_DIR$_SOURCE
echo $_TARGET
json-server --watch $_TARGET