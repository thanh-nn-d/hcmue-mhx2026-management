function useActivityFilter({
    activities,
    searchKeyword,
    statusFilter,
    pointFilter,
    sortType,
  }) {
    return activities
      .filter((activity) =>
        activity.activityName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      )
      .filter((activity) =>
        statusFilter === ""
          ? true
          : activity.status === statusFilter
      )
      .filter((activity) =>
        pointFilter === ""
          ? true
          : activity.assignedPoint === pointFilter
      )
      .sort((a, b) => {
        if (sortType === "newest") {
          return (
            new Date(b.activityDate) -
            new Date(a.activityDate)
          );
        }
  
        return (
          new Date(a.activityDate) -
          new Date(b.activityDate)
        );
      });
  }
  
  export default useActivityFilter;