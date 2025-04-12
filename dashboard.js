let cart = [];
let products = [
  { name: 'Product 1', price: 1000 },
  { name: 'Product 2', price: 1500 },
  { name: 'Product 3', price: 2000 },
  { name: 'Product 4', price: 2500 },
  { name: 'Product 5', price: 3000 },
  { name: 'Product 6', price: 3500 },
  { name: 'Product 7', price: 4000 },
  { name: 'Product 8', price: 4500 },
  { name: 'Product 9', price: 5000 },
  { name: 'Product 10', price: 5500 }
];

function displayProducts() {
  const productListDiv = document.getElementById('product-list');
  productListDiv.innerHTML = '';

  const productGrid = document.createElement('div');
  productGrid.classList.add('product-grid');

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-item');
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.price.toLocaleString()} so'm</p>
      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });

  productListDiv.appendChild(productGrid);
}

function addToCart(productName, productPrice) {
  cart.push({ product: productName, price: productPrice });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart-list');
  const totalElement = document.getElementById('total');
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.product} - ${item.price.toLocaleString()} so'm`;
    cartList.appendChild(li);
    total += item.price;
  });
  totalElement.textContent = `Total: ${total.toLocaleString()} so'm`;
}

function checkout() {
  alert('Checkout complete!');
  cart = [];
  updateCart();
}

document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const productName = document.getElementById('productName').value;
  let productPrice = parseFloat(document.getElementById('productPrice').value);

  if (productPrice > 0){
    products.push({ name: productName, price: productPrice });
    displayProducts(); 
    document.getElementById('productName').value = ''; 
    document.getElementById('productPrice').value = '';
    alert('Product added successfully!');
  }
  else{
    alert('Product can not be negativ');
  }
});

displayProducts();
