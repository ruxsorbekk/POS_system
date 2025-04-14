
const products = [
  { id: 1, name: "Rice", price: 25000, category: "groceries", image: "https://via.placeholder.com/150?text=Rice" },
  { id: 2, name: "Bread", price: 10000, category: "bakery", image: "https://via.placeholder.com/150?text=Bread" },
  { id: 3, name: "Milk", price: 15000, category: "dairy", image: "https://via.placeholder.com/150?text=Milk" },
  { id: 4, name: "Eggs", price: 20000, category: "groceries", image: "https://via.placeholder.com/150?text=Eggs" },
  { id: 5, name: "Apples", price: 12000, category: "produce", image: "https://via.placeholder.com/150?text=Apples" },
  {
    id: 6,
    name: "Chicken",
    price: 35000,
    category: "groceries",
    image: "https://via.placeholder.com/150?text=Chicken",
  },
  { id: 7, name: "Yogurt", price: 8000, category: "dairy", image: "https://via.placeholder.com/150?text=Yogurt" },
  { id: 8, name: "Coffee", price: 30000, category: "beverages", image: "https://via.placeholder.com/150?text=Coffee" },
  { id: 9, name: "Pasta", price: 18000, category: "groceries", image: "https://via.placeholder.com/150?text=Pasta" },
  {
    id: 10,
    name: "Tomatoes",
    price: 9000,
    category: "produce",
    image: "https://via.placeholder.com/150?text=Tomatoes",
  },
  { id: 11, name: "Soda", price: 7000, category: "beverages", image: "https://via.placeholder.com/150?text=Soda" },
  { id: 12, name: "Cake", price: 40000, category: "bakery", image: "https://via.placeholder.com/150?text=Cake" },
]


let cart = []
let selectedPaymentMethod = ""


let currentPage = 1
const itemsPerPage = 10
let totalPages = 1


const productListEl = document.getElementById("product-list")
const cartListEl = document.getElementById("cart-list")
const emptyCartMessageEl = document.getElementById("empty-cart-message")
const subtotalEl = document.getElementById("subtotal")
const taxEl = document.getElementById("tax")
const totalEl = document.getElementById("total")
const modalSubtotalEl = document.getElementById("modal-subtotal")
const modalTaxEl = document.getElementById("modal-tax")
const modalTotalEl = document.getElementById("modal-total")
const checkoutModal = document.getElementById("checkout-modal")
const receiptModal = document.getElementById("receipt-modal")
const searchInput = document.getElementById("search-products")
const categoryTabs = document.querySelectorAll(".category-tab")


const user = JSON.parse(localStorage.getItem("user"))
document.getElementById("username-display").textContent = user?.username || "User"


document.getElementById("exit-btn").addEventListener("click", () => {
  window.location.href = "login.html"
})


function displayProducts(category = "all", searchTerm = "") {
  productListEl.innerHTML = ""

  let filteredProducts = products

  
  if (category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(term))
  }

  
  totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  
  if (currentPage > totalPages) {
    currentPage = Math.max(1, totalPages)
  }

  
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  
  paginatedProducts.forEach((product) => {
    const productEl = document.createElement("div")
    productEl.className = "product-item"
    productEl.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price.toLocaleString()} so'm</div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `
    productListEl.appendChild(productEl)
  })

  
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.getAttribute("data-id"))
      addToCart(productId)
    })
  })

  
  updatePaginationControls(filteredProducts.length)
}


function updatePaginationControls(totalItems) {
  const paginationNumbers = document.getElementById("pagination-numbers")
  const prevButton = document.getElementById("prev-page")
  const nextButton = document.getElementById("next-page")

  
  paginationNumbers.innerHTML = ""

  
  document.querySelector(".pagination-controls").style.display = "flex"

  
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `page-number ${i === currentPage ? "active" : ""}`
    pageButton.textContent = i
    pageButton.addEventListener("click", () => {
      currentPage = i
      const activeCategory = document.querySelector(".category-tab.active").getAttribute("data-category")
      displayProducts(activeCategory, document.getElementById("search-products").value)
    })
    paginationNumbers.appendChild(pageButton)
  }

  
  prevButton.disabled = currentPage === 1
  nextButton.disabled = currentPage === totalPages
}


function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--
    const activeCategory = document.querySelector(".category-tab.active").getAttribute("data-category")
    displayProducts(activeCategory, document.getElementById("search-products").value)
  }
}


function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++
    const activeCategory = document.querySelector(".category-tab.active").getAttribute("data-category")
    displayProducts(activeCategory, document.getElementById("search-products").value)
  }
}


function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.product.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      product: product,
      quantity: 1,
    })
  }

  updateCart()
}


function updateCart() {
  if (cart.length === 0) {
    emptyCartMessageEl.style.display = "block"
    cartListEl.innerHTML = ""
  } else {
    emptyCartMessageEl.style.display = "none"
    cartListEl.innerHTML = ""

    cart.forEach((item) => {
      const li = document.createElement("li")
      li.className = "cart-item"
      li.innerHTML = `
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">${item.product.price.toLocaleString()} so'm</div>
        </div>
        <div class="cart-item-actions">
          <button class="quantity-btn decrease" data-id="${item.product.id}">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.product.id}">+</button>
          <button class="remove-item" data-id="${item.product.id}">
            <i class="material-icons">delete</i>
          </button>
        </div>
      `
      cartListEl.appendChild(li)
    })

    
    document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        updateQuantity(productId, -1)
      })
    })

    document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        updateQuantity(productId, 1)
      })
    })

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        removeFromCart(productId)
      })
    })
  }

  updateTotals()
}


function updateQuantity(productId, change) {
  const cartItem = cart.find((item) => item.product.id === productId)
  if (!cartItem) return

  cartItem.quantity += change

  if (cartItem.quantity <= 0) {
    removeFromCart(productId)
  } else {
    updateCart()
  }
}


function removeFromCart(productId) {
  cart = cart.filter((item) => item.product.id !== productId)
  updateCart()
}


function clearCart() {
  cart = []
  updateCart()
}


function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  subtotalEl.textContent = `${subtotal.toLocaleString()} so'm`
  taxEl.textContent = `${Math.round(tax).toLocaleString()} so'm`
  totalEl.textContent = `${Math.round(total).toLocaleString()} so'm`

  
  modalSubtotalEl.textContent = `${subtotal.toLocaleString()} so'm`
  modalTaxEl.textContent = `${Math.round(tax).toLocaleString()} so'm`
  modalTotalEl.textContent = `${Math.round(total).toLocaleString()} so'm`
}


function openCheckoutModal() {
  if (cart.length === 0) return

  checkoutModal.style.display = "flex"
  selectedPaymentMethod = ""

  
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.classList.remove("selected")
  })
}


function closeModal(modal) {
  modal.style.display = "none"
}


function generateReceipt() {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  
  document.getElementById("transaction-id").textContent = `TRX${Date.now()}`
  document.getElementById("transaction-date").textContent = new Date().toLocaleString()
  document.getElementById("payment-method").textContent = selectedPaymentMethod

  
  document.getElementById("receipt-subtotal").textContent = `${subtotal.toLocaleString()} so'm`
  document.getElementById("receipt-tax").textContent = `${Math.round(tax).toLocaleString()} so'm`
  document.getElementById("receipt-total").textContent = `${Math.round(total).toLocaleString()} so'm`

  
  const receiptItemsList = document.getElementById("receipt-items-list")
  receiptItemsList.innerHTML = ""

  cart.forEach((item) => {
    const tr = document.createElement("tr")
    const itemTotal = item.product.price * item.quantity

    tr.innerHTML = `
      <td>${item.product.name}</td>
      <td>${item.quantity}</td>
      <td>${item.product.price.toLocaleString()} so'm</td>
      <td>${itemTotal.toLocaleString()} so'm</td>
    `

    receiptItemsList.appendChild(tr)
  })

  
  closeModal(checkoutModal)
  receiptModal.style.display = "flex"
}


function completePurchase() {
  if (!selectedPaymentMethod) {
    alert("Please select a payment method")
    return
  }

  generateReceipt()
  clearCart()
}


document.getElementById("addProductForm").addEventListener("submit", (event) => {
  event.preventDefault()

  const name = document.getElementById("productName").value
  const price = Number.parseInt(document.getElementById("productPrice").value)
  const category = document.getElementById("productCategory").value

  if (!name || !price || price <= 0) {
    alert("Please enter valid product details")
    return
  }

  const newProduct = {
    id: Date.now(),
    name: name,
    price: price,
    category: category,
    image: `https://via.placeholder.com/150?text=${encodeURIComponent(name)}`,
  }

  products.push(newProduct)

  
  document.getElementById("productName").value = ""
  document.getElementById("productPrice").value = ""

  
  currentPage = 1
  const activeCategory = document.querySelector(".category-tab.active").getAttribute("data-category")
  displayProducts(activeCategory, searchInput.value)

  alert("Product added successfully!")
})


searchInput.addEventListener("input", function () {
  currentPage = 1 
  const activeCategory = document.querySelector(".category-tab.active").getAttribute("data-category")
  displayProducts(activeCategory, this.value)
})


categoryTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    
    categoryTabs.forEach((t) => t.classList.remove("active"))

    
    this.classList.add("active")

    
    currentPage = 1

    
    const category = this.getAttribute("data-category")
    displayProducts(category, searchInput.value)
  })
})


document.querySelectorAll(".close-modal").forEach((button) => {
  button.addEventListener("click", function () {
    const modal = this.closest(".modal")
    closeModal(modal)
  })
})

document.getElementById("cancel-payment").addEventListener("click", () => {
  closeModal(checkoutModal)
})

document.getElementById("confirm-payment").addEventListener("click", completePurchase)

document.getElementById("close-receipt").addEventListener("click", () => {
  closeModal(receiptModal)
})

document.getElementById("print-receipt").addEventListener("click", () => {
  window.print()
})


document.querySelectorAll(".payment-method").forEach((method) => {
  method.addEventListener("click", function () {
    
    document.querySelectorAll(".payment-method").forEach((m) => {
      m.classList.remove("selected")
    })

    
    this.classList.add("selected")

    
    selectedPaymentMethod = this.getAttribute("data-method") === "cash" ? "Cash" : "Credit Card"
  })
})


document.getElementById("prev-page").addEventListener("click", goToPrevPage)
document.getElementById("next-page").addEventListener("click", goToNextPage)


document.getElementById("checkout-btn").addEventListener("click", openCheckoutModal)
document.getElementById("clear-cart").addEventListener("click", clearCart)


displayProducts()
updateCart()


const paginationControls = document.getElementById("pagination-controls")
