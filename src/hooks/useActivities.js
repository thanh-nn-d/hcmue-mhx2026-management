import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import useActivityUpload from "./useActivityUpload";

function isFileObject(value) {
  return value instanceof File;
}

function hasNewImageFiles(images = []) {
  return images.some((item) => isFileObject(item));
}

function hasNewParticipantFile(file) {
  return isFileObject(file);
}

function getExistingImages(images = []) {
  return images.filter((item) => !isFileObject(item));
}

function getExistingParticipantFile(file) {
  return isFileObject(file) ? null : file;
}

function mapActivityFromDb(row) {
  return {
    id: row.id,
    team: row.team,
    activityName: row.activity_name,
    activityDate: row.activity_date,
    startTime: row.start_time || "",
    endTime: row.end_time || "",
    assignedPoint: row.activity_point || "",
    activityLocation: row.location,
    soldierCount: row.soldier_count || 0,
    supportedCount: row.support_total || 0,
    targetGroupCounts: row.support_groups || {},
    status: row.status,
    evidenceImages: row.evidence_images || [],
    participantFile: row.participant_file || null,
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
    start_time: activity.startTime || "",
    end_time: activity.endTime || "",
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

  const {
    uploadEvidenceImages,
    uploadParticipantFile,
    deleteActivityUploads,
  } = useActivityUpload();

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
    const { data: createdActivity, error: createError } = await supabase
      .from("activities")
      .insert({
        ...mapActivityToDb(activity),
        evidence_images: [],
        participant_file: null,
        feedback: "",
        feedback_seen: true,
        admin_seen: false,
      })
      .select()
      .single();

    if (createError) {
      console.error("Lỗi thêm hoạt động:", createError);
      alert(createError.message || "Không thể thêm hoạt động!");
      return;
    }

    let evidenceImages = [];
    let participantFile = null;

    try {
      if (activity.status === "Đã hoàn thành") {
        evidenceImages = await uploadEvidenceImages(
          createdActivity.id,
          activity.evidenceImages || []
        );

        participantFile = await uploadParticipantFile(
          createdActivity.id,
          activity.participantFile
        );

        const { data: updatedActivity, error: updateError } = await supabase
          .from("activities")
          .update({
            evidence_images: evidenceImages,
            participant_file: participantFile,
            updated_at: new Date().toISOString(),
          })
          .eq("id", createdActivity.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        setActivities((prev) => [mapActivityFromDb(updatedActivity), ...prev]);
        return;
      }

      setActivities((prev) => [mapActivityFromDb(createdActivity), ...prev]);
    } catch (uploadError) {
      console.error("Lỗi tải minh chứng:", uploadError);

      await supabase.from("activities").delete().eq("id", createdActivity.id);

      alert(
        uploadError.message ||
          "Không thể tải minh chứng hoạt động. Vui lòng thử lại."
      );
    }
  };

  const updateActivity = async (updatedActivity) => {
    let evidenceImages = getExistingImages(
      updatedActivity.evidenceImages || []
    );

    let participantFile = getExistingParticipantFile(
      updatedActivity.participantFile
    );

    try {
      // Upload ảnh mới nếu có
      if (hasNewImageFiles(updatedActivity.evidenceImages)) {
        evidenceImages = await uploadEvidenceImages(
          updatedActivity.id,
          updatedActivity.evidenceImages
        );
      }

      // Upload file Excel mới nếu có
      if (hasNewParticipantFile(updatedActivity.participantFile)) {
        participantFile = await uploadParticipantFile(
          updatedActivity.id,
          updatedActivity.participantFile
        );
      }

      const { data, error } = await supabase
        .from("activities")
        .update({
          ...mapActivityToDb(updatedActivity),

          evidence_images: evidenceImages,
          participant_file: participantFile,

          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedActivity.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === updatedActivity.id
            ? mapActivityFromDb(data)
            : activity
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật hoạt động:", error);

      alert(
        error.message ||
          "Không thể cập nhật hoạt động."
      );
    }
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
        activity.id === activityId
          ? mapActivityFromDb(data)
          : activity
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
      console.error(
        "Lỗi cập nhật trạng thái phản hồi:",
        error
      );
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? mapActivityFromDb(data)
          : activity
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
      console.error(
        "Lỗi cập nhật thông báo admin:",
        error
      );
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? mapActivityFromDb(data)
          : activity
      )
    );
  };

  const deleteActivity = async (id) => {
    const activityToDelete = activities.find(
      (activity) => activity.id === id
    );

    try {
      if (activityToDelete) {
        await deleteActivityUploads({
          evidenceImages: activityToDelete.evidenceImages || [],
          participantFile: activityToDelete.participantFile || null,
        });
      }

      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setActivities((prev) =>
        prev.filter((activity) => activity.id !== id)
      );
    } catch (error) {
      console.error("Lỗi xóa hoạt động:", error);
      alert("Không thể xóa hoạt động!");
    }
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