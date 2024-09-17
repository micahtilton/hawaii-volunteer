import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const accounts = [
  {
    email: "user@volunteer.com",
    username: "User",
    password: "changeme",
  },
  {
    email: "admin@volunteer.com",
    username: "Admin",
    password: "changeme",
  },
  {
    email: "organization@volunteer.com",
    username: "Organization",
    password: "changeme",
  },
]

Meteor.startup(async () => {
  const numUsers = await Meteor.users.find({}).countAsync() 
  if (numUsers === 0) {
    accounts.forEach(account => {
      console.log("created user: " + JSON.stringify(account))
      Accounts.createUser(account)
    })
  } else {
    console.log("accounts already created")
  }
});
