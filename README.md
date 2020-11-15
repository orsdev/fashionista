# fashionista

An ecommerce store built in NodeJS utilizing Express, Stripe Payment, MongoDB. Developed with the latest cutting edge industry standard technologies.

## Live Demo

View the live demo as hosted on Heroku at [Fashionit](https://fashionistaproject.herokuapp.com/) (application may take few seconds to load)

## Technologies

- Node.js
- Express
- Mongoose
- Pug
- Eslint
- Stripe

## Requirements

1. Internet connection
2. NodeJS
3. Mongoose
4. Stripe account _[Register](https://stripe.com/)_
5. Sendgrid account _[Register](https://sendgrid.com/)_
6. Imgur account _[Register](https://imgur.com/)_

## Instructions

Open the project in VS Code, and navigate to config folder. Open the config.js in the editor:

- Create a dev.env file
- Add the env variables below to dev.env

1. PORT=<value> _eg PORT=3000_
2. DB_URI=<Mongo DB Url> eg DB_URI=mongodb://localhost/test
3. SESSION_COLLECTION=<Value> eg SESSION_COLLECTION=sessionCollection
4. SESSION_SECRET=<Value> eg SESSION_SECRET=MYSECRET
5. SENDGRID_API_KEY=<Your SendGrid Api Key Value> eg SENDGRID_API_KEY=SG.TrSMYWn9TGeIyiXfIUsRUQ
6. STRIPE_EMAIL_ADDRESS=<Your Stripe Email Address> eg STRIPE_EMAIL_ADDRESS=user@gmail.com
7. STRIPE_SECRET_KEY=<Your Stripe SECRET KEY> eg STRIPE_SECRET_KEY=sk_test_51HY4weLdDWfSLJV4PMyEhm1
8. DOMAIN_URL=<Your Domain> eg DOMAIN_URL=http://localhost:3000 .Replace with hosted domain in production
9. ADMIN_EMAIL_ADDRESS=<ANY EmaiL Address> eg ADMIN_EMAIL_ADDRESS=user@gmail.com
10. IMGUR_CLIENT_ID=<Your IMGUR CLIENT ID> eg IMGUR_CLIENT_ID=Client-ID 2be01

## Install

`npm install`

## Usage

`npm run start-dev`

## Others

![Home](https://res.cloudinary.com/osdev/image/upload/v1605437964/fashionit/home_tc26lf.png)
![Shop](https://res.cloudinary.com/osdev/image/upload/v1605437978/fashionit/shop_dggat1.png)
![Orders](https://res.cloudinary.com/osdev/image/upload/v1605437976/fashionit/orders_vyctle.png)
