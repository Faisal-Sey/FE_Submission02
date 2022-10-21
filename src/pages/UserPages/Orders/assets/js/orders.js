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

const formatDate = (date) => {
  if (date) {
    const newDate = new Date(date);
    const monthStr = `${newDate}`.split(" ")[1];
    return monthStr + " " + newDate.getDate() + ", " + newDate.getFullYear();
  }

  return "Not specified";
};

const titleCase = (name) => {
  if (name) {
    name = name.toLowerCase();
    name = name.split(" ");
    for (var i = 0; i < name.length; i++) {
      name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
    }
    return name.join(" ");
  }
  return "";
};

const requestNewToken = async(token) => {
  const url = "https://freddy.codesubmit.io/refresh"
  post(url, {}, token, true).then(async(data) => {
    const res = await data.json()
    localStorage.setItem("access_token", res.access_token)
  }).catch(err => console.log(err))
}

const updateOrders = (data) => {
  const orders = document.querySelector("#orders_table")
  data?.forEach(elt => {
    const createTr = document.createElement("tr");
    const nameTd = document.createElement("td");
    nameTd.innerText = elt?.product?.name || "";
    const dateTd = document.createElement("td");
    dateTd.innerText = formatDate(elt?.created_at) || "";
    const priceTd = document.createElement("td");
    priceTd.innerText = elt?.product?.price || "";
    const statusTd = document.createElement("td");
    statusTd.innerText = titleCase(elt?.status) || "";
    statusTd.setAttribute("id", elt?.status)

    createTr.appendChild(nameTd);
    createTr.appendChild(dateTd);
    createTr.appendChild(priceTd);
    createTr.appendChild(statusTd);

    orders.appendChild(createTr);
  })
}

const applyChange = (url) => {
  const orders = document.querySelector("#orders_table")
  const tableHeaders = document.createElement("tr");
  const name = document.createElement("th");
  name.innerText = "Product Name";
  const date = document.createElement("th");
  date.innerText = "Date";
  const price = document.createElement("th");
  price.innerText = "Price";
  const status = document.createElement("th");
  status.innerText = "Status";

  tableHeaders.appendChild(name);
  tableHeaders.appendChild(date);
  tableHeaders.appendChild(price);
  tableHeaders.appendChild(status);

  orders.innerHTML = "";
  orders.appendChild(tableHeaders);

  const token = localStorage.getItem("access_token")
  const refreshToken = localStorage.getItem("refresh_token")

  requestNewToken(refreshToken)
  get(url, token, true).then(async(dataRec) => {
    const recData = await dataRec.json()
    updateOrders(recData?.orders)
  }).catch((err) => console.log(err))
}

const getPreviousPage = () => {
  let pageNumber = document.querySelector("#page_number").innerText;
  pageNumber = pageNumber.split(" ")
  const currentPage = pageNumber[1]
  const pagesNumber = pageNumber[3]

  if (parseInt(currentPage) - 1 === 1) {
    document.querySelector("#left_arrow").style.display = "none";
  } 

  if (parseInt(currentPage) - 1 > 1) {
    document.querySelector("#right_arrow").style.display = "block";
  }

  document.querySelector("#page_number").innerText = `Page ${parseInt(currentPage) - 1} of ${pagesNumber}`
  const url = `https://freddy.codesubmit.io/orders?page=${parseInt(currentPage) + 1}`
  applyChange(url)
}

const getNextPage = () => {
  let pageNumber = document.querySelector("#page_number").innerText;
  pageNumber = pageNumber.split(" ")
  const currentPage = pageNumber[1]
  const pagesNumber = pageNumber[3]

  if (parseInt(currentPage) + 1 === parseInt(pagesNumber)) {
    document.querySelector("#right_arrow").style.display = "none";
  } 

  if (parseInt(currentPage) + 1 > 1) {
    document.querySelector("#left_arrow").style.display = "block";
  }

  document.querySelector("#page_number").innerText = `Page ${parseInt(currentPage) + 1} of ${pagesNumber}`
  applyChange(parseInt(currentPage) + 1)
}

const searchName = () => {
  const searchInput = document.querySelector("#search_input").value;
  let pageNumber = document.querySelector("#page_number").innerText;
  pageNumber = pageNumber.split(" ")
  const currentPage = pageNumber[1]

  const url = `https://freddy.codesubmit.io/orders?page=${currentPage}&q=${searchInput}`
  applyChange(url)
}


async function loadContents() {
  document.querySelector("#left_arrow").style.display = "none";
  const url = "https://freddy.codesubmit.io/orders?page=1"
  const token = localStorage.getItem("access_token")
  const refreshToken = localStorage.getItem("refresh_token")

  requestNewToken(refreshToken)
  get(url, token, true).then(async(dataRec) => {
    const recData = await dataRec.json()
    updateOrders(recData?.orders)
    const pageNumber = document.querySelector("#page_number")
    const pagesNumber = Math.ceil(recData?.total / recData?.orders?.length)
    pageNumber.innerHTML = `Page 1 of ${pagesNumber}`
  }).catch((err) => console.log(err))
}

document.addEventListener("DOMContentLoaded", loadContents);
