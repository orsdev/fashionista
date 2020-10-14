const sgMail = require('@sendgrid/mail');

const formatMessage = (order, name) => {
  let totalPrice = 0;
  let html = `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
     .container-fluid {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto
        }

        .row {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px
      }

      .col-12{
        position: relative;
        width: 100%;
      }

      .table-responsive {
        display: block;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: -ms-autohiding-scrollbar
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 1rem;
          background-color: transparent
          }

          .table .thead-dark th {
            color: #fff;
            background-color: #212529;
            border-color: #32383e
            }

          .table td,
          .table th {
          padding: .75rem;
          vertical-align: top;
          border-top: 1px solid #dee2e6
          }

          .table thead th {
          vertical-align: bottom;
          border-bottom: 2px solid #dee2e6
          }

          .table tbody + tbody {
          border-top: 2px solid #dee2e6
          }

          .table .table {
          background-color: #fff
          }

          .table-sm td,
          .table-sm th {
          padding: .3rem
          }

          .table-bordered {
          border: 1px solid #dee2e6
          }

          .table-bordered thead td,
          .table-bordered thead th {
          border-bottom-width: 2px
          }


      h3 {
        font-size: 20px;
      }
      
      p {
        font-size: 17px;
      }

      .mt-3 {
        margin-top: 20px;
      }   

      .text-center {
        text-align: center;
        }

        .text-success {
          color: #28a745;
          }

    </style>
  </head>
  <body>
    <div class="container-fluid">
      <h3>Hey, ${name} </h3>
      <p>We have receive your order and will contact you as soon as your package is shipped.</p>
       <div class="row">
       <div class="col-12 text-center">
        <div class="table-responsive mt-3">
          <h3>Order Summary </h3>
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
              <tbody>`;

  for (let index = 0; index < order.length; index += 1) {
    const prod = order[index];
    totalPrice += (prod.product.price * prod.quantity);

    html += `<tr>
         <th scope="row">${index + 1}</th>
         <td>${prod.product.title}</td>
         <td>
         <span class="text-success font-weight-bold"> </span>$
         <span>${prod.product.price.toLocaleString()}</span>
         </td>
         <td>${prod.quantity}</td>
         <td> 
         <span class="text-success font-weight-bold">$</span>
         <span>${(prod.product.price * prod.quantity).toLocaleString()} </span>
         </td>
       </tr>
       `;
  }

  html += `</tbody>
          </thead>
        </table>
      </div>
      </div>
      </div>
  <div class="text-center mt-4">
    <h2 class="h2">Total Price: <span>$${totalPrice.toLocaleString()}</span></h2>
  </div>
    </div >
  </body >
</html >`;

  return html;
};

const sendOrderSuccessMessage = (order, email, name) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.STRIPE_EMAIL_ADDRESS,
    subject: 'Your Ordered Product Summary',
    html: formatMessage(order, name)
  };

  sgMail.send(msg)
    .then(() => { }, error => {
      if (error.response) {
        console.error(error.response.body);
      }
    });
};

module.exports = sendOrderSuccessMessage;
