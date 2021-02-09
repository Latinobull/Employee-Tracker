DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT AUTO_INCREMENT NOT NULL,
department_id INT(10) NULL,
title VARCHAR(45) NULL,
salary DECIMAL(10, 2) NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(45) NULL,
last_name VARCHAR(45) NULL,
role_id INT(10) NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id)
);

