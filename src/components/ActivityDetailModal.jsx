import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

function ActivityDetailModal({
  open,
  activity,
  onClose,
  showAssignedPoint = true,
  showTeam = false,
  canEditFeedback = false,
  onSaveFeedback,
}) {
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (activity) {
      setFeedbackText(activity.feedback || "");
    }
  }, [activity]);

  if (!open || !activity) return null;

  const targetGroupCounts =
    activity.targetGroupCounts ||
    activity.supportGroups ||
    activity.support_groups ||
    {};

  const totalSupported = Object.values(targetGroupCounts).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const hasAssignedPoint =
    showAssignedPoint &&
    activity.team === "Mùa hè số" &&
    activity.assignedPoint &&
    activity.assignedPoint.trim() !== "";

  const handleSaveFeedback = () => {
    if (!onSaveFeedback) return;
    onSaveFeedback(activity.id, feedbackText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b bg-green-600 px-8 py-5 text-white">
          <h2 className="text-2xl font-black">Chi tiết hoạt động</h2>

          <p className="mt-1 text-sm opacity-90">
            Thông tin tổng hợp của hoạt động được chọn
          </p>
        </div>

        <div className="overflow-y-auto px-8 py-6">
          <Section title="Thông tin chung">
            <InfoItem label="Tên hoạt động" value={activity.activityName} />

            {showTeam && <InfoItem label="Đội hình" value={activity.team} />}

            <InfoItem
              label="Ngày hoạt động"
              value={formatDate(activity.activityDate)}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-bold text-gray-500">
                Trạng thái
              </p>

              <StatusBadge status={activity.status} />
            </div>

            {hasAssignedPoint && (
              <InfoItem
                label="Điểm phụ trách"
                value={activity.assignedPoint}
              />
            )}

            <InfoItem label="Địa điểm" value={activity.activityLocation} />
          </Section>

          <Section title="Số liệu hoạt động">
            <InfoItem
              label="Số lượng chiến sĩ tham gia"
              value={activity.soldierCount}
            />

            <InfoItem
              label="Số lượng tiếp nhận hỗ trợ"
              value={totalSupported || activity.supportedCount}
            />

            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-bold text-gray-500">
                Chi tiết đối tượng tiếp nhận hỗ trợ
              </p>

              {Object.keys(targetGroupCounts).length === 0 ? (
                <p className="italic text-gray-500">
                  Chưa có dữ liệu.
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(targetGroupCounts).map(([group, count]) => (
                    <div
                      key={group}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <span className="font-medium text-gray-700">
                        {group}
                      </span>

                      <span className="rounded-lg bg-green-100 px-3 py-1 font-bold text-green-700">
                        {Number(count || 0)} lượt
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {activity.note && (
            <Section title="Ghi chú bổ sung">
              <InfoItem label="Ghi chú" value={activity.note} />
            </Section>
          )}

          <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="mb-3 text-lg font-black text-yellow-800">
              Phản hồi từ Ban Chỉ huy
            </p>

            {canEditFeedback ? (
              <>
                <textarea
                  rows="4"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Nhập phản hồi cho đội hình..."
                  className="w-full rounded-2xl border border-yellow-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSaveFeedback}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow transition hover:bg-blue-700"
                  >
                    Lưu phản hồi
                  </button>
                </div>
              </>
            ) : (
              <p className="leading-relaxed text-gray-700">
                {activity.feedback || "Chưa có phản hồi."}
              </p>
            )}
          </div>

          <Section title="Thời gian hệ thống">
            <InfoItem
              label="Thời gian tạo"
              value={formatDateTime(activity.createdAt)}
            />

            <InfoItem
              label="Cập nhật lần cuối"
              value={formatDateTime(activity.updatedAt)}
            />
          </Section>
        </div>

        <div className="flex justify-end border-t bg-gray-50 px-8 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-6 py-3 font-bold text-white shadow transition hover:bg-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-3 text-lg font-black text-gray-800">{title}</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-sm font-bold text-gray-500">{label}</p>

      <p className="break-words text-base font-semibold text-gray-800">
        {value || "Không có"}
      </p>
    </div>
  );
}

export default ActivityDetailModal;