import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

function renderSparklineCell(params) {
  const { value, row, colDef } = params;

  if (!value || value.length === 0 || !row.dates || row.dates.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
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
          data: row.dates,
        }}
      />
    </div>
  );
}

function renderStatus(sold) {
  const status = sold ? "Sold" : "HODL";
  const colors = {
    HODL: "success",
    Sold: "default",
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}

function renderUSD(total) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);
}

function renderPercent(percent) {
  let formattedPercent = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(percent);

  let color = "success";
  if (percent > 0) {
    formattedPercent = `+${formattedPercent}`;
  } else {
    color = "error";
  }
  return <Chip label={formattedPercent} color={color} size="medium" />;
}

function renderAvatar(params) {
  if (params.value == null) {
    return "";
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns = [
  { field: "name", headerName: "Name", flex: 1.5, minWidth: 100 },
  {
    field: "category",
    headerName: "Category",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "sold",
    headerName: "Status",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: "total",
    headerName: "Total",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => renderUSD(params.value),
  },
  {
    field: "profit",
    headerName: "Profit",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderUSD(params.value),
  },
  {
    field: "gainloss",
    headerName: "Gain/Loss",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => renderPercent(params.value),
  },
  {
    field: "intervalChange",
    headerName: "Change",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderPercent(params.value),
  },
  {
    field: "performance",
    headerName: "Performance",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export default function CustomizedDataGrid({ holdingsData }) {
  return (
    <DataGrid
      autoHeight
      rows={holdingsData}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
