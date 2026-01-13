# Next Auth Custom Cognito Signin, with additional providers.

## Demo

[Demo](https://github.com/user-attachments/assets/6f930454-f99d-414c-a32a-a6910e524699)

## Prerequisites
You will need to have an [Amazon Cognito Userpool](https://aws.amazon.com/pm/cognito/) and a [PostgreSQL](https://www.postgresql.org/download/) created prior to this.

You can find the SQL schema in the SQL folder.

If you do not want to use GitHub and or Google Signin, you can disable this in the .env by setting the enabled flags to 0.


## Description

This project shows how to create a web application which utilizes next auth as an authentication layer.

The ability of signing in and registering etc is using a Cognito Userpool and [amazon-cognito-identity-js](https://www.npmjs.com/package/amazon-cognito-identity-js).

The app does make use of other providers from NextAuth such as [github](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app) and [google](https://developers.google.com/identity/sign-in/web/sign-in), these can be controlled using env variables.

Using cognito, users are able to signin, signup, confirm account, forgot password and change password all using a custom journey.

There are two applications in this project called 'main' and 'members', main is the signin, signup etc application..
whereas members is a protected area only accessible once logged in.

Once users are signed in, they're put into a very simple user table in [PostgreSQL](https://www.postgresql.org/download/).

All signed-in users sessions are stored in a logged in history table. This gives you traceability across devices and accounts.

So if you come across a bug, raise a PR!, if you think there is a better way of doing something, raise a PR!

This entire project is supposed to aid folk in building a protected area using AWS Cognito and next auth, by all means copy this repo and code, but if you can improve it and help others please do so.

This project uses the following NextJS features:

- [App Router](https://nextjs.org/docs/app)
- [Next Auth](https://next-auth.js.org/)
- [Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags/flags-pattern-nextjs)
- [Multi Zones](https://nextjs.org/docs/pages/building-your-application/deploying/multi-zones)
- [Proxy (middleware)](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

For styling/Components [Material UI](https://mui.com/material-ui/) for the layout and overall design these are all taken from: [Free Material UI templates](https://mui.com/material-ui/getting-started/templates/) all components are examples from [Material uis component library](https://mui.com/material-ui/all-components/).


**NOTE** 05/11/2025 - I will be re adding the tests soon
For tests this project uses [Jest](https://jestjs.io/), [React testing library](https://testing-library.com/docs/react-testing-library/intro/) and [Cypress](https://www.cypress.io/) for acceptance criteria.


## Libraries
[Zustand](https://github.com/pmndrs/zustand) - Used for client side calls and maintaining state.

[Material-ui](https://mui.com/material-ui/) - Components general styling.

[Isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify) - Sanitizing query strings that come into the API/severside.

[uuid](https://www.npmjs.com/package/uuid) - Used to inject an uuid into a cookie, so you can protect endpoints for only those who have a session, this also enables you to track a user through a frontend and backend calls.

[zod](https://zod.dev/) - Schema validation for the endpoints



## Installation

Navigate to the relevant app so 'main' or 'members'

To install run in each of the projects:
```bash
yarn install
```

## Running Locally
You will also need to have PostgreSQL running and run the schema found in the SQL folder.

You will need to set up a .env file taken from the .env.example in each project.

Once you have installed simply run in each of the projects, main will run on port 3000 and members will run on 3001

```bash
npm run dev
```

**NOTE** 05/11/2025 - I will be re adding the tests soon
## Tests
To run:
```bash
npm run test:jest
# or
npm run test:cypress
```

### Freebies

Enjoy my lil solution to constantly have a valid WebSession ID... (in proxy) this means you can always trace users and what they do, backend and frontend.

Couple the above with the server/client side logger and you have fully readable logs both client and server side, Add in dynatrace to your solution and you have a full circle of traceability for when things go wrong!

DB controller, A simple lil thing that can come in handy when debugging and tracing user queries by web session id.

### Duplication
So the components and utils will be duplicated in each project, create yourself a nice lil ui/util package to share between the projects. Get creative!

### Queries
Why did I make this? funsies...

Why stick users in a users table? Soooo the users table is just used as a way to store a user, don't worry no credentials are stored, it's just a means to associate a user to a registered account with a unique ID, you could tie this into your own system, such as an ordering system, booking system etc....

Why no `<SessionProvider>`? So it's not really needed when doing the App directory route, that would just call the session callback method in NextAuth which I don't have because im doing everything for sessions severside and using the JWT strategy.

Who are am I?! [Jamie B!](http://www.jamiebyrne.com)
