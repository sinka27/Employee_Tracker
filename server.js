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
        viewDepartments();
        break;
      case "View all Roles":
        viewRoles();
        break;
      case "View all Employees":
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
        break;
      default:
        break;
    }
      });
    }