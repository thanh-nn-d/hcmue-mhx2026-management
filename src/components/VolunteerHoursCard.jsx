function calculateActivityHours(activity) {
    if (!activity.startTime || !activity.endTime) return 0;
  
    const [startHour, startMinute] = activity.startTime.split(":").map(Number);
    const [endHour, endMinute] = activity.endTime.split(":").map(Number);
  
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
  
    if (end <= start) return 0;
  
    return (end - start) / 60;
  }
  
  function VolunteerHoursCard({ activities }) {
    const completedActivities = activities.filter(
      (activity) => activity.status === "Đã hoàn thành"
    );
  
    const totalVolunteerHours = completedActivities.reduce((sum, activity) => {
      return sum + calculateActivityHours(activity);
    }, 0);
  
    return (
      <div className="mt-6 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-800">
              Tổng số giờ tình nguyện
            </h3>
  
            <p className="mt-1 text-sm text-gray-500">
              Chỉ tính các hoạt động có trạng thái Đã hoàn thành.
            </p>
          </div>
  
          <div className="text-left md:text-right">
            <p className="text-5xl font-black text-green-700">
              {totalVolunteerHours.toFixed(1)}
            </p>
  
            <p className="text-lg font-bold text-gray-600">giờ</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default VolunteerHoursCard;