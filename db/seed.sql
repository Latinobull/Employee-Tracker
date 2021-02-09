INSERT INTO department (department_name) VALUES
("Sales"),
("Financing"),
("Legal"),
("Engineering");

INSERT INTO role (department_id, title, salary) VALUES
-- employee positions
(1, "Sales Associate", 35000),
(1, "Sales Support", 65000),
(2, "Lead Accountant", 80000),
(2, "Tax Specialist", 75000),
(3, "Lawyer", 100000),
(3, "Human Resources", 95000),
(4, "Lead Engineer", 100000),
(4, "Junior Developer", 65000),
-- manager positions
(1, "Sales Manager", 110000),
(2, "Accounts Manager", 120000),
(3, "Chief HR Officer", 195000),
(4, "Engineering Manager", 150000);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
-- regular
("Jeremiah", "Vega", 1, 5),
("Johnny", "Perez", 2, 6),
("Amelia", "Lopez", 3, 7),
("Shelly", "Landrau", 4, 8),
-- managers
("Donnahue", "George", 9, NULL),
("Caroline", "Lynch", 10, NULL),
("Fiach", "Hill", 11, NULL),
("Alex", "Wooley", 12, NULL)