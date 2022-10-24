
function changeChartFilter() {
  const changeFilter = document.querySelector("#change_filter")
  const isMonthly = changeFilter.checked
  document.querySelector("#chart_container_week").style.display = isMonthly ? "none" : "block"
  document.querySelector("#chart_container_month").style.display = isMonthly ? "block" : "none"

  document.querySelector("#weekly_chart_header").style.display = isMonthly ? "none" : "block"
  document.querySelector("#monthly_chart_header").style.display = isMonthly ? "block" : "none"
}

const post = async(url, data, token, auth) => {
  if (auth) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    })
  }
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

const get = async(url, token, auth) => {
  if (auth) {
    return await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    })
  }
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
}

const formatChartData = (type, data) => {
  const weeklyDataKeys = [
    "today",
    "yesterday",
    "day 3",
    "day 4",
    "day 5",
    "day 6",
    "day 7",
  ]

  const yearlyDataKeys = [
    "this month",
    "last month",
    "month 3",
    "month 4",
    "month 5",
    "month 6",
    "month 7",
    "month 8",
    "month 9",
    "month 10",
    "month 11",
    "month 12",
  ] 

  const dataKeys = {
    weekly: weeklyDataKeys,
    yearly: yearlyDataKeys,
  }

  const chartData = []

  data?.forEach((elt, index) => {
    if(type === "weekly") {
      chartData.push({
        label: dataKeys[type][index],
        value: elt?.total,
        color: "#D8D8D8",
      })
    } else {
      chartData.push({
        label: dataKeys[type][index],
        value: elt?.total,
        color: "#D8D8D8",
      })
    }
  })

  return chartData

}

const updateBestSellers = (data) => {
  const bestSellers = document.querySelector("#bestsellers_table")
  data?.forEach(elt => {
    const createTr = document.createElement("tr");
    const nameTd = document.createElement("td");
    nameTd.innerText = elt.product.name;
    const priceTd = document.createElement("td");
    priceTd.innerText = "";
    const unitsTd = document.createElement("td");
    unitsTd.innerText = elt.units;
    const revenueTd = document.createElement("td");
    revenueTd.innerText = elt.revenue;

    createTr.appendChild(nameTd);
    createTr.appendChild(priceTd);
    createTr.appendChild(unitsTd);
    createTr.appendChild(revenueTd);

    bestSellers.appendChild(createTr);
  })
}

const requestNewToken = async(token) => {
  const url = "https://freddy.codesubmit.io/refresh"
  post(url, {}, token, true).then(async(data) => {
    const res = await data.json()
    localStorage.setItem("access_token", res.access_token)
  }).catch(err => console.log(err))
}

async function loadContents() {
  if (localStorage.getItem("access_token") !== "undefined") {
    const url = "https://freddy.codesubmit.io/dashboard"
    const token = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")
  
    requestNewToken(refreshToken)
    get(url, token, true).then(async(dataRec) => {
      const recData = await dataRec.json()
      updateBestSellers(recData?.dashboard?.bestsellers)
    }).catch((err) => console.log(err))
  }
  else {
    window.location.href = "../../Auth/login.html";
  }
}


const returnChartConfig = (filter, data) => {
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
      data: data,
    },
  };
}

const logout = () => {
  localStorage.clear()
  window.location.href = "../../Auth/login.html";
}


FusionCharts.ready(async function () {
  const url = "https://freddy.codesubmit.io/dashboard"
  const token = localStorage.getItem("access_token")
  const res = await get(url, token, true)
  const data = await res.json()

  let todayData = Object.values(data?.dashboard?.sales_over_time_week)
  todayData = todayData.slice(-1)[0]
  document.querySelector(".order_today").innerText = `$${todayData.total} / ${todayData.orders} orders`

  let lastWeekData = Object.values(data?.dashboard?.sales_over_time_week)
  lastWeekData = lastWeekData[0]
  document.querySelector(".order_lastWeek").innerText = `$${lastWeekData.total} / ${lastWeekData.orders} orders`

  let lastMonthData = Object.values(data?.dashboard?.sales_over_time_year)
  lastMonthData = lastMonthData.slice(-2)[0]
  document.querySelector(".order_lastMonth").innerText = `$${lastMonthData.total} / ${lastMonthData.orders} orders`

  let sales_over_time_week = Object.values(data?.dashboard?.sales_over_time_week)
  sales_over_time_week = [...sales_over_time_week].reverse()

  let sales_over_time_year = Object.values(data?.dashboard?.sales_over_time_year)
  sales_over_time_year = [...sales_over_time_year].reverse()
  
  const weeklyChartData = formatChartData("weekly", sales_over_time_week)
  const yearlyChartData = formatChartData("yearly", sales_over_time_year)

  const fusionchartsWeekly = new FusionCharts(returnChartConfig("weekly", weeklyChartData));
  fusionchartsWeekly.render();

  const fusionchartsYearly = new FusionCharts(returnChartConfig("yearly", yearlyChartData));
  fusionchartsYearly.render();
});

document.addEventListener("DOMContentLoaded", loadContents);
