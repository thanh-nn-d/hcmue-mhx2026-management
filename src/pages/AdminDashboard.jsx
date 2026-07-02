import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CampaignHeader from "../components/layout/CampaignHeader";
import SummaryCards from "../components/SummaryCards";
import ActivityTable from "../components/ActivityTable";
import ActivityDetailModal from "../components/ActivityDetailModal";
import AccountManagement from "../components/AccountManagement";

import useActivities from "../hooks/useActivities";
import useActivityFilter from "../hooks/useActivityFilter";

import { teamConfig } from "../data/teamConfig";

import bgSkyCity from "../assets/backgrounds/bg-sky-soft.png";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const {
    activities,
    updateFeedback,
    markAdminSeen,
  } = useActivities();

  const [activeTab, setActiveTab] =
    useState("activities");

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selectedActivity, setSelectedActivity] =
    useState(null);

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [teamFilter, setTeamFilter] =
    useState("");

  const [pointFilter, setPointFilter] =
    useState("");

  const [sortType, setSortType] =
    useState("newest");

  const teams = Object.keys(teamConfig);

  const showAssignedPointFilter =
    teamFilter === "" ||
    teamConfig[teamFilter]?.hasAssignedPoint;

  const assignedPoints =
    teamFilter === ""
      ? teamConfig["Mùa hè số"].points
      : teamConfig[teamFilter]?.points || [];

  const handleTeamChange = (e) => {
    const value = e.target.value;

    setTeamFilter(value);

    if (
      value !== "" &&
      !teamConfig[value]?.hasAssignedPoint
    ) {
      setPointFilter("");
    }
  };

  const filteredActivities = useActivityFilter({
    activities:
      teamFilter === ""
        ? activities
        : activities.filter(
            (activity) =>
              activity.team === teamFilter
          ),

    searchKeyword,

    statusFilter,

    pointFilter:
      showAssignedPointFilter
        ? pointFilter
        : "",

    sortType,
  });

  const newActivities =
    activities.filter(
      (activity) =>
        activity.adminSeen === false
    );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleView = (activity) => {
    if (activity.adminSeen === false) {
      markAdminSeen(activity.id);

      setSelectedActivity({
        ...activity,
        adminSeen: true,
      });
    } else {
      setSelectedActivity(activity);
    }

    setOpenDetail(true);
  };

  const handleSaveFeedback = (
    activityId,
    feedback
  ) => {
    updateFeedback(activityId, feedback);

    setSelectedActivity((prev) => ({
      ...prev,
      feedback,
      feedbackSeen: false,
      updatedAt: new Date().toISOString(),
    }));

    alert("Đã lưu phản hồi.");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgSkyCity})`,
      }}
    >
      <CampaignHeader variant="dashboard" />

      <main className="mx-auto max-w-7xl px-8 pb-10 pt-5">

        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-6 py-4 shadow-lg backdrop-blur">

          <div>
            <h2 className="text-2xl font-black text-blue-700">
              TỔNG QUAN HOẠT ĐỘNG
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

            <button
              onClick={handleLogout}
              className="rounded-xl bg-blue-600 px-3 py-1 font-bold text-white shadow transition hover:bg-blue-700"
            >
              Đăng xuất
            </button>

          </div>

        </div>

        <SummaryCards activities={activities} />

        <div className="mb-6 mt-6 flex gap-3">

          <button
            onClick={() =>
              setActiveTab("activities")
            }
            className={`rounded-xl px-5 py-3 font-bold transition ${
              activeTab === "activities"
                ? "bg-blue-600 text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            📋 Hoạt động
          </button>

          <button
            onClick={() =>
              setActiveTab("accounts")
            }
            className={`rounded-xl px-5 py-3 font-bold transition ${
              activeTab === "accounts"
                ? "bg-blue-600 text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            👤 Quản lý tài khoản
          </button>

        </div>

        {activeTab === "activities" && (
          <>

            {newActivities.length > 0 && (
              <div
                onClick={() => handleView(newActivities[0])}
                className="mb-6 cursor-pointer rounded-2xl border border-blue-200 bg-blue-50/95 p-5 shadow-lg transition hover:bg-blue-100"
              >
                <p className="font-bold text-blue-800">
                  🔔 Có{" "}
                  <span className="font-black">
                    {newActivities.length}
                  </span>{" "}
                  hoạt động mới từ các đội hình.
                </p>

                <p className="mt-1 text-sm font-medium text-blue-700">
                  Nhấn để xem hoạt động mới nhất.
                </p>
              </div>
            )}

            <div className="mb-6 mt-2 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur">

              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-800">
                  Bộ lọc hoạt động
                </h3>

                <p className="text-sm text-gray-500">
                  Tìm kiếm, lọc và sắp xếp danh sách hoạt động.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">

                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm hoạt động..."
                  value={searchKeyword}
                  onChange={(e) =>
                    setSearchKeyword(e.target.value)
                  }
                  className="min-w-64 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={teamFilter}
                  onChange={handleTeamChange}
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Tất cả đội hình
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team}
                      value={team}
                    >
                      {team}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Tất cả trạng thái
                  </option>

                  <option>
                    Đang ráp nối
                  </option>

                  <option>
                    Đã chốt
                  </option>

                  <option>
                    Đã hoàn thành
                  </option>
                </select>

                {showAssignedPointFilter && (
                  <select
                    value={pointFilter}
                    onChange={(e) =>
                      setPointFilter(
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Tất cả điểm phụ trách
                    </option>

                    {assignedPoints.map(
                      (point) => (
                        <option
                          key={point}
                          value={point}
                        >
                          {point}
                        </option>
                      )
                    )}
                  </select>
                )}

                <select
                  value={sortType}
                  onChange={(e) =>
                    setSortType(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="newest">
                    Mới nhất
                  </option>

                  <option value="oldest">
                    Cũ nhất
                  </option>
                </select>

              </div>

            </div>

            <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur">

              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-800">
                  Danh sách hoạt động
                </h3>

                <p className="text-sm text-gray-500">
                  Hiển thị toàn bộ hoạt động theo bộ lọc hiện tại.
                </p>
              </div>

              <ActivityTable
                activities={filteredActivities}
                onView={handleView}
                onEdit={() => {}}
                onDelete={() => {}}
                showTeamColumn={true}
                showAssignedPointColumn={
                  showAssignedPointFilter
                }
                showEdit={false}
                showDelete={false}
              />

            </div>
          </>
        )}

        {activeTab === "accounts" && <AccountManagement />}
      </main>

      <ActivityDetailModal
        open={openDetail}
        activity={selectedActivity}
        showAssignedPoint={showAssignedPointFilter}
        showTeam={true}
        canEditFeedback={true}
        onSaveFeedback={handleSaveFeedback}
        onClose={() => {
          setOpenDetail(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}

export default AdminDashboard;