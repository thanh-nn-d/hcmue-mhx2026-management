import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CampaignHeader from "../components/layout/CampaignHeader";
import ActivityModal from "../components/ActivityModal";
import ActivityTable from "../components/ActivityTable";
import ActivityDetailModal from "../components/ActivityDetailModal";
import SummaryCards from "../components/SummaryCards";
import VolunteerHoursCard from "../components/VolunteerHoursCard";
import useActivities from "../hooks/useActivities";
import useActivityFilter from "../hooks/useActivityFilter";
import { activityPoints } from "../data/activityPoints";
import { teamConfig } from "../data/teamConfig";
import bgSkyCity from "../assets/backgrounds/bg-sky-soft.png";
import ChangePasswordModal from "../components/ChangePasswordModal";

// Tạm khóa quyền thêm / sửa / xóa hoạt động của đội hình.
// Đổi thành true khi muốn mở lại quyền chỉnh sửa.
const TEAM_EDITING_ENABLED = false;

function TeamDashboard() {
  const { user, logout } = useAuth();

  const {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    markFeedbackSeen,
  } = useActivities();

  const hasAssignedPoint =
    teamConfig[user?.team]?.hasAssignedPoint;

  const [openModal, setOpenModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pointFilter, setPointFilter] = useState("");
  const [sortType, setSortType] = useState("newest");

  const teamActivities = activities.filter(
    (activity) => activity.team === user?.team
  );

  const unreadFeedbacks = teamActivities.filter(
    (activity) =>
      activity.feedback &&
      activity.feedback.trim() !== "" &&
      activity.feedbackSeen === false
  );

  const assignedPoints = activityPoints[user?.team] || [];

  const filteredActivities = useActivityFilter({
    activities: teamActivities,
    searchKeyword,
    statusFilter,
    pointFilter: hasAssignedPoint ? pointFilter : "",
    sortType,
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa hoạt động này không?"
    );

    if (!confirmed) return;

    deleteActivity(id);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setOpenModal(true);
  };

  const handleView = (activity) => {
    if (
      activity.feedback &&
      activity.feedbackSeen === false
    ) {
      markFeedbackSeen(activity.id);

      activity.feedbackSeen = true;
    }

    setSelectedActivity(activity);
    setOpenDetail(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingActivity(null);
  };

  const handleSaveActivity = (activity) => {
    if (editingActivity) {
      updateActivity(activity);
    } else {
      addActivity(activity);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgSkyCity})` }}
    >
      <CampaignHeader variant="dashboard" />

      <main className="mx-auto max-w-7xl px-8 pb-10 pt-5">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-6 py-4 shadow-lg backdrop-blur">
          <div>
            <h2 className="text-2xl font-black text-green-700">
              DANH SÁCH HOẠT ĐỘNG
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500">
                Xin chào,
              </p>

              <p className="font-bold text-gray-800">
                {user?.name}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setOpenChangePassword(true)}
                className="rounded-xl bg-blue-600 px-3 py-1 font-bold text-white shadow transition hover:bg-blue-700"
              >
                Đổi mật khẩu
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-green-600 px-3 py-1 font-bold text-white shadow transition hover:bg-green-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <SummaryCards activities={teamActivities} />

        <VolunteerHoursCard
          activities={teamActivities}
        />

        {unreadFeedbacks.length > 0 && (
          <div
            onClick={() => handleView(unreadFeedbacks[0])}
            className="mb-6 cursor-pointer rounded-2xl border border-yellow-300 bg-yellow-50/95 p-5 shadow-lg transition hover:bg-yellow-100"
          >
            <p className="font-bold text-yellow-800">
              🔔 Bạn có{" "}
              <span className="font-black">
                {unreadFeedbacks.length}
              </span>{" "}
              phản hồi mới từ Ban Chỉ huy.
            </p>

            <p className="mt-1 text-sm font-medium text-yellow-700">
              Nhấn để xem phản hồi.
            </p>
          </div>
        )}

        <div className="mb-6 mt-8 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur">
          <div className="mb-4">
            <h3 className="text-xl font-black text-gray-800">
              Bộ lọc hoạt động
            </h3>

            <p className="text-sm text-gray-500">
              Tìm kiếm, lọc và sắp xếp hoạt động của đội hình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên hoạt động..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="min-w-64 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Tất cả trạng thái</option>
              <option>Đang ráp nối</option>
              <option>Đã chốt</option>
              <option>Đã hoàn thành</option>
            </select>

            {hasAssignedPoint && (
              <select
                value={pointFilter}
                onChange={(e) => setPointFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Tất cả điểm phụ trách</option>

                {assignedPoints.map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            {TEAM_EDITING_ENABLED && (
              <button
                onClick={() => setOpenModal(true)}
                className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white shadow transition hover:bg-green-700"
              >
                + Thêm hoạt động
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur">
          <div className="mb-4">
            <h3 className="text-xl font-black text-gray-800">
              Danh sách hoạt động
            </h3>

            <p className="text-sm text-gray-500">
              Hiển thị các hoạt động theo bộ lọc hiện tại.
            </p>
          </div>

          <ActivityTable
            activities={filteredActivities}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
            showAssignedPointColumn={hasAssignedPoint}
            showEdit={TEAM_EDITING_ENABLED}
            showDelete={TEAM_EDITING_ENABLED}
          />
        </div>
      </main>

      <ActivityModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />

      <ActivityDetailModal
        open={openDetail}
        activity={selectedActivity}
        showAssignedPoint={hasAssignedPoint}
        onClose={() => {
          setOpenDetail(false);
          setSelectedActivity(null);
        }}
      />
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </div>
  );
}

export default TeamDashboard;