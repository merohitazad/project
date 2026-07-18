const cron = require("node-cron");
const webpush = require("web-push");
const User = require("../models/user"); 

// Initializing strictly with the required cryptographic keys
webpush.setVapidDetails(
  "", // Removed the VAPID_EMAIL process configuration entirely
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

async function checkDeadlinesAndNotify() {
  console.log("⚡ Executing automatic deadline inspection worker loop...");
  try {
    const absoluteNow = new Date(); 
    
    // Window: 110 to 130 minutes from now (~2 hours)
    const windowStart = new Date(absoluteNow.getTime() + (110 * 60 * 1000));
    const windowEnd = new Date(absoluteNow.getTime() + (130 * 60 * 1000));   

    const users = await User.find({
      "pushSubscription": { $exists: true },
      "todoList": {
        $elemMatch: {
          completed: false,
          reminderSent: { $ne: true }, 
          date: { $gte: windowStart, $lte: windowEnd }
        }
      }
    });

    for (const user of users) {
      console.log(`\nProcessing reminders for user: ${user.username}`);
      let hasUpdates = false;

      // Extract a clean JS object for web-push
      const subscriptionTarget = typeof user.pushSubscription.toObject === 'function' 
        ? user.pushSubscription.toObject() 
        : user.pushSubscription;

      for (const todo of user.todoList) {
        if (!todo.completed && !todo.reminderSent && todo.date >= windowStart && todo.date <= windowEnd) {
          
          const payload = JSON.stringify({
            title: "⏰ Task Deadline Reminder",
            body: `Your task "${todo.task}" is due in less than 2 hours!`
          });

          try {
            // Passing the completely sanitized subscription object
            await webpush.sendNotification(subscriptionTarget, payload);
            console.log(`🎯 Automatic push alert delivered for: ${todo.task}`);
            
            todo.reminderSent = true;
            hasUpdates = true;
          } catch (err) {
            console.error(`Push payload error for user ${user.username}:`, err.message);
            // If the subscription is no longer valid (expired/revoked), clear it
            if (err.statusCode === 410 || err.statusCode === 404) {
              console.log(`Removing expired subscription for ${user.username}`);
              user.pushSubscription = undefined;
              hasUpdates = true;
              break; 
            }
          }
        }
      }
      
      // Only hit the DB if changes were successfully made
      if (hasUpdates) {
        await user.save();
      }
    }
  } catch (error) {
    console.error("Error running automatic deadline check worker:", error);
  }
}

// Start cron - runs every 5 minutes
cron.schedule("*/5 * * * *", () => {
  checkDeadlinesAndNotify();
});

// Export the boot function so server.js can trigger it safely *after* DB connection
module.exports = { checkDeadlinesAndNotify };