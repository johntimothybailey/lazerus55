/*
   Stephen Pond - 2012
   jQuery Mobile fallback for IE5.5,
   polyfills for enhancing elements, checkboxes, disclosures, quantity inputs, etc...
   */
define(function() {
    var polyfill1 = function() {
		  //TODO convert this to grid
		  var setupClickForCheckboxRow = function(tr) {
			  var td = tr.find('label').parent();
			  td.unbind('click');
			  td.click(function() {
				  var checkbox = tr.find('input')[0];
				  checkbox.checked = ! checkbox.checked;
			  });
		  },
		  enhanceInputsAndLabels = function(inputs, labels) {
			  var ct = document.createElement('DIV'),
			  rows = "",
			  clsLast,
			  totalInputs = inputs.length;
			  inputs.each(function(index, input) {
				  clsLast = (totalInputs == index + 1) ? 'class="last"': '';
				  rows += '<tr><td width="25" ' + clsLast + '><input name="' + input.name + '" type="checkbox"/></td><td ' + clsLast + '><label>' + labels[index].innerHTML + '</label></td></tr>';
				  $(input).hide();
				  $(labels[index]).hide();
			  });
			  $(ct).html('<table class="checkbox" cellpadding="0" cellspacing="0">' + rows + '</table>')
			  inputs[0].parentNode.insertBefore(ct, inputs[0]);
			  $(ct).find('tr').each(function(index, tr) {
				  setupClickForCheckboxRow($(tr));
			  });
		  },
  		addCheckboxToContainer = function(ct, value, label) {
  			var last = ct.find('tr:last'),
  			label = label || value;
  			if (last.length === 0) {
  				var table = ct.find('table'),
  				newTable = function() {
  					var table = document.createElement('TABLE');
  					table.className = "checkbox";
  					ct.get(0).appendChild(table);
  					return table;
  				},
  				table = table.length === 0 ? $(newTable()) : table,
  				trEl = table.get(0).insertRow(0),
  				cell1 = trEl.insertCell(0),
  				cell2 = trEl.insertCell(1);
  				cell1.innerHTML = '<input name="' + value + '" type="checkbox" />';
  				cell2.innerHTML = '<label>' + label + '</label>';
  				$(cell2).css('width', '100%');
  				setupClickForCheckboxRow($(trEl));
  			} else {
  				var clone = last.clone(false),
  				cloneEl = clone.get(0),
  				input = clone.find('input'),
  				labelObj = clone.find('label'),
  				inputEl = input.get(0);
  				inputEl.name = value;
  				inputEl.id = value;
  				labelObj.get(0).innerHTML = label;
  				last.get(0).parentNode.appendChild(cloneEl);
  				setupClickForCheckboxRow(last);
  				setupClickForCheckboxRow(clone);
  			}
  		};
  		if (arguments.length === 1) {
  			var ct = $(arguments[0]);
  			var inputs = ct.find('input');
  			var labels = ct.find('label');
  			return enhanceInputsAndLabels(inputs, labels);
  		}
  		return arguments[0].length > 1 ? enhanceInputsAndLabels(arguments[0], arguments[1]) : addCheckboxToContainer(arguments[0], arguments[1], arguments[2]);
  	},

  	polyfill2 = function(triggerEl, hideables) {
  		if (arguments.length === 1) {
  			hideables = $(triggerEl).children().slice(1);
  			triggerEl = $(triggerEl).children().first();
  		}
  		triggerEl.click(function() {
  			hideables.toggleClass('ie55hide');
  		});
  		hideables.toggleClass('ie55hide');
  	},
  
  	polyfill4 = function(select, pairs, handler) {
  		var transformUlToSelect = function(ul) {
  			var selectEl = document.createElement('SELECT');
  			selectEl.className = $(ul).attr('class');
  			selectEl.id = $(ul).attr('id');
  			ul.parentNode.insertBefore(selectEl, ul);
  
  			$(ul).remove();
  			return selectEl;
  		},
  		select = select.get(0),
  		select = select.tagName === 'UL' ? transformUlToSelect(select) : select,
  		options = select.options;
  
  		for (var i = 0; i < pairs.length; i++) {
  			options[i] = new Option(pairs[i].label, pairs[i].value);
  		}
  		select.onchange = handler;
  	},
  	polyfill5 = function(ul, pairs, handler) {
  		var ul = $(ul).get(0);
  		var pairs = pairs || [];
  		//TODO consider just switching css file at runtime instead of this
  		if (pairs.length === 0) {
  			$(ul).find('li').addClass('ie55-li');
  		} else {
  			for (var i = 0; i < pairs.length; i++) {
  				var a = document.createElement('a'),
  				jqA = $(a);
  				a.innerHTML = pairs[i].label;
  				jqA.val(pairs[i].value);
  				if (handler) jqA.click(handler);
  				ul.appendChild(a);
  			}
  		}
  	},
  	enhancePage = function() {
  	  $('body').find('ul,div').each(function(index, div) {
  		if (div.getAttribute('data-role') === 'controlgroup' && $(div).find('input').length > 0) return polyfill1(div);
  		if (div.getAttribute('data-role') === 'collapsible') return polyfill2(div);
  		if (div.getAttribute('data-role') === 'listview') return polyfill5(div);
  		//TODO need data-role=button
  	  });
        var event = $.Event( event );
        event.type = "create";
        $(document).trigger(event);
  	},

  returnable = {
    // A way to identify that Lazerus55 is being used as a $.mobile replacement. This is helpful if required is being used to load the jQuery Mobile.
    isLaz: true,
		checkbox: polyfill1,
		disclosure: polyfill2,
		list: polyfill5,
		enhancePage: enhancePage,
		//TODO 
		showPageLoadingMsg: $.noop
	};

	if (window.$) {
		window.$.mobile = returnable;
	}

	/// THE FOLLOWING CODE IS EXPERIMENTAL AND GLEAMED FROM THE JQUERY MOBILE PROJECT 1.0.1
	// (IF THIS IS A LEGAL PROBLEM, THEN WE WILL REMOVE)
	// References
	var $window = $(window),
	$document = $(window.document),
	$mobile = $.mobile,
	$startPage,
	$pageContainer;

	// trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
	$document.trigger("mobileinit");

	$document.ready(function() {
		var $pages = $("[data-role='page']");

		// define the first page
		$startPage = $mobile.firstPage = $pages.first();

		// define the PageContainer to use and add the appropriate class
		$mobile.pageContainer = $startPage.parent().addClass("ui-mobile-viewport");

		// dispatch the "pagecontainercreate" event
		$window.trigger("pagecontainercreate");
	});
	//TODO need to make jqMobile equivalent
	(function($) {
		$.fn.button = function(state) {
			if (state === 'disabled') this.get(0).setAttribute('disabled', state);
			else this.get(0).removeAttribute('disabled');
			return this;
			// Do your awesome plugin stuff here
		};
	})(jQuery);
	return returnable;
});