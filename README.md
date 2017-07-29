# Coding Challenge
> This is a coding challenge given to me for a company I applied at.

## Team
  - __Development__: Bruce Graham

## How To Start The Database
-Install mySQL to your machine if it isnt already and run the database.
-In another terminal window shell into your database by running '/usr/local/mysql/bin/mysql -u root -p;' then enter the password.
-With your database command line open now run 'CREATE DATABASE massdrop;' then run 'USE massdrop'
-With your db command line then run 'CREATE TABLE `sites` (`id` INTEGER NOT NULL auto_increment , `url` VARCHAR(255), `html` TEXT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`));'.
-You will need to update the password for the database in database/database.js at line 3.

## How To Start The Servers
-Download this repository to your local machine.
-In your terminal, cd into the root folder of this repository.
-In your terminal run 'npm install' to download dependencies.
-In your terminal run 'npm start' to run your server.
-In another terminal window run 'node server/worker.js' to run your worker.



