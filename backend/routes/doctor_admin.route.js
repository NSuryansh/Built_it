import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";

const docAdminRouter = Router();

docAdminRouter.get("/getUsers", authorizeRoles("doc", "admin"), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
docAdminRouter.get("/user-feedback", authorizeRoles("admin"), async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch past appointments where feedback (stars) exists
    const feedbacks = await prisma.pastAppointments.findMany({
      where: {
        user_id: userId,
        stars: { not: null }, // Only fetch if feedback was submitted
      },
      include: {
        doc: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
docAdminRouter.post("/addEvent", authorizeRoles("doc", "admin"), async (req, res) => {
  try {
    const title = req.body["title"];
    const description = req.body["description"];
    const dateTime = req.body["dateTime"];
    const venue = req.body["venue"];
    const url = req.body["url"];

    // Validate required fields
    if (!title || !dateTime || !venue) {
      return res
        .status(400)
        .json({ error: "Title, DateTime, and Venue are required" });
    }

    // Create the event in Prisma
    const event = await prisma.events.create({
      data: {
        title: title,
        description: description,
        dateTime: new Date(dateTime), // Ensure it's a valid Date object
        venue: venue,
        url: url,
      },
    });

    res.json(event); // Return created event
  } catch (error) {
    console.error("Error adding event:", error);
    res.json({ error: "Internal server error" });
  }
});

export default docAdminRouter;