import { prisma } from "../server.js";
import crypto from "crypto";

const addRandomNames = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { randomName: null },
      select: { id: true },
    });
    for (const user of users) {
      const randomName = "anon" + crypto.randomBytes(3).toString("hex");
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          randomName: randomName,
        },
      });
    }
    return;
  } catch (error) {
    console.error("Error adding random names: ", error);
  }
};

addRandomNames();
