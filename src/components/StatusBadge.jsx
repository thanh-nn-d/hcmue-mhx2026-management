function StatusBadge({ status }) {
    const getStatusClass = () => {
      switch (status) {
        case "Đang ráp nối":
          return "bg-yellow-100 text-yellow-700";
  
        case "Đã chốt":
          return "bg-blue-100 text-blue-700";
  
        case "Đã hoàn thành":
          return "bg-green-100 text-green-700";
  
        case "Đã hủy":
          return "bg-red-100 text-red-700";
  
        default:
          return "bg-gray-100 text-gray-700";
      }
    };
  
    return (
      <span
        className={`rounded px-3 py-1 text-sm font-semibold ${getStatusClass()}`}
      >
        {status}
      </span>
    );
  }
  
  export default StatusBadge;