// backend/jobs/scheduler.js
const cron = require("node-cron");
const webpush = require("web-push");
const User = require("../models/user"); 

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:rohit.kumar@example.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

async function checkDeadlinesAndNotify() {
  console.log("⚡ Executing automatic deadline inspection worker loop...");
  try {
    const users = await User.find({
      "todoList": { $elemMatch: { completed: false } }
    });

    // 1. Get the current absolute global UTC timestamp
    const absoluteNow = Date.now(); 
    
    // 2. THE CHRONO FIX: Shift the evaluation clock forward by 5.5 hours to match IST tracking
    const fiveHalfHoursInMs = 5.5 * 60 * 60 * 1000;
    const currentClockTimestamp = absoluteNow + fiveHalfHoursInMs;

    const twoHoursInMs = 2 * 60 * 60 * 1000;      // 120 minutes
    const tenMinutesInMs = 10 * 60 * 1000;         // 10 minute buffer window

    for (const user of users) {
      console.log(`\nChecking user: ${user.username}`);

      const matchingTasks = user.todoList.filter(todo => {
        if (todo.completed || !todo.date) return false;

        const taskDeadlineTimestamp = new Date(todo.date).getTime();
        
        // Compare the database timestamp directly against our adjusted local clock
        const timeDifference = taskDeadlineTimestamp - currentClockTimestamp;
        const minutesRemaining = Math.round(timeDifference / (1000 * 60));

        console.log(`  -> Task: "${todo.task}"`);
        console.log(`     Minutes remaining: ${minutesRemaining} mins (${(minutesRemaining / 60).toFixed(2)} hours)`);

        // Check if it hits our 2-hour window target criteria smoothly
        const matchesWindow = timeDifference >= (twoHoursInMs - tenMinutesInMs) && timeDifference <= (twoHoursInMs + tenMinutesInMs);
        console.log(`     Matches target window? ${matchesWindow ? "YES 🎯" : "NO ⏳"}`);
        
        return matchesWindow;
      });

      for (const todo of matchingTasks) {
        const payload = JSON.stringify({
          title: "⏰ Task Deadline Reminder",
          body: `Your task "${todo.task}" is due in less than 2 hours!`
        });

        if (user.pushSubscription) {
          try {
            await webpush.sendNotification(user.pushSubscription, payload);
            console.log(`🎯 Automatic push alert delivered for: ${todo.task}`);
          } catch (err) {
            console.error("Push payload error:", err.message);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error running automatic deadline check worker:", error);
  }
}

// Fire on boot
checkDeadlinesAndNotify();

// Schedule to scan every 5 minutes
cron.schedule("*/5 * * * *", () => {
  checkDeadlinesAndNotify();
});