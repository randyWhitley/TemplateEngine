const fs = require("fs");
const inquirer = require('inquirer');
const Manager = require('./lib/manager');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');
const render = require("./lib/htmlRenderer");



const path = require('path');

// Sent to output folder
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const employees = [];
function generateTeam() {
  inquirer
    .prompt([
      {
        message: "What is the name of the Team Member?",
        name: "name",
      },
      {
        type: "list",
        message: "What is the Team Member's role?",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
      {
        message: "What is the Team Member's id?",
        name: "id",
      },
      {
        message: "What is Team Member's email address?",
        name: "email",
      },
    ])
    .then(function ({ name, role, id, email }) {
      let roleAnswer = "";
      if (role === "Engineer") {
        roleAnswer = "GitHub Username";
      } else if (role === "Intern") {
        roleAnswer = "School Name";
      } else {
        roleAnswer = "Office Number";
      }
      inquirer
        .prompt([
          {
            message: `What is Team Member's ${roleAnswer}?`,
            name: "roleAnswer",
          },
          {
            type: "confirm",
            message: "Would you like to add more Team Members?",
            name: "addMembers",
          },
        ])
        .then(function ({ roleAnswer, addMembers }) {
          let teamMember;
          if (role === "Engineer") {
            teamMember = new Engineer(name, id, email, roleAnswer);
          } else if (role === "Intern") {
            teamMember = new Intern(name, id, email, roleAnswer);
          } else {
            teamMember = new Manager(name, id, email, roleAnswer);
          }
          employees.push(teamMember);
          if (addMembers) {
            generateTeam();
          } else {
            render(employees);
            fs.writeFile(outputPath, render(employees), (err) => {
              if (err) {
                throw err;
              }
              console.log("Success!");
            });
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error: ", err);
          }
        });
    });
}
generateTeam();
