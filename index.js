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
          role.view();
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
          dep.view();
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
  },
  edit: function () {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      let empData = res;

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
              console.log("You Choose " + JSON.stringify(userChoice));
            }
          }
          let roleData = "";
          let roleArr = [];
          // get data from role table
          connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err;
            roleData = res;
            for (var i = 0; i < res.length; i++) {
              roleArr.push(res[i].title);
            }
          });

          inquirer
            .prompt([
              {
                name: "firstname",
                message: "\nfirst name: ",
                type: "input",
                default: userChoice.first_name,
              },
              {
                name: "lastname",
                message: "last name: ",
                type: "input",
                default: userChoice.last_name,
              },
              {
                name: "role",
                message: "role: ",
                type: "list",
                choices: roleArr,
              },
              {
                name: "manager",
                message: "select manager: ",
                type: "list",
                choices: function () {
                  let choiceArray = [];
                  for (var i = 0; i < empData.length; i++) {
                    choiceArray.push(
                      empData[i].first_name + " " + empData[i].last_name
                    );
                  }
                  return choiceArray;
                },
              },
            ])
            .then(function (ans) {
              // add data to object
              let updateEmployee = {};
              updateEmployee.first_name = ans.firstname;
              updateEmployee.last_name = ans.lastname;
              // find role id based on title
              for (let i = 0; i < roleData.length; i++) {
                if (ans.role === roleData[i].title) {
                  updateEmployee.role_id = roleData[i].id;
                }
              }
              // get employee id based on name
              for (let i = 0; i < empData.length; i++) {
                if (
                  ans.manager ===
                  empData[i].first_name + " " + empData[i].last_name
                ) {
                  updateEmployee.manager_id = empData[i].id;
                }
              }
              connection.query(
                "UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=? WHERE id=?;",
                [
                  updateEmployee.first_name,
                  updateEmployee.last_name,
                  updateEmployee.role_id,
                  updateEmployee.manager_id,
                  userChoice.id,
                ],
                function (err, res) {
                  if (err) throw err;
                  console.log(
                    `successfully updated employee ${updateEmployee.first_name} ${updateEmployee.last_name}`
                  );
                  start();
                }
              );
            });
        });
    });
  },
  add: function () {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      let empData = res;

      let roleData = "";
      let roleArr = [];
      // get data from role table
      connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        roleData = res;
        for (var i = 0; i < res.length; i++) {
          roleArr.push(res[i].title);
        }
      });
      inquirer
        .prompt([
          { name: "firstname", message: "first name: ", type: "input" },
          { name: "lastname", message: "last name: ", type: "input" },
          { name: "role", message: "role: ", type: "list", choices: roleArr },
          {
            name: "manager",
            message: "manager",
            type: "list",
            choices: function () {
              let choiceArray = [];
              for (var i = 0; i < empData.length; i++) {
                choiceArray.push(
                  empData[i].first_name + " " + empData[i].last_name
                );
              }
              return choiceArray;
            },
          },
        ])
        .then(function (ans) {
          let updateEmployee = {};
          updateEmployee.first_name = ans.firstname;
          updateEmployee.last_name = ans.lastname;
          // find role id based on title
          for (let i = 0; i < roleData.length; i++) {
            if (ans.role === roleData[i].title) {
              updateEmployee.role_id = roleData[i].id;
            }
          }
          for (let i = 0; i < empData.length; i++) {
            if (
              ans.manager ===
              empData[i].first_name + " " + empData[i].last_name
            ) {
              updateEmployee.manager_id = empData[i].id;
            }
          }
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
            [
              updateEmployee.first_name,
              updateEmployee.last_name,
              updateEmployee.role_id,
              updateEmployee.manager_id,
            ],
            function (err, res) {
              if (err) throw err;
              console.log(
                `successfully added employee ${updateEmployee.first_name} ${updateEmployee.last_name}`
              );
              start();
            }
          );
        });
    });
  },
  delete: function () {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            message: "\nchoose an employee to delete: ",
            pageSize: 25,
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
          let chosenEmployee;
          for (var i = 0; i < res.length; i++) {
            if (res[i].first_name + " " + res[i].last_name === ans.choice) {
              chosenEmployee = res[i];
            }
          }
          connection.query(
            "DELETE FROM employee WHERE id =?",
            [chosenEmployee.id],
            function (err, res) {
              if (err) throw err;
              console.log("\nEmployee has been deleted\n");
            }
          );
          start();
        });
    });
  },
};

const role = {
  view: function () {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.log("Here are the Roles");
      console.table(res);
      start();
    });
  },
  edit: function () {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      let roleData = res;
      connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        let depData = res;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "list",
              message: "\nchoose a role to edit: ",
              pageSize: 25,
              loop: false,
              choices: function () {
                var choiceArray = [];
                for (var i = 0; i < roleData.length; i++) {
                  choiceArray.push(roleData[i].title);
                }
                return choiceArray;
              },
            },
          ])
          .then(function (ans) {
            let chosenRole = {};
            for (let i = 0; i < roleData.length; i++) {
              if (roleData[i].title === ans.choice) {
                chosenRole = roleData[i];
              }
            }
            inquirer
              .prompt([
                {
                  name: "title",
                  message: "title: ",
                  type: "input",
                  default: chosenRole.title,
                },
                {
                  name: "salary",
                  message: "salary: ",
                  type: "number",
                  default: chosenRole.salary,
                },
                {
                  name: "department",
                  message: "department",
                  type: "list",
                  choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < depData.length; i++) {
                      choiceArray.push(depData[i].department_name);
                    }
                    return choiceArray;
                  },
                  default: chosenRole.department_id,
                },
              ])
              .then(function (ans) {
                // get department id based on user choice
                let dep_ans;
                for (let i = 0; i < depData.length; i++) {
                  if (ans.department === depData[i].department_name) {
                    dep_ans = depData[i].id;
                  }
                }
                connection.query(
                  "UPDATE role SET title=?, salary=?, department_id=? WHERE id=?;",
                  [ans.title, ans.salary, dep_ans, chosenRole.id],
                  function (err, res) {
                    if (err) throw err;
                    console.log(`successfully updated ${chosenRole.title}`);
                    start();
                  }
                );
              });
          });
      });
    });
  },
  add: function () {
    console.log(`\nAdd new role:\n`);
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      let depData = res;
      inquirer
        .prompt([
          {
            name: "title",
            message: "title: ",
            type: "input",
          },
          { name: "salary", message: "salary: ", type: "number" },
          {
            name: "department",
            message: "department: ",
            type: "list",
            pageSize: 20,
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].department_name);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (ans) {
          let department_id = 0;
          for (let i = 0; i < depData.length; i++) {
            if (ans.department === depData[i].department_name) {
              department_id = depData[i].id;
            }
          }
          connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [ans.title, ans.salary, department_id],
            function (err, res) {
              if (err) throw err;
              console.log(`successfully added new role ${ans.title}`);
              start();
            }
          );
        });
    });
  },
  delete: function () {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            message: "\nchoose an role to delete: ",
            pageSize: 16,
            loop: false,
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].title);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (ans) {
          let chosenRole;
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === ans.choice) {
              chosenRole = res[i];
            }
          }
          connection.query(
            "DELETE FROM role WHERE id =?",
            [chosenRole.id],
            function (err, res) {
              if (err) throw err;
              console.log("\nRole has been deleted\n");
            }
          );
          start();
        });
    });
  },
};

const dep = {
  view: function () {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.log("Here are the Departments");
      console.table(res);
      start();
    });
  },
  edit: function () {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      let depData = res;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            loop: false,
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].department_name);
              }
              return choiceArray;
            },
            message: "\nchoose a department to edit: ",
          },
        ])
        .then(function (ans) {
          let chosenDep;
          for (let i = 0; i < depData.length; i++) {
            if (depData[i].department_name === ans.choice) {
              chosenDep = depData[i];
            }
          }
          inquirer
            .prompt([
              {
                name: "name",
                message: "department name: ",
                default: chosenDep.department_name,
                type: "input",
              },
            ])
            .then(function (ans) {
              connection.query(
                "UPDATE department SET department_name=? WHERE id=?;",
                [ans.name, chosenDep.id],
                function (err, res) {
                  if (err) throw err;
                  console.log(
                    `successfully updated ${chosenDep.department_name}`
                  );
                  start();
                }
              );
            });
        });
    });
  },
  add: function () {
    inquirer
      .prompt([
        {
          name: "name",
          message: "What is the new Department name?",
          type: "input",
        },
      ])
      .then(function (ans) {
        connection.query(
          "INSERT INTO department (department_name) VALUES (?)",
          [ans.name],
          function (err, res) {
            if (err) throw err;
            console.log(`The ${ans.name} Department has been added!`);
            start();
          }
        );
      });
  },
  delete: function () {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            message: "\nchoose an department to delete: ",
            pageSize: 16,
            loop: false,
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].department_name);
              }
              return choiceArray;
            },
          },
        ])
        .then(function (ans) {
          let chosenRole;
          for (var i = 0; i < res.length; i++) {
            if (res[i].department_name === ans.choice) {
              chosenRole = res[i];
            }
          }
          connection.query(
            "DELETE FROM department WHERE id =?",
            [chosenRole.id],
            function (err, res) {
              if (err) throw err;
              console.log("\nRole has been deleted\n");
            }
          );
          start();
        });
    });
  },
};

function budget() {
  connection.query(
    "SELECT SUM(role.salary) budget FROM role INNER JOIN employee ON role.id = employee.role_id;",
    function (err, res) {
      if (err) throw err;
      console.log(`\nTotal budget is: ${res[0].budget}`);
      start();
    }
  );
}
