# Getting Started 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 

The /client folder holds the react app, with relevant files being /public and /src. 
The /public folder will have different .json files, which are used to fetch data when the server has not been started.
The /src folder will have the project's /components, /pages, and /interactions, along with the sstandard app.jsx and index.jsx.

##
Important to note, there may be many files that have no functionality in the app. In most cases, either smaller components were not needed or larger components were broken down after the fact.

##
To add and render a formatted blank page (including navbar & header), import and add the following to any page on the project: 

  import {Link} from 'react-router-dom'
  
  return (
    ... 
    <Link to={'/filename'}> 
    </Link>
  );

Then, to add the page to the project, add the following line of code to AnimatedRoutes.jsx in /src/components:

    <Route path='/something' element={<Something/>}/>
    
There should be many Routes in the file like this, put it anywhere with the rest of them.

##
Also, the two mostly blank files '/Friends.js' and '/CreateMilestone.js' have the imports and css styling that should be featured on the 
majority of the project, so it will definitely be useful to save a blank copy as a reference.

##

The server file doesn't really need to be touched if you arent running the server, and I haven't found a way to push milestoneDB from mySQL Workbench
to github. Although if you want to connect to Postman with /server.js, lemme know and I can set it up for you.

If there are any errors coming from the backend, make sure the following dependencies are included in /server/package.json 

  "dependencies": {
    "mysql": "^2.18.1",
    "express": "^4.18.1",
    "body-parser": "^1.20.0",
    "cors": "^2.8.5"
  },
 
If anything is missing just do "npm install express" or whichever dependancy is missing.

Big Body Bands
