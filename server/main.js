import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles'
import { Mongo } from 'meteor/mongo';
import { EventsCollection } from '../imports/api/collections';
import "./pub.js"

const accounts = [
  {
    email: "user@volunteer.com",
    username: "User",
    password: "changeme",
    roles: ["USER"]
  },
  {
    email: "admin@volunteer.com",
    username: "Admin",
    password: "changeme",
    roles: ["ADMIN"]
  },
  {
    email: "organization@volunteer.com",
    username: "Organization",
    password: "changeme",
    roles: ["ORG"]
  },
]

const events = [
  {
    title: "Beach Cleanup",
    date: "2023-11-15",
    location: "Waikiki Beach, Honolulu",
    description: "Join us for a day of cleaning up our beautiful beach and protecting marine life.",
    time: "9:00 AM - 12:00 PM",
    contact: "beachcleanup@volunteerhawaii.org",
    image: "volunteer.jpg"
  },
  {
    title: "Tree Planting",
    date: "2023-12-01",
    location: "Kualoa Regional Park, Oahu",
    description: "Help us plant native trees to restore the ecosystem.",
    time: "8:00 AM - 3:00 PM",
    contact: "treeplanting@volunteerhawaii.org",
    image: "volunteer.jpg"
  },
  {
    title: "Food Drive",
    date: "2023-11-20",
    location: "Aloha Stadium, Honolulu",
    description: "Collecting non-perishable food items for local families in need.",
    time: "10:00 AM - 4:00 PM",
    contact: "fooddrive@volunteerhawaii.org",
    image: "volunteer.jpg"
  },
  {
    title: "Community Garden Day",
    date: "2023-11-25",
    location: "Maui Community Garden, Wailuku",
    description: "Help us maintain our community garden and learn about sustainable gardening.",
    time: "9:00 AM - 1:00 PM",
    contact: "communitygarden@volunteerhawaii.org",
    image: "volunteer.jpg"
  },
  {
    title: "Ocean Conservation Workshop",
    date: "2023-12-10",
    location: "Hanauma Bay, Oahu",
    description: "Learn about ocean conservation efforts and how you can help.",
    time: "1:00 PM - 4:00 PM",
    contact: "oceanconservation@volunteerhawaii.org",
    image: "volunteer.jpg"
  }
];

Meteor.startup(async () => {
  const numUsers = await Meteor.users.find({}).countAsync() 
  if (numUsers === 0) {
    accounts.forEach(async account => {
      console.log("created user: " + JSON.stringify(account))
      const id = await Accounts.createUserAsync(account)
      for (const role of account.roles) {
        await Roles.createRoleAsync(role, {unlessExists: true});
      }
      await Roles.addUsersToRolesAsync(id, account.roles)
    })
  } else {
    console.log("accounts already created")
  }

  const eventsCollection = EventsCollection
  const numEvents = await eventsCollection.find({}).countAsync()
  if (numEvents === 0) {
    events.forEach(event => {
      eventsCollection.insertAsync(event)
    })
  }
});