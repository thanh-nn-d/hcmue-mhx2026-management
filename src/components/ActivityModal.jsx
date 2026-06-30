import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { activityPoints } from "../data/activityPoints";
import { teamConfig } from "../data/teamConfig";
import { supportGroups } from "../data/supportGroups";

function ActivityModal({ open, onClose, onSave, activity }) {
  const { user } = useAuth();

  const hasAssignedPoint = teamConfig[user?.team]?.hasAssignedPoint;
  const points = activityPoints[user?.team] || [];

  const emptyForm = {
    activityName: "",
    activityDate: "",
    assignedPoint: "",
    activityLocation: "",
    soldierCount: "",
    targetGroupCounts: {},
    status: "Đang ráp nối",
    note: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (activity) {
      setFormData({
        activityName: activity.activityName || "",
        activityDate: activity.activityDate || "",
        assignedPoint: activity.assignedPoint || "",
        activityLocation: activity.activityLocation || "",
        soldierCount: activity.soldierCount || "",
        targetGroupCounts: activity.targetGroupCounts || {},
        status: activity.status || "Đang ráp nối",
        note: activity.note || "",
      });

      return;
    }

    setFormData(emptyForm);
  }, [activity, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleSupportGroup = (group, checked) => {
    setFormData((prev) => {
      const updatedGroups = { ...prev.targetGroupCounts };

      if (checked) {
        updatedGroups[group] = "";
      } else {
        delete updatedGroups[group];
      }

      return {
        ...prev,
        targetGroupCounts: updatedGroups,
      };
    });
  };

  const handleGroupCountChange = (group, value) => {
    setFormData((prev) => ({
      ...prev,
      targetGroupCounts: {
        ...prev.targetGroupCounts,
        [group]: value,
      },
    }));
  };

  const totalSupportedCount = Object.values(
    formData.targetGroupCounts
  ).reduce((sum, value) => sum + Number(value || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const activityData = {
      team: user.team,
      activityName: formData.activityName,
      activityDate: formData.activityDate,
      assignedPoint: hasAssignedPoint ? formData.assignedPoint : "",
      activityLocation: formData.activityLocation,
      soldierCount: Number(formData.soldierCount),
      supportedCount: totalSupportedCount,
      targetGroupCounts: formData.targetGroupCounts,
      status: formData.status,
      note: formData.note,
    };

    if (activity) {
      onSave({
        ...activity,
        ...activityData,
      });
    } else {
      onSave(activityData);
    }

    setFormData(emptyForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b bg-green-600 px-8 py-5 text-white">
          <h2 className="text-2xl font-black">
            {activity ? "Sửa hoạt động" : "Thêm hoạt động"}
          </h2>

          <p className="mt-1 text-sm opacity-90">
            Nhập thông tin hoạt động của đội hình
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto px-8 py-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block font-bold text-gray-700">
                  Tên hoạt động
                </label>

                <input
                  type="text"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-gray-700">
                  Ngày hoạt động
                </label>

                <input
                  type="date"
                  name="activityDate"
                  value={formData.activityDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {hasAssignedPoint && (
                <div>
                  <label className="mb-2 block font-bold text-gray-700">
                    Điểm phụ trách
                  </label>

                  <select
                    name="assignedPoint"
                    value={formData.assignedPoint}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  >
                    <option value="">-- Chọn điểm phụ trách --</option>

                    {points.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={hasAssignedPoint ? "md:col-span-2" : ""}>
                <label className="mb-2 block font-bold text-gray-700">
                  Địa điểm hoạt động
                </label>

                <input
                  type="text"
                  name="activityLocation"
                  value={formData.activityLocation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-gray-700">
                  Số lượng chiến sĩ tham gia
                </label>

                <input
                  type="number"
                  name="soldierCount"
                  value={formData.soldierCount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-gray-700">
                  Trạng thái
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option>Đang ráp nối</option>
                  <option>Đã chốt</option>
                  <option>Đã hoàn thành</option>
                </select>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-green-100 bg-green-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-lg font-black text-green-700">
                      Đối tượng tiếp nhận hỗ trợ
                    </label>

                    <p className="mt-1 text-sm text-gray-600">
                      Chọn nhóm đối tượng và nhập số lượng tương ứng.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm">
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Tổng hỗ trợ
                    </p>

                    <p className="text-2xl font-black text-green-700">
                      {totalSupportedCount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {supportGroups.map((group) => {
                    const checked =
                      formData.targetGroupCounts[group] !== undefined;

                    return (
                      <div
                        key={group}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <label className="flex items-center gap-3 font-bold text-gray-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              handleToggleSupportGroup(
                                group,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />

                          {group}
                        </label>

                        {checked && (
                          <input
                            type="number"
                            min="0"
                            value={formData.targetGroupCounts[group]}
                            onChange={(e) =>
                              handleGroupCountChange(group, e.target.value)
                            }
                            placeholder="Nhập số lượng..."
                            className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-bold text-gray-700">
                  Ghi chú
                </label>

                <textarea
                  rows="4"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t bg-gray-50 px-8 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-400"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow transition hover:bg-green-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityModal;