// Prisma Seed Script for Travally (Strictly Indian Market Launch Data)
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Travally database with authentic Indian personas, activities, and travel expeditions...");

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.travelPlan.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create the Four Core Demo Personas for Quick Switch (Authentic Indian Solo Companions)
  // Persona 1: Ananya Sharma (Bangalore - Culture, Indie Cinema & Specialty Filter Coffee)
  const ananya = await prisma.user.create({
    data: {
      email: "ananya@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Ananya Sharma",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          bio: "Specialty filter coffee addict, Suchitra Film Society regular, and weekend sketcher in Cubbon Park. Working in tech by day; love exploring indie bookshops and heritage cafes on Saturdays.",
          birthDate: new Date("1997-04-14"),
          age: 27,
          gender: "FEMALE",
          city: "Bengaluru",
          country: "India",
          interests: JSON.stringify(["Indie Cinema", "Specialty Coffee", "Cubbon Park", "Book Reading", "Board Games"]),
          preferredActivities: JSON.stringify(["Movies", "Food and Cafes", "Walking", "City Exploration"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, dating: false, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/ananya-sharma-travally",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  // Persona 2: Rohan Verma (Mumbai - Heritage Architecture & Western Ghats Treks)
  const rohan = await prisma.user.create({
    data: {
      email: "rohan@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Rohan Verma",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          bio: "Architectural photographer and weekend Sahyadri trekker. Love Marine Drive night strolls, Bandra vintage cafes, and spontaneous sunset cycling along Worli Sea Face.",
          birthDate: new Date("1995-11-20"),
          age: 29,
          gender: "MALE",
          city: "Mumbai",
          country: "India",
          interests: JSON.stringify(["Architecture", "Street Photography", "Sahyadri Treks", "Bandra Cafes", "Cycling"]),
          preferredActivities: JSON.stringify(["City Exploration", "Walking", "Food and Cafes", "Events"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, dating: false, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/rohan-verma-travally",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  // Persona 3: Priya Iyer (Delhi NCR - Solo Backpacker & Himalayan Trek Leader)
  const priya = await prisma.user.create({
    data: {
      email: "priya@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Priya Iyer",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
          bio: "Himalayan trekker, tea garden wanderer, and slow-travel enthusiast. Hiked Kasol, Kheerganga, and Living Root Bridges. Looking for verified travel companions for North-East & Spiti road expeditions!",
          birthDate: new Date("1998-03-08"),
          age: 26,
          gender: "FEMALE",
          city: "New Delhi",
          country: "India",
          interests: JSON.stringify(["Himalayan Treks", "Monastery Trails", "Himachali Food", "Road Trips", "Camping"]),
          preferredActivities: JSON.stringify(["City Exploration", "Food and Cafes", "Walking"]),
          connectionPreferences: JSON.stringify({ friendship: true, travel: true, activityPartner: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/priya-iyer-travally",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  // Persona 4: Trust & Safety Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@travally.app",
      passwordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Travally India Safety Team",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
          bio: "Official Community Moderation and Trust & Safety Guardian for Travally India.",
          city: "Bengaluru",
          country: "India",
          isVerified: true,
          verificationStatus: "VERIFIED",
        },
      },
    },
    include: { profile: true },
  });

  // Aliases for backward compatibility:
  await prisma.user.create({
    data: {
      email: "sarah@travally.app",
      passwordHash,
      role: "USER",
      profile: { create: { displayName: "Ananya Sharma (Sarah)", city: "Bengaluru", isVerified: true, verificationStatus: "VERIFIED" } },
    },
  });
  await prisma.user.create({
    data: {
      email: "alex@travally.app",
      passwordHash,
      role: "USER",
      profile: { create: { displayName: "Rohan Verma (Alex)", city: "Mumbai", isVerified: true, verificationStatus: "VERIFIED" } },
    },
  });
  await prisma.user.create({
    data: {
      email: "maya@travally.app",
      passwordHash,
      role: "USER",
      profile: { create: { displayName: "Priya Iyer (Maya)", city: "New Delhi", isVerified: true, verificationStatus: "VERIFIED" } },
    },
  });

  // Additional Active Indian Community Members
  const kabir = await prisma.user.create({
    data: {
      email: "kabir@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Kabir Mehta",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
          bio: "Trail biker, certified rafter, and live music lover. Organizing Parvati valley treks and riverside acoustic music jams in Kasol & Tosh.",
          birthDate: new Date("1994-08-25"),
          age: 30,
          gender: "MALE",
          city: "Chandigarh",
          country: "India",
          interests: JSON.stringify(["River Rafting", "Acoustic Music", "Kasol Treks", "Cafe Hopping", "Motorcycling"]),
          preferredActivities: JSON.stringify(["Events", "Walking", "Food and Cafes"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const sneha = await prisma.user.create({
    data: {
      email: "sneha@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Sneha Nair",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
          bio: "Botanical researcher and yoga practitioner. Organizing peaceful Munnar tea estate walks and Alleppey backwater kayaking sessions.",
          birthDate: new Date("1996-09-12"),
          age: 28,
          gender: "FEMALE",
          city: "Kochi",
          country: "India",
          interests: JSON.stringify(["Tea Trails", "Kayaking", "Yoga", "Backwaters", "South Indian Cuisine"]),
          preferredActivities: JSON.stringify(["Studying", "Food and Cafes", "Walking"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  // 2. Create Authentic Indian Companion Activities
  const today = new Date();
  const date1 = new Date(today);
  date1.setDate(today.getDate() + 2);

  const date2 = new Date(today);
  date2.setDate(today.getDate() + 4);

  const date3 = new Date(today);
  date3.setDate(today.getDate() + 6);

  const act1 = await prisma.activity.create({
    data: {
      organizerId: ananya.id,
      title: "Satyajit Ray Film Screening + Filter Coffee & Dosa Crawl",
      description: "Catching classic restored cinema at Suchitra Film Society, followed by crisp Benne Masala Dosas and artisanal filter coffee at Brahmin's Cafe in Basavanagudi. Looking for fellow cinema and South Indian food buffs!",
      category: "FOOD_CAFES",
      date: date1,
      startTime: "17:30",
      approxDurationHours: 3.5,
      locationName: "Basavanagudi, Bengaluru",
      meetingPointVenue: "Suchitra Film Society Main Entrance",
      maxParticipants: 3,
      currentAcceptedCount: 1,
      preferredAgeMin: 21,
      preferredAgeMax: 35,
      genderPreference: "ANY",
      additionalRequirements: "Please arrive 15 minutes early so we can grab good seats together.",
      visibility: "PUBLIC",
      cutoffHoursBeforeStart: 2,
      status: "OPEN",
    },
  });

  const act2 = await prisma.activity.create({
    data: {
      organizerId: rohan.id,
      title: "Bandra Art Deco Photo Walk & Sunset at Bandstand",
      description: "A relaxed 4km architectural walk exploring hidden Portuguese bungalows in Ranwar village, vintage Art Deco buildings, and grabbing sea breeze with iced cold brew at Bandstand sunset.",
      category: "CITY_EXPLORATION",
      date: date2,
      startTime: "16:30",
      approxDurationHours: 3.0,
      locationName: "Bandra West, Mumbai",
      meetingPointVenue: "Subko Coffee Roasters, Ranwar Village",
      maxParticipants: 4,
      currentAcceptedCount: 0,
      preferredAgeMin: 20,
      preferredAgeMax: 38,
      genderPreference: "ANY",
      visibility: "PUBLIC",
      status: "OPEN",
    },
  });

  const act3 = await prisma.activity.create({
    data: {
      organizerId: priya.id,
      title: "Cubbon Park Sunday Reading & Sketching Circle",
      description: "Peaceful Sunday morning under the bamboo groves at Cubbon Park. Bring your favorite book, notebook, or sketching pad. 2 hours of silent focus followed by refreshing coconut water and chai at the press club corner.",
      category: "STUDYING",
      date: date3,
      startTime: "09:30",
      approxDurationHours: 3.0,
      locationName: "Cubbon Park, Bengaluru",
      meetingPointVenue: "Near Central Library Statue",
      maxParticipants: 4,
      currentAcceptedCount: 0,
      genderPreference: "ANY",
      visibility: "PUBLIC",
      status: "OPEN",
    },
  });

  // 3. Create Authentic Indian Travel Plans (Expeditions with INR Budgets)
  const tripDate1Start = new Date(today);
  tripDate1Start.setDate(today.getDate() + 14);
  const tripDate1End = new Date(today);
  tripDate1End.setDate(today.getDate() + 21);

  const trip1 = await prisma.travelPlan.create({
    data: {
      organizerId: priya.id,
      destination: "Kasol & Tosh: Parvati Valley Trek & Riverside Camps",
      departureCity: "New Delhi / Chandigarh",
      startDate: tripDate1Start,
      endDate: tripDate1End,
      budgetMin: 8500,
      budgetMax: 14500,
      currency: "INR",
      travelStyle: "ADVENTURE",
      interests: JSON.stringify(["Parvati River", "Kasol Cafes", "Kheerganga Trek", "Stargazing", "Himachali Cuisine"]),
      plannedAttractions: JSON.stringify(["Chalal riverside trail", "Tosh waterfall hike", "Manikaran hot springs", "Acoustic camp night"]),
      accommodationPreference: "HOSTEL",
      transportPreference: "ROAD_TRIP",
      groupSizeMax: 4,
      currentAcceptedCount: 1,
      companionPreferences: JSON.stringify({ pacing: "Moderate", morningPerson: true, respectful: true }),
      status: "OPEN",
    },
  });

  const tripDate2Start = new Date(today);
  tripDate2Start.setDate(today.getDate() + 30);
  const tripDate2End = new Date(today);
  tripDate2End.setDate(today.getDate() + 38);

  const trip2 = await prisma.travelPlan.create({
    data: {
      organizerId: rohan.id,
      destination: "Meghalaya Monsoon: Living Root Bridges & Dawki Waters",
      departureCity: "Guwahati / Kolkata",
      startDate: tripDate2Start,
      endDate: tripDate2End,
      budgetMin: 18000,
      budgetMax: 26000,
      currency: "INR",
      travelStyle: "CULTURAL",
      interests: JSON.stringify(["Living Root Bridges", "Dawki Boating", "Khasi Culture", "Waterfalls", "Caving"]),
      plannedAttractions: JSON.stringify(["Double Decker Root Bridge", "Umngot Crystal River", "Nohkalikai Falls", "Mawlynnong village"]),
      accommodationPreference: "AIRBNB",
      transportPreference: "ROAD_TRIP",
      groupSizeMax: 4,
      currentAcceptedCount: 1,
      companionPreferences: JSON.stringify({ fitnessLevel: "Moderate-High", natureLover: true }),
      status: "OPEN",
    },
  });

  const tripDate3Start = new Date(today);
  tripDate3Start.setDate(today.getDate() + 45);
  const tripDate3End = new Date(today);
  tripDate3End.setDate(today.getDate() + 52);

  const trip3 = await prisma.travelPlan.create({
    data: {
      organizerId: kabir.id,
      destination: "Hampi & Gokarna: Ancient Vijayanagara Ruins & Beach Camping",
      departureCity: "Bengaluru / Pune",
      startDate: tripDate3Start,
      endDate: tripDate3End,
      budgetMin: 7000,
      budgetMax: 12500,
      currency: "INR",
      travelStyle: "BACKPACKING",
      interests: JSON.stringify(["Ancient Ruins", "Beach Sunset", "Bouldering", "Hippie Island Cafes", "Campfires"]),
      plannedAttractions: JSON.stringify(["Virupaksha Temple at sunrise", "Matanga Hill boulder trek", "Om Beach sunset", "Kudle beach shack hop"]),
      accommodationPreference: "HOSTEL",
      transportPreference: "TRAIN",
      groupSizeMax: 5,
      currentAcceptedCount: 0,
      companionPreferences: JSON.stringify({ easygoing: true, loveSunsets: true }),
      status: "OPEN",
    },
  });

  // 4. Seed Interactions & Confirmed Community Connections
  // Rohan joined Ananya's food & film activity
  await prisma.joinRequest.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      applicantId: rohan.id,
      status: "ACCEPTED",
      introMessage: "Hey Ananya! Big Ray cinema enthusiast here. Would love to join for the film and discussions over filter coffee!",
      respondedAt: new Date(),
    },
  });

  // Priya sent pending request to Ananya
  await prisma.joinRequest.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      applicantId: priya.id,
      status: "PENDING",
      introMessage: "Hi Ananya! Would love to join if you have a spot open for the movie screening!",
    },
  });

  // Participants in act1
  await prisma.participant.create({
    data: {
      userId: ananya.id,
      activityId: act1.id,
      role: "ORGANIZER",
    },
  });

  await prisma.participant.create({
    data: {
      userId: rohan.id,
      activityId: act1.id,
      role: "MEMBER",
    },
  });

  // Rohan joined Priya's Kasol Expedition
  await prisma.joinRequest.create({
    data: {
      type: "TRAVEL",
      travelPlanId: trip1.id,
      applicantId: rohan.id,
      status: "ACCEPTED",
      introMessage: "Hi Priya! I have done Kheerganga before and was looking for a fun group for Tosh and acoustic camping. I have my own gear.",
      respondedAt: new Date(),
    },
  });

  await prisma.participant.create({
    data: {
      userId: priya.id,
      travelPlanId: trip1.id,
      role: "ORGANIZER",
    },
  });

  await prisma.participant.create({
    data: {
      userId: rohan.id,
      travelPlanId: trip1.id,
      role: "MEMBER",
    },
  });

  // 5. Seed Private Conversations & Real Messages
  const conv1 = await prisma.conversation.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      title: "Film & Filter Coffee: Suchitra Society",
      messages: {
        create: [
          {
            senderId: ananya.id,
            content: "Hey Rohan! Welcome to the group! Glad to have another classic cinema lover.",
            readBy: JSON.stringify([ananya.id, rohan.id]),
          },
          {
            senderId: rohan.id,
            content: "Thanks Ananya! Really excited for the screening. Shall we meet at the entrance ticket counter at 5:15 PM?",
            readBy: JSON.stringify([rohan.id, ananya.id]),
          },
          {
            senderId: ananya.id,
            content: "Perfect! 5:15 PM works nicely. We can grab adjacent center seats and head straight to Brahmin's after.",
            readBy: JSON.stringify([ananya.id]),
          },
        ],
      },
    },
  });

  const conv2 = await prisma.conversation.create({
    data: {
      type: "TRAVEL",
      travelPlanId: trip1.id,
      title: "Kasol & Tosh Expedition Team",
      messages: {
        create: [
          {
            senderId: priya.id,
            content: "Namaste team! Welcome to the Kasol & Tosh expedition group chat. Booking our Volvo bus from Majnu Ka Tila, Delhi this Friday evening.",
          },
          {
            senderId: rohan.id,
            content: "Hey Priya! Sounds great. I have my trekking boots and warm layers ready. Can't wait for the riverside acoustic night!",
          },
        ],
      },
    },
  });

  // 6. Seed Sample Safety Report for Admin Queue
  await prisma.report.create({
    data: {
      reporterId: ananya.id,
      targetType: "USER",
      targetId: "sample-flagged-user",
      reason: "COMMERCIAL_OR_PAID_SERVICE",
      details: "User sent unsolicited marketing messages offering commercial tour agency packages instead of genuine mutual companion exploration.",
      status: "PENDING",
    },
  });

  console.log("Seeding complete! 4 Core Indian Personas created with password 'Password123!':");
  console.log("1. ananya / sarah@travally.app (Ananya Sharma, Bengaluru)");
  console.log("2. rohan / alex@travally.app (Rohan Verma, Mumbai)");
  console.log("3. priya / maya@travally.app (Priya Iyer, New Delhi)");
  console.log("4. admin@travally.app (Travally India Safety Team, Admin)");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
