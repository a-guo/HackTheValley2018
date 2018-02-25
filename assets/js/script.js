var $body = $('body');

var $animContainer = $('.animation-container');
var value = 0;
var transitionEnd = 'webkitTransitionEnd transitionend';

var API_URL = "http://feedmee.azurewebsites.net";

var userName;

function formatName(name) {
    var hyphen = name.indexOf('-');
    if (hyphen > -1) {
      name = name.slice(0, hyphen);
    }
    if (name.endsWith(' ')) {
      name = name.slice(0, -1);
    }
    return name;
}

function populateQuestion(data) {
  var name = formatName(data['name']);
  var ratings = data['rating'];
  var cuisinesList = data['cuisines'];
  var logo_url = data['logo_url'];
  var cuisines = "";
  for (cuisine of cuisinesList) {
    cuisines += cuisine + ", ";
  }

  if (cuisines.endsWith(', ')) {
    cuisines = cuisines.slice(0, -2);
  }
  var price = data['price'];
  var distance = data['distance'];

  // populating html fields
  $('#placeholderName').text(name);
  $('#placeholderRating').text('Rating: ' + ratings);
  $('#placeholderCuisine').text(cuisines);
  $('#placeholderPrice').text('$' + price);
  $('#placeholderDistance').text(distance + ' km');
  $("#placeholderImage").attr("src", logo_url);

}

function populateRecommendations(recommendations) {
  for (x in recommendations) {
    var restaurant = recommendations[x];

    var name = formatName(restaurant['name']);
    var ratings = restaurant['rating'];
    var cuisinesList = restaurant['cuisines'];
    var logo_url = restaurant['logo_url'];
    var cuisines = "";
    for (cuisine of cuisinesList) {
      cuisines += cuisine + ", ";
    }

    if (cuisines.endsWith(', ')) {
      cuisines = cuisines.slice(0, -2);
    }
    var price = restaurant['price'];
    var distance = restaurant['distance'];
    console.log(name);
    console.log(ratings);
    console.log(cuisines);
    console.log(price);
    console.log(distance);

    // populating html fields
    $('#' + x + 'Name').text(name);
    $('#' + x + 'Rating').text('Rating: ' + ratings);
    $('#' + x + 'Cuisine').text(cuisines);
    $('#' + x + 'Price').text('$' + price);
    $('#' + x + 'Distance').text(distance + ' km');
    $('#' + x + 'Image').attr("src", logo_url);

    if (x == 0) {
      var a = "final";
      $('#' + a + 'Name').text(name);
      $('#' + a + 'Rating').text('Rating: ' + ratings);
      $('#' + a + 'Cuisine').text(cuisines);
      $('#' + a + 'Price').text('$' + price);
      $('#' + a + 'Distance').text(distance + ' km');
      $('#' + a + 'Image').attr("src", logo_url);
    }
  }
}

$(document).ready(function() {
  $('.userNamePage').hide();
  $('.categoryChoice').hide();
  $('.cuisineChoice').hide();
  $('.priceRangeChoice').hide();
  $('.restaurantRecommendations').hide();
  $('.listOfRecommends').hide();
  $('.lastPage').hide();

  $('.homePage').on('click', function() {
    $('.homePage').hide();
    $('.userNamePage').show();
  });

  $('.userContinueBtn').on('click', function(e) {
    e.preventDefault();
    userName = $('#userName').val();

    $.get(
      API_URL + '/login/' + userName,
      {},
      function(data) {
        $('.userNamePage').hide();
        $('.categoryChoice').show();
        console.log('login: ', data);
      }
    )
  });

  $('.categoryBtn').on('click', function(e) {
    e.preventDefault();
    var category = $('input[name=category]:checked').val();

    $.get(
      API_URL + '/category/' + userName + '/' + category,
      {},
      function(data) {
        $('.categoryChoice').hide();
        $('.cuisineChoice').show();
        console.log('category: ', data)
      }
    )
  });

  $('.cuisineBtn').on('click', function(e) {
    e.preventDefault();
    var cuisine = "";
    $('#cuisineDiv1').children('input').each(function () {
      if (this.checked) {
        cuisine += this.getAttribute('value') + ",";
      }
    });

    $('#cuisineDiv2').children('input').each(function () {
      if (this.checked) {
        cuisine += this.getAttribute('value') + ",";
      }
    });

    if (cuisine.endsWith(',')) {
      cuisine = cuisine.slice(0, -1);
    }

    if (cuisine.length < 1) {
      cuisine = '_';
    }

    $.get(
      API_URL + '/cuisines/' + userName + '/' + cuisine,
      {},
      function(data) {
        $('.cuisineChoice').hide();
        $('.priceRangeChoice').show();
        console.log('cuisinse: ', data)
      }
    )
  });

  $('.priceRangeBtn').on('click', function(e) {
    e.preventDefault();
    var price_map = {
        'Inexpensive': {
          'min': '0',
          'max': '25'
        },
        'Moderate': {
          'min': '25',
          'max': '50'
        },
        'Lavish': {
          'min': '50',
          'max': '100'
        }
    }
    var price = $('input[name=priceRange]:checked').val();
    var price_range = price_map[price];
    $.get(
      API_URL + '/price/' + userName + '/' + price_range['min'] + '/' + price_range['max'],
      {},
      function(data) {
        populateQuestion(data['question']);
        $('.priceRangeChoice').hide();
        $('.restaurantRecommendations').show();
        console.log('price: ', data)
      }
    )
  });

  $('.no').on('click', function(e) {
    e.preventDefault();
    $.get(
      API_URL + '/answer/' + userName + '/no',
      {},
      function(data) {
        populateQuestion(data['question']);
        console.log('answer no: ', data);
      }
    )
  });

  $('.yes').on('click', function(e) {
    e.preventDefault();
    $.get(
      API_URL + '/answer/' + userName + '/yes',
      {},
      function(data) {
        populateRecommendations(data['recommendations']);
        console.log('answer yes: ', data);
      }
    )
    $('.restaurantRecommendations').hide();
    $('.lastPage').show();
  });

  $('.more').on('click', function(e) {
    e.preventDefault();
    formReset();
    $('.lastPage').hide();
    $('.listOfRecommends').show();
  });



})
/** click homePage div and then move to first form */

/**
 * Resets the form back to the default state.
 * ==========================================
 */
function formReset() {
	value = 0;
	//$progressBar.val(value);
	$('form input').not('button').val('').removeClass('hasInput');
	$('.js-form-step').removeClass('left leaving');
	$('.js-form-step').not('.js-form-step[data-step="1"]').addClass('hidden waiting');
	$('.js-form-step[data-step="1"]').removeClass('hidden');
	$('.form-progress-indicator').not('.one').removeClass('active');

	$animContainer.css({
		'paddingBottom': $('.js-form-step[data-step="1"]').height() + 'px'
	});

	console.warn('Form reset.');
	return false;
}

/**
 * Sets up the click handlers on the form. Next/reset.
 * ===================================================
 */
function setupClickHandlers() {

	// Show next form on continue click
	$('button[type="submit"]').on('click', function(event) {
			event.preventDefault();
			var $currentForm = $(this).parents('.js-form-step');
			showNextForm($currentForm);
	});

	// Reset form on reset button click
	$('.js-reset').on('click', function() {
		formReset();
	});

	return false;
}

/**
 * Shows the next form.
 * @param - Node - The current form.
 * ======================================
 */
function showNextForm($currentForm) {
	var currentFormStep = parseInt($currentForm.attr('data-step')) || false;
	var $nextForm = $('.js-form-step[data-step="' + (currentFormStep + 1) + '"]');

	console.log('Current step is ' + currentFormStep);
	console.log('The next form is # ' + $nextForm.attr('data-step'));

	$body.addClass('freeze');

	// Ensure top of form is in view
	$('html, body').animate({
		scrollTop : $progressBar.offset().top
	}, 'fast');

	// Hide current form fields
	$currentForm.addClass('leaving');
	setTimeout(function() {
		$currentForm.addClass('hidden');
	}, 500);

	// Animate container to height of form
	$animContainer.css({
		'paddingBottom' : $nextForm.height() + 'px'
	});

	// Show next form fields
	$nextForm.removeClass('hidden')
					 .addClass('coming')
					 .one(transitionEnd, function() {
						 $nextForm.removeClass('coming waiting');
					 });

	// Increment value (based on 4 steps 0 - 100)
	value += 33;

	// Reset if we've reached the end
	if (value >= 100000) {
		formReset();
	} else {
		$('.form-progress')
			.find('.form-progress-indicator.active')
			.next('.form-progress-indicator')
			.addClass('active');

		// Set progress bar to the next value
		$progressBar.val(value);
	}

	// Update hidden progress descriptor (for a11y)
	$('.js-form-progress-completion').html($progressBar.val() + '% complete');

	$body.removeClass('freeze');

	return false;
}

/**
 * Sets up and handles the float labels on the inputs.
 =====================================================
 */
function setupFloatLabels() {
	// Check the inputs to see if we should keep the label floating or not
	$('form input').not('button').on('blur', function() {

		// Different validation for different inputs
		switch (this.tagName) {
			case 'SELECT':
				if (this.value > 0) {
					this.className = 'hasInput';
				} else {
					this.className = '';
				}
				break;

			case 'INPUT':
				if (this.value !== '') {
					this.className = 'hasInput';
				} else {
					this.className = '';
				}
				break;

			default:
				break;
		}
	});

	return false;
}

/**
 * Gets the party started.
 * =======================
 */
function init() {
	formReset();
	setupFloatLabels();
	setupClickHandlers();
}

init();
