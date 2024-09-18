import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";
import { Mongo } from "meteor/mongo";
import { EventsCollection } from "../imports/api/collections";
import "./pub.js";

const accounts = [
  {
    email: "user@volunteer.com",
    username: "User",
    password: "changeme",
    roles: ["USER"],
    details: {
      bio: "I am a passionate volunteer who loves to help the community. I enjoy participating in various events that promote environmental conservation. My goal is to make a positive impact in the lives of others. I believe in the power of teamwork and collaboration. In my free time, I enjoy hiking and exploring the beautiful landscapes of Hawaii.",
      skills: [
        "Teamwork",
        "Communication",
        "Event Planning",
        "Environmental Awareness",
        "First Aid",
      ],
      birthdate: "1990-05-15",
    },
  },
  {
    email: "admin@volunteer.com",
    username: "Admin",
    password: "changeme",
    roles: ["ADMIN"],
    details: {
      bio: "As an admin, I oversee volunteer activities and ensure everything runs smoothly. I have a strong background in management and organization. My passion lies in connecting volunteers with meaningful opportunities. I strive to create a welcoming environment for all participants. Outside of work, I enjoy reading and gardening.",
      skills: [
        "Leadership",
        "Organization",
        "Problem Solving",
        "Public Speaking",
        "Networking",
      ],
      birthdate: "1985-08-22",
    },
  },
  {
    email: "organization@volunteer.com",
    username: "Organization",
    password: "changeme",
    roles: ["ORG"],
    details: {
      bio: "I represent an organization dedicated to community service and environmental protection. We work with volunteers to create impactful projects that benefit the local community. My role involves coordinating events and managing volunteer resources. I am committed to fostering a culture of service and sustainability. In my spare time, I love to travel and learn about different cultures.",
      skills: [
        "Project Management",
        "Community Engagement",
        "Fundraising",
        "Sustainability Practices",
        "Cultural Awareness",
      ],
      birthdate: "1992-11-30",
    },
  },
];

const events = [
  {
    title: "Beach Cleanup",
    location: "Waikiki Beach, Honolulu",
    description:
      "Join us for a day of cleaning up our beautiful beach and protecting marine life. This event is crucial for maintaining the health of our coastal ecosystems. Volunteers will work together to collect trash and debris that threaten marine habitats. By participating, you will help create a cleaner environment for both wildlife and beachgoers. Together, we can make a significant impact on our local community.",
    summary: "A community effort to clean and protect Waikiki Beach.",
    startDate: new Date("2023-11-15T09:00:00"),
    endDate: new Date("2023-11-15T12:00:00"),
    image: "/volunteer.jpg",
    skills: ["Teamwork", "Environmental Awareness", "Physical Fitness"],
    completed: false
  },
  {
    title: "Tree Planting",
    location: "Kualoa Regional Park, Oahu",
    description:
      "Help us plant native trees to restore the ecosystem. This event is essential for enhancing biodiversity in our area. Volunteers will learn about the importance of native species and their role in the environment. Together, we will plant trees that provide habitat for wildlife and improve air quality. Join us in making a lasting difference in our community's landscape.",
    summary: "Planting native trees to restore local ecosystems.",
    startDate: new Date("2023-12-01T08:00:00"),
    endDate: new Date("2023-12-01T15:00:00"),
    image: "/volunteer.jpg",
    skills: ["Gardening", "Environmental Awareness", "Teamwork"],
    completed: false
  },
  {
    title: "Food Drive",
    location: "Aloha Stadium, Honolulu",
    description:
      "Collecting non-perishable food items for local families in need. This event aims to support those who are struggling to put food on the table. Volunteers will help organize donations and distribute food to families. Your contribution can make a significant difference in the lives of many. Join us in our mission to alleviate hunger in our community.",
    summary: "Collecting food items to support local families in need.",
    startDate: new Date("2023-11-20T10:00:00"),
    endDate: new Date("2023-11-20T16:00:00"),
    image: "/volunteer.jpg",
    skills: ["Organization", "Communication", "Teamwork"],
    completed: false
  },
  {
    title: "Community Garden Day",
    location: "Maui Community Garden, Wailuku",
    description:
      "Help us maintain our community garden and learn about sustainable gardening. This event is a great opportunity to connect with nature and fellow gardening enthusiasts. Volunteers will assist in planting, weeding, and harvesting. By participating, you will gain valuable skills in sustainable practices. Together, we can create a thriving garden that benefits our community.",
    summary: "Maintaining and learning about sustainable gardening practices.",
    startDate: new Date("2023-11-25T09:00:00"),
    endDate: new Date("2023-11-25T13:00:00"),
    image: "/volunteer.jpg",
    skills: ["Gardening", "Sustainability", "Teamwork"],
    completed: false
  },
  {
    title: "Ocean Conservation Workshop",
    location: "Hanauma Bay, Oahu",
    description:
      "Learn about ocean conservation efforts and how you can help. This workshop will cover various topics related to marine ecosystems and conservation strategies. Participants will engage in discussions and hands-on activities. Your involvement can lead to positive changes in ocean health. Join us to become an advocate for our oceans.",
    summary: "Workshop focused on ocean conservation and advocacy.",
    startDate: new Date("2023-12-10T13:00:00"),
    endDate: new Date("2023-12-10T16:00:00"),
    image: "/volunteer.jpg",
    skills: ["Environmental Awareness", "Public Speaking", "Teamwork"],
    completed: false
  },
];

Meteor.startup(async () => {
  const numUsers = await Meteor.users.find({}).countAsync();
  if (numUsers === 0) {
    accounts.forEach(async (account) => {
      console.log("created user: " + JSON.stringify(account));
      const id = await Accounts.createUserAsync(account);
      await Meteor.users.updateAsync(id, { $set: account.details });
      await Meteor.users.updateAsync(id, {
        $set: { completedEvents: [], currentEvents: [] },
      });
      for (const role of account.roles) {
        await Roles.createRoleAsync(role, { unlessExists: true });
      }
      await Roles.addUsersToRolesAsync(id, account.roles);
    });
  } else {
    console.log("accounts already created");
  }

  const eventsCollection = EventsCollection;
  const numEvents = await eventsCollection.find({}).countAsync();

  if (numEvents === 0) {
    const organizations_cursor = await Roles.getUsersInRoleAsync("ORG");
    const organizations = await organizations_cursor.fetch();
    const organizer = organizations[0];
    if (!!organizer) {
      events.forEach((event) => {
        eventsCollection.insertAsync({
          ...event,
          organizer: organizer._id,
        });
      });
    }
  }
});
