// src/services/plannerService.js

/**
 * Generates a local, demo weekly plan based on weak subjects.
 * This does NOT call an API.
 */
export const generateWeeklyPlan = (weakSubjects = ['General Revision']) => {
  const today = new Date();
  const plans = [];
  const times = ['09:00', '11:00', '14:00', '16:00', '19:00', '20:00', '21:00'];
  const durations = ['1 hour', '1.5 hours', '45 mins', '2 hours'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Add 1 or 2 tasks for each day
    for (let j = 0; j < (i % 2) + 1; j++) {
      const subject = weakSubjects[Math.floor(Math.random() * weakSubjects.length)];
      plans.push({
        id: Math.random(),
        date: dateStr,
        time: times[Math.floor(Math.random() * times.length)],
        subject: subject,
        duration: durations[Math.floor(Math.random() * durations.length)],
        completed: false,
        type: 'ai', // 'ai' type gives it the blue brain icon
        isOverdue: false,
      });
    }
  }
  return plans;
};

/**
 * Updates existing plans to reschedule overdue tasks to today.
 * (This logic is from the file you provided and is correct.)
 */
export const updatePlan = (plans) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const updatedPlans = [...plans];

  const overdueTasks = updatedPlans.filter(
    (p) => !p.completed && p.date < todayStr
  );

  overdueTasks.forEach((task) => {
    const taskIndex = updatedPlans.findIndex((p) => p.id === task.id);
    if (taskIndex > -1) {
      updatedPlans[taskIndex].date = todayStr;
      updatedPlans[taskIndex].isOverdue = true;
    }
  });

  return updatedPlans;
};