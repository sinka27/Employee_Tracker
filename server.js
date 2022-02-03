const express = require('express');const express = require('express');
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
););

db.connect(err => {
  if (err) throw err;
  initialQuestion();
});

//welcome message
console.table(
    "\n------------ EMPLOYEE TRACKER ------------\n"
)