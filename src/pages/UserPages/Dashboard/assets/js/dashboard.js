const chartData = [
  {
    label: "Venezuela",
    value: "290",
    color: "#D8D8D8",
  },
  {
    label: "Saudi",
    value: "260",
    color: "#D8D8D8",
  },
  {
    label: "Canada",
    value: "180",
    color: "#D8D8D8",
  },
  {
    label: "Iran",
    value: "140",
    color: "#D8D8D8",
  },
  {
    label: "Russia",
    value: "115",
    color: "#D8D8D8",
  },
  {
    label: "UAE",
    value: "100",
    color: "#D8D8D8",
  },
  {
    label: "US",
    value: "30",
    color: "#D8D8D8",
  },
  {
    label: "China",
    value: "30",
    color: "#D8D8D8",
  },
];

//STEP 3 - Chart Configurations
const returnChartConfig = (filter) => {
  return {
    type: "column2d",
    renderAt: filter === "weekly" 
      ? "chart_container_week" 
      : "chart_container_month",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "",
        subCaption: "",
        xAxisName: "",
        yAxisName: "",
        bgColor: "#D8D8D8",
        showPlotBorder: 1,
        plotBorderColor: "#B8B8B8",
        showBorder: 1,
        showYAxisValues: 0,
        borderColor: "#B8B8B8",
        borderThickness: "2",
        borderAlpha: 100,
        showYAxisLine: 0,
        showXAxisLine: 0,
        theme: "fusion",
      },
      // Chart Data
      data: chartData,
    },
  };
}


FusionCharts.ready(function () {
  const fusionchartsWeekly = new FusionCharts(returnChartConfig("weekly"));
  fusionchartsWeekly.render();

  const fusionchartsMonthly = new FusionCharts(returnChartConfig("monthly"));
  fusionchartsMonthly.render();
});



function ChangeChartFilter() {
  const changeFilter = document.querySelector("#change_filter")
  const isMonthly = changeFilter.checked
  document.querySelector("#chart_container_week").style.display = isMonthly ? "none" : "block"
  document.querySelector("#chart_container_month").style.display = isMonthly ? "block" : "none"

  document.querySelector("#weekly_chart_header").style.display = isMonthly ? "none" : "block"
  document.querySelector("#monthly_chart_header").style.display = isMonthly ? "block" : "none"
}
