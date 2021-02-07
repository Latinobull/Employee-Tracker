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