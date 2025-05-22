# crossbar-graphql

[![Docker](https://github.com/HUBioDataLab/crossbar-graphql/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/HUBioDataLab/crossbar-graphql/actions/workflows/docker-publish.yml)

## env file

`.env` file is necessary for this package to work.
Please declare it with the template below.

```env
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_DATABASE_NAME=neo4j
API_PORT=4000
```
