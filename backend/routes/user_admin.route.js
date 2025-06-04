import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";

const userAdminRouter = Router();

userAdminRouter.get("/getdoctors", authorizeRoles("user", "admin"), async (req, res) => {
  const user_type = req.query["user_type"];
  try {
    let doctors = [];
    if (user_type === "user") {
      doctors = await prisma.doctor.findMany({
        where: { isInactive: false },
      });
    } else if (user_type === "admin") {
      doctors = await prisma.doctor.findMany();
    }
    res.json(doctors);
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error fetching doctors" });
  }
});

export default userAdminRouter;
