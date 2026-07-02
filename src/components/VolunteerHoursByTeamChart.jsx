import { teamConfig } from "../data/teamConfig";

function calculateActivityHours(activity) {
  if (!activity.startTime || !activity.endTime) return 0;

  const [sh, sm] = activity.startTime.split(":").map(Number);
  const [eh, em] = activity.endTime.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  if (end <= start) return 0;

  return (end - start) / 60;
}

function VolunteerHoursByTeamChart({ activities }) {
  const completedActivities = activities.filter(
    (activity) => activity.status === "Đã hoàn thành"
  );

  const teams = Object.keys(teamConfig);

  const teamHours = teams
    .map((team, index) => {
      const value = completedActivities
        .filter((activity) => activity.team === team)
        .reduce((sum, activity) => sum + calculateActivityHours(activity), 0);

      return {
        label: team,
        value,
        color: colors[index % colors.length],
      };
    })
    .filter((item) => item.value > 0);

  const totalHours = teamHours.reduce((sum, item) => sum + item.value, 0);

  const gradient =
    teamHours.length === 0 ? "#e5e7eb 0deg 360deg" : buildGradient(teamHours);

  return (
    <div className="mt-6 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-lg backdrop-blur">
      <div className="mb-5">
        <h3 className="text-xl font-black text-gray-800">
          TỔNG SỐ GIỜ TÌNH NGUYỆN
        </h3>

        <p className="text-sm text-gray-500">
          Chỉ tính các hoạt động có trạng thái Đã hoàn thành.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative mx-auto h-56 w-56 shrink-0 rounded-full lg:mx-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradient})` }}
          />

          <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <p className="text-4xl font-black text-blue-700">
              {totalHours.toFixed(1)}
            </p>
            <p className="text-sm font-bold text-gray-500">giờ</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {teamHours.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-500">
              Chưa có dữ liệu số giờ tình nguyện.
            </div>
          ) : (
            teamHours.map((item) => (
              <LegendItem
                key={item.label}
                color={item.color}
                label={item.label}
                value={item.value}
                total={totalHours}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, total }) {
  const percent = total === 0 ? 0 : ((value / total) * 100).toFixed(1);

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-gray-700">{label}</span>
      </div>

      <span className="font-black text-gray-900">
        {value.toFixed(1)} giờ{" "}
        <span className="text-sm text-gray-500">({percent}%)</span>
      </span>
    </div>
  );
}

const colors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#0f766e",
  "#9333ea",
  "#ea580c",
];

function buildGradient(items) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let currentDegree = 0;

  return items
    .map((item) => {
      const start = currentDegree;
      const end = currentDegree + (item.value / total) * 360;
      currentDegree = end;
      return `${item.color} ${start}deg ${end}deg`;
    })
    .join(", ");
}

export default VolunteerHoursByTeamChart;