#Directory Tree Problem

## Installation
To begin, you want to make sure you have Node installed on your machine. This project was created with Node v10.16.3
Head over to [https://nodejs.org/en/download/](https://nodejs.org/en/download/) to download it.


Once you have Node installed, open a terminal and navigate to the root of the project and run:

```
npm install
```

##Running in development mode
From in a terminal of the root directory of the project, run:

```
npm run start
```

This will compile the Angular source code and start a Node server on port 4200. 
Once it compiles, open a browser and navigate to [localhost:4200](http://localhost:4200).

##Running in production mode
From in a terminal of the root directory of the project, run:
```
npm run build -- --prod
```

This will generate the static files needed for the application in the `~dist/directory-tree-problem` directory.
From here, you would need to deploy the static files to a web server of your choosing.

##Usage
Once the application is running in either development or production mode, simply navigating to the application in the browser will trigger the code to run.
The results should be displayed on the webpage.
