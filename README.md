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
		- path (planets model, app.js)
	- NPM packages
		* Express
			* Middleware:
				- express.json()
				- express.static()
				- cors (app.js)
				* morgan (app.js)
		* nodemon
		* csv-parse (planets model)
		* Jest
		* Supertest
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

## Set Up POST Launches Data Access Function
The Data Access Function will be called with a launch as an argument. At this point the launch will be incomplete and so part of the Data Access Functions job is to complete the launch by adding the remaining properties.

These properties are:
- Flight number
- Customers
- Upcoming
- Success

The trickiest one of these is the flight number, which will need to be incremented up by 1 with each added launch.

To do this a flightNumber variable was created and this variable will get incremented each time a launch is added.

To add all the properties to the launch object I used Object.assign() function. I then returned the updated launch as this will be sent within the response body.

With this set up it was just a matter of exporting it, then importing it into the controller, plugging it into the httpAddNewLaunch controller and testing it with Postman.

All tests passed! Time to connect to the front end.

## Connecting Launches POST to Front-End
### Setting up the request function
I will be using the fetch within an async function. Whereas GET requests are pretty straight forward, POST requests require a bit more conditioning within the fetch request. 

A second argument is required within the fetch indicating that the method is ‘post,’ that the content-type is ‘application/json,’ and sending the launch within the request body as JSON, and so JSON.stringify() is needed. 

I know that, unless a network error occurs, the fetch API will return a response object that has an ‘ok’ property. The value of this will be used to trigger the submitLaunch hook to either run the getLaunches function in order to update the Upcoming page with the new launch and play the success sound, or play the failure alert. 

In order to catch any issues with the network itself I utilized the try…catch syntax, which is standard when using async await. If the request is unable to be sent out do to an issue with my network then an error object will be returned with an ‘ok’ value of false. 

```
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    })
  } catch(err) {
    return {
      ok: false
    }
  }
}
```

All tests pass! The front-end is now able to send POST requests using the form and the Upcoming page updates with the new launch. 


## HTTP Request Monitoring and Logs
There is a useful piece of middleware called [morgan](https://www.npmjs.com/package/morgan) and now that the API is getting a bit complex it would be nice to monitor the requests coming into the server.

This was installed as a project dependency within the server directory.

The morgan middleware was added to the app.js file right after the cors middleware using the ‘combined’ format which provides standard Apache log output.

Now I can see exactly what is going on with each request the server receives. Sweet!

## Launches DELETE Request
Within the Upcoming page there is a ‘X’ button that allows for aborting a launch.

Clicking the button on the Upcoming page sends the http DELETE request to the specific item within the launches collection. The launch item is specified via a parameterized url to the launches endpoint. The parameter will be the flight number of the launch. Ex: http://localhost:8000/launches/100

Aborted launches are not deleted from the database, but are removed from the Upcoming page and are displayed on the History page. Which page a launch is displayed within is solely dependent upon the ‘upcoming’ launch property’s value.

When the back-end receives this request the controller will validate the existence of the launch, and then the Data Access Function within the launches.model.js file will update the values of the ‘upcoming’ and ‘success’ properties to false. The updated object will then be sent as JSON within the response body. 

When the front-end receives the response object the ok property’s value will, upon ‘true’ value, trigger the getLaunches hook as well as the success sound, or, upon a ‘false’ value, trigger the failure sound.

Following the RESTful standards, status codes will either be 200 for success or 404 if the launch cannot be found within the database.

### Fetch Request Function
Similar philosophy as the previous fetch request.

The fetch is wrapped in an async function. The argument passed in is the flight number (labeled as ‘id’). This argument is the parameter within the fetch url. 

Try…catch is used in order to catch any errors related to the network. Errors will return an object with ‘ok’ property set to false.

```
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete', 
    })
  } catch(err) {
    return {
      ok: false,
    }
  }
}
```

### Hook Setup
When the abort button is clicked the abortLaunch hook function is called. This will call the httpAbortLaunch function passing into it the flight number of the launch to be aborted. 

The response will be awaited and the ok property of this launch will determine the behavior to follow.

## DELETE Back-End Setup
Route for the delete request is created. This utilizes Express’ handy parameterized url syntax. This value also has to be converted into a number value. 

Controller is created.

2 Data Access Functions are created here. The first is a simple function that determines whether the launch exists or not. Its return is true or false. 

The second function is the one that will update the ‘upcoming’ and ‘success’ property values to false and return the launch. Here the Object.assign() function will be used to do the updating. 

Tested in Postman, all is working.

Tested with front and back-ends running: Success!

At this point, all endpoint have been set up. The API is working and is connected to the front-end successfully. 

## Setting Up Production Front-End
So far the front-end has been running on one server port and the back-end on a different one. Ideally we want both of these to be running on the same port. 

The Create React App has a “build” script (located within the client’s package.json file) that will set up the production code of the front-end. This script will run processes that compress and optimize the front-end files. 

An adjustment need to be made to the script to tell it that the location of this production code needs to exist within the server directory. To do this the “BUILD_PATH” parameter needs to be added to the “build” script. It looks like this:
```
"build": "BUILD_PATH=../server/public react-scripts build"
```

### Setting Up More Global Scripts
With the “build” script in place I’ve created a global script called “deploy” within the project package.json. This script will run the “build” script first which will create the production package within our server file and then it will start the server itself. Note: The server will not be starting with nodemon, but will be starting in a production-ready manner. 

The script looks like this:
```
"deploy": "npm run build --prefix client && npm run start --prefix server"
```
Note the ‘&&’ used. The server needs to wait until the production-ready files are in place. 

Running this script adds all the production-ready files into a public directory within the server directory.

What’s needed now is to tell our app to serve these files.

### Serving the Static Files From app.js
There are two functions that Express provides that will help use here.

The first is the middleware express.static(). What is passed into this function is the file path to our public folder. This will tell the app to serve the index.html file within this folder, which will load the webpage. 

Node’s path module was used here to set the absolute path to the public folder. 

At this point, with the server open, navigating to our server’s local url loads the front-end site. All seems well here. Navigating into each page loads the pages, all the functionalities of the buttons work. We can add and remove launches just fine.

However, navigating to any of the pages and then refreshing the page gives the “Cannot GET …” message. 

This is because there aren’t any routes within our server set for these specific pages yet. 

To set these up a new route is created using the universal symbol and within the callback body we use Express’ .sendFile() function to send the index.html file when a request is made. 

What is passed into the .sendFile() function is the absolute path to the index.html file within the public directory. 

Now when a page is refreshed there will be an established route within our app.js file to serve the appropriate file which points to the appropriate page. 

Of course this now means any endpoint can be typed in, whether it exists or not, but what will be displayed on the users end is the site with no data loaded. This is not a big problem though as it is easy to navigate back to the useful pages using the navigation bar. This is a graceful failure.

## Testing with Jest and Supertest
I imagine that a perfected workflow would have this step come before deploying the site itself, but better late than never. 

I have installed both Jest and Supertest as dev dependencies within the server directory. 

The Jest testing suite will be used to provide further testing features of the API which can come in handy as the site grows in complexity.  [Globals · Jest](https://jestjs.io/docs/api)

Jest is an excellent choice here as it provides in one package test runners, fixtures, assertions, and the ability to set up mock data. 

SuperTest will be used within the Jest testing environment for sending out test HTTP requests against the API. It works asynchronously and so the async-await syntax will be utilized with it. [supertest - npm](https://www.npmjs.com/package/supertest)

SuperTest works by opening what it calls an ‘ephemeral’ port using the app.js (so the app needs to be imported into the .test file)

Both SuperTest and Jest have their syntaxes and functions that aid in he setting up of tests.

### Jest Syntax
The 3 main functions used with Jest are describe, test, and expect.

Describe is used mainly for organizational purposes. It groups related tests together under a label, which is the first argument of the  `describe()` function. The second argument is a callback within which the individual tests are declared.

Test is the main function for running tests in Jest. Each test tests for a specific end result. The first argument is the test name, the second argument is a callback within which the conditions of the test are set

The expect function is used along with what are called ‘matchers’. Expect is what sets the condition and the matcher determines the result of the test. Ex: 
expect(‘red’).toBe(‘red’) would result in a pass.
expect(‘red’).toBe(‘blue’) would result in a failure.

```
describe('Test for matching color', () => {
    let testColor = 'red';
    test('Color is red', () => {
        expect(testColor).toBe('red');
    })
})
```

### SuperTest Syntax
The function that starts it all is the `request()` function. This opens that ephemeral port using the server that is passed into it as an argument.

Once the server is open, the next function in the chain will specify request type with the path as the argument. Ex: `.get(‘/url’)`

Next in the chain we can set headers, such as Content-Type, using `.set()`. By default the Content-Type type is set as JSON.

SuperTest has its own `.expect()` function which works similarly to Jest’s. 

### File Structure
There are 2 standard ways of setting up files for testing with Jest.

One is to add all tests within a directory called ‘__tests__’

The other is to add the test files along with the files that are being tested. This is the way I’ve chosen

Every test has the naming scheme similar to what I’ve already been using” name.test.js

### Test Scripts
For Jest to run its tests the script needs to be added to the package.json file.

There are 2 scripts that will come in handy. The first is the standard script which will trigger Jest to run all tests once and will provide the results in the terminal.
`”test”: “jest”`

The second script will have Jest run automatically with each change in the code. There are 2 form of this, which one to use depends on whether the directory the tests live within is git initialized or not:
- git initialized: `”test-watch”: “jest --watch”`
- without git:  `”test-watch”: “jest --watchAll”`

With these in place it made sense to set up a global script within the main project’s package.json: 
`”test”: “npm run test-watch —prefix server”`

### What To Test
Jest is going to be used to test the Launches endpoint.

The Launches endpoint has 3 request types to test: GET, POST, DELETE.

### GET /launches Test
This is the simplest test. It only needs to utilize SuperTest’s .expect() assertions. It will test the header for the correct Content-Type and the response status code.

```
describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})
```

### POST /launches Test
This test is more involved. It not only requires testing for success, but also testing for errors. It is important that both success and errors give the desired response back to the front-end.

This test requires the building of test cases. There needs to be a successful test case and there needs to be test cases that fail.

Each test case is a launch object, as that is what will be sent to the server from the front-end. 

For successful responses we expect the response header’s Content-Type to be JSON and the status code to be 201

An additional SuperTest function needs to be used here, which is the `.send()` function and the argument of this will be our test cases.

#### Success Test 
For the successful test, a test case will be needed that will get by all the validation. However….

#### Date Conditioning
Because dates can be sent in all manner of different valid formats, it is important that our success test case verifies that the value of the date in the request is equal to the date in the response. 

To do this we must compare the primitive values of the date objects from both the request and the response. Otherwise dates that are equal can show up as not equal resulting in falsely failed tests.

To do this the request and the response dates’ primitive values are bound to two variables, and these are compared to one another using Jest’s expect() function, like so:

```
const requestDate = new Date(completeLaunch.launchDate).valueOf();

const responseDate = new Date(response.body.launchDate).valueOf();

expect(responseDate).toBe(requestDate);
```

#### Finishing Success Test
Though the above may seem like overkill, it is best to be safe, rather than end up with data that is unusable. With this date safeguard for our test in place the success test can be finished. 

#### Error Cases
There are 3 error cases that tests needed to be set up for: Missing Data, Incorrect Date Format, Date Too Soon.

For each of the tests above SuperTest’s .expect() function was used to verify content-type and the response status code.

Jest’s expect() function was used along with the .toStrictEqual() matcher function to verify the correct response error object was returned.

A test object for each of the cases was created and passed into the corresponding test. 

### DELETE /launches test
There will be 2 tests, one for the success case and one for the failure case. 

#### Success Case
The success case needs to respond with JSON, with 200 status code, and the response’s body needs to have the ‘upcoming’ and the ‘success’ property values updated to ‘false’.

To verify the ‘upcoming’ and ‘success’ values were updated a test object was created to compare the response body to and the .toStrictEqual() Jest matcher function was used to test this.

#### Failure Case
The failure case needs to respond with a 404 status code and the response’s body needs to be the exact error object set within the controller.

In order to test this the .delete() SuperTest function’s argument needed to pass in a url to an item that doesn’t exist. 

To test for the error object Jest’s .toStrictEqual() was used once again.

Because I expect the number of launches to always grow I used the item path ‘9999’, which is so large that it will take some time before the test will fail inappropriately. 

## Optimizing Performance
Currently there aren’t any requests that take a lot of time. However as the database grows and the number of requests received by the server increases, there may come a time when responses begin to lag resulting in users experiencing significant lag time. 

To stay on top of this, Node’s Clustering capability is going to be utilized. 

### What is Clustering
Clustering is a way in which a Node server can be horizontally scaled. How it works is a Master process is used to create Worker processes. The Master’s job is simply to create the Workers, and the Workers handle the requests as they come in.

The Cluster module is used in Node to accomplish this. Each Worker is running an exact copy of the script that the Master is called on. 

Each Worker is able to handle separate requests coming into the same endpoint. The requests are handled via a load balancing process. There are different strategies for load balancing, but one of the most effective strategies is round-robin, which Node’s cluster modules use by default.

With the round-robin load balancing strategy, each incoming request is handled by the next worker that’s available. 

The number of workers that can be called to existence depends on the number of logical cores available in the computer that the server lives on. 

### Theoretical Example of Why Clustering is Useful
Let’s say there is a request that takes 10 seconds to complete and this request requires the running of CPU intensive blocking code.

If one user were to send this request to the server it would take 10 seconds for that user to receive the response. 

If there is only one instance of this server and another user a second later were to send the same request, the second user would have to wait 20 seconds; 10 seconds for the first user’s request to process, then 10 more seconds for the server to process the second user’s request.

With 2 instances of the server then the second user would only have to wait 10 seconds. 

Generally with servers built with Node the processes required by each request won’t be too CPU intensive and can finish within milliseconds, but if there are millions of users making requests at the same time, then those milliseconds add up quickly and the result is poor performance on the user’s end and the potential for locked servers.

Clustering allows the server to handle multiple requests, optimizing the performance of the server. 

### PM2 Package
Node’s Cluster module is going to be utilized within the context of the very helpful tool called PM2. 

PM2 is built on top of the Node’s Cluster module and provides a lot of useful features out of the box such as: launching/relaunching our cluster upon code change, providing monitoring capabilities, optimized and graceful restart processes, such as Zero Downtime Restarts.

This will be installed within the server directory as a project dependency.

PM2 is one of those packages where it is apreferable to install it globally as well, as this allows the advantage of using pm2’s commands in the CLI.

Note: PM2 is mainly for when a project is in its production state. It is not used much during development, but getting it installed now is setting the project up for full-blown production more.

#### Starting the Cluster with PM2
In order to maximize the number of processes and have PM2 automatically detect the number of logical cores available the command to use is:
```
pm2 start server.js -i max
```
Note: This is done from the server/src directory. 

#### Creating a Scripts to for Enabling PM2
Within the server directory’s package.json this script is added:
```
"cluster": "pm2 start src/server.js -i max"
```

Within the main project directory a script is added that will start the server and then deploy the front-end:
```
"deploy-cluster": "npm run build --prefix client && npm run cluster --prefix server"
```

With all this in place the website is ready to efficiently handle multiple requests upon deploy.

#### Strange Behavior
However, when the site is deployed using the new global script some seemingly strange behavior will be encountered.

If a new launch is saved, it will show in out launches list, but if we save a new launch and go back to the launches list, the launch we added previously will not be in the list. What the heck?

This has to do with data persistence and the fact that right now our API is relying on the server’s memory for the state of each of the data objects. 

The first launch added was added to the memory of that specific worker’s server process. The next launch was added to the memory of a different worker’s process. This is due to the round-robin load balancing. 

Because the state of the data objects is stored within the server itself each instance of the server (i.e. each worker process) will have its own object state. These processes cannot share data between each other because they are essentially separate processes. They are not referencing and acting on the same object. 

On top of all this, whenever the server is restarted (whether using pm2 or not) all the new launches added by our front-end are lost.

What is needed is for our API to be stateless. Our data needs to live in a space where CRUD operations can occur and the data will persist. How can this happen?

The answer: Databases.

## Creating the Database
### Very Brief Database Overview
When it comes to databases there are 2 main types: SQL and NoSQL

SQL and NoSQL are references to how queries are made against a database. 

SQL is a standardized querying syntax that is used by many databases such as MySQL and Postgres.

SQL is the querying syntax for databases that operate on the very popular referential model.

NoSQL is a form of querying that varies depending on what database is used. Each NoSQL database will have its own querying syntax. NoSQL databases generally do not use the referential model and use other database models such as the document model.

The choice of database to use for a project will depend on the project’s needs. There is no one right answer for databases. 

### The Database for this Project

For this project it has been determined that MongoDB will be used as its database. MongoDB is a NoSQL database and operates using the document model.

For this project MongoDB was chosen for a number of reasons:
1. It’s document model is based in JSON and its querying syntax is Javascript-based, which is in alignment with Node.js. A new syntax will not need to be used and this helps avoid the problem of [Object–relational impedance mismatch - Wikipedia](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch).
2. Right now the data itself is not set in stone. This is a growing project and its data sets may change and evolve and MongoDB with its document model offers greater flexibility.
3. MongoDB will work well for our need to scale horizontally. With that said SQL databases such as Postgres are fast becoming efficient at horizontal scaling.

With our database selected it is time to move forward with setting up the current models to work with the database.

### MongoDB Atlas
MongoDB allows for setting up a cloud-based server and offers the ability to do this free which serves the purposes of this project just fine.

After creating the new cluster and gathering the setup info (password to connect being the most important) it is time to connect to our database within our project.

### Mongoose
One of the advantage of SQL databases (which MongoDB is not) is the use of Schemas, which gives the data structure. 

Out of the box, MongoDB is schema-less, however there is a useful utility that gives added benefits when using MongoDB and one of those is the creation of schemas.

The utility is called Mongoose.

This will be installed as a project dependency within the server directory.

Mongoose will be used to perform CRUD operations on the MongoDB database and it works through MongoDB’s drivers.

### Connecting our Project to MongoDB
The first step in this process (after installing mongoose) is to connect mongoose to our database prior to our server starting. This is similar to what was done awhile back when the planets model database was set to load prior to server start. 

In keeping with good project management and file structure, all the code related to connecting with mongoose will take place in its own file that will be imported into server.js. 

Within the server/src directory a new directory called ‘services’ was created and within that directory a new file called ‘mongo.js’ was created.

Within this file all the mongoose code that connects our project to the MongoDB will be written.

While setting up the MongoDB server 2 pieces of info was provided:
- the password for the user
- the url to access the database

Both of these pieces of info will be used to connect our project to MongoDB using mongoose.

The mongoose functions used within this file are:
```
mongoose.connection.once('open', () => {...})
mongoose.connection.on('error', () => {...})

Note: the two functions below are asynchronous operations
mongoose.connect(MONGO_URL)
mongoose.disconnect()
```

The two functions are exported and imported into server.js and added to the startServer function like so:
```
async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
}
```

**!!!Note: It is important to add the mongo.js file to the .gitignore as this file contains the password for the mongoDB connection.**

### Model Setup Philosophy
This process occurs in a step-by-step manner, changing the current model Data Access Functions piece by piece, verifying each step of the way that things are working as they need to be. 

Making changes like this to code that is already working can invite errors and head scratching moments. To help with this, no old code will be deleted until the new code has proven itself to work. 

Also this is the perfect time to utilize the branching feature within git. For each model and perhaps each request method a new branch will be created and merged back into the main when that step has proven to be working.

### MongoDB and Mongoose Overview 
MongoDB is a document model database. It works with collections and documents. Each collection contains at least one document. Each document is one instance of the data.

A document in MongoDB is stored in the form of JSON. Actually it is turned into an even more efficient form called BSON, but that occurs on a layer of abstraction that our project will not have to interact with. 

Mongoose is the tool that is going to help give the data structure within the MongoDB database. The structure comes from Mongoose Schemas and Models.

It all starts with a schema. This sets the structure and requirements for each individual document. Every schema maps to an individual collection within the MongoDB.

With a schema in place, models are compiled from the schema. All documents added to a collection is an instance of a specific model object. 

Setting up schemas and models occurs within a separate file stored within the models directory. This is in keeping with the separating of concerns philosophy, but also keeps the project flexible for future changes regarding databases. 

There will be a .mongo.js file for each of the current models, so planets.mongo.js and launches.mongo.js.

### Planets Model
#### Schema and Model
When setting up a schema, it is important to determine what the data needs to look like.

One of the reasons MongoDB was chosen is because currently what is thought to be needed may very well need to be added to or removed from. Referential, SQL-based databases have a very hard time with changing schemas, but with Mongoose and MongoDB changes to schemas won’t be so detrimental. 

What is the purpose of the Planets Model in this project?
To supply the front-end Launch page with planets that are good candidates to use as targets for future mission.

How does the Planets Model accomplish this?
By filtering the data from the kepler_data.csv file for potentially habitable planets and, currently, adding those planets to an array. 

This array is returned in a Data Access Function that is called within the planets controller. 

What data is currently crucial?
As of now, only the planet name is used. 

The planet array that is returned to the front-end consists of a lot more data than is actually used. 

The planets schema will be set up to store only the required information. If this changes then that change can be added when the time comes. 

Now is the time to set up the property naming scheme and data type. 

The data type of the planet names will always be strings.

The key of the property ought to follow the standard naming scheme of JSON objects which is camel case. 

The schema  that was set for the Planets Model looks like this:
```
const planetsSchema = new mongoose.Schema({
    keplerName: String,
    required: true
});
```

What must be considered at this point is how the front-end will be referencing this property. 

Currently the front-end is setup to look for the property that has the key of “kepler_name,” as this is how it was sent to the front-end using the array. this needs to be updated to match the Planets Model’s schema. 

After updating this, it is important to run the “npm run build” script within the client directory so this crucial change will update the public folder in the server directory. 

The model will be what is exported from this file and imported into the planets.model.js file:
```
module.exports = mongoose.model('Planet', planetsSchema);
```

### Updating Planets Model
Currently as the data is streamed and filtered, the planets that pass through the filter successfully get pushed into an array. It is this push method and the array that will be replaced.

First  the planets model from the mongo.js file was imported into the Planets Model file.

Next a new function was set up. This function utilized a mongoose method to add the planet as a document based on the planets model to the planets collection, which is be stored in the MongoDB.

The method used is the .updateOne() method. The reason this is used is because it has an option called “upsert” and when this option is set to true how the function works is it first checks for the presence of the document in the collection. This is set by the first argument. If it is present it updates it via the second argument. If it is not present then it will add a new document based on the the second argument.

The reason this method is chosen versus the .create() method has to do with our server’s clustering mechanism.

If the .create() function was used then when the server is called to run using the clusters, each cluster would perform the planet filtering and therefore each planet that passes through the filter would be added as many times as there are clusters. This duplicate data is undesirable. Using the .updateOne() method allows this to be avoided.

The function looks like this:

```
async function savePlanets(planet) {
    try {
        await planetsDatabase.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch(err) {
        console.log("Could not save the planet...", err);
    };
}
```
([back to previous location](bear://x-callback-url/open-note?id=EE88B88D-ABEC-455F-BD23-A15A4A586F6F-700-00121137C9828DA1&header=*))

This function replaces the planets.push() method within the stream’s ’data’ event listener callback. It does not need the ‘await’ keyword in front of it when it is called here. When it is called, what is awaited is the completion of the .updateOne() function within the savePlanets function’s body. The listener callback looks like this:
```
.on('data', async planet => {
    if (isHabitablePlanet(planet)) {
        savePlanets(planet);
    };
})
```

Note: All functions that have to do with querying data are asynchronous and so the callbacks that utilize them need to be made async because the async-await syntax is used throughout the project. 

The last thing to update is to console.log the number of planets found within the callback for the stream’s ‘end’ event listener.

To do this mongoose’s model.find({}) query function is used. Note the empty object as the argument, which returns all documents within the planets collection. 

To use this, the callback for the stream’s ‘end’ event listener is prepended with the ‘async’ keyword. A variable was created to store the result of awaiting the .find() function call. What is logged is the length of the resulting array bound to the new variable. It looks like this:
```
.on('end', async () => {
    const planets = await planetsDatabase.find({});
    console.log(`${planets.length} habitable planets found!`);
    resolve();
})
```

At this stage the server was run using the ‘npm run server’ command. After verifying all was working via the console.log message, the old code was deleted from the model.

### Updating Planets Controller
It was now time to update the controller. To do this the first step was to update the Data Access Function itself.

The old Data Access Function looked like this:
```
function getHabitablePlanets() {
    return planets;
}
```

The new one looks like this:
```
async function getHabitablePlanets() {
    return await planetsDatabase.find({}, '-_id -__v');
}
```
Note: the second argument within the .find() function filters out the fields that MongoDB adds to the documents. These are not needed by the front-end and so these are filtered out. It is good practice, for security purposes, to only return the data that is needed.

The old Controller function looked like this:
```
function httpGetAllPlanets(req, res) {
    res.status(200).json(getHabitablePlanets())
}
```

The new one, like this:
```
async function httpGetAllPlanets(req, res) {
    res.status(200).json(await getHabitablePlanets())
}
```

At this point the server was run again and Postman was used to test the API endpoint. All is working!

## Launches Model
### Setting up the Launches Schema and Model
First step was simply to create the launches.mongo.js file within the models directory

Setting up the schema for the launches was relatively straightforward. Every property was required, some of the properties had default values set (customers, upcoming, success). 

Model was exported in the same way the planets mongoose model was exported.

### GET Data Access Function
How the launches was working is, within the model file, two mock launches were created and added to a Map object. This Map object was used as our “database.”

The Data Access Function returned this Map object. 

This Map object will no longer be used once the Mongo DB is set up. 

First step is to adjust the getAllLaunches function. To do this the .find({}) function is utilized and all documents are returned (hence empty object for the first argument of .find()) and the fields are filtered to remove those same fields that were removed for the planets. Looks like this:
```
async function getAllLaunches() {
    return await launchesDatabase.find({}, '-_id -__v');
}
```

The Map object was set up with two launches to be initially stored within it using the Map methods of .set(). I wanted to initialize the MongoDB as well. 

I could have just created a simple function that adds the launch object created in the launches model file, however when it comes time to set up the POST request I knew I would need a function that adds the launches anyways.

The launch created within the launches model would serve as a tester for this function which I called ‘saveLaunch.’

The ‘saveLaunch’ function would take completed launches and add them as documents to the Launches collection in the database. This would be the last step.

I set up the test launch object which had all the properties, both the properties set by the front-end and the additional properties added on the back-end. I ran the saveLuanches function with this test object as the argument and used both the console and Postman to verify the result was successful, and it was. 

After this I updated the controller in the launches.controller.js file to be async like so:
```
async function httpGetLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
}
```

I ran the ‘npm run server’ script from the project folder, to verify all was showing up in the front-end.

Once this was verified I committed the changes, then merged the branch to the main. 

Time to move on to the POST request.

### POST Data Access Function
I had the last part of the chain in place regarding adding launches to the data base, but there were still more links to set up in order to have a full POST data access function.

I envisioned the chain like so:
- Validate whether the planet exists within the planets database
- complete the launch object
- add the launch to the database (This is what I completed in the previous step)

#### Validating the Planet
I wanted to create an internal check/validation that would verify that the planet was indeed part of the planets database before adding the launch to the launches collection. 

I don’t know how necessary this is as the planets that are available to select on the front-end are the ones present in the planets database, but for the sake of practice and for the sake of data legitimacy I created one. 

This required importing the planets mongoose model into the launches model file. With it imported the .findOne() function was used on the planets model. The reason the findOne() was used instead of .find() is because with findOne() returns a null value if no matching document is found, whereas with .find() an empty array is returned. With the null value as a return a simpler check can be created. 

I created a function specifically for this and set it up like so:
```
async function checkValidPlanet(planetName) {
    const planetExists = await planetsDatabase.findOne({
        keplerName: planetName
    });
    return planetExists;
}
```

I utilized the console to verify that either the object was returned if it was present, or whether a null value was returned.  I did this by temporarily adding console.log(planetExists) prior to the return statement and calling the function within the model with valid and invalid arguments. 

#### Complete Launch Object Function
Just as with the planet validation, I decided to create a separate function that completes the launch object. This completed launch object would be passed as the argument into the saveLaunches function as the last step in the Data Access Function.

As I started on this I quickly hit the first problem to solve: how to increment the flight number. 

#### Incrementing the Flight Number
SQL databases have simple syntax for doing this, but with MongoDB this is not the case. However, the problem was not too difficult to solve.

I created another function that performed the specific task of retrieving the latest flight number. This function is naturally called getLatestFlightNumber.

To do this I utilized mongoose’s findOne({}) function, with the empty object as the argument and chained onto this mongoose’s .sort() function. For the argument of the .sort() function I passed in the string ‘-flightNumber’, which tells mongoose to sort the collection by flight number and in descending order (this is where the ‘-‘ comes in). 

Utilizing this in conjunction with the .findOne({}) function, what would be retrieved is the launch object that has the latest flight number. It was then simple to return the flight number of this object. This function looks like so:
```
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne({})
        .sort('-flightNumber');
    console.log(latestLaunch.flightNumber)
    return latestLaunch.flightNumber;
}
```

#### Completing the completeLaunch Function
Now completing the completeLaunch function was straight forward. I created a variable which utilized the nifty getLatestLaunch function and added one to its return. I utilized the Object.assign() function to add the necessary properties to the launch object that would be passed into it and then returned that object. It looks like so:
```
async function completeLaunch(launch) {
    const flightNumber = await getLatestFlightNumber() + 1;
    Object.assign(launch, {
        flightNumber,
        customers: ['NASA', 'Chris'],
        upcoming: true,
        success: true
    })
    return launch;
}
``` 

#### Determining How to Implement the Planet Validator
With all the links in the chain completed, twas high time to declare the Data Access Function. Or so I thought…

The first step was verifying the planet exists. I stored the value of the return of the planetExists function in a variable. I used a conditional to verify it exists. At first I set it up so if the planet was found to not be a planet within our database, then it would throw an Error object. However upon testing this, I realized it just broke the server. I didn’t like this. But this is how it looked:
```
const validPlanet = await checkValidPlanet(launch.target);
if (!validPlanet) {
    throw new Error('Not a valid planet.');
};
```

I decided to remove this validation from the addNewLaunch data access function and exported it as data access function in its own right, then imported it into the controller and set up the validation there. Doing it this way means the server will not break if an invalid planet is entered in, plus it provides the error message on the front-end’s response. It looks like so:
```
const planetExists = await checkValidPlanet(launch.target);

if (!planetExists) {
    return res.status(400).json({
        error: "This planet is not a valid exoplanet."
    })
}
```

I am not sure if this is the best way to deal with this. Reading here [Node Best Practices](https://github.com/goldbergyoni/nodebestpractices), it mentions how the best practice is the throw an Error object, but I don’t like the idea of the server breaking with an error. Doesn’t seem stable. This is an area that I still have some learning to do.

#### Setting up the addNewLaunch Data Access Function
Those moments above are fun to me. Making adjustments on the fly, learning how to be nimble, flexible, bending with the situation. This is also why I love coding, but I digress here…

With the validator in what I feel is a better and more consistent position, twas high time to finish the addNewLaunch Data Access Controller function.

At this point, by the time this function receives the launch I know all the properties within it will be valid and ready to pass into the completeLaunch function. So that’s what happens. That is step numero uno.

I store the return of the completeLaunch function into the fantastically named completedLaunch variable, and this is passed into the saveLaunch function, then I return the completedLaunch so that this can be returned as json in the response body. It looks like so:
```
async function addNewLaunch(launch) {
    const completedLaunch = await completeLaunch(launch);
    saveLaunch(completedLaunch);
    return completedLaunch;
}
```

I updated the controller to be async by prepending ‘async’ to the function declaration (easy peasy) and I tested this bad boy in Postman. The failure tests were successful (loving how that sentence makes perfect sense here). But with the successful tests I noticed something interesting

MongoDB added a property to the object. The property looks like so:
```
"$setOnInsert": {
        "__v": 0
    }
```

This may seem innocent enough, however I have learned that it is best to only show the data that is necessary. Having this property be visible within the response body could potentially leave the database vulnerable to hackers. How so? I don’t know, but best not to find out.

##### *
Digging deeper I found that this property is added when using the “upsert: true” option within the .updateOne() function, which is how the saveLaunches function is set up (see [here](bear://x-callback-url/open-note?id=EE88B88D-ABEC-455F-BD23-A15A4A586F6F-700-00121137C9828DA1&header=Updating%20Planets%20Model) and scroll down a little bit). 

The easy fix: use the .findOneAndUpdate() function. All other arguments stay the same, including the upsert option and viola, no more added property and a more secure response object.

With all this in place, and the server already running I tested the front-end and almost cried (okay, not really, but happiness was experienced) at the sound of success. 

Time for the final method: DELETE.