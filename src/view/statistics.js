// import flatpickr from "flatpickr";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Smart from "./smart.js";
import {uniqTypes, costPointByType} from "../utils/statistics.js";
// import {getCurrentDate} from "../utils/points.js";


// const transportCtx = document.querySelector(`.statistics__chart--transport`);
// const timeSpendCtx = document.querySelector(`.statistics__chart--time`);

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
// transportCtx.height = BAR_HEIGHT * 4;
// timeSpendCtx.height = BAR_HEIGHT * 4;

const renderMoneyChart = (moneyCtx, points) => {
  // console.log(points);
  const eventsTypes = points.map((item) => item.eventsTypes.type);
  const types = uniqTypes(eventsTypes);
  const pointByTypeCost = types.map((type) => costPointByType(points, type));

  moneyCtx.height = BAR_HEIGHT * 6;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      // labels: [`✈️ FLY`, `???? STAY`, `???? DRIVE`, `????️ LOOK`, `???? EAT`, `???? RIDE`],
      datasets: [{
        data: pointByTypeCost,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

// const transportChart = new Chart(transportCtx, {
//   plugins: [ChartDataLabels],
//   type: `horizontalBar`,
//   data: {
//     labels: [`???? DRIVE`, `???? RIDE`, `✈️ FLY`, `????️ SAIL`],
//     datasets: [{
//       data: [4, 3, 2, 1],
//       backgroundColor: `#ffffff`,
//       hoverBackgroundColor: `#ffffff`,
//       anchor: `start`
//     }]
//   },

//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 13
//         },
//         color: `#000000`,
//         anchor: 'end',
//         align: 'start',
//         formatter: (val) => `${val}x`
//       }
//     },
//     title: {
//       display: true,
//       text: `TRANSPORT`,
//       fontColor: `#000000`,
//       fontSize: 23,
//       position: `left`
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: `#000000`,
//           padding: 5,
//           fontSize: 13,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         barThickness: 44,
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         minBarLength: 50
//       }],
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: false,
//     }
//   }
// });

const createStatisticsTemplate = () => {
  // const {tasks, dateFrom, dateTo} = data;
  // const completedTaskCount = countCompletedTaskInDateRange(tasks, dateFrom, dateTo);

  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

export default class Statistics extends Smart {
  constructor(points) {
    super();

    this._data = {
      points,
    //   // По условиям техзадания по умолчанию интервал - неделя от текущей даты
    //   dateFrom: (() => {
    //     const daysToFullWeek = 6;
    //     const date = getCurrentDate();
    //     date.setDate(date.getDate() - daysToFullWeek);
    //     return date;
    //   })(),
    //   dateTo: getCurrentDate()
    };

    // this._colorsCart = null;
    this._moneyChart = null;

    // this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    // this._setDatepicker();
  }

  // removeElement() {
  //   super.removeElement();

  //   if (this._colorsCart !== null || this._moneyChart !== null) {
  //     this._colorsCart = null;
  //     this._moneyChart = null;
  //   }

  //   // if (this._datepicker) {
  //   //   this._datepicker.destroy();
  //   //   this._datepicker = null;
  //   // }
  // }

  getTemplate() {
    return createStatisticsTemplate();
  }

  // restoreHandlers() {
  //   this._setCharts();
  //   this._setDatepicker();
  // }

  // _dateChangeHandler([dateFrom, dateTo]) {
  //   if (!dateFrom || !dateTo) {
  //     return;
  //   }

  //   this.updateData({
  //     dateFrom,
  //     dateTo
  //   });
  // }

  // _setDatepicker() {
  //   if (this._datepicker) {
  //     this._datepicker.destroy();
  //     this._datepicker = null;
  //   }

  //   this._datepicker = flatpickr(
  //       this.getElement().querySelector(`.statistic__period-input`),
  //       {
  //         mode: `range`,
  //         dateFormat: `j F`,
  //         defaultDate: [this._data.dateFrom, this._data.dateTo],
  //         onChange: this._dateChangeHandler
  //       }
  //   );
  // }

  _setCharts() {
    if (this._moneyChart !== null) {
      this._moneyChart = null;
    }

    const {points} = this._data;
    // const colorsCtx = this.getElement().querySelector(`.statistic__colors`);
    // const daysCtx = this.getElement().querySelector(`.statistic__days`);
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);

    // this._colorsCart = renderColorsChart(colorsCtx, points);
    this._moneyChart = renderMoneyChart(moneyCtx, points);
  }
}
