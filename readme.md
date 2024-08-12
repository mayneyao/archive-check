# URL Archive Checker

## Project Overview

URL Archive Checker is a Cloudflare Worker project designed to check the accessibility of a given URL and provide an archived version from Web Archive when the original content is unavailable.

## Features

- Check the accessibility of a specified URL
- Redirect directly to the original URL if accessible
- Query the latest archived version from Web Archive if the URL is inaccessible or redirected
- Redirect to the Web Archive's archived page if an archived version exists
- Redirect to Web Archive's general timeline page if no archived version is available

## Usage

After deployment, you can use the service with the following URL format:

https://archive-check.gine.workers.dev/https://example.com

e.g. https://archive-check.gine.workers.dev/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90


## Dev

http://localhost:8787/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90
