document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.toggle-admin-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      const userId = btn.dataset.userid;
      try {
        const res = await fetch(`/users/${userId}/toggle-admin`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          location.reload();
        } else {
          alert(result.message || 'Failed to update admin status.');
        }
      } catch (err) {
        alert('Error updating admin status.');
      }
    });
  });

  document.querySelectorAll('.delete-user-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      const userId = btn.dataset.userid;
      if (!confirm("Are you sure you want to delete this user? This action cannot be undone, and will delete all the user's posts and comments permanently!")) return;
      try {
        const res = await fetch(`/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          location.reload();
        } else {
          alert(result.message || 'Failed to delete user.');
        }
      } catch (err) {
        alert('Error deleting user.');
      }
    });
  });
});