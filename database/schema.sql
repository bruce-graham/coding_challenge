CREATE DATABASE massdrop;

USE massdrop;

CREATE TABLE sites (
  id INTEGER NOT NULL auto_increment ,
  url VARCHAR(255),
  html TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id)
);

