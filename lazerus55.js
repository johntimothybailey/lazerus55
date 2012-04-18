/*
Stephen Pond - 2012
jQuery Mobile fallback for IE5.5, 
polyfills for enhancing elements, checkboxes, disclosures, quantity inputs, etc...
*/
define(function() {
   polyfill1 = function() {
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
			rows = "";
			inputs.each(function(index, input) {
				rows += '<tr><td><input name="' + input.name + '" type="checkbox"/></td><td style="width=100%"><label>' + labels[index].innerHTML + '</label></td></tr>';
				$(input).hide();
				$(labels[index]).hide();
			});
			$(ct).html('<table class="checkbox">' + rows + '</table>')
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

	polyfill3 = function(el, state) {
		el = $(el);
		if (el.parent().find('#add').length === 0) {
			var ct = document.createElement('DIV');
			ct.innerHTML = '<input type="button" id="add" value="+" /><input id="qty" value="' + (el[0].value || 0) + '" /><input type="button"id="minus" value="-" /></div>';
			el[0].parentNode.insertBefore(ct, el[0]);
			el.hide();

			var children = $(ct).children(),
			child0 = $(children[0]),
			child1 = $(children[1]),
			child2 = $(children[2]),
			add = child0.button ? child0.button() : child0,
			qty = child1.textinput ? child1.textinput().addClass('qty-field') : child1.addClass('qty-field'),
			minus = child2.button ? child2.button() : child2;
			add.parent('div').addClass('qty-btn');
			minus.parent('div').addClass('qty-btn');

			add.click(function() {
				var currentVal = parseInt(qty.val());
				if (currentVal != NaN) {
					el.val(currentVal + 1);
					qty.val(currentVal + 1);
					//    qty.trigger('change');
				}
			});
			minus.click(function() {
				var currentVal = parseInt(qty.val());
				if (currentVal != NaN && currentVal > - 1) {
					el.val(currentVal - 1);
					qty.val(currentVal - 1);
					//  qty.trigger('change');
				}
			});
		}
		if (state) {
			el.parent().find('#add').button(state);
			el.parent().find('#minus').button(state);
			el.parent().find('#qty').textinput(state);
			return;
		}
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
			if (div.getAttribute('data-role') === 'controlgroup' && $(div).find('input').length > 1) return polyfill1(div);
			if (div.getAttribute('data-role') === 'collapsible') return polyfill2(div);
			if (div.getAttribute('data-role') === 'quantity') return polyfill3(div);
			if (div.getAttribute('data-role') === 'listview') return polyfill5(div);
		});
	};

	var returnable = {
		checkbox: polyfill1,
		disclosure: polyfill2,
		quantity: polyfill3,
		select: polyfill4,
		list: polyfill5,
		enhancePage: enhancePage
	};

	if (window.$) {
		window.$.mobile = returnable;
  }

  /// THE FOLLOWING CODE IS EXPERIMENTAL AND GLEAMED FROM THE JQUERY MOBILE PROJECT 1.0.1
  // (IF THIS IS A LEGAL PROBLEM, THEN WE WILL REMOVE)

  // References
  var $window   = $( window ),
      $document = $( window.document ),
      $mobile   = $.mobile,
      $startPage, $pageContainer;

  // trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
  $document.trigger( "mobileinit" );

  $document.ready(function(){
    var $pages = $("[data-role='page']");

    // define the first page
    $startPage = $mobile.firstPage = $pages.first();

    // define the PageContainer to use and add the appropriate class
    $mobile.pageContainer = $startPage.parent().addClass("ui-mobile-viewport");

    // dispatch the "pagecontainercreate" event
    $window.trigger("pagecontainercreate");
  });

  return retrurnable;
});