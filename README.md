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
		* Express
			* Middleware:
				- express.json()
				- cors (app.js)
		* nodemon
		* csv-parse (planets model)
		* 
Postman - testing APIs



## Project Setup
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

## Building the First Endpoint
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

###  Planets Controller/Router Setup
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

### Connecting the API to the Front-End
The front end is utilizing React. React makes the request to the back end via the Fetch API. The function used to perform this fetch is called within a hook and the hook provides the data to the selection element. 

The endpoint to the planets data is currently http://localhost:8000/planets

For this to work the server will need to be opened first, followed by the front-end. The order matters because the server is supplying the front-end with the data it needs.

To make this easier I created a new global script in the project directory’s package.json file. This script will start the server and then start the client. 
```
"watch": "npm run server & npm run client"
```

The key syntax here is the single ‘&’ symbol. This will run both the global server script and the client script that I have set up. The ‘&&’ would not work in this case as the server process will not end and so the client script would never be triggered. 

#### Encounter with Same Origin Policy and Using CORS
Upon running the new script an issue is encountered. The planets data is not loading in. The issue is not with the fetch request (or is it?) or the front-end code. The back-end is working, as confirmed by Postman. 

Checking the site’s console the issue is revealed. Right now the front-end is loading on port 3000 and the fetch request is being made to the back-end which is running on port 8000. This fetch request is violating the Same Origin Policy and thus the data is not being provided. 

An ‘origin’ is made up of the protocol (in this case it’s HTTP), the url (localhost) and the port (3000 for the front-end, 8000 for the back-end). If any one of these is different then the origin is not the same. This is why the request by the front to the back-end is being rejected.

This is not a bad thing. This is actually a very good thing when it comes to data privacy and security. However in this case I know that the origin the request is being made from is legitimate. This is where Cross-Origin Resource Sharing (CORS) comes into play.

#### CORS to the Rescue
CORS allows us to whitelist certain origins, which allows those different origins to access our back-end API. 

There are many ways to make this happen. In this instance, because we are using Node and Express we are going to leverage some middleware, namely the ‘cors’ middleware. This will be installed as a project dependency within our server.

The ‘cors’ middleware will be imported into our app.js file at the top of the middleware flow. An object is passed into the cors function indicating the origin that is allowed access to our data, in this case it’s ‘http://localhost:3000'

With this in place our front-end now has access to our planets data. 

### Loading Data on Startup
Right now our planets data is loading just fine, however a good practice is to set up any potentially time-consuming and asynchronous data to be loaded prior to the server coming online. 

This ensures that the front-end will have access to the data it needs upon the page loading. 

To do this some adjustments need to be made to the planets model. 

Specifically the fs.createReadStream process will be wrapped in a Promise object. This promise will be returned by a new function called loadPlanetsData.

This new function is exported and imported into our server.js file.

Within our server.js file a new function called serverStart is created. I am going to work with the async-await syntax and so this function is async. The server.listen() function is moved into the body of this function and is called after awaiting the result of loadPlanetsData.

With this in place, no matter what the planets data will be loaded and ready to be accessed upon the server starting.

The first path in the API has been created.

## Set Up For Launches API
### Launch API Overview
Approach: Top-Down. This approach makes a lot of sense here because the front-end reveals the properties that each individual launch item will need to have.

#### Launch Item Properties
- Launch Page Properties:
	- Launch Date
	- Mission Name
	- Rocket Type
	- Destination Exoplanet
- Upcoming Page Properties:
	- Number (flight number)
	- Plus the properties from the Launch Page
- History Page Properties:
	- Customers
	- No other new properties on this page

From this analysis I can see that each launch item/object will need to have at least 6 properties. These are informational properties. I feel that one more informational property would be valuable and that is whether or not the mission was successful or not. This property will be a boolean property. 

There will need to be at least one logical property as well which will serve the purpose of telling the front-end which launch items should be displayed on which page, either Upcoming or History.

The logical property will be called Upcoming. This will be a boolean value. Launch items that have a true value for this property will be displayed on the Upcoming page.

#### Launch API Methods
The Launch API will be access by 3 request types:
- POST - Launch page. POST requests are made to collections in general.
- GET - Upcoming and History pages. This request will be made to the launches collection.
- DELETE - Upcoming page. DELETE requests are generally made to items.

## Launch Router and Controller Setup
Created the launches route directory and within this created the launches.router.js and launches.controller.js files.

The router was mounted within the app.js file and its route setup. The controller was imported into the router. 

Set up the first controller to serve the GET request. This is a GET request made to an entire collection and so the status code 200 will be sent upon success. The request body will be sent in the form of JSON. 

What will be passed into the .json() function is a call to a Data Access Function which will return an array of all launches. 

## Launches Model Setup
### Creating a Mock Launch Item
At this stage a mock launch item was setup within the newly created launches.model.js file within the models directory.

The mock launch includes all the properties that were discovered as essential in the analysis above.

The key of each property of the launch item needs to match up with what the front-end is looking for.

### Creating a Mock Launch Collection
Each launch will be stored as an object. Each object has a flight number property and this can serve as an identifier for each individual launch. 

But how should the launches be stored? Within an array? Within an object with the launch flight number set as the key?

In this case the Map object is going to be used as it allows an easy way to set the flight number of launches as the key, making referencing, adding and deleting launches easy, especially with the in-built Map object methods. 

With the mock launch set up and a new launches Map created, the launch was added to the Map by using the .set() Map method.

### Data Access Function Setup
The getAllLaunches Data Access Function was created. The return of this function involved processing the Map object. First the .values() Map method was called in order to give an Iterator object of all the values (i.e. the individual launch objects) associated with each key. Then Array.from() was used to create an array from these values.

The processing occurred within the model so that when the Data Access Function is called within the controller, the data itself will be in a form that can be converted into JSON. This is another way of separating concerns, keeping all data manipulation within the model’s Data Access function.

The Data Access Function was exported and imported into the controller and utilized within the first controller method, which is called in the corresponding router.

### Postman Testing
With everything in place, it was time to test in Postman. 

Tests pass! Time to connect to front end.

## Connecting Launches GET Request to Front-End
This was just a matter of setting up another fetch request in the request.js file in our front-end. The endpoint is ‘/launches’.

For this request, there was one more step, which was to sort our launches by the flight number and return this sorted array.

After setting this up the Upcoming page is now displaying the mock launches.

Time to set up our POST request!

## Set Up of Router and Controller for Launches POST Requests
Created the post router in the launches.router.js file. 

The controller requires some thought. There must be some validation in this step to ensure the data for the launch object that is added to the launches model will be usable and valid. 

It’s useful to know what properties will be provided within the request body by the front-end and which will be provided by the back-end.

### Properties Analysis
The properties provided by the back-end will not need to be validated. These properties are:
- flight number
	- This will be a number
	- Will need to be incremented with each added launch
- upcoming
	- This is a boolean value
	- Set to true by default as each launch scheduled via the Launch form must be in the future.
- success
	- This is a boolean value
	- Will be set to true by default. 
	- This property doesn’t have any current usage, but may be valuable in the future.
- customers
	- This will be an array of strings.
	- These are essentially those companies and people who have skin in the game with each launch. 
	- Default value will be [‘NASA’]

The properties provided by the front-end:
- Launch Date (launchDate)
	- This needs to be a Date object
	- The date object is already limited to future dates by the input though this could be validated on the backend as well. 
	- This will need to be validated in some way.
		- Validated for presence (it is required)
		- Validated that it will yield a valid Date object
- Mission Name (mission)
	- This can be a string or a number
	- Validated for its presence (it is required)
- Rocket Type (rocket)
	- This can be a string or a number
	- Validated for its presence
- Destination Exoplanet (target)
	- This will be a string value
	- The options are provided by the planets model so no validation is necessary

### RESTful Analysis
The request will be a POST request to a collection. According to RESTful standards ([HTTP Methods for RESTful Services](https://www.restapitutorial.com/lessons/httpmethods.html)):
- Status codes:
	- Success: 201
	- Failure: 400

### Validations
#### Data presence
The easiest validation is simply checking whether or not any of the inputs was left blank. This can be done with a simple if statement and if any of the properties are blank an error will be returned.

#### Date Validation
##### Valid Format
After a user hits Submit the value entered for the date will be turned into a Date object. This Date object will be added to the object of properties that will ultimately be converted to JSON prior to sending in the request body.

What happens to an invalid Date Object that is converted to JSON?
```
let date = "Hellooooo";
date = new Date(date);
JSON.stringify(date) //'null'
```

Notice that this ‘null’ value is a string. It is not the actual null value which would be filtered out by our presence validator. 

The easiest way that comes to mind is to utilize the .valueOf() method for Date objects. This will give us a number that will be either a real number or NaN. 

With this the isNaN() method can be used. The launch date value will be passed into this and if it is true then a 400 response would be returned, with an error message in an object. 

##### Valid Time Frame
The date input needs to give at least four days for the launch to be set up and run. Is this amount of days super short? Yes, but the minimum amount of days can easily be adjusted. The point is I felt it necessary that same day launches cannot be scheduled. That would just be crazy.