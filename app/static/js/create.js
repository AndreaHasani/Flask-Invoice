function makeEditable() {
  $(".post_from .name").attr("contenteditable", "true");
  $(".post_from .address").attr("contenteditable", "true");
  $(".post_from .city_state").attr("contenteditable", "true");
  $(".post_to .name").attr("contenteditable", "true");
  $(".post_to .address").attr("contenteditable", "true");
  $(".post_to .city_state").attr("contenteditable", "true");
  $(".item td").attr("contenteditable", "true");
}

function applyCSS() {
  $(".item td, .post_from p, .post_to p").addClass("brd-input");
  $(".item .price").css("width", "10%");
}

$("#invoice_gen").submit(function(e) {
  e.preventDefault(); // avoid to execute the actual submit of the form.
  console.log("Submit");

  var form = $(this);
  var url = form.attr("action");

  $.ajax({
    type: "POST",
    url: url,
    data: form.serialize(), // serializes the form's elements.
    success: function(data) {
      $("#invoice-preview").html(data);
      makeEditable();
	applyCSS();
	$(".invoice-box").append("<div class='edit-mode'><p>Edit Mode</p></div>");
      $(".item .price").keypress(function(e) {
	  if (e.which < 48 || e.which > 57) e.preventDefault();
      });
      $(".item .price").on("input", function(e) {
	  let price = $(".item .price").map(function() {
	      const num = parseInt($(this).html());
	      if (num != 0 && !isNaN(num)) return num;
	  }).get();
	  let total = price.reduce(function(acc, a) { return acc + a });
	  $(".total-price").html("Total: " + total + "$");
      });
    }
  });
});
