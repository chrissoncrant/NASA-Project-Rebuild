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
Git Version Control with Git Hub
VSCode code editor
Node.js
- Modules:
	- http (server)
	- file system (planets model)
	- path (planets model)
NPM packages
* Express (npm package)
* nodemon (npm package)
* csv-parse (npm package)



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
### Deciding Where To Start
At this point I am ready to begin building some routes and setting up the models. 

Determining which model and route to move forward involved analyzing dependencies. 

The Upcoming and History pages both rely on a launch being created. The creation of a launch depends on the inputs in the form on the Launch page. 

All of the inputs except one rely on information the user supplies in the form of text. 

The ‘Destination Exoplanet’ depends on data from our backend, so this will be the first endpoint to set up. 

### Adding Global Scripts
I ran npm init in the main project folder in order to add a script that allows me to start the server using node or nodemon. I did this because in the CLI I am mostly in the main project folder so these scripts will make it easier for me to start the server from this location in the CLI

### Planets Model

#### Data Source
Our planets model’s data comes from a NASA database created from the data gathered by the [Kepler Mission](https://exoplanetarchive.ipac.caltech.edu/docs/KeplerMission.html), which was launched in March of 2009 in order to find potentially habitable planets.

The data is downloadable as a .csv file from [here](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative). Each planet, or Kepler Object of Interest (KOI) has 27 properties associated with it. 

#### Making Sense of the Data
The goal here is to filter these KOIs, of which there are over 9500+, for the best candidates where life could potentially be found and/or supported.

In order to do this some time had to be spent making sense of the data itself. 

Some clarifying questions that helped with the investigation:
1. Of the 27 properties measured for each KOI found by the Kepler spacecraft what are the most relevant for the purpose of this project? 
2. For those most relevant properties, what is the value/value range for each property that would make the KOI in question a qualifying candidate?

##### Question 1: The relevant properties
What even makes a property relevant? There are a couple properties that are obviously important, such as the planet name and its disposition, but what are the crucial properties that would make a planet potentially habitable?

This article helps explain: [A Review of the Best Habitable Planet Candidates](https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/)

From this article it is found that 2 of the best measures are the amount of light the planet receives from the star it orbits (stellar flux) and the radius of the planet itself. 

This reduces the number of relevant properties from 27 down to 4: Kepler name, Kepler disposition, stellar flux, and the planetary radius. 

The name and disposition were obviously important. We need the name of the planet because that is ultimately what our front-end will be populating in the “Destination Exoplanet” selection drop down. 

The disposition is basically whether or not the planet has been confirmed as an actual planet or whether it is a false positive. We only want those planets that are confirmed.

Looking at our data we see that there is a planetary radius property named ‘koi_prad’, but what about stellar flux?

This property was a little trickier as the data doesn’t label it exactly as ‘stellar flux’, but there’s only one property, ‘koi_insol,’ that uses the term ‘flux’ in the description. This property is the “insolation flux”. Looking up “insolation” we can see that this has to do with exposure to sun rays so this is the property we want. This is the property we want!

##### Question 2: Relevant Values
Along with the relevant properties the article provided the relevant ranges to use for the planetary radius and the stellar/insolation flux as well.

The relevant range for the KOIs radius is less than 1.6 Earth radii (so any planets larger than 1.6x the radius of the Earth are most likely to be Neptune-like or gaseous).

The relevant range for the the insolation flux is between 0.36 and 1.11 Earth insolation flux units.

The relevant value for the KOIs disposition is simply ‘CONFIRMED’.

#### Using the Data
The next step is getting this data into a format that our back-end can use so it can perform the necessary filtering and serve up the planet names to our front-end. 

First step was to create a planets.model.js file within the models directory.

I also created a ‘data’ directory at the top level of the project folder and added the Kepler csv file to this.

##### Parsing the Data
At this point I have a bunch of useful data, but need to convert this data into JavaScript in order to process it and send it to the front end. This is where the beauty of npm packages and the power of Node’s file system module comes into play.

Searching the term ‘csv’ in the npm registry leads to exactly what is needed: a parser tool. 

There are many of these tools, but one that was used in this project is called ‘csv-parse’. This package was installed this package as a project dependency. [csv-parser homepage](https://csv.js.org/parse/)

This module was imported into the planets model using object destructuring as only the parse method is needed, but in order to use it the csv file itself needed to be piped into the parser via a readable stream. 

This is where Node’s file system module comes into play. After importing this module in, a read stream was created from the csv file and piped into the parser. 

Within the parser’s argument I had to define the value used for comments and indicate that the csv was in column format. This parsed each row of the the csv file into a Javascript object, with the title of each column serving as the property key. 

##### Filtering the KOIs for those that are potentially habitable
At this point I knew that I needed to filter this data and so a function was created (isHabitablePlanet) that simply verified whether the argument passed in satisfied the conditions we discovered above. The return of this function was simply true or false. 

Once the stream was passed into the parser it became a writable stream and the stream itself is an instance of Node’s Event Emitter object. The isHabitablePlanet function was used within the listener for the ‘data’ event. Each piece of data was, at this point, a Javascript object corresponding to one of the 9500+ KOIs that the Kepler spacecraft discovered. 

The KOI was passed into the isHabitablePlanet function and if it returned as true, this was pushed into a planets array. 

A listener for any errors was added. 

A listener for the ‘end’ event was added, which simply logged the length of the array. Out of the 9500+ planets 8 potentially habitable planets were found! Exciting stuff!

##### Note about the initial stage of models
At this stage a database is not needed. This is the setup phase of the API, so currently all data will be stored within the memory of the server itself. This is fine at this stage. Once the API is working, then a decision will be made in regards to what type of database will best serve the purpose of this project. 

At this stage a new commit was made to GitHub

Here’s the what the planets.model.js file looks like at this point:
```
const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets = [];

function isHabitablePlanet(planet) {
    return planet.koi_disposition === 'CONFIRMED' && planet.koi_insol > 0.36 && planet.koi_insol < 1.11 && planet.koi_prad < 1.6
}

fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', planet => {
        if (isHabitablePlanet(planet)) {
            planets.push(planet);
        }
    })
    .on('error', err => {
        console.log('Error received', err);
    })
    .on('end', () => {
        console.log(`${planets.length} habitable planets found!`);
    })
```
