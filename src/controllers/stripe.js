const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderSuccessMessage = require('../mail/orderSuccessMessage');
const adminUserOrderSummary = require('../mail/adminUserOrder');

exports.getSuccessPage = async (req, res, next) => {
  const { session_id } = req.query;
  const { userEmail, fullName } = req.user;
  const { order } = req.order;

  // Redirect to order if session_id is missing
  if (!session_id) {
    return res.redirect('/order');
  };

  // Redirect to shop if order is empty
  if (!order.length) {
    return res.redirect('/shop');
  };

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customer = await stripe.paymentIntents.retrieve(session.payment_intent, {
      expand: ['payment_method'],
    });

    const getBillingAddress = customer.payment_method.billing_details.address
    const { line1, line2 } = getBillingAddress;
    let getAddress = line1 || line2;

    // Send Message to user
    orderSuccessMessage(order, userEmail, fullName.split(' ')[0]);

    // Send Order Summary to admin
    adminUserOrderSummary(order, fullName.split(' ')[0], getAddress);

    // Clear products in order cart
    req.order.deleteOrder(req, res)
      .then((response) => {
        return res.render('stripe/success', { pageTitle: 'FASHIONIT | ORDER SUCCESS' })
      })
      .catch((error) => {
        const errMessage = 'Failed to clear order cart. Please try again.';
        return flashError(req, res, errMessage, '/order');
      });

  } catch (e) {
    const error = new Error('Server Error(stripe).');
    return next(error);
  }
};

exports.getCancelPage = (req, res, next) => {
  return res.render('stripe/cancel', { pageTitle: 'FASHIONIT | ORDER Cancel' })
}

exports.createPayment = async (req, res) => {

  const orders = req.order.order.length && req.order.order;
  let productData = [];
  if (orders) {
    for (const key of orders) {
      productData.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: key.product.title
          },
          unit_amount: (key.product.price * 100)
        },
        quantity: key.quantity
      })
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.userEmail,
      payment_method_types: ['card'],
      line_items: productData,
      billing_address_collection: 'required',
      mode: 'payment',
      success_url: process.env.DOMAIN_URL + '/order-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.DOMAIN_URL + '/order-cancel'
    });

    res.json({ id: session.id });
  } catch (e) {
    res.json({ error: 'Error: An error occurred with your connection to Stripe' })
  }

};
