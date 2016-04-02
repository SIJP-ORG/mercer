# Mercer

[![Build Status](https://travis-ci.org/SIJP-ORG/mercer.svg?branch=master)](https://travis-ci.org/SIJP-ORG/mercer)

Mercer is a simple Slack bot that forwards Pivotal Tracker's updates to Slack.

## Install

```
% npm install
```

## Start

First start the server in somewhere. Currently I'm using
[http://www.ibm.com/Bluemix] because that's free (as in free beer).

The server relies three environmental variables:

- PORT
- TRACKER_API_TOKEN
- SLACK_API_TOKEN

Then configure your Pivotal Tracker to use the server.
The setting is in https://www.pivotaltracker.com/projects > Settings >
Integrations > Activity Web Hook.

## Test

```
% npm test -s
...
%
```
