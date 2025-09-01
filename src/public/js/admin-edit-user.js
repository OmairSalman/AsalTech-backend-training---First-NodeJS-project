document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('admin-edit-user-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Password match check
    const warning = document.getElementById('password-warning');
    if (warning) warning.textContent = ""; // Clear previous warning

    if (data.newPassword || data.confirmPassword) {
      if (!data.newPassword || !data.confirmPassword) {
        if (warning) warning.textContent = 'Please fill out both password fields.';
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        if (warning) warning.textContent = 'New password and confirmation do not match.';
        return;
      }
    }

    // Send AJAX PUT request
    const userId = form.dataset.userid;
    try {
      const res = await fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (res.ok && result.success) {
        window.location.href = '/admin/users';
      } else {
        // Show error message in the warning label or as an alert
        if (warning && result.message) {
          warning.textContent = result.message;
        } else {
          alert(result.message || 'Failed to update user.');
        }
      }
    } catch (err) {
      if (warning) warning.textContent = 'Error updating user.';
      else alert('Error updating user.');
    }
  });
});