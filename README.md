# Quick Start

```
npm install
npm run typeorm:run-migrations # Creates the database - currently sqlite
npm run start # Starts the server
```

# Working with TypeORM migrations

I setup typeORM migrations as per: https://wanago.io/2022/07/25/api-nestjs-database-migrations-typeorm/

In short, see the scripts in package.json for the typeorm migration commands.

- Make sure to add new entities and migrations to the list in src/typeorm.config.ts

