# National (AU) Public Toilet API

REST API built with Golang

Data from https://data.gov.au/dataset/ds-dga-553b3049-2b8b-46a2-95e6-640d7986a8c1/details

## Endoints

- GET: /toilets ; Get ONE toilet (sample response)
- GET: /toilet/<ID> ; Get a specific toilet location by ID (uuid)
- POST: /toilets with body {lat: <>, long: <>} ; Get 3 toilets within 500meters of given coordinates (JSON body)
- POST: /api/toilets-dist with body {lat: <>,  long: <>,  distance: <int>}  ; Get 3 toilets within X meters of given coordinates & distance (JSON body)

This server uses ports 8080 and 8443
