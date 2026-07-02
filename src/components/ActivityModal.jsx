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
    startTime: "",
    endTime: "",
    assignedPoint: "",
    activityLocation: "",
    soldierCount: "",
    targetGroupCounts: {},
    status: "Đang ráp nối",
    evidenceImages: [],
    participantFile: null,
    note: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (activity) {
      setFormData({
        activityName: activity.activityName || "",
        activityDate: activity.activityDate || "",
        startTime: activity.startTime || "",
        endTime: activity.endTime || "",
        assignedPoint: activity.assignedPoint || "",
        activityLocation: activity.activityLocation || "",
        soldierCount: activity.soldierCount || "",
        targetGroupCounts: activity.targetGroupCounts || {},
        status: activity.status || "Đang ráp nối",
        evidenceImages: activity.evidenceImages || [],
        participantFile: activity.participantFile || null,
        note: activity.note || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [activity, open]);

  if (!open) return null;

  const isCompleted = formData.status === "Đã hoàn thành";

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert("Chỉ được tải tối đa 05 ảnh minh chứng.");
      e.target.value = "";
      return;
    }

    const validImages = files.every((file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
    );

    if (!validImages) {
      alert("Ảnh minh chứng chỉ chấp nhận JPG, JPEG, PNG hoặc WEBP.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      evidenceImages: files,
    }));
  };

  const handleExcelChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      alert("Danh sách chiến sĩ chỉ chấp nhận file Excel (.xlsx hoặc .xls).");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      participantFile: file,
    }));
  };

  const totalSupportedCount = Object.values(formData.targetGroupCounts).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
        return;
      }
    }

    if (isCompleted) {
      if (formData.evidenceImages.length < 2) {
        alert("Vui lòng tải tối thiểu 02 ảnh minh chứng.");
        return;
      }

      if (formData.evidenceImages.length > 5) {
        alert("Chỉ được tải tối đa 05 ảnh minh chứng.");
        return;
      }

      if (!formData.participantFile) {
        alert("Vui lòng tải danh sách chiến sĩ tham gia hoạt động.");
        return;
      }
    }

    const activityData = {
      team: user.team,
      activityName: formData.activityName,
      activityDate: formData.activityDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      assignedPoint: hasAssignedPoint ? formData.assignedPoint : "",
      activityLocation: formData.activityLocation,
      soldierCount: Number(formData.soldierCount || 0),
      supportedCount: totalSupportedCount,
      targetGroupCounts: formData.targetGroupCounts,
      status: formData.status,
      evidenceImages: formData.evidenceImages,
      participantFile: formData.participantFile,
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
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
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
            <FormSection title="I. Thông tin chung">
              <div className="md:col-span-2">
                <Label>Tên hoạt động</Label>

                <Input
                  type="text"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Ngày hoạt động</Label>

                <Input
                  type="date"
                  name="activityDate"
                  value={formData.activityDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Thời gian dự kiến</Label>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Ví dụ: 07:00 đến 11:00
                </p>
              </div>

              {hasAssignedPoint && (
                <div>
                  <Label>Điểm phụ trách</Label>

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

              <div className={hasAssignedPoint ? "" : "md:col-span-2"}>
                <Label>Địa điểm thực hiện</Label>

                <Input
                  type="text"
                  name="activityLocation"
                  value={formData.activityLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Trạng thái</Label>

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
            </FormSection>

            <FormSection title="II. Thống kê hoạt động">
              <div>
                <Label>Số lượng chiến sĩ tham gia</Label>

                <Input
                  type="number"
                  name="soldierCount"
                  value={formData.soldierCount}
                  onChange={handleChange}
                  min="0"
                  required
                />
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
                          <Input
                            type="number"
                            min="0"
                            value={formData.targetGroupCounts[group]}
                            onChange={(e) =>
                              handleGroupCountChange(group, e.target.value)
                            }
                            placeholder="Nhập số lượng..."
                            className="mt-3"
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FormSection>

            {isCompleted && (
              <FormSection title="III. Báo cáo minh chứng">
                <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="mb-4">
                    <p className="text-lg font-black text-blue-700">
                      Ảnh minh chứng hoạt động
                    </p>

                    <p className="text-sm text-gray-600">
                      Tải tối thiểu 02 ảnh và tối đa 05 ảnh. Chấp nhận JPG,
                      JPEG, PNG, WEBP.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3"
                  />

                  {formData.evidenceImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {formData.evidenceImages.map((file, index) => (
                        <div
                          key={`${file.name || file.url}-${index}`}
                          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                        >
                          📷 {file.name || `Ảnh minh chứng ${index + 1}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <div className="mb-4">
                    <p className="text-lg font-black text-purple-700">
                      Danh sách chiến sĩ tham gia
                    </p>

                    <p className="text-sm text-gray-600">
                      Tải lên file Excel định dạng .xlsx hoặc .xls.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelChange}
                    className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3"
                  />

                  {formData.participantFile && (
                    <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                      📄 {formData.participantFile.name || "File danh sách"}
                    </div>
                  )}
                </div>
              </FormSection>
            )}

            <FormSection title="IV. Ghi chú">
              <div className="md:col-span-2">
                <textarea
                  rows="4"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập ghi chú nếu có..."
                />
              </div>
            </FormSection>
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

function FormSection({ title, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="mb-4 border-l-4 border-green-500 pl-3 text-lg font-black text-gray-800">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <label className="mb-2 block font-bold text-gray-700">{children}</label>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${className}`}
    />
  );
}

export default ActivityModal;