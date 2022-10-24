
const login = async() => {
  const username = document.querySelector("#username").value
  const password = document.querySelector("#password").value
  
  const data = {
    username: username,
    password: password,
  }

  const url = "https://freddy.codesubmit.io/login"
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  }).then(async(data) => {
    const res = await data.json()
    localStorage.setItem("access_token", res.access_token)
    localStorage.setItem("refresh_token", res.refresh_token)
    window.location.href = "../UserPages/Dashboard/dashboard.html";
  }).catch((error) => {
    console.log("error", error)
  })
}