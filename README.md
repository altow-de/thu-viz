
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/). You can install Node.js and npm by following [these instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Installation

1. Clone the repository to your local machine.
  `git clone <your-repo-url>`
  `cd <your-repo-directory>`
   

2. Install the dependencies.
  `npm install`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Deployment and Production

To deploy the application, follow these steps:

1. Build the Next.js project.
   `npm run build`

2. Execute the deployment script to build the Next.js standalone project with the public and static folders, and copy the project to the server.
  `sh deploy.sh`
3. Learn how to set up your systemd service by following [this guide](https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/).

4. Restart the process using systemd.
   `systemctl restart configuration_interface`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
