tephen Pond - 2012
jQuery Mobile fallback for IE5.5, 
       polyfills for enhancing elements, checkboxes, disclosures, quantity inputs, etc...
       */

       define(function() {
             var polyfill1 = function(inputs, labels) {
                           var ct = document.createElement('DIV'),
                       rows = "";

                   inputs.each(function(index, input) {
                                     rows += '<tr><td><input name="' + input.name + '" type="checkbox" /></td><td style="width=100%"><label>' + labels[index].innerHTML + '</label></td></tr>';
                                                     $(input).hide();
                                                                     $(labels[index]).hide();
                                                                                 });
                               $(ct).html('<table class="checkbox">' + rows + '</table>')
                     inputs[0].parentNode.insertBefore(ct, inputs[0]);
                   $(ct).find('tr').each(function(index, tr) {
                                     tr = $(tr);
                                                     tr.find('label').parent().click(function() {
                                                                           var checkbox = tr.find('input')[0];
                                                                                               checkbox.checked = !checkbox.checked;

                                                                                                               });
                                                                 });
                           },
                     polyfill2 = function(triggerEl, hideables) {
                                   triggerEl.click(function() {
                                                     hideables.toggleClass('ie55hide');
                                                                 });
                                               hideables.toggleClass('ie55hide');

                                                       },
                             polyfill3 = function(el) {
                                           var ct = document.createElement('DIV');
                                                       ct.innerHTML = '<input type="button" id="add" value="+" /><input type="text" id="qty" value="0" /><input type="button"id="minus" value="-" /></div>';
                                                                   el[0].parentNode.insertBefore(ct, el[0]);
                                                                               el.hide();

                                                                                           var children = $(ct).children(),
                                                                                                               add = $(children[0]),
                                                                                                                               qty = $(children[1]),
                                                                                                                                               minus = $(children[2]);

                                                                                                       add.click(function() {
                                                                                                                         var currentVal = parseInt(qty.val());
                                                                                                                                         if (currentVal != NaN) {
                                                                                                                                                               el.val(currentVal + 1);
                                                                                                                                                                                   qty.val(currentVal + 1);
                                                                                                                                                                                                   }
                                                                                                                                                     });
                                                                                                                   minus.click(function() {
                                                                                                                                     var currentVal = parseInt(qty.val());
                                                                                                                                                     if (currentVal != NaN && currentVal > -1) {
                                                                                                                                                                           el.val(currentVal - 1);
                                                                                                                                                                                               qty.val(currentVal - 1);
                                                                                                                                                                                                               }
                                                                                                                                                                 });
                                                                                                                           };
           return {
                     checkbox: polyfill1,
                               disclosure: polyfill2,
                                       quantity: polyfill3
                                             }
       });
