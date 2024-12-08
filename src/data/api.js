
export const fetchDashboardData = async () => {
    const response = await fetch('/data.json'); // Replace with an API endpoint later
    if (!response.ok) throw new Error('Failed to fetch data');
    const json = await response.json();

    let processed = []
    for(let i = 0; i < json.length; i++){
        processed.push(processData(json[i]))
    }
    return processed;
  };

export const processData = (data) => {
    // Step 1: Remove entries with value: 0
    const filteredValues = data.values.filter((entry) => entry.value !== 0);
  
    // Step 2: Group values by date
    const groupedByDate = filteredValues.reduce((acc, current) => {
      const { date, value } = current;
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += value;
      acc[date].count += 1;
      return acc;
    }, {});
  
    // Step 3: Calculate averages for each date
    const averagedValues = Object.entries(groupedByDate).map(([date, { total, count }]) => ({
      date,
      value: total / count,
    }));
  
    // Return processed data
    return {
      title: data.title,
      values: averagedValues,
    };
  };
  