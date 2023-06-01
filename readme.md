# Basic application using Node and Express with TypeScript

This is a  REST api app for NodeJS and Express

## Setup
run the following in order
- `npm init`
- `npm install express nodemon typescript @types/express @types/node concurrently mongoose`
- create folders "src" and "public"
- create an empty server.ts file under src folder
- `tsc --init`
    - this will generate a tscconfig file that needs to be modified - copy from the files above
-

## Current Features

- Use TypeScript with classes and interfaces
- Add tests using jest and supertest
- Creates a docker image
- Connects to the db to fetch and save data
- uses Trie data structure to search as u type

## Features to be added
- Hook up to ci/cd using github actions
- Add deployment using Kubernetes
