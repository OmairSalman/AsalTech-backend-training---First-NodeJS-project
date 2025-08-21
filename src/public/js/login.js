(() => {
  async function handleLogin(form) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    const formData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
        console.log(formData);
        const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });

        if (res.redirected)
        {
            window.location.href = res.url;
            return;
        }

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/feed?page=1';
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = data.error || 'Account doesn\'t exist, please register.';
      }
    } catch (err) {
      console.error('Login AJAX error:', err);
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Something went wrong. Please try again.';
    }
  }

  function init() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();