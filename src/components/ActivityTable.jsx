import StatusBadge from "./StatusBadge";

function ActivityTable({
  activities,
  onDelete,
  onEdit,
  onView,
  showTeamColumn = false,
  showAssignedPointColumn = true,
  showEdit = true,
  showDelete = true,
  showFeedbackColumn = false,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const columnCount =
    6 +
    (showTeamColumn ? 1 : 0) +
    (showAssignedPointColumn ? 1 : 0) +
    (showFeedbackColumn ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-4 text-center">STT</th>
              <th className="px-4 py-4 text-center">Tên hoạt động</th>

              {showTeamColumn && (
                <th className="px-4 py-4 text-center">Đội hình</th>
              )}

              <th className="px-4 py-4 text-center">Ngày</th>

              {showAssignedPointColumn && (
                <th className="px-4 py-4 text-center">Điểm phụ trách</th>
              )}

              <th className="px-4 py-4 text-center">Địa điểm</th>
              <th className="px-4 py-4 text-center">Trạng thái</th>

              {showFeedbackColumn && (
                <th className="px-4 py-4 text-center">Phản hồi</th>
              )}

              <th className="px-4 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="p-8 text-center text-gray-500"
                >
                  Chưa có hoạt động nào.
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr
                  key={activity.id}
                  className="border-b text-center transition hover:bg-gray-50"
                >
                  <td className="px-4 py-4">{index + 1}</td>

                  <td className="px-4 py-4 font-semibold">
                    {activity.activityName}
                  </td>

                  {showTeamColumn && (
                    <td className="px-4 py-4">{activity.team}</td>
                  )}

                  <td className="px-4 py-4">
                    {formatDate(activity.activityDate)}
                  </td>

                  {showAssignedPointColumn && (
                    <td className="px-4 py-4">
                      {activity.assignedPoint || "—"}
                    </td>
                  )}

                  <td className="px-4 py-4">{activity.activityLocation}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={activity.status} />
                  </td>

                  {showFeedbackColumn && (
                    <td className="px-4 py-4">
                      {activity.feedback ? (
                        <span className="rounded bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                          Có phản hồi
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                          Chưa có
                        </span>
                      )}
                    </td>
                  )}

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(activity)}
                        className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-sky-600"
                      >
                        Chi tiết
                      </button>

                      {showEdit && (
                        <button
                          onClick={() => onEdit(activity)}
                          className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-bold text-white transition hover:bg-yellow-500"
                        >
                          Sửa
                        </button>
                      )}

                      {showDelete && (
                        <button
                          onClick={() => onDelete(activity.id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityTable;