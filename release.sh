#!/usr/bin/env bash
zip JustDeleteMe-`git describe --abbrev=0 --tags`.zip _locales/*/* img/* js/* manifest.json
