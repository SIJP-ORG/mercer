# Mercer

[![Build Status](https://travis-ci.org/SIJP-ORG/mercer.svg?branch=master)](https://travis-ci.org/SIJP-ORG/mercer)

Mercer is a simple Slack bot that forwards Pivotal Tracker's updates to Slack.

## Install

```
% npm install
```

## Start

```
% TRACKER_API_TOKEN=pivotal_trackers_api_token \
SLACK_API_TOKEN=slacks_api_token \
node src/index.js
...
```

## Test

```
% npm test -s
...
%
```
