import cron from "node-cron";
import User from "../models/UserSchema";

const clearExpiredPremium = () => {
  cron.schedule("0 2 * * *", async () => {
    const now = new Date();

    const users = await User.updateMany(
      { "premium.expiresAt": { $lt: now } },
      { $unset: { premium: "" } }
    );
    
    console.log(`${users.modifiedCount} users had expired premium removed.`);
  });
};

export default clearExpiredPremium;
