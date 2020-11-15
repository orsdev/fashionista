function validateForm() {
  const form = document.getElementById('edit-form');
  form.onsubmit = function (e) {
    let data = filterFormData($(this).serializeArray());

    emptyField(data);
    minDescription();
    isFileValid();

    if ($('.form-error').length === 0) {
      const submitBtn = document.querySelector(
        'button[data-id="loader"]'
      );
      const img = document.createElement('img');
      img.alt = 'Loader';
      img.className = 'button-loader';
      img.src = '/assets/img/loader.gif';

      // remove img loader
      if (submitBtn.firstElementChild) {
        submitBtn.firstElementChild.remove();
      }

      submitBtn.prepend(img);
      submitBtn.disabled = true;
      return true;
    } else {
      return false;
    }
  };
}

function emptyField(data) {
  data.forEach(function (val) {
    let input = document.querySelector(`#${val.name}`);
    let nextElement = input.nextElementSibling;

    if (!input.value && input.id === 'title') {
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter product title';
    } else {
      if (input.id === 'title') {
        nextElement.classList.remove('form-error');
        nextElement.textContent = '';
      }
    }

    if (!input.value && input.id === 'tag') {
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter a tag';
    } else {
      if (input.id === 'tag') {
        nextElement.classList.remove('form-error');
        nextElement.textContent = '';
      }
    }

    if (!input.value && input.id === 'price') {
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter product price';
    } else {
      if (input.id === 'price') {
        nextElement.classList.remove('form-error');
        nextElement.textContent = '';
      }
    }

    if (!input.value && input.id === 'description') {
      nextElement.classList.add('form-error');
      nextElement.textContent = 'Enter product description';
    } else {
      if (input.id === 'description') {
        nextElement.classList.remove('form-error');
        nextElement.textContent = '';
      }
    }
  });
}

function filterFormData(data) {
  const include = ['title', 'tag', 'price', 'description'];
  return data.filter(function (val) {
    return include.includes(val.name);
  });
}

function isFileValid() {
  const input = document.getElementById('productImage');
  let nextElement = input.nextElementSibling.nextElementSibling;

  if (input.files.length > 0) {
    if (/\/(png|jpe?g|svg|gif)/.test(input.files[0].type)) {
      nextElement.classList.remove('form-error');
      nextElement.textContent = '';
    } else {
      nextElement.classList.add('form-error');
      nextElement.textContent =
        'Only jpg or png file formats supported';
    }
  }
}

function minDescription() {
  const textarea = document.getElementById('description');
  let nextElement = textarea.nextElementSibling;

  if (textarea.value.length > 0) {
    if (textarea.value.length < 50) {
      nextElement.classList.add('form-error');
      nextElement.textContent =
        'Product description must be at least 50 characters in length.';
    } else {
      nextElement.classList.remove('form-error');
      nextElement.textContent = '';
    }
  }
}

validateForm();
