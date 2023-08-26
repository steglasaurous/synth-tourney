# Quick Start

## Configuring Google connection

- Create a service account in google, and ensure it has scopes for google sheets read and write.
- Download the service account's credentials.json and put in the root of this server as `credentials.json`
- In the spreadsheet you wish to edit, ensure the service account user has edit access to it
- Edit the google sheet listener with the spreadsheet id, tab names and ranges

## Running locally
```
npm install
npm run typeorm:run-migrations # Creates the database - currently sqlite
npm run start # Starts the server locally on port 3000
```

## Starting in Docker

```
docker build . -t synth-tourney
# Running solo (no HTTPS)
docker run synth-tourney -p 3000:3000

# Use in conjunction with nginxproxy/nginx-proxy and nginxproxy/acme-companion for HTTPS certs and proxy
docker run -e VIRTUAL_HOST=scores.steglasaurous.com LETSENCRYPT_HOST=scores.steglasaurous.com synth-tourney 
```

# Working with TypeORM migrations

I setup typeORM migrations as per: https://wanago.io/2022/07/25/api-nestjs-database-migrations-typeorm/

In short, see the scripts in package.json for the typeorm migration commands.

- Make sure to add new entities and migrations to the list in src/typeorm.config.ts

# Todo list

- [ ] Update google sheet listener to have sheet name and tab names to be configurable
- [x] Add condition to only push one submission to google sheet per play instance
- [x] Update spreadsheet listener to match new spreadsheet layout
- [ ] Think about how google sheets can fit into the broader picture
- [ ] Update docker config and sqlite db location so it can be persisted in a docker volume (ex: in a var folder)
- [ ] Replace "hello world" default controller with something useful.
- [ ] Write unit tests for all functionality to date
- [ ] Come up with a plan on how to track a tournament instance that spans multiple rooms
- [ ] Determine how to handle repeats of the same song but in a different instance
- [ ] Handle cases of song 'bail-outs' (i.e. everyone aborts a song to start it again for some reason)
- [ ] Add tournament tables
- [ ] Add ability to enable/disable receiving score submissions
- [ ] Implement Steam SSO
- [ ] Implement remaining entities
