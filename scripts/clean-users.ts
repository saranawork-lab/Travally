import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanUsersData() {
  console.log("Cleaning MongoDB user data...");
  try {
    // Delete in order to prevent orphan cascading conflicts
    const notifications = await prisma.notification.deleteMany({});
    const messages = await prisma.message.deleteMany({});
    const conversations = await prisma.conversation.deleteMany({});
    const joinRequests = await prisma.joinRequest.deleteMany({});
    const participants = await prisma.participant.deleteMany({});
    const activities = await prisma.activity.deleteMany({});
    const travelPlans = await prisma.travelPlan.deleteMany({});
    const blocks = await prisma.block.deleteMany({});
    const reports = await prisma.report.deleteMany({});
    const profiles = await prisma.profile.deleteMany({});
    const users = await prisma.user.deleteMany({});

    console.log("------------------------------------------");
    console.log("MongoDB Clean Results:");
    console.log(`- Users deleted: ${users.count}`);
    console.log(`- Profiles deleted: ${profiles.count}`);
    console.log(`- Activities deleted: ${activities.count}`);
    console.log(`- Travel Plans deleted: ${travelPlans.count}`);
    console.log(`- Join Requests deleted: ${joinRequests.count}`);
    console.log(`- Messages deleted: ${messages.count}`);
    console.log("------------------------------------------");
  } catch (err) {
    console.error("Error cleaning MongoDB user data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUsersData();
