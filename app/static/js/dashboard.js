// global variable;
var id = 0;
var tableCount = 0
var buttonAction = false;

//Trigger setFilter function with correct parameters
function updateFilter() {

    let filter = $("#example-table .filter .type_filter").val();

    table.setFilter(filter, "like", $("#example-table .filter .search").val());
}

function getItems() {
    let items = {};
    $(".modal-content").find(".item").each(function(e) {
        let item = {};
        $(this).find(".description, .price").each(function() {
            item[this.className.replace("form-control ", "")] = this.value;
        });
        items["item-" + e] = item;
    });
    return items;
}

function modalClear() {
    $("#editorModal").find(".id, .from_name, .from_city_state, .from_address, .payment_email, .to_name, .to_city_state, .to_address, .total, .warranty_description, .notes_description").each(function() {
        this.value = "";
        this.style.border = "1px solid #ced4da";
    });
    $("#editorModal .msg").hide();
    $("#editorModal .items .item").remove();
    let itemsDom =
        "<div class='mb-3 row item'>" +
        "<div class='input-group col-7'>" +
        "<input placeholder='Description' type='text' class='form-control description' required>" +
        "</div>" +
        "<div class='input-group col-3'>" +
        "<input type='number' placeholder='Price' class='form-control price' required>" +
        "<div class='input-group-append'><span class='input-group-text'>$</span></div>" +
        "</div>" +
        "<div class='col-2'>" +
        "<button class='btn btn-primary remove'>Remove</button>" +
        "</div>" +
        "</div>";
    $(".items-toggle .items").append(itemsDom);
}

function ajaxInvoice_GET(id, type, duplicate = false) {
    if (type == "showModal") {
        $.ajax({
            type: "GET",
            url: "/api/invoice",
            data: {
                id: id,
                request_type: "data"
            }, // serializes the form's elements.
            success: function(data) {
                $(".modal-content .type_select")
                    .val(data[0].type)
                    .change();
            $("#editorModal").modal('show');
		var items = JSON.parse(data[0].items);
                if (duplicate == true) {
                    delete data[0].id;
                }
                $(".modal-content").find(".id, .from_name, .from_city_state, .from_address, .payment_email, .to_name, .to_city_state, .to_address, .total, .warranty_description, .notes_description, warranty_period").each(function() {
                    this.value = data[0][this.className.replace("form-control ", "")];
                });
                let itemsDom = "";
                for (var key in items) {
                    if (items.hasOwnProperty(key)) {
			itemsDom =
			    "<div class='mb-3 row item'>" +
			    "<div class='input-group col-7'>" +
			    "<input placeholder='Description' type='text' class='form-control description' value='" + items[key].description + "' required>" +
			    "</div>" +
			    "<div class='input-group col-3'>" +
			    "<input type='number' placeholder='Price' value='" + items[key].price + "' class='form-control price' required>" +
			    "<div class='input-group-append'><span class='input-group-text'>$</span></div>" +
			    "</div>" +
			    "<div class='col-2'>" +
			    "<button class='btn btn-primary remove'>Remove</button>" +
			    "</div>" +
			    "</div>";
                    }
                }
                $(".items-toggle .items").html(itemsDom);
                itemsDom = data[0].warranty;
                $(".warranty-toggle .warranty_input").val(itemsDom);
            }
        });
    }
    if (type == "view") {
	open("/?i=" + id, "preivewWin", "height=600,width=800");
    }
}

function ajaxInvoice_POST(data) {
    $.ajax({
        type: "POST",
        url: "/api/invoice",
        data: data, // serializes the form's elements.
	success: function(result) {
	    switch (data['request_type']) {
		case 'delete':
		    return;
		default:
		    table.updateOrAddRow(result.id, {
			id: result.id,
			to_name: data.to_name,
			to_address: data.to_address,
			to_city_state: data.to_city_state,
			total: data.total,
			type: data.type,
			payment_method: data.payment_method,
			payment_email: data.payment_email,
			issued_date: result.date
		    }, true);
	    }
	}

    });
}


var functionsBtn = function(cell, formatterParams, onRendered) {
    return (
	"<div class='input-group col_actions'>" +
	"<select class='custom-select action_selector'>" +
	"<option value='view'>View</option>" +
	"<option value='edit'>Edit</option>" +
	"<option value='delete'>Delete</option>" +
	"<option value='clone'>Clone</option>" +
	"</select>" +
	"<div class='input-group-append'>" +
	"<button class='btn btn-outline-secondary run_btn' type='button'>Run</button>" +
	"</div>" +
	"</div>"
    );
};
var table = new Tabulator("#example-table", {
    ajaxURL: "./api/invoices", // ajax URL
    layout: "fitDataFill",
    index: "id",
    responsiveLayout: true,
    addRowPos: "top",
    footerElement: "<div class='actions'>" +
        "<button type='button' class='tabulator-page create_inv'>Create Invoice</button>" +
        "<div class='filter'>" +
        "<input type='text' class='search tabulator-page' placeholder='Search...'>" +
        "</div>" +
        "<div class='download_json'>" +
    "<a href='/api/invoices?download=1' target='_blank' class='tabulator-page'>Download</a>" +
        "</div>" +
        "</div>", //add a custom button to the footer element
    columns: [{
            title: "ID",
            field: "id",
            sorter: "number",
            resizable: true,
            responsive: 0
        },

        {
            title: "Type",
            field: "type",
            sorter: "string",
            resizable: true,
            responsive: 0
        },
        {
            title: "Date",
            field: "issued_date",
            sorter: "datetime",
	    sorterParams:{
		format:"YYYY-MM-DD",
		alignEmptyValues:"bottom",
	    },
            resizable: true,
            responsive: 0
        },
        {
            title: "To Name",
            field: "to_name",
            sorter: "string",
            resizable: true,
            responsive: 0
        },
        {
            title: "To City",
            field: "to_city_state",
            sorter: "string",
            resizable: true,
            responsive: 2
        },
        {
            title: "To Address",
            field: "to_address",
            sorter: "string",
            resizable: true,
            responsive: 2
        },
        {
            title: "Amount",
            field: "total",
            sorter: "number",
            resizable: true,
            responsive: 0
        },
        {
            title: "Payment Method",
            field: "payment_method",
            sorter: "string",
            resizable: true,
            responsive: 1
        },
        {
            title: "Payment Email",
            field: "payment_email",
            sorter: "string",
            resizable: true,
            responsive: 2
        },
        {
            title: "Actions",
            formatter: functionsBtn,
            width: 200,
            responsive: 0
        }
    ],
    pagination: "local",
    paginationSize: 10,
    tableBuilt: function() {
        $("#editorModal .warranty_description, #editorModal .notes_description").val("");
        let columns = this.getColumnDefinitions();
        let html = "<select class='tabulator-page type_filter'>"
        for (let x = 0; columns.length > x; x++) {
	    if (columns[x].field != undefined) {
            html += "<option value='" + columns[x].field + "'>" + columns[x].title + "</option>";
	    }
        }
        html += "</select>"
        $("#example-table .actions .filter").append(html);
        $("#example-table .actions .search").keyup(updateFilter);
    },
});

// Table : View Button
$("#example-table")
    .on(
        "click", ".col_actions .run_btn",
        function(e) {
	    let selectAction = $(this).parent().parent().find("select :selected").val();
            let row = $(this).parents(".tabulator-row")[0];
	    let id = table.getRow(row).getData().id;
	    console.log(selectAction);
	    switch (selectAction) {
		case "view":
		    buttonAction = 'view';
		    ajaxInvoice_GET(id, "view");
		    break;
		case "clone":
		    buttonAction = 'clone';
		    ajaxInvoice_GET(id, "showModal", duplicate = true);
		    break;
		case "edit":
		    buttonAction = 'edit';
		    ajaxInvoice_GET(id, "showModal");
		    break;
		case "delete":
		    table.deleteRow(row);
		    buttonAction = 'delete';
		    ajaxInvoice_POST({'id': id, 'request_type': 'delete'});
		    break;
        }
        });

// Table : Create Button

$("#example-table .actions .create_inv").click(function() {
    modalClear();
    $("#editorModal").modal();
    let default_warranty_value = `### Warranty

  - This program is delivered as it is together with a warranty of 6 months covering the following.

  - The first month covers any problem with the program including API problems, usage problem (stopping, errors, etc) and any other problem which caused the program to not function properly.

  - Month 2 through 6 covers only problems which cause is the code quality such as bugs that existed in the code when it was delivered etc.

  - The client can request updates for filter keywords without charge during the warrenty period.

  - This warranty will be void if there are changes to the code not made by the author and it will cause an extra 30% overcharge for fixing such bugs which were caused by a feature added from another program.

  - In case of non-compliance from the author, the client will be reimbursed up to 50% of the cost. This will be calculated from the damage the bug caused for the code.
    `;
    $("#editorModal").find(".warranty textarea").val(default_warranty_value);
    let total_rows = table.getRows().length;
    $("#editorModal .modal-content .id").val(total_rows + 1);
});


$('#editorModal').on('hidden.bs.modal', function (e) {
    modalClear();
    $("#editorModal").find(" .items-toggle, .warranty-toggle, .notes-toggle").hide();
    $("#editorModal .main_phase").show();
})

// Modal : Items Button
$("#editorModal")
    .on(
        "click", "button.items",
        function(e) {
            e.preventDefault();
            $("#editorModal .main_phase")
                .hide(
                    0,
                    function() {
                        $("#editorModal .items-toggle").show();
                    });
        });

// Modal : warranty Button
$("#editorModal")
    .on(
        "click", "button.warranty",
        function(e) {
            e.preventDefault();
            $("#editorModal .main_phase")
                .hide(
                    0,
                    function() {
                        $("#editorModal .warranty-toggle").show();
                    });
        });



// Modal : warranty Button
$("#editorModal")
    .on(
        "click", "button.notes",
        function(e) {
            e.preventDefault();
            $("#editorModal .main_phase")
                .hide(
                    0,
                    function() {
                        $("#editorModal .notes-toggle").show();
                    });
        });

// Modal : Back Button
$("#editorModal")
    .on(
        "click", "button.back",
        function(e) {
            e.preventDefault();
            $(this).parent().parent().hide(
                0,
                function() {
                    $("#editorModal .main_phase").show();
                });

            let price = $(".items .row .col-3 input")
                .map(function() {
                    const num = parseInt($(this).val());
                    if (!isNaN(num))
                        return num;
                    else
                        return 0;
                })
                .get();
            let total = price.reduce(function(acc, a) {
                return acc + a;
            });
            $(".modal-content .total").val(total);
        });

// Modal Items: Add Button
$(".items-toggle")
    .on(
        "click", "button.add",
        function(e) {
            e.preventDefault();
	    let itemsDom =
		"<div class='mb-3 row item'>" +
		"<div class='input-group col-7'>" +
		"<input placeholder='Description' type='text' class='form-control description' required>" +
		"</div>" +
		"<div class='input-group col-3'>" +
		"<input type='number' placeholder='Price' class='form-control price' required>" +
		"<div class='input-group-append'><span class='input-group-text'>$</span></div>" +
		"</div>" +
		"<div class='col-2'>" +
		"<button class='btn btn-primary remove'>Remove</button>" +
		"</div>" +
		"</div>";
            $(".items-toggle .items").append(itemsDom);
        });


// Modal Items: Remove Button
$(".items-toggle")
    .on(
        "click", "button.remove",
        function(e) {
            e.preventDefault();
            let items_length = $("#editorModal .items .item").length;
            if (items_length != 1) {
                $(this).parent().parent().remove();
            } else {
                $("#editorModal .items .item .description").val("");
                $("#editorModal .items .item .price").val("");
            }
        });

// Modal: Save button
$("#editorModal .main_phase")
    .on(
        "click", "button.save",
        function(e) {
            e.preventDefault();
            $("#editorModal form:submit").click();
            let warranty_description;
            let warranty_days;

            let modalData = {};
            let emptyField = false;
            $(".modal-content").find(".type_select, .payment_method, .payment_email, .id, .total, .from_name, .from_city_state, .from_address, .to_name, .to_city_state, .to_address, .warranty_description, .notes_description, .warranty_period").each(function() {
                let value = $.trim(this.value);
                if (value.length == 0) {
                    emptyField = true;
                    this.style.border = "solid 2px red";
                    return
                }
                this.style.border = "1px solid #ced4da";
                modalData[this.className.replace("form-control ", "")] = value;
            });
            if (emptyField == true) {
                msg = "<p>There are empty fields in the form. Please fill out all the fields.</p>";
                $("#editorModal .msg").show();
                $("#editorModal .msg").html(msg);
                return;
            }
            $("#editorModal .msg").hide();
            let items = getItems();
            modalData['items'] = JSON.stringify(items);

	    if (buttonAction == 'edit') {
		modalData['request_type'] = 'update';
	    }
	    else {
		modalData['request_type'] = 'add';
        }
	    modalData['type'] = modalData['type_select'];
	    delete modalData['type_select'];
	    ajaxInvoice_POST(modalData);
            $("#editorModal").modal('hide');
        });


// // Modal Outside Click without bootstrap
// $("html").draggable().click(function(event) {
//     if ($(event.target)
//         .closest(
//             "#editorModal .modal-content, button.edit, button.remove, #example-table .actions .create_inv")
//         .length === 0) {
//         $("#editorModal").fadeOut(400, function() {
//             modalClear();
//             $("#editorModal .items-toggle, #editorModal .warranty-toggle").hide();
//             $("#editorModal .main_phase").show();
//         });
//     }
//     if ($(event.target).closest("#editorModal .modal-content .close").length === 1) {
//         $("#editorModal").fadeOut(400, function() {
//         });
//     }
// });
