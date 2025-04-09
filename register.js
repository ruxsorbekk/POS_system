document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (password === confirmPassword) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      alert('Registration successful!');
      window.location.href = 'login.html'; 
    } else {
      alert('Passwords do not match, please try again.');
    }
  });
  