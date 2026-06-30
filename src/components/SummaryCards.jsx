import { supportGroups } from "../data/supportGroups";

function SummaryCards({ activities }) {
  const totalActivities = activities.length;

  const connectingCount = activities.filter(
    (activity) => activity.status === "Đang ráp nối"
  ).length;

  const confirmedCount = activities.filter(
    (activity) => activity.status === "Đã chốt"
  ).length;

  const completedActivities = activities.filter(
    (activity) => activity.status === "Đã hoàn thành"
  );

  const completedCount = completedActivities.length;

  const completionPercent =
    totalActivities === 0
      ? 0
      : Math.round((completedCount/totalActivities) * 100);

  const statusItems = [
    {
      label: "Đang ráp nối",
      value: connectingCount,
      color: "#f59e0b",
    },
    {
      label: "Đã chốt",
      value: confirmedCount,
      color: "#2563eb",
    },
    {
      label: "Đã hoàn thành",
      value: completedCount,
      color: "#16a34a",
    },
  ].filter((item) => item.value > 0);

  const statusGradient =
    statusItems.length === 0
      ? "#e5e7eb 0deg 360deg"
      : buildGradient(statusItems);

  const groupTotals = supportGroups.map((group) => {
    const value = completedActivities.reduce((sum, activity) => {
      return sum + Number(activity.targetGroupCounts?.[group] || 0);
    }, 0);

    return {
      label: group,
      value,
      color: pieColors[supportGroups.indexOf(group) % pieColors.length],
    };
  });

  const activeGroups = groupTotals.filter((item) => item.value > 0);

  const totalSupported = activeGroups.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const supportGradient =
    activeGroups.length === 0
      ? "#e5e7eb 0deg 360deg"
      : buildGradient(activeGroups);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-5">
          <h3 className="text-xl font-black text-gray-800">
            Tiến độ hoạt động
          </h3>

          <p className="text-sm text-gray-500">
            Tỷ lệ các trạng thái hoạt động trong tổng số hoạt động.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-44 w-44 shrink-0 rounded-full">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${statusGradient})`,
              }}
            />

            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <p className="text-4xl font-black text-green-600">
                {completionPercent}%
              </p>

              <p className="text-sm font-bold text-gray-500">
                Hoàn thành
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-4xl font-black text-gray-900">
              {completedCount}/{totalActivities}
            </p>

            <p className="font-semibold text-gray-600">
              Hoạt động đã hoàn thành/Tổng số hoạt động
            </p>

            <LegendItem
              color="#f59e0b"
              label="Đang ráp nối"
              value={connectingCount}
              total={totalActivities}
            />

            <LegendItem
              color="#2563eb"
              label="Đã chốt"
              value={confirmedCount}
              total={totalActivities}
            />

            <LegendItem
              color="#16a34a"
              label="Đã hoàn thành"
              value={completedCount}
              total={totalActivities}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-5">
          <h3 className="text-xl font-black text-gray-800">
            Đối tượng tiếp nhận hỗ trợ
          </h3>

          <p className="text-sm text-gray-500">
            Chỉ tính các hoạt động có trạng thái Đã hoàn thành.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative mx-auto h-44 w-44 shrink-0 rounded-full md:mx-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${supportGradient})`,
              }}
            />

            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <p className="text-4xl font-black text-blue-700">
                {totalSupported}
              </p>

              <p className="text-sm font-bold text-gray-500">
                Lượt hỗ trợ
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {activeGroups.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-500">
                Chưa có dữ liệu nhóm đối tượng.
              </div>
            ) : (
              activeGroups.map((item) => (
                <LegendItem
                  key={item.label}
                  color={item.color}
                  label={item.label}
                  value={item.value}
                  total={totalSupported}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, total }) {
  const percent =
    total === 0 ? 0 : ((value/total) * 100).toFixed(1);

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />

        <span className="font-semibold text-gray-700">
          {label}
        </span>
      </div>

      <span className="font-black text-gray-900">
        {value}{" "}
        <span className="text-sm text-gray-500">
          ({percent}%)
        </span>
      </span>
    </div>
  );
}

const pieColors = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
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

export default SummaryCards;