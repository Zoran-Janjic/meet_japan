Meet Japan - README BACKEND

This is the README file for the Meet Japan project - backend , which is a web application built using Node.js, Express.js, and MongoDB with Mongoose.

Backend is MVC architectural pattern which separates an application into three main logical components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application.

Installation:

Clone the repository from GitHub: git clone https://github.com/ZoranUTF8/meet_japan.git

Navigate to the project directory: cd meet-japan

Install dependencies: npm install

Set up a .env file and message Zoran for MongoDB and any other necessary variables.

Start the server: npm run start:dev

Dependencies:

"dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "http-status-codes": "^2.2.0",
    "jsonwebtoken": "^9.0.0",
    "moment": "^2.29.4",
    "mongoose": "^7.0.3",
    "nodemailer": "^6.9.1",
    "slugify": "^1.6.6",
    "validator": "^13.9.0",
    "xss-clean": "^0.1.1"
  },

Dev Dependencies used:

"devDependencies": {
    "colors": "^1.4.0",
    "eslint": "^8.37.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.27.5",
    "ndb": "^1.1.5",
    "nodemon": "^2.0.22"
  }

Usage:
Once the server is running, navigate to http://localhost:3000 in your postman client to access the Meet Japan web api. 

Features:
Browse and search for tours of Japan
Filter tours by date, price, and number of persons
Book and pay for tours securely through the website
User account creation and management
View upcoming and past tours
Leave reviews and ratings for tours

Contributing:
Contributions to the Meet Japan project are welcome. Please create a pull request with your proposed changes and a detailed description of what your changes accomplish and put Zoran as a reviewer.

License:
This project is licensed under the Proprietary license. See the LICENSE file for more information.

If you have any questions or concerns about the Meet Japan project, please contact us at meetjapan2023@gmail.com
