# National (AU) Public Toilet API

REST API built with Express, Mongo (hosted externally - on MLab), and node

Data from https://data.gov.au/dataset/ds-dga-553b3049-2b8b-46a2-95e6-640d7986a8c1/details

## Endoints

- GET: /api
- GET: /api/toilets
- POST:/api/toilets with body {lat: <>, long: <>}

## The POST endpoint, finds the toilets 500 meters closest to the given GPS location

`db.toilets.find( { loc: { $near : { $geometry: { type: "Point", coordinates: [144.957442, -37.803926] }, $minDistance: 0, $maxDistance: 500 } } } )`

This server uses ports 8080 and 8443
