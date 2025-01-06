export const processHistoryForCards = (data, interval) => {
  const intervalNumber = Number(interval);
  if (isNaN(intervalNumber)) {
    throw new Error("Interval is not a valid number: " + interval);
  }

  if (data.length === 0) {
    return [
      new ProcessedData("Total", [], [], interval),
      new ProcessedData("Net Spent", [], [], interval),
      new ProcessedData("Profit", [], [], interval),
    ];
  }

  //{id: 42, portfolio_id: 1, date: "12/29/2023", total: 5506.91, net_spent: 3965.0099999999998, profit: 1865.0433333333333,  }

  // Step 1: Remove entries with value: 0
  const filteredValues = data.filter(
    (entry) => entry.total !== 0 && entry.net_spent !== 0 && entry.profit !== 0
  );

  const initialData = {
    totalSum: 0,
    totalCount: 0,
    netSpentSum: 0,
    netSpentCount: 0,
    profitSum: 0,
    profitCount: 0,
  };

  // Step 2: Group values by date
  const groupedByDate = filteredValues.reduce((acc, current) => {
    const { date, total, net_spent, profit } = current;
    if (!acc[date]) {
      acc[date] = { ...initialData };
    }
    acc[date].totalSum += total;
    acc[date].totalCount += 1;
    acc[date].netSpentSum += net_spent;
    acc[date].netSpentCount += 1;
    acc[date].profitSum += profit;
    acc[date].profitCount += 1;
    return acc;
  }, {});

  // Step 3: Calculate averages for each date
  const averagedValues = Object.entries(groupedByDate).map(
    ([
      date,
      {
        totalSum,
        totalCount,
        netSpentSum,
        netSpentCount,
        profitSum,
        profitCount,
      },
    ]) => ({
      date,
      total: totalSum / totalCount,
      netSpent: netSpentSum / netSpentCount,
      profit: profitSum / profitCount,
    })
  );

  //sort by date
  const sortedByDate = averagedValues.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
  // A - B = sorted oldest first -> newest last
  // B - A = sorted newest first -> oldest last

  //cutoff past interval
  const newestDate = new Date(sortedByDate[sortedByDate.length - 1].date);
  const cutoffDate = new Date(
    newestDate.getTime() - interval * 24 * 60 * 60 * 1000
  ); // Subtract interval in milliseconds

  let dateCutoff = sortedByDate.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate; // Keep only dates within the interval
  });

  // Step 4: Process data for each card

  const dates = dateCutoff.map((item) => item.date);

  // Initialize processedData using the ProcessedData class
  const processedData = [
    new ProcessedData(
      "Total",
      dateCutoff.map((item) => item.total),
      dates,
      interval
    ),
    new ProcessedData(
      "Net Spent",
      dateCutoff.map((item) => item.netSpent),
      dates,
      interval
    ),
    new ProcessedData(
      "Profit",
      dateCutoff.map((item) => item.profit),
      dates,
      interval
    ),
  ];
  console.log(processedData);
  // Return processed data
  return processedData;
};

class ProcessedData {
  constructor(title, data, dates, interval) {
    this.id = title.toLowerCase().replace(" ", "-");
    this.title = title;
    this.data = data;
    this.dates = dates;

    // Initialize with zero values
    this.newestValue = 0;
    this.oldestValue = 0;
    this.rawPercent = 0;
    this.percentChange = "0%";
    this.usdChange = "$0.00";
    this.trend = "neutral";
    this.min = 0;
    this.max = 0;
    this.intervalString = `Last ${interval} days`;
    this.value = "$0.00";

    // If there is no data, return early
    if (data.length === 0) {
      return;
    }

    // Find the newest and oldest values
    this.newestValue = data[data.length - 1];
    this.oldestValue = data[0];

    // Calculate percent change
    let percentChange = this.newestValue / this.oldestValue - 1;
    let formattedPercent = new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(percentChange);

    // Calculate USD change
    let usdChange = this.newestValue - this.oldestValue;
    let formattedUsdChange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usdChange);

    // Add "+" sign for positive values
    if (percentChange > 0) {
      formattedPercent = `+${formattedPercent}`;
      formattedUsdChange = `+${formattedUsdChange}`;
    }

    // Determine trend based on percent change
    this.trend = "neutral";
    if (percentChange > 0.05) {
      this.trend = "up";
    } else if (percentChange < 0.05) {
      this.trend = "down";
    }

    // Calculate min and max values
    this.min = Math.min(...data);
    this.max = Math.max(...data);

    this.intervalString = `Last ${interval} days`;

    // Format value as currency
    this.value = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(this.newestValue);

    // Assign formatted values to instance variables
    this.rawPercent = percentChange;
    this.percentChange = formattedPercent;
    this.usdChange = formattedUsdChange;
  }
}
