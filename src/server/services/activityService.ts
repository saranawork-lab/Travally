import db from "@/lib/db";

export const ActivityService = {
  async getActivities(filters?: { city?: string; category?: string; query?: string }) {
    const where: any = { status: "OPEN" };
    if (filters?.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters?.category) {
      where.category = filters.category;
    }
    return db.activity.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        participants: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getActivityById(id: string) {
    return db.activity.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, email: true, profile: true } },
        participants: { include: { user: { select: { id: true, email: true, profile: true } } } },
      },
    });
  },
};

export default ActivityService;
