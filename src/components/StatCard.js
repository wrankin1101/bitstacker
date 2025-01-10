import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="50%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function StatCard({
  id,
  title,
  value,
  intervalString,
  trend,
  percentChange,
  usdChange,
  data,
  dates,
  min,
  max,
}) {
  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.main,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.main,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };
  const color = labelColors[trend];
  const chartColor = trendColors[trend];

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Stack sx={{ justifyContent: "space-between", gap: 1 }}>
                <Chip size="small" color={color} label={percentChange} />
                <Chip size="small" color={color} label={usdChange} />
              </Stack>
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {intervalString}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              yAxis={{
                min: min * 0.9,
                max: max * 1.1,
                hideTooltip: true,
              }}
              valueFormatter={(value) =>
                value === null
                  ? ""
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)
              }
              xAxis={{
                scaleType: "band",
                data: dates,
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${id})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${id}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  intervalString: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["down", "neutral", "up"]).isRequired,
  percentChange: PropTypes.string.isRequired,
  usdChange: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default StatCard;
