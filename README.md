# test-case

## To start project follow these steps:

- Open terminal in root directory

- Install node_modules with command: **npm i**

- node_modules should be created after this command

- Compile TypeScript files with command: **npm run compile**

- dist folder should be created after this command

- Create .env file in root directory, you can use .env.template as an example. If .env file is empty, application uses default settings.

- If different variables provided in .env file, please configure **docker-compose.yml** file with those variables.

- After that run command: **npm run start**

- The application will be launched.

## To Start Daily Sending Mails

- If there isn't dist folder, compile TypeScript files with command: **npm run compile**

- dist folder should be created after this command

- Open new terminal in root directory

- To start Cron Job for sending Daily Emails run command: **npm run cron-start**

- If terminal is killed, Cron Job will stop and will be no longer working.

## Api Docs

- Swagger is available at /docs path.

- Postman collection avaliable at https://www.getpostman.com/collections/1528480174f181b4a009
