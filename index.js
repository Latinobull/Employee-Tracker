const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASS,
  database: "employee_tracker",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  console.log("\n");
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "Welcome to the Employee Tracker Application\n",
      pageSize: 25,
      choices: [
        new inquirer.Separator("-----Employees-----"),
        "view employees",
        "edit employees",
        "add employees",
        "delete employees",
        new inquirer.Separator("\n-------Roles-------"),
        "view roles",
        "edit roles",
        "add roles",
        "delete roles",
        new inquirer.Separator("\n----Departments----"),
        "view departments",
        "edit departments",
        "add departments",
        "delete departments",
        new inquirer.Separator("\n-------Budget-------"),
        "view budget",
      ],
    })
    .then(function (ans) {
      switch (ans.menu) {
        case "view employees":
          emp.view();
          break;
        case "edit employees":
          emp.edit();
          break;
        case "add employees":
          emp.add();
          break;
        case "delete employees":
          emp.delete();
          break;
        case "view roles":
          viewDB("role");
          break;
        case "edit roles":
          role.edit();
          break;
        case "add roles":
          role.add();
          break;
        case "delete roles":
          role.delete();
          break;
        case "view departments":
          viewDB("department");
          break;
        case "edit departments":
          dep.edit();
          break;
        case "add departments":
          dep.add();
          break;
        case "delete departments":
          dep.delete();
          break;
        case "view budget":
          budget();
          break;
        default:
          break;
      }
    });
}

const emp = {
  view: function () {
    inquirer
      .prompt({
        type: "list",
        name: "view",
        message: "Who do you want to view?\n",
        pageSize: 25,
        choices: ["view employees", "view managers"],
      })
      .then(function (ans) {
        if (ans.view === "view employees") {
          viewDB("employee");
        } else {
          viewDB("manager");
        }
      });
  },
  edit: function () {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;

      console.log(res);
      inquirer
        .prompt([
          {
            type: "list",
            name: "choice",
            message: "choose an employee to edit\n",
            pageSize: 20,
            loop: false,
            choices: function () {
              var choiceArray = [];

              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].first_name + " " + res[i].last_name);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (ans) {
          let userChoice;
          for (var i = 0; i < res.length; i++) {
            if (res[i].first_name + " " + res[i].last_name === ans.choice) {
              userChoice = res[i];
              console.log("You Choose " + userChoice);
            }
          }
        });
    });
  },
};

function viewDB() {
  connection.query(
    `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) as employee_name, role.title as role,
         CONCAT(manager.first_name, " ", manager.last_name) as manager_name
        FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager on employee.manager_id = manager.id`,
    function (err, res) {
      if (err) throw err;
      console.log("Here are your employees");
      console.table(res);
      start();
    }
  );
}
