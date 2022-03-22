# NASA-Project-Rebuild
Rebuilding NASA project from ZTM course

## Table of Contents
[[/Intention]]
[[/NASA Website Overview]]
[[/The Project Mission]]
[[/Tools and Apps Used]]
[[/Phase One: Project Setup]]
	[[/Project Architecture\/Diagram]]
	[[/Project Philosophies]]
	[[/Setting up remote and local repo]]
	[[/Initial Front-End Inspection]]
	[[/Project Folder Structure]]
[[/Phase Two: Server and App Setup]]
	[[/server.js and app.js Setup]]
[[/Phase Three: Building our First Endpoint]]
	[[/Deciding Where To Start]]
	[[/Adding Global Scripts]]
	[[/Planets Model]]

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

## Tools and Apps Used
React/Create React App
ARWES Framework
Git Version Control with Git Hub
VSCode code editor
Node.js
	- Core Modules:
		- http (server)
		- file system (planets model)
		- path (planets model)
	- NPM packages
		* Express (npm package)
			* Middleware:
				- express.json()
		* nodemon (npm package)
		* csv-parse (npm package)
Postman - testing APIs



## Phase One: Project Setup
### Project Architecture/Diagram
Using Figma to create a project diagram. This will be an overview of the project structure. This will grow as the project grows. Currently it consists of 3 elements: Web Browser, Web Application, Node API.

### Project Philosophies
The MVC design pattern will be used for this project with a focus on increasing cohesion and decreasing coupling. 

The API will be following RESTful standards.

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

The design philosophy for this project is to export all model data using Data Access Functions.

##### Note about the initial stage of models
At this stage a database is not needed. This is the setup phase of the API, so currently all data will be stored within the memory of the server itself. This is fine at this stage. Once the API is working, then a decision will be made in regards to what type of database will best serve the purpose of this project. 

### Quick Note on Building Strategy
I feel it useful to point out that the creation of this specific endpoint is flowing in a bottom-up manner. I have started with getting the data source in place, then moving up from here to the controller, then the router, then to the Express app.js file, to our server.js, which will ultimately serve it to our front-end. 

There are many ways to go about setting up an API. Other routes in this project will be built using a top-down approach for the sake of practice. I find that the more ways I do something the more familiar I get with the process. this makes sense to me as different angles of approach reveal different sides.

###  The Planets Controller
Now it is time to build the controller for the planets model. 

#### Controller Philosophy
This is where it is useful to think about separation of concerns in order to keep the MVC design pattern intact and as flexible and understandable as possible. 

My current understanding of the controller is this: Its main job has to do with receiving requests from the front-end, validating them if necessary, working with the model to create, read, update or delete data, and delivering a useful response to the front-end.

Providing a useful response is crucial. Even if the response is unable to deliver what is desired, a response can still be useful based on the information contained in said response. Much of this usefulness comes in the form of status codes and the body of the response itself.

#### RESTful Aside

Because RESTful API standards are being used, responses (and requests) will be tailored accordingly. A useful resource can be found here: [HTTP Methods for RESTful Services](https://www.restapitutorial.com/lessons/httpmethods.html)

With RESTful APIs requests are made to endpoints that are associated with collections or items within collections. 

How information is passed back and forth between the front-end and the back-end will be in the form of JSON.

This leads to a useful piece of middleware which has been added to the app.js file. It is the express.json() middleware and it works to convert received JSON into Javascript objects. 

#### Analysis of Planets Controller

The planets controller will be receiving a GET request. The front-end makes this request during the initial loading of the page in order to populate the selection element in the form. The controller will be passing along the data from the planets model.

#### Planets Endpoint 

The controller and the router were set up and the router was mounted into the app.js file.

Postman was used to test the API GET request. All is working on the back-end. Now it is time to connect this to the front-end. 
