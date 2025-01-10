export const processHistoryForCards = (data, interval) => {
  const intervalNumber = Number(interval);
  if (isNaN(intervalNumber)) {
    throw new Error("Interval is not a valid number: " + interval);
  }

  if (data.length === 0) {
    return [
      new ProcessedCardData("Total", [], [], interval),
      new ProcessedCardData("Net Spent", [], [], interval),
      new ProcessedCardData("Profit", [], [], interval),
    ];
  }

  // Step 1: Remove entries with value: 0
  const filteredValues = data.filter(
    (entry) => entry.total !== 0 && entry.net_spent !== 0 && entry.profit !== 0
  );

  // Step 2: Group values by date
  const initialData = {
    totalSum: 0,
    totalCount: 0,
    netSpentSum: 0,
    netSpentCount: 0,
    profitSum: 0,
    profitCount: 0,
  };
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
  let dateCutoff = sortAndCutoff(averagedValues, interval);

  // Step 4: Process data for each card
  const dates = dateCutoff.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  });

  // Initialize processedData using the ProcessedData class
  const processedData = [
    new ProcessedCardData(
      "Total",
      dateCutoff.map((item) => item.total),
      dates,
      interval
    ),
    new ProcessedCardData(
      "Net Spent",
      dateCutoff.map((item) => item.netSpent),
      dates,
      interval
    ),
    new ProcessedCardData(
      "Profit",
      dateCutoff.map((item) => item.profit),
      dates,
      interval
    ),
  ];
  // Return processed data
  return processedData;
};

class ProcessedCardData {
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

export class ProcessedHoldingData {
  constructor(holding) {
    this.id = holding.id;
    this.name = holding.name;
    this.category = holding.category;
    this.sold = holding.sold;
    this.portfolio_id = holding.portfolio_id;

    this.profit = holding.profit !== undefined ? holding.profit : 0;
    this.total = holding.total !== undefined ? holding.total : 0;
    this.net_spent = holding.net_spent !== undefined ? holding.net_spent : 0;
    //this.gainloss = this.net_spent !== 0 ? this.profit / this.net_spent : 0;
    
    this.gainloss = 0;
    this.history = [];
    this.historyLoaded = false;
    this.performance = [];
    this.dates = [];
    this.intervalChange = 0;
    this.interval = 0;
  }
  addHistory(history) {
    this.history = history;
    this.historyLoaded = true;
  }
  addInterval(interval) {
    const intervalNumber = Number(interval);
    if (isNaN(intervalNumber)) {
      throw new Error("Interval is not a valid number: " + interval);
    }
    this.interval = interval;

    if (this.history.length === 0) {
      console.log("No history data for holding: ", this.name);
      return;
    }
    let dateCutoff = sortAndCutoff(this.history, interval);

    this.performance = dateCutoff.map((item) => item.total);
    const lastIndex = dateCutoff.length - 1;

    this.dates = dateCutoff.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });
    this.profit = dateCutoff[lastIndex].profit;
    this.total = dateCutoff[lastIndex].total;
    this.net_spent = dateCutoff[lastIndex].net_spent;
    this.gainloss = dateCutoff[lastIndex].profit / dateCutoff[lastIndex].net_spent;
    this.intervalChange =
      dateCutoff[lastIndex].total / dateCutoff[0].total - 1;
  }
}

const sortAndCutoff = (data, interval, direction = "asc") => {
  if (data.length === 0) {
    console.log("dataCleaner: No data to sort or cutoff");
    return [];
  }
  if (interval === 0 ) {
    console.log("dataCleaner: Interval is 0, returning unsorted data");
    return data;
  }
  if (data[0].date === undefined) {
    console.log("dataCleaner: No date field in data, returning unsorted");
    return data;
  }

  //sort by date
  const sortedByDate = data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    //oldest -> newest
    if (direction === "asc") {
      return dateA - dateB;
    }
    //newest -> last
    else {
      return dateB - dateA;
    }
  });
  
  //cutoff past interval
  const newestDate = new Date(sortedByDate[sortedByDate.length - 1].date);
  const cutoffDate = new Date(
    newestDate.getTime() - interval * 24 * 60 * 60 * 1000
  ); // Subtract interval in milliseconds

  let dateCutoff = sortedByDate.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate; // Keep only dates within the interval
  });

  return dateCutoff;
}