
console.log("test")




const purchase = document.getElementById("purchase");
const search = document.getElementById("search");
const info = document.getElementById("info");


purchase.onclick = ()=>{
  const id = document.getElementById("id").value;
  const cost = document.getElementById("cost").value;
  axios.post(`http://localhost:8083/order-server/purch`,{id:id,orderCost:cost}).then((res)=>{
  console.log(res.data)
})

}

search.onclick = ()=>{
  const topic = document.getElementById("topic").value;
  axios.get(`http://localhost:8083/catalog-server/search/${topic}`).then((res)=>{
  console.log(res.data)
})

}

info.onclick = ()=>{
  const id = document.getElementById("id").value;
  axios.get(`http://localhost:8083/catalog-server/info/${id}`).then((res)=>{
  console.log(res.data)
  })

}
