import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function mapActivityFromDb(row) {
  return {
    id: row.id,
    team: row.team,
    activityName: row.activity_name,
    activityDate: row.activity_date,
    assignedPoint: row.activity_point || "",
    activityLocation: row.location,
    soldierCount: row.soldier_count || 0,
    supportedCount: row.support_total || 0,
    targetGroupCounts: row.support_groups || {},
    status: row.status,
    note: row.note || "",
    feedback: row.feedback || "",
    feedbackSeen: row.feedback_seen ?? true,
    adminSeen: row.admin_seen ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivityToDb(activity) {
  return {
    team: activity.team,
    activity_name: activity.activityName,
    activity_date: activity.activityDate,
    activity_point: activity.assignedPoint || "",
    location: activity.activityLocation,
    soldier_count: Number(activity.soldierCount || 0),
    support_total: Number(activity.supportedCount || 0),
    support_groups: activity.targetGroupCounts || {},
    status: activity.status,
    note: activity.note || "",
  };
}

function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi tải hoạt động:", error);
      setLoading(false);
      return;
    }

    setActivities((data || []).map(mapActivityFromDb));
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const addActivity = async (activity) => {
    const { data, error } = await supabase
      .from("activities")
      .insert({
        ...mapActivityToDb(activity),
        feedback: "",
        feedback_seen: true,
        admin_seen: false,
      })
      .select()
      .single();

      if (error) {
        console.error("Lỗi thêm hoạt động:", error);
        alert(error.message || JSON.stringify(error));
        return;
      }

    setActivities((prev) => [mapActivityFromDb(data), ...prev]);
  };

  const updateActivity = async (updatedActivity) => {
    const { data, error } = await supabase
      .from("activities")
      .update({
        ...mapActivityToDb(updatedActivity),
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedActivity.id)
      .select()
      .single();

    if (error) {
      console.error("Lỗi cập nhật hoạt động:", error);
      alert("Không thể cập nhật hoạt động!");
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === updatedActivity.id
          ? mapActivityFromDb(data)
          : activity
      )
    );
  };

  const updateFeedback = async (activityId, feedback) => {
    const { data, error } = await supabase
      .from("activities")
      .update({
        feedback,
        feedback_seen: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activityId)
      .select()
      .single();

    if (error) {
      console.error("Lỗi lưu phản hồi:", error);
      alert("Không thể lưu phản hồi!");
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? mapActivityFromDb(data) : activity
      )
    );
  };

  const markFeedbackSeen = async (activityId) => {
    const { data, error } = await supabase
      .from("activities")
      .update({
        feedback_seen: true,
      })
      .eq("id", activityId)
      .select()
      .single();

    if (error) {
      console.error("Lỗi cập nhật trạng thái phản hồi:", error);
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? mapActivityFromDb(data) : activity
      )
    );
  };

  const markAdminSeen = async (activityId) => {
    const { data, error } = await supabase
      .from("activities")
      .update({
        admin_seen: true,
      })
      .eq("id", activityId)
      .select()
      .single();

    if (error) {
      console.error("Lỗi cập nhật thông báo admin:", error);
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? mapActivityFromDb(data) : activity
      )
    );
  };

  const deleteActivity = async (id) => {
    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Lỗi xóa hoạt động:", error);
      alert("Không thể xóa hoạt động!");
      return;
    }

    setActivities((prev) =>
      prev.filter((activity) => activity.id !== id)
    );
  };

  return {
    activities,
    loading,
    fetchActivities,
    addActivity,
    updateActivity,
    updateFeedback,
    markFeedbackSeen,
    markAdminSeen,
    deleteActivity,
  };
}

export default useActivities;