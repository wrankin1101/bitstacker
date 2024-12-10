import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status) {
  const colors = {
    HODL: 'success',
    Sold: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}
function renderUSD(total) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total)
}
function renderPercent(percent) {
  
  let formattedPercent = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(percent);

  let color = 'success'
  if (percent > 0) {
    formattedPercent = `+${formattedPercent}`;
  }
  else {
    color = 'error'
  }
  return <Chip label={formattedPercent} color={color} size="medium" />;
}

export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns = [
  { field: 'pageTitle', headerName: 'Name', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'total',
    headerName: 'Total',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => renderUSD(params.value),
  },
  {
    field: 'profit',
    headerName: 'Profit',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderUSD(params.value),
  },
  {
    field: 'gainloss',
    headerName: 'Gain/Loss',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => renderPercent(params.value),
  },
  {
    field: 'intervalChange',
    headerName: 'Change',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderPercent(params.value)
  },
  {
    field: 'performance',
    headerName: 'Performance',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows = [
  {
    id: 1,
    pageTitle: 'ETH',
    status: 'HODL',
    profit: 8345,
    total: 212423,
    gainloss: 18.5,
    intervalChange: .5,
    performance: [
      469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
      911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
      1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
      3296541, 3041524, 2599497,
    ],
  },
  {
    id: 2,
    pageTitle: 'BTC',
    status: 'HODL',
    profit: 5653,
    total: 172240,
    gainloss: 9.7,
    intervalChange: .5,
    performance: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      557488, 1341471, 2044561, 2206438,
    ],
  },
  {
    id: 3,
    pageTitle: 'SOL',
    status: 'Sold',
    profit: 3455,
    total: 58240,
    gainloss: 15.2,
    intervalChange: .5,
    performance: [
      166896, 190041, 248686, 226746, 261744, 271890, 332176, 381123, 396435, 495620,
      520278, 460839, 704158, 559134, 681089, 712384, 765381, 771374, 851314, 907947,
      903675, 1049642, 1003160, 881573, 1072283, 1139115, 1382701, 1395655, 1355040,
      1381571,
    ],
  },
  {
    id: 4,
    pageTitle: 'Eigen',
    status: 'HODL',
    profit: 112543,
    total: 96240,
    gainloss: -4.5,
    intervalChange: .5,
    performance: [
      264651, 311845, 436558, 439385, 520413, 533380, 562363, 533793, 558029, 791126,
      649082, 566792, 723451, 737827, 890859, 935554, 1044397, 1022973, 1129827,
      1145309, 1195630, 1358925, 1373160, 1172679, 1340106, 1396974, 1623641,
      1687545, 1581634, 1550291,
    ],
  },
  {
    id: 5,
    pageTitle: 'ONDO',
    status: 'Sold',
    profit: 3653,
    total: 142240,
    gainloss: 3.1,
    intervalChange: .5,
    performance: [
      251871, 262216, 402383, 396459, 378793, 406720, 447538, 451451, 457111, 589821,
      640744, 504879, 626099, 662007, 754576, 768231, 833019, 851537, 972306,
      1014831, 1027570, 1189068, 1119099, 987244, 1197954, 1310721, 1480816, 1577547,
      1854053, 1791831,
    ],
  },
  {
    id: 6,
    pageTitle: 'LINK',
    status: 'HODL',
    profit: 106543,
    total: 15240,
    gainloss: 7.2,
    intervalChange: .5,
    performance: [
      13671, 16918, 27272, 34315, 42212, 56369, 64241, 77857, 70680, 91093, 108306,
      94734, 132289, 133860, 147706, 158504, 192578, 207173, 220052, 233496, 250091,
      285557, 268555, 259482, 274019, 321648, 359801, 399502, 447249, 497403,
    ],
  },
  {
    id: 7,
    pageTitle: 'OP',
    status: 'Sold',
    profit: 7853,
    total: 32240,
    gainloss: 6.5,
    intervalChange: .5,
    performance: [
      93682, 107901, 144919, 151769, 170804, 183736, 201752, 219792, 227887, 295382,
      309600, 278050, 331964, 356826, 404896, 428090, 470245, 485582, 539056, 582112,
      594289, 671915, 649510, 574911, 713843, 754965, 853020, 916793, 960158, 984265,
    ],
  },
  {
    id: 8,
    pageTitle: 'ZRO',
    status: 'HODL',
    profit: 8563,
    total: 48240,
    gainloss: 4.3,
    intervalChange: .5,
    performance: [
      52394, 63357, 82800, 105466, 128729, 144472, 172148, 197919, 212302, 278153,
      290499, 249824, 317499, 333024, 388925, 410576, 462099, 488477, 533956, 572307,
      591019, 681506, 653332, 581234, 719038, 783496, 911609, 973328, 1056071,
      1112940,
    ],
  },
  {
    id: 9,
    pageTitle: 'MATIC',
    status: 'Sold',
    profit: 4563,
    total: 18240,
    gainloss: 2.7,
    intervalChange: .5,
    performance: [
      15372, 16901, 25489, 30148, 40857, 51136, 64627, 75804, 89633, 100407, 114908,
      129957, 143568, 158509, 174822, 192488, 211512, 234702, 258812, 284328, 310431,
      338186, 366582, 396749, 428788, 462880, 499125, 537723, 578884, 622825,
    ],
  },
  {
    id: 10,
    pageTitle: 'Gemini',
    status: 'HODL',
    profit: 9863,
    total: 28240,
    gainloss: 5.1,
    intervalChange: .5,
    performance: [
      70211, 89234, 115676, 136021, 158744, 174682, 192890, 218073, 240926, 308190,
      317552, 279834, 334072, 354955, 422153, 443911, 501486, 538091, 593724, 642882,
      686539, 788615, 754813, 687955, 883645, 978347, 1142551, 1233074, 1278155,
      1356724,
    ],
  },
  {
    id: 11,
    pageTitle: 'Shitcoins',
    status: 'Sold',
    profit: 6563,
    total: 24240,
    gainloss: 4.8,
    intervalChange: .5,
    performance: [
      49662, 58971, 78547, 93486, 108722, 124901, 146422, 167883, 189295, 230090,
      249837, 217828, 266494, 287537, 339586, 363299, 412855, 440900, 490111, 536729,
      580591, 671635, 655812, 576431, 741632, 819296, 971762, 1052605, 1099234,
      1173591,
    ],
  },
  {
    id: 12,
    pageTitle: 'ARB',
    status: 'HODL',
    profit: 12353,
    total: 38240,
    gainloss: 3.5,
    intervalChange: .5,
    performance: [
      29589, 37965, 55800, 64672, 77995, 91126, 108203, 128900, 148232, 177159,
      193489, 164471, 210765, 229977, 273802, 299381, 341092, 371567, 413812, 457693,
      495920, 564785, 541022, 491680, 618096, 704926, 833365, 904313, 974622,
      1036567,
    ],
  },
  {
    id: 13,
    pageTitle: 'BONK',
    status: 'Sold',
    profit: 5863,
    total: 13240,
    gainloss: 2.3,
    intervalChange: .5,
    performance: [
      8472, 9637, 14892, 19276, 23489, 28510, 33845, 39602, 45867, 52605, 59189,
      65731, 76021, 85579, 96876, 108515, 119572, 131826, 145328, 160192, 176528,
      196662, 217929, 239731, 262920, 289258, 315691, 342199, 370752, 402319,
    ],
  },
  {
    id: 14,
    pageTitle: 'WLD',
    status: 'HODL',
    profit: 7853,
    total: 18240,
    gainloss: 3.2,
    intervalChange: .5,
    performance: [
      15792, 16948, 22728, 25491, 28412, 31268, 34241, 37857, 42068, 46893, 51098,
      55734, 60780, 66421, 72680, 79584, 87233, 95711, 105285, 115814, 127509,
      140260, 154086, 169495, 186445, 205109, 225580, 247983, 272484, 299280,
    ],
  },
  {
    id: 15,
    pageTitle: 'JMPT',
    status: 'Sold',
    profit: 9563,
    total: 24240,
    gainloss: 2.5,
    intervalChange: .5,
    performance: [
      25638, 28355, 42089, 53021, 66074, 80620, 97989, 118202, 142103, 166890,
      193869, 225467, 264089, 307721, 358059, 417835, 488732, 573924, 674878, 794657,
      938542, 1111291, 1313329, 1543835, 1812156, 2123349, 2484926, 2907023, 3399566,
      3973545,
    ],
  },
  {
    id: 16,
    pageTitle: 'Coinbase',
    status: 'HODL',
    profit: 13423,
    total: 54230,
    gainloss: 7.8,
    intervalChange: .5,
    performance: [
      241732, 256384, 289465, 321423, 345672, 378294, 398472, 420364, 436278, 460192,
      495374, 510283, 532489, 559672, 587312, 610982, 629385, 654732, 678925, 704362,
      725182, 749384, 772361, 798234, 819472, 846291, 872183, 894673, 919283, 945672,
    ],
  },
];
