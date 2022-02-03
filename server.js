const express = require('express');
require('dotenv').config();
const inquirer = require('inquirer');
const consoleTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Enter your MySQL username here
    user: 'root',
     //Enter your MySQL password here
    password: process.env.MYSQL_PASSWORD,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

//on connection call initalQuestion function
db.connect(err => {
  if (err) throw err;
  initialQuestion();
});

//welcome message
console.table(
    "\n------------ EMPLOYEE TRACKER ------------\n"
)

// Ask the user initial question: what they would like to do?
const initialQuestion  = () => {
  return inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "Select one of the following options:",
      choices: ["View all Departments",
                "View all Roles", 
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"],
    },
  ])
  .then(function (userInput) {
    switch (userInput.action) {
      case "View all Departments":
        console.table("\n----------- DEPARTMENTS -----------\n");
        viewDepartments();
        break;
      case "View all Roles":
        console.table("\n----------- ROLES -----------\n");
        viewRoles();
        break;
      case "View all Employees":
        console.table("\n----------- EMPLOYEES -----------\n");
        viewEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Exit":
        db.end();
        console.table(
          "\n------------ BYE! ------------\n"
      )
        break;
      default:
        break;
    }
      });
    }


const viewDepartments = () => {
  console.log("Department View");
    let query = "SELECT * FROM department;";
    db.query(query, function (err, res) {
      if (err) throw err;
      let departmentArray = [];
      res.forEach((department) => departmentArray.push(department));
      console.table(departmentArray);
      initialQuestion();
    });
};

const viewRoles = () => {
  console.log("Roles View");
    let query = "SELECT * FROM role;";
    db.query(query, function (err, res) {
      if (err) throw err;
      let roleArray = [];
      res.forEach((role) => roleArray.push(role));
      console.table(roleArray);
      initialQuestion();
    });
};

const viewEmployees = ()=>{
  console.log("Employees View");
  let query = "SELECT * FROM employee;";
    db.query(query, function (err, res) {
      if (err) throw err;
      let employeeArray = [];
      res.forEach((employee) => employeeArray.push(employee));
      console.table(employeeArray);
      initialQuestion();
    });
}

const addDepartment = ()=>{
  console.log("Add Department");
  inquirer.prompt([
    {
      type: "input",
      name: "deptname",
      message: "Enter Department name",
    },
  ])
  .then(function (userInput) {
  let query = "INSERT INTO department(department_name) VALUES('"+userInput.deptname+"')";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log("Department added successfully");
      viewDepartments();
    });
});
}

const addRole = ()=>{
  console.log("Add Role");
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter Title of the new role",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter salary",
    },
    {
      type: "input",
      name: "deptId",
      message: "Enter department id",
    }
  ])
  .then(function (userInput) {
  let query = "INSERT INTO role(title, salary, department_id) VALUES('"+userInput.title+"', "+userInput.salary+","+userInput.deptId+")";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log("Role added successfully");
      viewRoles();
    });
});
}

}