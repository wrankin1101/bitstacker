import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

const generateSxObject = (cardData) => {
  const sxObject = {};
  cardData.forEach((card) => {
    const className = `& .MuiAreaElement-series-${card.id}`;
    sxObject[className] = {
      fill: `url('#${card.id}')`,
    };
  });
  return sxObject;
};

export default function SessionsChart({ cardData, interval }) {
  const theme = useTheme();
  const colors = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];
  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Performance
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {cardData.length && (
              <>
                <Typography variant="h4" component="p">
                  {cardData[0].value}
                </Typography>
                <Chip
                  size="small"
                  color={labelColors[cardData[0].trend]}
                  label={cardData[0].percentChange}
                />
                <Chip
                  size="small"
                  color={labelColors[cardData[0].trend]}
                  label={cardData[0].usdChange}
                />
              </>
            )}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Performance for the last {interval} days
          </Typography>
        </Stack>
        {cardData.length && (
          <LineChart
            colors={colors}
            xAxis={[
              {
                scaleType: "point",
                data: cardData[0].dates,
                tickInterval: (index, i) => (i + 1) % 5 === 0,
              },
            ]}
            series={cardData.map((card) => ({
              id: card.id,
              label: card.title,
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: card.data,
            }))}
            height={250}
            margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
            sx={generateSxObject(cardData)}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          >
            {cardData.map((card, index) => (
              <AreaGradient
                key={index}
                color={colors[index % colors.length]}
                id={card.id}
              />
            ))}
          </LineChart>
        )}
      </CardContent>
    </Card>
  );
}
