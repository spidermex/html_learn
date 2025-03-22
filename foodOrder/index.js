import { menuArray } from "./data.js"

// DOM important objects
const menuContainer = document.getElementById("menu-container")
const orderRows = document.getElementById("order-rows")
const orderDetail = document.getElementById("order-detail")
const orderSum = document.getElementById("order-sum")

//const orderArray =[{id: 0, name: "Pizza",price: 14},{id: 2, name: "Beer",price: 10}]
const orderArray = []

// Event Listeners
document.addEventListener("click", function (e) {
    // console.log(e.target)
    if (e.target.dataset.add) {
        addOrderItem(e.target.dataset.add)
    } else
        if (e.target.dataset.remove) {
            removeOrderItem(e.target.dataset.remove)
        } else
            if (e.target.id === "order-btn") {
                document.getElementById('modal01').style.display = 'block'
            } else
                if (e.target.id === "modal-pay") {
                    e.preventDefault()
                    finishOrder()
                }
})

function finishOrder() {
    document.getElementById("order-thanks").textContent = `Thanks, ${document.querySelector('input[name="Full Name"]').value}
    . Your order is on its way!`
    document.getElementById('modal01').style.display = 'none'
    orderArray.splice(0, orderArray.length)
    renderOrder()
    document.getElementById("the-footer").style.display = "block"
    window.setTimeout(function() {
        window.location.reload();
    }, 5000); // 5000 milliseconds = 5 seconds
    
}

function removeOrderItem(id) {
    const index = orderArray.findIndex(item => item.id == id)
    if (index !== -1) {
        if (confirm("Are you sure to remove item(s)?")) {
            orderArray.splice(index, 1)
            renderOrder()
        }
    }
}

function addOrderItem(id) {
    const orderCheck = orderArray.find(item => item.id == id)
    if (orderCheck) {
        orderCheck.qty++
        orderCheck.total = orderCheck.qty * orderCheck.price
    } else {
        const targetObj = menuArray.filter(item => item.id == id)[0]
        targetObj.qty = 1
        targetObj.total = targetObj.price
        orderArray.push(targetObj)
    }
    renderOrder();
}

function renderProducts() {
    let menuHTML = ``
    menuArray.forEach(item => {
        menuHTML += `
        <section class="food-item-grid">
            <p class="food-photo">${item.emoji}</p>
            <h2 class="food-name">${item.name}</h2>
            <p class="food-desc">${item.ingredients.join(', ')}</p>
            <p class="food-price">Price: $${item.price}</p>
            <button class="btn-add" type="button" data-add=${item.id}>+</button>
        </section>`
    });
    menuContainer.innerHTML = menuHTML
}

function renderOrder() {
    let orderHtml = ``
    let orderTotal = 0
    if (orderArray.length > 0) {
        document.getElementById("the-footer").style.display = "none"
        orderDetail.style.display = "block"
        orderArray.forEach(item => {
            orderHtml += `
            <div class="order-row">
            <p class="order-item"> 
            <span class="item-qty">${item.qty}</span>
            ${item.name}
                <span class="remove-item">
                    <button class="remove-item-btn" type="button" data-remove="${item.id}">
                    remove
                    </button>
                </span>
            </p>
            <p class="item-price"> $ ${item.total}</p>
            </div>`
            orderTotal += item.total
        })
    } else {
        orderDetail.style.display = "none"
    }
    orderRows.innerHTML = orderHtml
    orderSum.textContent = `$ ${orderTotal}`
}

renderProducts()
renderOrder()