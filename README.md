# CROssBARv2 GraphQL Module

<div align="center">
  <picture>
    <img alt="CROssBARv2 logo" style="width: 175px" src="https://graphql.org/_next/static/media/logo.ad338028.svg">
    <img alt="CROssBARv2 logo" style="width: 175px" src="https://crossbarv2.hubiodatalab.com/static/images/apollo.png">
  </picture>
</div>

<br>

<div align="center">
    <a href="https://github.com/HUBioDataLab/crossbar-graphql/actions/workflows/docker-publish.yml"><img alt="arxiv-badge" src="https://github.com/HUBioDataLab/crossbar-graphql/actions/workflows/docker-publish.yml/badge.svg"></a>
</div>

<br>

<div align="center">
    <img src='https://crossbarv2.hubiodatalab.com/static/images/graphql.avif'></img>
</div>

<br>

Access the CROssBARv2 database programmatically using a flexible **GraphQL** interface. You can build custom, nested queries to retrieve precisely the data you need. It's ideal for integrating CROssBARv2 into your analytical workflows or applications, and supports seamless development with tools like **Apollo Studio**. 

## Installation

Clone the repository:

```bash
git clone https://github.com/HUBioDataLab/crossbar-graphql
```

Install the module:

```bash
cd src/
npm install
```

Setup the environment, `.env` file is necessary for this module to work.
Please declare it with the template below.

```env
NEO4J_USERNAME=neo4j
MY_NEO4J_PASSWORD=neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_DATABASE_NAME=neo4j
API_PORT=4000
```

Then you should be able to run the module:

```bash
npm run
```