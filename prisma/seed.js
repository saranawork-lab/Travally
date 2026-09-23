// Prisma Seed Script for Travally
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Travally database...");

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

  // 1. Create Users & Profiles
  const sarah = await prisma.user.create({
    data: {
      email: "sarah@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Sarah Jenkins",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
          bio: "Film buff, specialty coffee enthusiast, and urban flâneur. Passionate about indie cinema screenings, quiet reading cafes, and weekend architectural strolls.",
          birthDate: new Date("1996-05-14"),
          age: 28,
          gender: "FEMALE",
          city: "San Francisco",
          country: "United States",
          interests: JSON.stringify(["Cinema", "Specialty Coffee", "Architecture", "Photography", "Books"]),
          preferredActivities: JSON.stringify(["Movies", "Food and Cafes", "Walking", "City Exploration"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, dating: false, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/sarah-jenkins-demo",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const alex = await prisma.user.create({
    data: {
      email: "alex@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Alex Rivera",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          bio: "Architecture designer and weekend photographer. Always up for city discovery walks, museum exhibitions, and spontaneous evening espresso.",
          birthDate: new Date("1995-11-20"),
          age: 29,
          gender: "MALE",
          city: "San Francisco",
          country: "United States",
          interests: JSON.stringify(["Architecture", "Photography", "Design", "Museums", "Coffee"]),
          preferredActivities: JSON.stringify(["City Exploration", "Walking", "Food and Cafes", "Events"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true, dating: false, travel: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/alex-rivera-demo",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const maya = await prisma.user.create({
    data: {
      email: "maya@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Maya Chen",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          bio: "Cultural explorer and slow-travel backpacker. Love visiting heritage districts, historic temples, and tasting regional street foods.",
          birthDate: new Date("1998-03-08"),
          age: 26,
          gender: "FEMALE",
          city: "Seattle",
          country: "United States",
          interests: JSON.stringify(["Cultural Travel", "Photography", "Street Food", "Hiking", "Language Exchange"]),
          preferredActivities: JSON.stringify(["City Exploration", "Food and Cafes", "Walking"]),
          connectionPreferences: JSON.stringify({ friendship: true, travel: true, activityPartner: true }),
          isVerified: true,
          verificationStatus: "VERIFIED",
          linkedinUrl: "https://linkedin.com/in/maya-chen-demo",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "David Ross",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
          bio: "Outdoor runner, amateur cyclist, and live indie music enthusiast. Exploring quiet trails and acoustic live gigs on weekends.",
          birthDate: new Date("1993-08-25"),
          age: 31,
          gender: "MALE",
          city: "Portland",
          country: "United States",
          interests: JSON.stringify(["Indie Music", "Cycling", "Hiking", "Live Gigs", "Coffee"]),
          preferredActivities: JSON.stringify(["Events", "Walking", "Food and Cafes"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true }),
          isVerified: false,
          verificationStatus: "PENDING",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const elena = await prisma.user.create({
    data: {
      email: "elena@travally.app",
      passwordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Elena Rostova",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
          bio: "Comparative literature researcher. Looking for study buddies for deep focus sessions at the library and matcha latte breaks.",
          birthDate: new Date("1997-09-12"),
          age: 27,
          gender: "FEMALE",
          city: "San Francisco",
          country: "United States",
          interests: JSON.stringify(["Literature", "Studying", "Tea & Matcha", "Art Exhibitions", "Cinema"]),
          preferredActivities: JSON.stringify(["Studying", "Food and Cafes", "Movies"]),
          connectionPreferences: JSON.stringify({ friendship: true, activityPartner: true }),
          isVerified: false,
          verificationStatus: "UNVERIFIED",
          hideContactDetails: true,
          discoveryVisible: true,
        },
      },
    },
    include: { profile: true },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@travally.app",
      passwordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Travally Trust & Safety",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
          bio: "Official Community Moderation and Safety Team for Travally.",
          city: "San Francisco",
          country: "United States",
          isVerified: true,
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  // 2. Create Companion Activities
  const today = new Date();
  const date1 = new Date(today);
  date1.setDate(today.getDate() + 2);

  const date2 = new Date(today);
  date2.setDate(today.getDate() + 4);

  const date3 = new Date(today);
  date3.setDate(today.getDate() + 6);

  const act1 = await prisma.activity.create({
    data: {
      organizerId: sarah.id,
      title: "Wim Wenders 'Perfect Days' Screening & Post-Film Coffee",
      description: "Catching the evening 35mm screening of 'Perfect Days' at Roxie Theater, followed by a warm tea/coffee debrief at Cafe Trieste. Looking for someone who enjoys thoughtful cinema discussion.",
      category: "MOVIES",
      date: date1,
      startTime: "18:45",
      approxDurationHours: 3.0,
      locationName: "Mission District, San Francisco",
      meetingPointVenue: "Roxie Theater Marquee (16th & Valencia)",
      maxParticipants: 2,
      currentAcceptedCount: 1,
      preferredAgeMin: 22,
      preferredAgeMax: 36,
      genderPreference: "ANY",
      additionalRequirements: "Please arrive 10 minutes early so we can grab good balcony seats.",
      visibility: "PUBLIC",
      cutoffHoursBeforeStart: 3,
      status: "OPEN",
    },
  });

  const act2 = await prisma.activity.create({
    data: {
      organizerId: alex.id,
      title: "Golden Gate Sunset Promenade & Coastal Trail Walk",
      description: "A relaxed 5km coastal scenic walk starting from Crissy Field, heading up toward Fort Point for golden hour photos. Bring a warm layer and comfortable walking shoes!",
      category: "WALKING",
      date: date2,
      startTime: "17:15",
      approxDurationHours: 2.5,
      locationName: "Presidio / Crissy Field, San Francisco",
      meetingPointVenue: "Warming Hut Park Store & Cafe",
      maxParticipants: 3,
      currentAcceptedCount: 0,
      preferredAgeMin: 20,
      preferredAgeMax: 40,
      genderPreference: "ANY",
      visibility: "PUBLIC",
      status: "OPEN",
    },
  });

  const act3 = await prisma.activity.create({
    data: {
      organizerId: elena.id,
      title: "Sunday Silent Focus & Co-Working Session",
      description: "Working on writing drafts and research papers. 2 hours of Pomodoro focused work followed by casual coffee chat. Great for students, writers, or remote workers.",
      category: "STUDYING",
      date: date3,
      startTime: "11:00",
      approxDurationHours: 3.5,
      locationName: "Hayes Valley, San Francisco",
      meetingPointVenue: "Ritual Coffee Roasters (Upper Mezzanine)",
      maxParticipants: 2,
      currentAcceptedCount: 0,
      genderPreference: "ANY",
      visibility: "PUBLIC",
      status: "OPEN",
    },
  });

  const act4 = await prisma.activity.create({
    data: {
      organizerId: david.id,
      title: "Acoustic Folk Night at The Lost Church",
      description: "Intimate acoustic showcase featuring indie songwriters. The venue has cozy vintage seating. Looking for an indie music lover to join!",
      category: "EVENTS",
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      startTime: "20:00",
      approxDurationHours: 2.5,
      locationName: "North Beach, San Francisco",
      meetingPointVenue: "The Lost Church front entrance",
      maxParticipants: 2,
      currentAcceptedCount: 0,
      genderPreference: "ANY",
      visibility: "PUBLIC",
      status: "OPEN",
    },
  });

  // 3. Create Travel Plans
  const tripDate1Start = new Date(today);
  tripDate1Start.setDate(today.getDate() + 25);
  const tripDate1End = new Date(today);
  tripDate1End.setDate(today.getDate() + 38);

  const trip1 = await prisma.travelPlan.create({
    data: {
      organizerId: maya.id,
      destination: "Tokyo & Kyoto, Japan",
      departureCity: "Seattle / West Coast",
      startDate: tripDate1Start,
      endDate: tripDate1End,
      budgetMin: 1800,
      budgetMax: 2800,
      currency: "USD",
      travelStyle: "CULTURAL",
      interests: JSON.stringify(["Cultural Travel", "Photography", "Street Food", "Historic Temples", "Architecture"]),
      plannedAttractions: JSON.stringify(["Senso-ji & Yanaka old town", "Fushimi Inari morning hike", "Uji matcha tea tour", "Kitsune Ramen alley"]),
      accommodationPreference: "AIRBNB",
      transportPreference: "TRAIN",
      groupSizeMax: 3,
      currentAcceptedCount: 1,
      companionPreferences: JSON.stringify({ pacing: "Moderate", morningPerson: true, budgetConscious: true }),
      status: "OPEN",
    },
  });

  const tripDate2Start = new Date(today);
  tripDate2Start.setDate(today.getDate() + 45);
  const tripDate2End = new Date(today);
  tripDate2End.setDate(today.getDate() + 55);

  const trip2 = await prisma.travelPlan.create({
    data: {
      organizerId: david.id,
      destination: "Interlaken & Lauterbrunnen, Switzerland",
      departureCity: "Portland / San Francisco",
      startDate: tripDate2Start,
      endDate: tripDate2End,
      budgetMin: 2200,
      budgetMax: 3500,
      currency: "USD",
      travelStyle: "ADVENTURE",
      interests: JSON.stringify(["Hiking", "Alpine Views", "Photography", "Cycling", "Lakes"]),
      plannedAttractions: JSON.stringify(["Lauterbrunnen Valley waterfalls", "Schilthorn ridge trek", "Lake Brienz kayak morning"]),
      accommodationPreference: "HOSTEL",
      transportPreference: "TRAIN",
      groupSizeMax: 4,
      currentAcceptedCount: 0,
      companionPreferences: JSON.stringify({ fitnessLevel: "Active", hikingExperience: true }),
      status: "OPEN",
    },
  });

  const tripDate3Start = new Date(today);
  tripDate3Start.setDate(today.getDate() + 60);
  const tripDate3End = new Date(today);
  tripDate3End.setDate(today.getDate() + 72);

  const trip3 = await prisma.travelPlan.create({
    data: {
      organizerId: alex.id,
      destination: "Barcelona & Costa Brava, Spain",
      departureCity: "San Francisco",
      startDate: tripDate3Start,
      endDate: tripDate3End,
      budgetMin: 1600,
      budgetMax: 2400,
      currency: "USD",
      travelStyle: "SLOW_TRAVEL",
      interests: JSON.stringify(["Architecture", "Modernisme", "Tapas & Wine", "Mediterranean Coast", "Photography"]),
      plannedAttractions: JSON.stringify(["Sant Pau Art Nouveau", "Casa Batlló", "Girona medieval walk", "Cadaqués coastal path"]),
      accommodationPreference: "AIRBNB",
      transportPreference: "TRAIN",
      groupSizeMax: 2,
      currentAcceptedCount: 0,
      companionPreferences: JSON.stringify({ designAppreciation: true, easygoing: true }),
      status: "OPEN",
    },
  });

  // 4. Seed Requests & Active Interactions
  // Sarah's activity (act1): Alex sent a request and was ACCEPTED
  await prisma.joinRequest.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      applicantId: alex.id,
      status: "ACCEPTED",
      introMessage: "Hi Sarah! Wim Wenders is one of my favorite directors, and Roxie is such an iconic theater. Would love to join you and discuss over coffee!",
      respondedAt: new Date(),
    },
  });

  // Also Elena sent a request to Sarah's activity (act1) which is PENDING
  await prisma.joinRequest.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      applicantId: elena.id,
      status: "PENDING",
      introMessage: "Hey Sarah! Huge cinema fan here, especially Japanese cinematography. Hope there's still room for one more!",
    },
  });

  // Add participants for act1
  await prisma.participant.create({
    data: {
      userId: sarah.id,
      activityId: act1.id,
      role: "ORGANIZER",
    },
  });
  await prisma.participant.create({
    data: {
      userId: alex.id,
      activityId: act1.id,
      role: "MEMBER",
    },
  });

  // Create Conversation & sample messages for act1
  const conv1 = await prisma.conversation.create({
    data: {
      type: "ACTIVITY",
      activityId: act1.id,
      title: "Wim Wenders 'Perfect Days' Screening Group",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: sarah.id,
      content: "Welcome Alex! Glad you can make it. Have you watched 'Wings of Desire' or 'Paris, Texas' before as well?",
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: alex.id,
      content: "'Paris, Texas' is an all-time top 5 for me! Really looking forward to seeing Perfect Days on the big screen.",
      createdAt: new Date(Date.now() - 3600000 * 1),
    },
  });

  // Trip 1 (Maya's Japan trip): Sarah requested and was ACCEPTED
  await prisma.joinRequest.create({
    data: {
      type: "TRAVEL",
      travelPlanId: trip1.id,
      applicantId: sarah.id,
      status: "ACCEPTED",
      introMessage: "Hi Maya! I've been dreaming of exploring Kyoto's historic districts and tea culture. Our dates and pacing match seamlessly!",
      respondedAt: new Date(),
    },
  });

  await prisma.participant.create({
    data: {
      userId: maya.id,
      travelPlanId: trip1.id,
      role: "ORGANIZER",
    },
  });
  await prisma.participant.create({
    data: {
      userId: sarah.id,
      travelPlanId: trip1.id,
      role: "MEMBER",
    },
  });

  const tripConv1 = await prisma.conversation.create({
    data: {
      type: "TRAVEL",
      travelPlanId: trip1.id,
      title: "Tokyo & Kyoto Expedition Team",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: tripConv1.id,
      senderId: maya.id,
      content: "Konnichiwa Sarah! So excited you're joining. I am putting together our walking route for the Yanaka district!",
    },
  });

  // Seed sample notifications for Sarah
  await prisma.notification.create({
    data: {
      userId: sarah.id,
      type: "REQUEST_RECEIVED",
      title: "New Join Request",
      body: "Elena Rostova requested to join your activity: Wim Wenders 'Perfect Days' Screening.",
      actionUrl: "/requests",
    },
  });

  await prisma.notification.create({
    data: {
      userId: sarah.id,
      type: "REQUEST_ACCEPTED",
      title: "Travel Request Accepted!",
      body: "Maya Chen accepted your request to join 'Tokyo & Kyoto, Japan'. You can now chat in private messages!",
      actionUrl: "/chats",
    },
  });

  console.log("Database seeded successfully with test users, activities, travel plans, and interactions!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
