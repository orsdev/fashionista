// A reference to Stripe.js initialized with your real test publishable API key.
const stripe = Stripe("pk_test_51HY4weLdDWfSLJV4ENHlmJnVcSSfqTLVK1SabL9QI96KJu67EhbiWLpK097bjJ6oikVOZyo0g6mq9ttVSPQ04pW500eDAQQmr4");


window.onload = function () {

  const csrfToken = document.getElementById('csrfToken');
  const data = {
    _csrf: csrfToken.value
  };

  const checkoutForm = document.getElementById('create-checkout');

  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    loading(true);

    // Create a new Checkout Session using the server-side endpoint you
    // created in step 3.
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        loading(false);
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          loading(false);
          document.querySelector(".stripe-error").classList.remove("d-none");
          document.querySelector(".stripe-error-text").textContent = `Error: An error occurred with your connection to Stripe`;
        }
      })
      .catch(function (error) {
        loading(false);
        document.querySelector(".stripe-error").classList.remove("d-none");
        document.querySelector(".stripe-error-text").textContent = `Error: An error occurred with your connection to Stripe`;
      });
  });

  // Show a spinner on payment submission
  const loading = function (isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.getElementById("pay").disabled = true;
      document.getElementById("spinner").classList.remove("hidden");
    } else {
      document.getElementById("pay").disabled = false;
      document.getElementById("spinner").classList.add("hidden");
    }
  };
};