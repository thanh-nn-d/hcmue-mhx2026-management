import { useState } from "react";

function useActivities() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("mhx_activities");
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (data) => {
    setActivities(data);
    localStorage.setItem("mhx_activities", JSON.stringify(data));
  };

  const addActivity = (activity) => {
    const now = new Date().toISOString();

    const newActivity = {
      id: Date.now(),
      ...activity,
      feedback: "",
      feedbackSeen: true,
      adminSeen: false,
      createdAt: now,
      updatedAt: now,
    };

    saveToStorage([newActivity, ...activities]);
  };

  const updateActivity = (updatedActivity) => {
    const updated = activities.map((activity) =>
      activity.id === updatedActivity.id
        ? {
            ...activity,
            ...updatedActivity,
            updatedAt: new Date().toISOString(),
          }
        : activity
    );

    saveToStorage(updated);
  };

  const updateFeedback = (activityId, feedback) => {
    const updated = activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            feedback,
            feedbackSeen: false,
            updatedAt: new Date().toISOString(),
          }
        : activity
    );

    saveToStorage(updated);
  };

  const markFeedbackSeen = (activityId) => {
    const updated = activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            feedbackSeen: true,
          }
        : activity
    );

    saveToStorage(updated);
  };

  const markAdminSeen = (activityId) => {
    const updated = activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            adminSeen: true,
          }
        : activity
    );

    saveToStorage(updated);
  };

  const deleteActivity = (id) => {
    const updated = activities.filter((activity) => activity.id !== id);
    saveToStorage(updated);
  };

  return {
    activities,
    addActivity,
    updateActivity,
    updateFeedback,
    markFeedbackSeen,
    markAdminSeen,
    deleteActivity,
  };
}

export default useActivities;