// A reference to Stripe.js initialized with your real test publishable API key.
var stripe = Stripe("pk_test_51HY4weLdDWfSLJV4ENHlmJnVcSSfqTLVK1SabL9QI96KJu67EhbiWLpK097bjJ6oikVOZyo0g6mq9ttVSPQ04pW500eDAQQmr4");

const csrfToken = document.getElementById('csrfToken');
document.querySelector("button").disabled = true;

const data = {
  _csrf: csrfToken.value
};

window.onload = function () {

  fetch("/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(function (result) {
    return result.json();
  }).then(function (data) {
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");
    card.on("change", function (event) {

      // Disable the Pay button if there are no card details in the Element
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });
    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);
    });
  });

}

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
const payWithCard = function (stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function (result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      }
      else {
        // The payment succeeded!
        orderComplete(result.paymentIntent.id);

        console.log(result.paymentIntent.id);

        // If successfull, clear order 
        fetch("/delete-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }).then(function (result) {
          window.location.reload();
          console.log(result);
        }).catch(function (error) {
          window.location.reload();
        })

      }
    });
};
/* ------- UI helpers ------- */
// Shows a success message when the payment is complete
const orderComplete = function (paymentIntentId) {
  loading(false);
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};
// Show the customer the error from Stripe if their card fails to charge
const showError = function (errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = "";
  }, 4000);
};
// Show a spinner on payment submission
const loading = function (isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
