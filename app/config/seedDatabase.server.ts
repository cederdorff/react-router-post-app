import { Types } from "mongoose";
import Post from "~/models/Post";
import User from "~/models/User";

export default async function seedDatabase() {
  // check if data exists
  const userCount = await User.countDocuments();
  const postCount = await Post.countDocuments();

  if (userCount === 0 || postCount === 0) {
    await dropCollections();
    await insertData();
    console.log("Database seeded successfully!");
  }
}

async function dropCollections() {
  console.log("Dropping collections...");
  // Drop collections
  await User.collection.drop();
  await Post.collection.drop();
}

// ========== insertData ========== //

async function insertData() {
  console.log("Inserting data...");
  // Insert users
  const maria = await User.create({
    image:
      "https://www.baaa.dk/media/b5ahrlra/maria-louise-bendixen.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921650330000&format=webp",
    mail: "mlbe@eaaa.dk",
    name: "Maria Louise Bendixen",
    title: "Senior Lecturer",
    educations: ["Multimedia Design"],
    password: "1234",
    car: "Audi A3"
  });

  const rasmus = await User.create({
    _id: new Types.ObjectId("65cde4cb0d09cb615a23db17"),
    image: "https://share.cederdorff.dk/images/race.webp",
    mail: "race@eaaa.dk",
    name: "Rasmus Cederdorff",
    title: "Senior Lecturer",
    educations: ["Multimedia Design", "Web Development", "Digital Concept Development"],
    password: "1234"
  });

  const anne = await User.create({
    image:
      "https://www.baaa.dk/media/5buh1xeo/anne-kirketerp.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921531600000&format=webp",
    mail: "anki@eaaa.dk",
    name: "Anne Kirketerp",
    title: "Head of Department",
    educations: ["Multimedia Design", "Web Development", "Digital Concept Development"],
    password: "1234"
  });

  const line = await User.create({
    image: "https://www.eaaa.dk/media/14qpfeq4/line-skjodt.jpg?width=800&height=450&rnd=133178433559770000",
    mail: "lskj@eaaa.dk",
    name: "Line Skjødt",
    title: "Senior Lecturer & Internship Coordinator",
    educations: ["Multimedia Design"],
    password: "1234"
  });

  const dan = await User.create({
    image:
      "https://www.eaaa.dk/media/bdojel41/dan-okkels-brendstrup.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921559630000&format=webp",
    mail: "dob@eaaa.dk",
    name: "Dan Okkels Brendstrup",
    title: "Lecturer",
    educations: ["Web Development"],
    password: "1234"
  });

  // Insert posts
  await Post.insertMany([
    {
      caption: "Beautiful sunset at the beach",
      image:
        "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 101,
      user: maria._id,
      tags: ["beach", "sunset", "nature", "aarhus"]
    },
    {
      caption: "Exploring the city streets of Aarhus",
      image:
        "https://images.unsplash.com/photo-1559070169-a3077159ee16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 33,
      user: rasmus._id,
      tags: ["city", "aarhus", "exploration"]
    },
    {
      caption: "Delicious food at the restaurant",
      image:
        "https://images.unsplash.com/photo-1548940740-204726a19be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 21,
      user: line._id,
      tags: ["food", "restaurant", "delicious"]
    },
    {
      caption: "Exploring the city center of Aarhus",
      image:
        "https://images.unsplash.com/photo-1612624629424-ddde915d3dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 97,
      user: rasmus._id,
      tags: ["city", "aarhus", "exploration", "cityhall"]
    },
    {
      caption: "A cozy morning with coffee",
      image:
        "https://images.unsplash.com/photo-1545319261-f3760f9dd64d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 785,
      user: dan._id,
      tags: ["morning", "coffee", "cozy", "food"]
    },
    {
      caption: "Serenity of the forest",
      image:
        "https://images.unsplash.com/photo-1661505216710-32316e7b5bb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 799,
      user: rasmus._id,
      tags: ["forest", "nature", "serenity"]
    },
    {
      caption: "A beautiful morning in Aarhus",
      image:
        "https://images.unsplash.com/photo-1573997953524-efed43db70a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 99,
      user: maria._id,
      tags: ["morning", "aarhus", "beautiful", "AROS"]
    },
    {
      caption: "Rainbow reflections of the city of Aarhus",
      image:
        "https://images.unsplash.com/photo-1558443336-dbb3de50b8b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      likes: 589,
      user: anne._id,
      tags: ["city", "aarhus", "rainbow", "AROS"]
    },
    {
      caption: "The city streets of Aarhus ✨",
      image:
        "https://images.unsplash.com/photo-1596150368199-1dddc9fc34cc?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 201,
      user: rasmus._id,
      tags: ["city", "aarhus", "streets"]
    }
  ]);
}
