# NASA-Project-Rebuild
Rebuilding NASA project from ZTM course

## Intention
My intention for this project is to rebuild a project from the Zero to Mastery’s Complete NodeJS Developer course. I will be doing this in order to practice what I have learned in order to aid in my retention of the information and skills. 

While going through the project from scratch I will be doing my best to document the journey and the thought processes in this README. 

## NASA Website Overview
This website serves as a mission scheduler. Several potentially habitable exoplanets have been identified and this website is the hub where future launches to these planets will be scheduled. 

## The Project Mission
I’ve been given all the files for a front-end that needs a functioning back-end.

I will be using NodeJS and MongoDB to setup a functioning API that will accomplish a few jobs:
1. Schedule Launches
2. View Upcoming Launches
3. Abort Launches
4. View Previous Launches

## Tools and Apps Used:
React/Create React App
ARWES Framework
NPM packages
Git Version Control with Git Hub
VSCode code editor
Node.js
Express
nodemon

## Phase One: Project Setup
### Project Architecture/Diagram
Using Figma to create a project diagram. This will be an overview of the project structure. This will grow as the project grows. Currently it consists of 3 elements: Web Browser, Web Application, Node API.

### Project Philosophies
The MVC design pattern will be used for this project with a focus on increasing cohesion and decreasing coupling. 

The API will be following RESTful standards.

### Setting up remote and local repo
* Created new repo in GitHub.
* Cloned the repo into local repository.
* Gathered the front-end files and imported them into the project in a directory labelled “client” that I created. Note: The front-end was built using React and the Create React App package. It’s design (visual and audio) utilize the ARWES library.
* Set up the .gitignore file before running “npm install”, making sure to add the ‘node_modules’ directory to this, then ran “npm install” within the client folder.
* Checked out the scripts in the package.json file:
	* Create React App automatically set up several scripts, the most useful one at the moment is the “start” script which opens up the front-end using port 3000 on the local host.
* Examining the front-end to see what will be required of the API.

### Initial Front-End Inspection
Consists of 3 pages: Launch, Upcoming, History

#### Launch Page
Consists of a form that takes in information for new launches. This will be a POST request to our API

“Destination Exoplanet” field is a selection input element whose options will come from our API. This will be a GET request to our API. 

#### Upcoming Page
Consists of a table of the launches that have been scheduled through the Launch page. This requires a GET request to our API

The table has a button for aborting launches. This requires a DELETE request to our API.

#### History Page
Consists of a table of launches that were successful or failed for some reason. This requires a GET request to our API

#### Summary of Inspection
From this initial inspection I can see that, at this stage, our API will need to have 2 data endpoints, one for the destination exoplanets and one for the launches.

The ‘Destination Exoplanets’ endpoint will need a controller for a GET request.

The launches model will need 3 controllers: POST, GET, DELETE.

There are 2 GET requests being made for 2 different pages, Upcoming and History. There will need to be some property for the individual launch objects that we can use to determine which page the launches will be populated on. 

### Project Folder Structure
Top level of the Project folder will consist of ‘client’ and ‘server’ directories.

The code for the server itself will live in a ‘src’ directory following the pattern established by the ‘client’ directory.

Within the ‘src’ directory of the server we will do our best to hold to separation of concerns. The top level of the ‘src’ directory will have a server.js file, an app.js file, a routes directory and a model directory and this structure will be updated/added to as needed as the project grows.

All updates and additions will be made in a manner that aids project development, readability, and scalability.

The routes directory will consist of all the routes required. At this point we have determined that there will be 2 endpoints and thus 2 routes, ‘planets and ‘launches’.

The ‘planets’ and ‘launches’ directories will contain their respective router and controller files.

The models directory will contain the individual model files. These will not be separated into sub-directories as that unnecessarily complicates the file structure. 

For the NPM packages, both the client and the server directories will have their own package.json files. All npm packages will be installed in either the client or the server folders.

The main project folder will have a global package.json file for writing global scripts.

## Phase Two: Server and App Setup
With the server.js and app.js files created, I ran ‘npm init’ and got the package.json file set up. Specifically, I updated the ‘name’, ‘description’, ‘main’ fields and I added a ’start’ script, which will allow me to start my server by running ‘npm run start’ in CLI.

Next, I installed Express as we will be relying heavily upon this framework for building our backend.

I then installed the nodemon tool as a development dependency so I won’t have to constantly restart the server when code is changed.

I set up a script to start my server using nodemon.

With all this in place I copied and pasted the .gitignore file from the ‘client’ directory into my ‘server’ directory and made a new git commit.

### server.js and app.js Setup
Just a very basic server setup at this point. The goal here is for this file to be solely dedicated to only server tasks. The server utilizes Node’s http module and imports the Express app from the app.js file.
```
const http = require('http');

const app = require('./app');
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
```

The front-end is currently set up to be opened on port 3000. I chose port 8000 for the back-end to avoid any conflicts during the initial stages of development. 

The API will be utilizing Express. Express is one of the most widely used Node.js. frameworks. It helps us get a server set up quickly without having to reinvent certain wheels (routing, error handling, etc.) ourselves. There are also a lot of useful middleware that Express allows us to utilize. All the Express related code will be confined to the app.js file.

The app.js file at this point is as simple as it gets. No middleware, no routes just yet.  
```
const express = require('express');
const app = express();

module.exports = app;
```
 
With these two files in place, I tested the server using both the scripts I set up to verify the server is working, I then performed a git commit and pushed changes.

## Phase Three: Building our First Endpoint
At this point I am ready to begin building some routes and setting up the models. 

Determining which model and route to move forward involved analyzing dependencies. 

The Upcoming and History pages both rely on a launch being created. The creation of a launch depends on the inputs in the form on the Launch page. 

All of the inputs except one rely on information the user supplies in the form of text. 

The ‘Destination Exoplanet’ depends on data from our backend, so this will be the first endpoint to set up. 