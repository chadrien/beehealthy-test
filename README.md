# BeeHealthy technical test

## Backend

The backend is made with [NestJS](https://nestjs.com/), a NodeJS framework.

### Installation

```bash
# `-w backend` refers to the backend workspace (see https://docs.npmjs.com/cli/v7/using-npm/workspaces)
$ npm -w backend install
```

### Running the app

```bash
# development
$ npm -w backend run start:dev
```

### Testing

```bash
# unit tests
$ npm -w backend run test

# e2e tests
$ npm -w backend run test:e2e
```

### Linting

```bash
$ npm -w backend run lint
```

## Frontend

The frontend is made with [NextJS](https://nextjs.org/), a React framework. Queries are made with [Apollo Client](https://www.apollographql.com/docs/react/).

### Installation

```bash
$ npm -w frontend install

# Copy the default environment file
# and edit it to match your configuration
$ cp backend/.env.default backend/.env
```

### Running the app

```bash
# development
$ npm -w frontend run dev
```

### Linting

```bash
$ npm -w frontend run lint
```

### GraphQL code generation

```bash
$ npm -w frontend run graphql:generate
```
