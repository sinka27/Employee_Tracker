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
      message: "Enter Department name: ",
    },
  ])
  .then(function (userInput) {
  let query = "INSERT INTO department(department_name) VALUES('"+userInput.deptname+"')";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log(userInput.deptname+" department added successfully to the database");
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
      message: "Enter Title of the new role: ",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary: ",
    },
    {
      type: "input",
      name: "deptName",
      message: "What department is the role associated with? ",
    }
  ])
  .then(function (userInput) {
    let idquery= "SELECT id FROM department WHERE department_name='"+userInput.deptName+"'";
    db.query(idquery, function (err, res,fields) {
      if (err) throw err;
      console.log(res);
      const id = res[0].id;
      let query = "INSERT INTO role(title, salary, department_id) VALUES('"+userInput.title+"', "+userInput.salary+","+id+")";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log("Role added successfully to the database");
      viewRoles();
    });
    });
  
});
}

const addEmployee = ()=>{
  console.log("Add Employee");
  let roleQuery = "SELECT title FROM role";
  let roleArray = [];
  let employeeArray = [];
  db.query(roleQuery, function (err, res) {
    if (err) throw err;
    res.forEach((role) => roleArray.push(role.title));
    let empQuery = "SELECT first_name, last_name FROM employee";
    db.query(empQuery, function (err, res) {
      if (err) throw err;
      res.forEach((employee) => employeeArray.push(employee.first_name+" "+employee.last_name));
      
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter the first name of the employee: ",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the last name of the employee: ",
        },
        {
          type: "list",
          name: "roleName",
          message: "What is employee's role? ",
          choices: roleArray,
        },
        {
          type: "list",
          name: "managerName",
          message: "Who is employee's manager? ",
          choices: employeeArray
        }
      ])
      .then(function (userInput) {
        let rolequery= "SELECT id FROM role WHERE title='"+userInput.roleName+"'";
        db.query(rolequery, function (err, res,fields) {
          if (err) throw err;
          console.log(res);
          const roleid = res[0].id;
          
          let managerFN = userInput.managerName.split(" ")[0];
          let managerLN = userInput.managerName.split(" ")[1];
    
          let managerquery= "SELECT id FROM employee WHERE first_name='"+managerFN+"' AND last_name='"+managerLN+"'";
          db.query(managerquery, function (err, res,fields) {
          if (err) throw err;
          console.log(res);
          const managerid = res[0].id;
    
          let query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('"+userInput.firstName+"', '"+userInput.lastName+"',"+roleid+","+managerid+")";
          db.query(query, function (err, res) {
            if (err) throw err;
            console.log("New Employee added successfully to the databse");
            viewEmployees();
          });
        });
      });
    });
  });
});
}

const updateEmployeeRole = ()=>{
let employeeQuery = "SELECT first_name,last_name FROM employee";
let employeeArray=[];
db.query(employeeQuery,function(err,res,fields){
  if (err) throw err;
  console.table(res);
  res.forEach((employee) => employeeArray.push(employee.first_name+" "+employee.last_name));
  console.table(employeeArray);
  inquirer.prompt([
    {
      type: "list",
      name: "name",
      message: "Which employee's role do you want to update?",
      choices: employeeArray,
    },
  ])
  .then(function (employeeName) {
    let empFN = employeeName.name.split(" ")[0];
    let empLN = employeeName.name.split(" ")[1]; 
    
    let roleQuery = "SELECT title FROM role";
    let roleArray = [];
    db.query(roleQuery, function (err, res) {
      if (err) throw err;
      res.forEach((role) => roleArray.push(role.title));
      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "Select the Role to update the employee with?",
          choices: roleArray,
        },
      ])
      .then(function (roleName) {
        let role = roleName.role;
        let selectRoleIdQuery = "SELECT id FROM role WHERE title = '"+role+"'";
        db.query(selectRoleIdQuery, function (err, res) {
          if (err) throw err;
          let roleId = res[0].id;
          let updateQuery = "UPDATE employee SET role_id="+roleId+" WHERE first_name='"+empFN+"' AND last_name='"+empLN+"'";
          db.query(updateQuery, function (err, res) {
            if (err) throw err;
            console.log("Employee Updated Succesfully");     
            initialQuestion();       
          });
        });
      });
    });
  });
})
  
}