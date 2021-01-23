# National (AU) Public Toilet API

REST API built with Golang

## Endoints

- GET: /toilet/<ID> ; Get a specific toilet location by ID (uuid)
- GET: /toilets ; Get ONE toilet (sample response)
- POST: /toilets with body {lat: <>, long: <>} ; Get 3 toilets within 500meters of given coordinates (JSON body)

## The POST endpoint, finds the toilets 500 meters closest to the given GPS location

This server uses ports 8080 and 8443
