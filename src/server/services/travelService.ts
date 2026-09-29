import db from "@/lib/db";

export const TravelService = {
  async getTravelPlans(filters?: { destination?: string; departureCity?: string }) {
    const where: any = { status: "OPEN" };
    if (filters?.destination) {
      where.destination = { contains: filters.destination, mode: "insensitive" };
    }
    if (filters?.departureCity) {
      where.departureCity = { contains: filters.departureCity, mode: "insensitive" };
    }
    return db.travelPlan.findMany({
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

  async getTravelPlanById(id: string) {
    return db.travelPlan.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, email: true, profile: true } },
        participants: { include: { user: { select: { id: true, email: true, profile: true } } } },
      },
    });
  },
};

export default TravelService;
