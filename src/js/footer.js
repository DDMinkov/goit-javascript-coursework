// footer.js
const BASE_URL = "https://your-energy.b.goit.study/api";

const initSubscription = () => {
  const subscribeForm = document.querySelector('.subscribe-form');
  if (!subscribeForm) return;

  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    // ОБОВ'ЯЗКОВА ВАЛІДАЦІЯ ЗА КРИТЕРІЯМИ
    const emailRegex = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address."); // Або красивий toast
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status === 409) {
        alert("This email is already subscribed."); // Повідомлення про помилку
        return;
      }

      if (!response.ok) throw new Error("Server error");

      alert("Subscription successful!"); // Підтвердження підписки
      subscribeForm.reset();
    } catch (error) {
      alert(error.message); // Вивід помилки
    }
  });
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubscription);
} else {
  initSubscription();
}