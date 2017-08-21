(function () {
  'use strict';

  var pubsub = new PubSub();
  var ADD_TO_CART = 'ADD_TO_CART';
  var REMOVE_FROM_CART = 'REMOVE_FROM_CART';
  var $phonesListEl = $('#phones-list');
  var $cartListEl = $('#cart-list');
  var $cartLengthEl = $('#cart-length');
  var phones = $.get('phones.json');
  var basket = [];
  var template = '';

  function phoneTemplate(data) {
    return (
      '<div class="col-lg-3 col-md-4 card rounded-0">' +
        '<div class="card-body">' +
          '<h4 class="card-title">' + data.name + '</h4>' +
          '<h6 class="card-subtitle mb-3 text-muted">' + data.carrier + '</h6>' +
          '<p class="card-text">' + data.snippet + '</p>' +
        '</div>' +
        '<div class="card-footer">' +
          '<a href="#" data-action="add-to-cart" data-phone-id="' + data.id + '" class="btn btn-sm d-block btn-primary">Add To Cart</a>' +
        '</div>' +
      '</div>'
    );
  }

  function cartListTemplate(data) {
    return (
      '<li class="list-group-item">' + data.name + ' <a href="#" class="text-danger" data-action="remove-from-cart" data-phone-id="' + data.id + '">Remove</a></li>'
    );
  }

  function populateCartList() {
    phones.then(function (res) {
      var template = '';
      basket.forEach(function (phoneId) {
        var phone = res.filter(function (item) {
          return item.id === phoneId;
        })[0];

        template += cartListTemplate(phone);
      });
      $cartListEl.html(template || '<li class="dropdown-item">No items added to cart</li>');
    });
  }

  function toggleButton($buttonEl) {
    if ($buttonEl.attr('data-action') === 'add-to-cart') {
      $buttonEl.attr('data-action', 'remove-from-cart').text('Remove From Cart').removeClass('btn-primary').addClass('btn-danger');
    } else {
      $buttonEl.attr('data-action', 'add-to-cart').text('Add To Cart').removeClass('btn-danger').addClass('btn-primary');
    }
  }

  function updateUI(phoneId) {
    toggleButton($('[data-phone-id="' + phoneId + '"]'));
    $cartLengthEl.text(basket.length);
    populateCartList();
  }

  phones.then(function (res) {
    res.forEach(function (phone) {
      template += phoneTemplate(phone);
    });
    $phonesListEl.html(template);
  });

  var addToCartUnsubscribe = pubsub.subscribe(ADD_TO_CART, function (data) {
    if (basket.indexOf(data.phoneId) === -1) {
      basket.push(data.phoneId);
      updateUI(data.phoneId);
    }
  });

  var removeFromCartUnsubscribe = pubsub.subscribe(REMOVE_FROM_CART, function (data) {
    var index = basket.indexOf(data.phoneId);
    if (index > -1) {
      basket.splice(index, 1);
      updateUI(data.phoneId);
    }
  });

  $('[data-toggle="tooltip"]').tooltip();

  $(document)
    .on('click', '[data-action="add-to-cart"]', function (event) {
      event.preventDefault();
      pubsub.publish(ADD_TO_CART, {
        phoneId: $(this).attr('data-phone-id')
      });
    })
    .on('click', '[data-action="remove-from-cart"]', function (event) {
      event.preventDefault();
      pubsub.publish(REMOVE_FROM_CART, {
        phoneId: $(this).attr('data-phone-id')
      });
    })
    .on('click', '[data-action="unsubscribe-add"]', function () {
      if (typeof pubsub.unsubscribe(addToCartUnsubscribe) === 'number') {
        $(this).prop('disabled', true);
      }
    })
    .on('click', '[data-action="unsubscribe-remove"]', function () {
      if (typeof pubsub.unsubscribe(removeFromCartUnsubscribe) === 'number') {
        $(this).prop('disabled', true);
      }
    })
    .on('click', '.dropdown-menu', function (event) {
      event.stopPropagation();
    });
}());
