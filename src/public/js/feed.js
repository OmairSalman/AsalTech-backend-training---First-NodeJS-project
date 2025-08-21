(() => {
  async function handleLikeForm(form, button)
  {
    try
    {
      // 1. Build the request
      const url = form.action; // e.g. /posts/123/like
      const method = button.dataset.liked === "true" ? "delete" : "post";

      // 2. Send the AJAX request
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // 3. Handle errors
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 4. Parse JSON response
      const data = await response.json();

      // 5. Update the DOM based on server response
      let likeCount;
      if(form.dataset.postId)
        likeCount = document.getElementById(`like-count-${form.dataset.postId}`);
      else if(form.dataset.commentId)
        likeCount = document.getElementById(`like-count-${form.dataset.commentId}`);

      if (likeCount && typeof data.likeCount !== 'undefined')
      {
        likeCount.textContent = `${data.likeCount} ${data.likeCount === 1 ? 'like' : 'likes'}`;
      }

      // 6. Update button text based on liked/unliked
      if (data.liked)
      {
        button.textContent = "Unlike";
        button.dataset.liked = "true";
      }
      else
      {
        button.textContent = "Like";
        button.dataset.liked = "false";
      }

    }
    catch (err)
    {
      console.error("Error handling like:", err);
    }
}

async function handleAddComment(form)
{
  const postId = form.dataset.postId;
  const input = form.querySelector('input[name="content"]');
  const content = input.value.trim();
  if (!content) return;

  try
  {
    const res = await fetch(`/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (res.ok) {
      // Insert the server-rendered HTML
      const commentsSection = document.getElementById(`comments-${postId}`);
      commentsSection.insertAdjacentHTML('afterbegin', data.html);

      // Clear input
      input.value = '';
    } else {
      alert('Failed to add comment.');
    }

  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

  async function init() {
    // Make sure feed exists
    const feed = document.getElementById('feed-container');
    if (!feed) return;

    // ---- 1. Like buttons (posts + comments) ----
    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('button.like-btn');
      if (!btn) return;

      const form = btn.closest('form[action$="/like"]');
      if (!form) return;

      e.preventDefault();
      await handleLikeForm(form, btn);
      if(form.dataset.commentId)
      {
        /*console.log("Like button clicked for comment:", form.dataset.commentId);
        const likeCnt = document.getElementById(`like-count-${form.dataset.commentId}`);
        console.log("ID of like section for comment:",likeCnt.id);*/
      }
      else if(form.dataset.postId)
      {
        /*console.log("Like button clicked for post:", form.dataset.postId);
        const likeCnt = document.getElementById(`like-count-${form.dataset.postId}`);
        console.log("ID of like section for post:",likeCnt.id);*/
      }
      //console.log("Action: POST", form.getAttribute('action'));
      // For now, just log — we’ll implement AJAX later
    });

    // ---- 2. Comment forms ----
    document.body.addEventListener('submit', (e) => {
      const form = e.target.closest('form.comment-form');
      if (!form) return;

      e.preventDefault();
      handleAddComment(form);
      //console.log("Comment form submitted for post:", form.dataset.postId);
      //console.log("Action: POST", form.getAttribute('action'));
      // For now, just log — we’ll implement AJAX later
    });
  }

  // Run init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();