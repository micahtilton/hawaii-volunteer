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
    roles: ["USER"],
    details: {
      bio: "I am a passionate volunteer who loves to help the community. I enjoy participating in various events that promote environmental conservation. My goal is to make a positive impact in the lives of others. I believe in the power of teamwork and collaboration. In my free time, I enjoy hiking and exploring the beautiful landscapes of Hawaii.",
      skills: ["Teamwork", "Communication", "Event Planning", "Environmental Awareness", "First Aid"],
      birthdate: "1990-05-15"
    }
  },
  {
    email: "admin@volunteer.com",
    username: "Admin",
    password: "changeme",
    roles: ["ADMIN"],
    details: {
      bio: "As an admin, I oversee volunteer activities and ensure everything runs smoothly. I have a strong background in management and organization. My passion lies in connecting volunteers with meaningful opportunities. I strive to create a welcoming environment for all participants. Outside of work, I enjoy reading and gardening.",
      skills: ["Leadership", "Organization", "Problem Solving", "Public Speaking", "Networking"],
      birthdate: "1985-08-22"
    }
  },
  {
    email: "organization@volunteer.com",
    username: "Organization",
    password: "changeme",
    roles: ["ORG"],
    details: {
      bio: "I represent an organization dedicated to community service and environmental protection. We work with volunteers to create impactful projects that benefit the local community. My role involves coordinating events and managing volunteer resources. I am committed to fostering a culture of service and sustainability. In my spare time, I love to travel and learn about different cultures.",
      skills: ["Project Management", "Community Engagement", "Fundraising", "Sustainability Practices", "Cultural Awareness"],
      birthdate: "1992-11-30"
    }
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
      await Meteor.users.updateAsync(id, {$set: account.details})
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