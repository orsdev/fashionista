function validateForm() {
  const form = document.getElementById('signup-form');
  form.onsubmit = function (e) {
    let data = removeCsrfToken($(this).serializeArray());

    emptyField(data);
    validateEmail();

    if ($('.form-error').length === 0) {
      const submitBtn = document.querySelector('button[data-id="loader"]');
      const img = document.createElement('img');
      img.alt = 'Loader';
      img.className = 'button-loader';
      img.src = '/assets/img/loader.gif';

      submitBtn.prepend(img);
      return true;
    } else {
      return false;
    }

  };
};

function removeCsrfToken(data) {
  return data.filter(function (val) {
    return val.name !== '_csrf';
  });
};

function emptyField(data) {
  data.forEach(function (val) {
    let input = document.querySelector(`#${val.name}`);

    if (!input.value && input.id === 'fullName') {
      let nextElement = input.nextElementSibling;
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter your full name';
    } else {
      if (input.id === 'fullName') {
        let nextElement = input.nextElementSibling;
        nextElement.classList.remove('form-error');
        nextElement.textContent = "";
      }
    }

    if (!input.value && input.id === 'userEmail') {
      let nextElement = input.nextElementSibling;
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter your email';
    } else {
      if (input.id === 'userEmail') {
        let nextElement = input.nextElementSibling;
        nextElement.classList.remove('form-error');
        nextElement.textContent = "";
      }
    }

    if (!input.value && input.id === 'userPassword') {
      let nextElement = input.nextElementSibling;
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter your password';
    } else {
      if (input.id === 'userPassword') {
        let nextElement = input.nextElementSibling;
        nextElement.classList.remove('form-error');
        nextElement.textContent = "";
      }
    }
  });
};

function validateEmail() {
  let input = document.getElementById('userEmail');
  let nextElement = input.nextElementSibling;

  const regex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

  if (input.value) {
    if (!regex.test(input.value)) {
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter a valid email';
    } else {
      nextElement.classList.remove('form-error');
      nextElement.textContent = "";
    }
  };

};

validateForm();