# Next Auth Custom Cognito Signin, with additional providers.

[Demo](https://github.com/user-attachments/assets/55b0d98a-8f24-4b03-8c46-3ac8aa8489b6)


## Description

This is a simple project that shows how to create simple web application which utilizes next auth as an authentication layer.

The ability of signing in and registering etc is using a Cognito Userpool and [amazon-cognito-identity-js](https://www.npmjs.com/package/amazon-cognito-identity-js)
The app does make use of other providers from NextAuth such as [github](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app) and [google](https://developers.google.com/identity/sign-in/web/sign-in), these can be controlled using env variables.

Using cognito, users are able to signin, signup, confirm account, forgot password and change password all using a custom journey.

There are two applications in this project called 'main' and 'members', main is the signin, signup etc application whereas 
members is a protected area only accessible once logged in.

Once users are signed in are put into a very simple user table in [DynamoDB](https://aws.amazon.com/pm/dynamodb/).


This project uses the following NextJS features:

- [App Router](https://nextjs.org/docs/app)
- [Next Auth](https://next-auth.js.org/)
- [Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags/flags-pattern-nextjs)
- [Multi Zones](https://nextjs.org/docs/pages/building-your-application/deploying/multi-zones)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

For styling/Components [Material UI](https://mui.com/material-ui/) for the layout and overall design these are all taken from: [Free Material UI templates](https://mui.com/material-ui/getting-started/templates/) all components are examples from [Material uis component library](https://mui.com/material-ui/all-components/).

For tests this project uses [Jest](https://jestjs.io/), [React testing library](https://testing-library.com/docs/react-testing-library/intro/) and [Cypress](https://www.cypress.io/) for acceptance criteria.


## Libraries
[Zustand](https://github.com/pmndrs/zustand) - Used for client side calls and maintaining state.

[Material-ui](https://mui.com/material-ui/) - Components general styling.

[Isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify) - Sanitizing query strings that come into the API.

[uuid](https://www.npmjs.com/package/uuid) - Used to inject an uuid into a cookie, so you can protect endpoints for only those who have a session, this also enables you to track a user through a frontend and backend calls.

## Overview
So if you come across a bug, raise a PR!, if you think there is a better way of doing something, raise a PR!

This entire project is supposed to aid folk in building a protected area using AWS Cognito and next auth, by all means copy this repo and code, but if you can improve it and help others please do so.

### Queries
Why did I make this? funsies...

Why stick users in a Dynamo DB? Soooo the DynamoDB is just used as a way to store a user, don't worry no credentials are stored, it's just a means to associate a user to a registered account with a unique ID, you could tie this into your own system, such as an ordering system, booking system etc....

Okay but why dynamoDB as its none relational? Because I'm cheap and this is a demo app...

Why use API endpoints instead of server side actions in NextJS? I basically prefer it, easier to detach.
I usually prefer a client side action to a server side endpoint, easier on the ui for spinners, potential for code base to be separate and detachable, 
for example you could just delete the api endpoints and create an express app that handles those calls, API gateway with lambda association.... anything


Why no `<SessionProvider>`? So it's not really needed when doing the App directory route, that would just call the session callback method in NextAuth which I don't have because im doing everything for sessions severside and using the JWT strategy.

Who are ya? [ME!](http://www.jamiebyrne.com)

## Prerequisites
You will need to have an [Amazon Cognito Userpool](https://aws.amazon.com/pm/cognito/) and a [DynamoDB](https://aws.amazon.com/pm/dynamodb/) created prior to this.

If you do not want to use Github and or Google Signin, you can disable this in the .env by setting the enabled flags to 0.


## Installation

Navigate to the relevant app so 'main' or 'members'

To install run:
```bash
npm i
```

## Running Locally
Once you have installed simply run:

```bash
npm run dev
```


## Tests
To run:
```bash
npm run test:jest
# or
npm run test:cypress
```
