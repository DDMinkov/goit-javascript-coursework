// footer.js
const BASE_URL = "https://your-energy.b.goit.study/api";

const initSubscription = () => {
  const subscribeForm = document.querySelector('.subscribe-form');

  if (!subscribeForm) return; // Guard clause

  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // This PREVENTS the page from jumping/reloading

    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) return;

    try {
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Special handling for 409 Conflict
      if (response.status === 409) {
        alert("This email is already subscribed.");
        return;
      }

      if (!response.ok) {
        throw new Error("Server error");
      }

      alert("Subscription successful!");
      subscribeForm.reset();
    } catch (error) {
      console.error("Subscription Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubscription);
} else {
  initSubscription();
}