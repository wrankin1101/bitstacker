export const fetchDashboardData = async (interval) => {
  const intervalNumber = Number(interval);
  if (isNaN(intervalNumber)) {
    throw new Error("Interval is not a valid number: " + interval);
  }

  const response = await fetch("/data.json"); // Replace with an API endpoint later
  if (!response.ok) throw new Error("Failed to fetch data");
  const json = await response.json();

  let processed = [];
  for (let i = 0; i < json.length; i++) {
    processed.push(processData(json[i], interval));
  }
  return processed;
};

export const processData = (data, interval) => {
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
  const averagedValues = Object.entries(groupedByDate).map(
    ([date, { total, count }]) => ({
      date,
      value: total / count,
    })
  );

  //sort by date
  const sortedByDate = averagedValues.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
  // A - B = sorted oldest -> newest
  // B - A = sorted newest -> oldest

  //cutoff past interval
  let cutoffDate = new Date();
  const newestDate = new Date(sortedByDate[0].date);

  cutoffDate = new Date(newestDate); 
  cutoffDate.setDate(newestDate.getDate() - interval); 

  let dateCutoff = sortedByDate.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate; // Keep only dates within the interval
  });
  const newestValue = dateCutoff[dateCutoff.length - 1].value;
  const oldestValue = dateCutoff[0].value;

  let percentChange = newestValue / oldestValue - 1;
  let formattedPercent = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(percentChange);

  if (percentChange > 0) {
    formattedPercent = `+${formattedPercent}`;
  }

  let trend = "neutral";
  if (percentChange > 0.05) {
    trend = "up";
  } else if (percentChange < 0.05) {
    trend = "down";
  }
  const dates = dateCutoff.map((item) => item.date);
  const values = dateCutoff.map((item) => item.value);

  const processedData = {
    title: data.title,
    data: values,
    min: Math.min(...values),
    max: Math.max(...values),
    dates: dates,
    intervalString: `Last ${interval} days`,
    value: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(newestValue),
    newestValue: newestValue,
    oldestValue: oldestValue,
    trend: trend,
    rawpercent: percentChange,
    percentChange: formattedPercent,
  };
  console.log(processedData);
  // Return processed data
  return processedData;
};
