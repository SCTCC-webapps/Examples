/*
Script written for various functions needed for calling our php via ajax and various other JavaScript.
Author: Tony Reed
*/

$(document).ready(function(){
    //Declaring new object and specifying parameters to be used in various functions.
    //Makes it easier for future changes being made in one spot, versus all over.
    //JSON Syntax
    var parameterObject = {
        loadingGifPath:"lib/Styles/ajax-loader-trans.gif",
        ModalBodyPath:"lib/modals/",
        imagePath:"lib/Styles/pics/",
        ajaxFunctionsPath:"lib/PHP/ajaxFunctions.php",
        foodID:0,
        specialID:0,
        lastInsertID:0
    };

    /*
    For logging in, registering, and logging out.
    */

    //Register action
    $("#registerForm").submit(function(e){
        //Stop form from refreshing page.
        e.preventDefault();

        var username = $("#regUsername").val();
        var password = $("#regPassword").val();
        var confirmPassword = $("#confirmPassword").val();
        var valid = true;

        if(password != confirmPassword) {
            valid = false;
        }

        if(!password || !confirmPassword || !username){
            valid = false;
        }

        if(valid){
            register(parameterObject);
        }else{
            $(".passwordAlert").show();
        }
    });

    //Login action
    $("#loginForm").submit(function(e){
        //Stop form from refreshing page.
        e.preventDefault();

        var username = $("#username").val();
        var password = $("#password").val();
        var valid = true;

        if(!password || !username){
            valid = false;
        }

        if(valid){
            login(parameterObject);
        }else{
            $(".passwordAlert").show();
        }
    });

    //Logout action
    $("#logoutForm").submit(function(e){
        //Stop form from refreshing page.
        e.preventDefault();

        logout(parameterObject);
    });

    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    */

    /*
    All users options handler
     */
    $('#foodDetailModal').on('show.bs.modal', function(e){
        var invoker = $(e.relatedTarget).data('id');

        //Set the loading image while ajax renders
        displayLoad($('.food-details-modal-body'), parameterObject, true);

        $.ajax({
           type: 'post',
            url: parameterObject.ModalBodyPath+'food_details.php',
            data: { food_id: invoker },
            success: function(r){
                $('.food-details-modal-body').html(r);
            }
        });
    });

    $('#weeklySpecialsModal').on('show.bs.modal', function(e){
        //Set the loading image while ajax renders
        displayLoad($('.weekly-specials-modal-body'), parameterObject, true);

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'weekly_specials.php',
            success: function(r){
                $('.weekly-specials-modal-body').html(r);
            }
        });
    });


    //Populate food table via ajax. (Also done when user selects the reset anchor tag.
    //This is not within a function because it will be done every time the user refreshes the page.
    displayDefaultTable(parameterObject);

    //Populate Specials table via ajax. (Also done when user selects the reset anchor tag.
    //This is not within a function because it will be done every time the user refreshes the page.
    displayDefaultSpecialTable(parameterObject);

    //Populate Category table via ajax. (Also done when user selects the reset anchor tag.
    //This is not within a function because it will be done every time the user refreshes the page.
    displayDefaultCategoryTable(parameterObject);

    //Search posting to refresh table portion of the page.
    $('#submitSearchButton').click(function(e){
        $('.panel-body .food-table-pages').html('');

        e.preventDefault();
        var search = $("#search").val();

        //If search is set, make an ajax call and refresh the table.
        if(search){
            $('.panel-body .food-table').addClass('text-center').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

            $.ajax({
                type: 'post',
                url: parameterObject.ajaxFunctionsPath+'?action=display_food_table_search&search='+search,
                success: function(r){
                    $('.panel-body .food-table').removeClass('text-center').html(r);
                }
            });
        }
    });

    //Attach the autocomplete on the input.
    $('#search').autocomplete({});

    //Portion for ajax searching without needing to press submit.
    $('#search').keyup(function(){
        $('.panel-body .food-table-pages').html('');

        var search = $("#search").val();

        //Using jQuery-UI Autocomplete here and returning a json-encoded array from our PHP script.
        //The source is what array are we displaying in the dropdown as the user types.
        //Select is what we are doing when the user selects an item out of the drop down.
        $("#search").autocomplete({
            source: parameterObject.ajaxFunctionsPath+"?action=autocomplete_food_search&search="+search,
            select: function(event, ui){
                //We get the value from the label in the array. This link for reference: http://api.jqueryui.com/autocomplete/#event-select
                doSearch(ui.item.label, parameterObject);
            }
        });

        if(!search) {
            setTimeout(function () {
                displayDefaultTable(parameterObject);
            }, 500);
        }

        //OLD STUFF (pre-autocomplete)
        //If search is set, make an ajax call and refresh the table.
        //if(search.length > 0){

            //doSearch(search, parameterObject);
        //If search is nothing, reset table to default.
        //}else{
           // setTimeout(function(){
               // displayDefaultTable(parameterObject);
           // }, 500);
       // }
    });

    /*
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /*
    Admin options handler - Inventory
    */
    $('#editFoodModal').on('show.bs.modal', function (e) {

        var invoker = $(e.relatedTarget).data('id');

        /*
        This if-else is for going back from the upload modal to the edit modal.
        We set a field in our parameterObject to hold our food id.
        When we come back from the upload modal to the edit modal the food_ID is lost, but not if we store it in the object and assign it as below.
         */
        if(typeof(invoker) == "undefined"){
            invoker = parameterObject.foodID;
        }else if(typeof(invoker) == "number"){
            //Set object ID = to invoker
            parameterObject.foodID = invoker;
        }

        //Set the loading image while ajax renders
        $('.edit-food-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        //This ajax call loads up the modal-body with the form we receive.
        //(jQuery validation is inside the success callback function)
        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'edit_food.php',
            data: { food_id:  invoker },
            success: function (r) {
                //Inside the success return function for the ajax call is where we are validating and using jQuery with our
                //Newly-passed form.
                $('.edit-food-modal-body').html(r);

                //Initialize text counter
                countTextArea();

                //Initialize our datepickers.
                $('.edit-food-modal-body .datepicker').datepicker();

                /* Toggles for cyclone & sales */
                $('.edit-food-modal-body .showCyclone').click(function(){
                    $('.edit-food-modal-body .displayCyclonePrice').show(100);
                });

                $('.edit-food-modal-body .hideCyclone').click(function(){
                    $('.edit-food-modal-body .displayCyclonePrice').hide(100);
                    $('.edit-food-modal-body .cyclone-card-price').val("");
                });

                $('.edit-food-modal-body .showSales').click(function(){
                   $('.edit-food-modal-body .displaySales').show(100);
                });

                $('.edit-food-modal-body .hideSales').click(function(){
                    $('.edit-food-modal-body .displaySales').hide(100);

                    //Reset values on hide
                    $('.edit-food-modal-body .sale-price').val("");
                    $('.edit-food-modal-body .sale-start-date').val("");
                    $('.edit-food-modal-body .sale-end-date').val("");
                });

                /* Validation on the edit food modal */
                $("#edit_food_form").submit(function(e) {
                    var name = $('.edit-food-modal-body .food-name').val();
                    var desc = $('.edit-food-modal-body .food-desc').val();
                    var cyclonePrice = parseFloat($('.edit-food-modal-body .cyclone-card-price').val());
                    var price = parseFloat($('.edit-food-modal-body .regular-price').val());
                    var salePrice = parseFloat($('.edit-food-modal-body .sale-price').val());
                    var saleStart = $('.edit-food-modal-body .sale-start-date').val();
                    var saleEnd = $('.edit-food-modal-body .sale-end-date').val();
                    var valid = true;

                    if(!name || !desc || !price){
                        valid = false;
                        $('.edit-food-modal-body .displayAlert').show(100);
                    }else{
                        $('.edit-food-modal-body .displayAlert').hide(100);
                    }

                    //If any price is below 0, fail.
                    //Also, if sale or cyclone price are set, if either one of them is higher than the regular price, fail.
                    if(price < 0 || cyclonePrice < 0 || salePrice < 0 || (salePrice > 0 || cyclonePrice > 0) && (salePrice >= price || cyclonePrice >= price)){
                        valid = false;
                        $('.edit-food-modal-body .displayPriceAlert').show(100);
                    }else{
                        $('.edit-food-modal-body .displayPriceAlert').hide(100);
                    }

                    if((salePrice > 0 && (!saleStart || !saleEnd))){
                        valid = false;
                        $('.edit-food-modal-body .displayDateAlert').show(100);
                    }else if((saleStart || saleEnd) && !salePrice){
                        valid = false;
                        $('.edit-food-modal-body .displayDateAlert').show(100);
                    }else{
                        $('.edit-food-modal-body .displayDateAlert').hide(100);
                    }

                    //Require one checkbox being checked
                    if($('input[type=checkbox]:checked').length == 0)
                    {
                        $(".edit-food-modal-body .typeAlert").show(100);
                        valid = false;
                    }else{
                        $(".edit-food-modal-body .typeAlert").hide(100);
                    }

                    if (valid == true) {
                        e.preventDefault();
                        editItem(parameterObject);
                    }else{
                        e.preventDefault();
                    }
                });
            }
        });
    });

    $('#addFoodModal').on('show.bs.modal', function(e) {
        //Re-show in case the user has entered more than one item. (We hide it on form submission to clean up the modal.
        $('.add-food-modal-body .addFoodFormDiv').show();

        //Initialize our datepickers.
        $('.add-food-modal-body .datepicker').datepicker();

        /* Toggles for cyclone & sales */
        $('.add-food-modal-body .showCyclone').click(function () {
            $('.add-food-modal-body .displayCyclonePrice').show(100);
        });

        $('.add-food-modal-body .hideCyclone').click(function () {
            $('.add-food-modal-body .displayCyclonePrice').hide(100);
            $('.add-food-modal-body .cyclone-card-price').val("");
        });

        $('.add-food-modal-body .showSales').click(function () {
            $('.add-food-modal-body .displaySales').show(100);
        });

        $('.add-food-modal-body .hideSales').click(function () {
            $('.add-food-modal-body .displaySales').hide(100);

            //Reset values on hide
            $('.add-food-modal-body .sale-price').val("");
            $('.add-food-modal-body .sale-start-date').val("");
            $('.add-food-modal-body .sale-end-date').val("");
        });

        /* Validation on the edit food modal */
        $("#add_food_form").submit(function (e) {
            var name = $('.add-food-modal-body .food-name').val();
            var desc = $('.add-food-modal-body .food-desc').val();
            var cyclonePrice = parseFloat($('.add-food-modal-body .cyclone-card-price').val());
            var price = parseFloat($('.add-food-modal-body .regular-price').val());
            var salePrice = parseFloat($('.add-food-modal-body .sale-price').val());
            var saleStart = $('.add-food-modal-body .sale-start-date').val();
            var saleEnd = $('.add-food-modal-body .sale-end-date').val();
            var valid = true;

            if (!name || !desc || !price) {
                valid = false;
                $('.add-food-modal-body .displayAlert').show(100);
            } else {
                $('.add-food-modal-body .displayAlert').hide(100);
            }

            //If any price is below 0, fail.
            //Also, if sale or cyclone price are set, if either one of them is higher than the regular price, fail.
            if (price < 0 || cyclonePrice < 0 || salePrice < 0 || (salePrice > 0 || cyclonePrice > 0) && (salePrice >= price || cyclonePrice >= price)) {
                valid = false;
                $('.add-food-modal-body .displayPriceAlert').show(100);
            } else {
                $('.add-food-modal-body .displayPriceAlert').hide(100);
            }

            if (salePrice > 0 && (!saleStart || !saleEnd)) {
                valid = false;
                $('.add-food-modal-body .displayDateAlert').show(100);
            } else if((saleStart || saleEnd) && !salePrice){
                valid = false;
                $('.add-food-modal-body .displayDateAlert').show(100);
            } else {
                $('.add-food-modal-body .displayDateAlert').hide(100);
            }

            //Require one checkbox being checked
            if($('input[type=checkbox]:checked').length == 0) {
                $(".add-food-modal-body .typeAlert").show(100);
                valid = false;
            } else{
                $(".add-food-modal-body .typeAlert").hide(100);
            }

            if (valid === true) {
                e.preventDefault();
                addItem(parameterObject);

                //Reset form.
                $('#add_food_form').trigger("reset");
            } else {
                e.preventDefault();
            }
        });
    });

    $('#addFoodModal').on('hidden.bs.modal', function(e){
        //Reset form.
        $('#add_food_form').trigger("reset");

        $('.add-food-modal-body .item-information').html('');

        //Hide all fields & errors.
        $('.add-food-modal-body .loading-added').hide();
        $('.add-food-modal-body .displayDateAlert').hide();
        $('.add-food-modal-body .displayPriceAlert').hide();
        $('.add-food-modal-body .displayAlert').hide();
        $('.add-food-modal-body .displaySales').hide();
        $('.add-food-modal-body .displayCyclonePrice').hide();
        $('.add-food-modal-body .typeAlert').hide();

    });

    $('#uploadModal').on('show.bs.modal', function(e){
        //Hide edit modal until this modal is done.
        $('#editFoodModal').modal('hide');

        //Get ID from form. (Hidden field)
        if($('input[name="food_id"]').val()){
            var id = $('input[name="food_id"]').val();
        }

        //Set the loading image while ajax renders
        $('.upload-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'upload.php',
            data: { food_id:  id },
            success: function (r) {
                $('.upload-modal-body').html(r);

                $("#upload_form").submit(function(e) {
                    e.preventDefault();

                    //Set the loading image while ajax renders
                    $('.upload-modal-body .loading').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

                    //This function posts with ajax to update the new image. (Or insert one)
                    uploadImage(parameterObject);
                });
            }
        });
    });

    $('#deleteModal').on('show.bs.modal', function(e){

        parameterObject.foodID = $(e.relatedTarget).data('id');

        $('.delete-modal-body .item-information').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        //Show details of item to be deleted to verify to the user which one they've selected to delete.
        $.ajax({
            method: "post",
            url: parameterObject.ajaxFunctionsPath+'?action=displayByIDNonTable&id='+parameterObject.foodID,
            success: function(r){
                $('.delete-modal-body .item-information').html(r);
                $("#deleteForm").submit(function(e){
                    e.preventDefault();
                    //Delete and get rid of item.
                    deleteItem(parameterObject);

                    //Hide modal after 1 second.
                    setTimeout(function () {
                        $('#deleteModal').modal('toggle');
                    }, 1000);
                });
            }
        });
    });

    $('#optionsModal').on('show.bs.modal', function(e){
        displayLoad($('.options-modal-body .all-types'), parameterObject, true);
        
        $.get(parameterObject.ajaxFunctionsPath+"?action=displayAllTypes", function(r){
            $('.options-modal-body .all-types').removeClass("text-center").html(r);
        });

        $('#optionsForm').submit(function(e){
            e.preventDefault();

            //Require one checkbox being checked
            if($('input[type=checkbox]:checked').length > 0)
            {
                var formData = $('#optionsForm').serialize();

                displayLoad($('.options-modal-body .loading'), parameterObject);

                //Sending serialized form to a php script, and hiding modal on finish.
               // $.post(parameterObject.ajaxFunctionsPath+'?action=display_food_table_search', formData, function(r){
                //    $('.panel-body .food-table').html(r);
                //}).done(function(){
                 //   $('#optionsModal').modal('hide');
                //});

                //Sending serialized form to a php script, and hiding modal on finish.
                $.ajax({
                    method: "POST",
                    url: parameterObject.ajaxFunctionsPath+'?action=display_food_table_search',
                    data: formData,
                    success: function(r){
                        $('.panel-body .food-table').html(r);
                        $('.panel-body .food-table-pages').html('');
                    },
                    complete: function(){
                        $('#optionsModal').modal('hide');
                    }
                });

                $('#optionsForm').trigger('reset');
            }
        });//End of form submit

        //Clean out loading div.
        $('.options-modal-body .loading').html("");

    });//End of options modal show

    $('#optionsModal').on('hidden.bs.modal', function(){
        //Reset form.
        $('#optionsForm').trigger("reset");
    });

    //If uploadModal is closed, re-open edit modal
    $('#uploadModal').on('hidden.bs.modal', function(e){
        $('#editFoodModal').modal('show');
    });

    /*
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /*
    Admin options handler - Categories
     */
    $('#editCategoryModal').on('show.bs.modal', function(e){
        var id = $(e.relatedTarget).data('id');

        //Set the loading image while ajax renders
        $('.edit-category-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'edit_category.php',
            data: { type_id: id },
            success: function(r){
                //This is loading up the edit_category modal. From here, we can actually post the new data out.
                $('.edit-category-modal-body').removeClass('text-center').html(r);

                $('#edit_category_form').submit(function(e){
                    e.preventDefault();

                    var name = $('.edit-category-modal-body .category-description').val();
                    if(name){
                        editCategory(parameterObject);
                    }

                });
            }
        });
    });

    $('#addCategoryModal').on('show.bs.modal', function(e){
        $('#add_category_form').submit(function(e){
            e.preventDefault();
            var name = $('.add-category-modal-body .category-name').val();
            var valid = true;

            if(!name){
                valid = false;
            }

            if(valid == true){
                addCategory(parameterObject);

                //Reset form.
                $('#add_category_form').trigger("reset");
            }
        });
    });

    $('#addCategoryModal').on('hidden.bs.modal', function(e){
        $(".add-category-modal-body .loading").html("");
        $('#add_category_form').trigger("reset");
    });

    $('#deleteCategoryModal').on('show.bs.modal', function(e){
        var id = $(e.relatedTarget).data('id');

        $('.delete-category-modal-body .item-information').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        //Show details of item to be deleted to verify to the user which one they've selected to delete.
        $.ajax({
            method: "post",
            url: parameterObject.ajaxFunctionsPath+'?action=displayByIDCategoryNonTable&id='+id,
            success: function(r){
                $('.delete-category-modal-body .item-information').html(r);
                $("#cDeleteForm").submit(function(e){
                    e.preventDefault();
                    //Delete and get rid of item.
                    deleteCategory(parameterObject, id);
                });
            }
        });
    });

    //Search posting to refresh table portion of the page.
    $('#categorySearchButton').click(function(e){
        e.preventDefault();
        var search = $("#categorySearch").val();

        //If search is set, make an ajax call and refresh the table.
        if(search){
            $('.panel-body .category-table').addClass('text-center').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

            $.ajax({
                type: 'post',
                url: parameterObject.ajaxFunctionsPath+'?action=display_category_table&search='+search,
                success: function(r){
                    $('.panel-body .category-table').removeClass('text-center').html(r);
                }
            });
        }
    });

    //Initialize.
    $('#categorySearch').autocomplete({});

    //Portion for ajax searching without needing to press submit.
    $('#categorySearch').keyup(function(){
        var search = $("#categorySearch").val();

        //Using jQuery-UI Autocomplete here and returning a json-encoded array from our PHP script.
        //The source is what array are we displaying in the dropdown as the user types.
        //Select is what we are doing when the user selects an item out of the drop down.
        $("#categorySearch").autocomplete({
            source: parameterObject.ajaxFunctionsPath+"?action=autocomplete_category_search&search="+search,
            select: function(event, ui){
                //We get the value from the label in the array. This link for reference: http://api.jqueryui.com/autocomplete/#event-select
                doCategorySearch(ui.item.label, parameterObject);
            }
        });

        if(!search) {
            setTimeout(function () {
                displayDefaultCategoryTable(parameterObject);
            }, 500);
        }

        //OLD (pre-auto)
        //If search is set, make an ajax call and refresh the table.
        /*if(search.length > 0){
            doCategorySearch(search, parameterObject);
            //If search is nothing, reset table to default.
        }else{
            setTimeout(function(){
                displayDefaultCategoryTable(parameterObject);
            }, 500);
        }*/
    });


    $('#resetCategory').click(function(e){
        $('#categorySearch').val("");
        displayDefaultCategoryTable(parameterObject);
    });

    /*
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /*
     Admin options handler - Specials
     */

    $('#editSpecialModal').on('show.bs.modal', function(e){
        var invoker = $(e.relatedTarget).data('id');

        /*
         This if-else is for going back from the upload modal to the edit modal.
         We set a field in our parameterObject to hold our food id.
         When we come back from the upload modal to the edit modal the food_ID is lost, but not if we store it in the object and assign it as below.
         */
        if(typeof(invoker) == "undefined"){
            invoker = parameterObject.specialID;
        }else if(typeof(invoker) == "number"){
            //Set object ID = to invoker
            parameterObject.specialID = invoker;
        }

        //Set the loading image while ajax renders
        $('.edit-special-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'edit_special.php',
            data: { special_id: invoker },
            success: function(r){
                //This is loading up the edit_category modal. From here, we can actually post the new data out.
                $('.edit-special-modal-body').html(r);

                //Initialize our datepickers.
                $('.edit-special-modal-body .datepicker').datepicker();

                $('#edit_special_form').submit(function(e){
                    e.preventDefault();

                    var name = $('.edit-special-modal-body .special-name').val();
                    var desc = $('.edit-special-modal-body .special-desc').val();
                    var price = parseFloat($('.edit-special-modal-body .special-price').val());
                    var date = $('.edit-special-modal-body .special-date').val();
                    var valid = true;

                    if(!name || !desc || !price || !date){
                        valid = false;
                        $('.edit-special-modal-body .displayAlert').show(100);
                    }else{
                        $('.edit-special-modal-body .displayAlert').hide(100);
                    }

                    if(price < 0 ){
                        valid = false;
                        $('.edit-special-modal-body .displaynumericalert').show(100);
                    }else{
                        $('.edit-special-modal-body .displaynumericalert').hide(100);
                    }

                    if(valid === true){
                        editSpecial(parameterObject);
                    }

                });
            }
        });
    });

    $('#addSpecialModal').on('show.bs.modal', function(e){
        //Re-show in case the user has entered more than one item. (We hide it on form submission to clean up the modal.
        $('.add-special-modal-body .addSpecialFormDiv').show();

        //Initialize our datepickers.
        $('.add-special-modal-body .datepicker').datepicker();

        countTextArea();

        $('#add_special_form').submit(function(e){
            e.preventDefault();
            
            var name = $('.add-special-modal-body .special-name').val();
            var date = $('.add-special-modal-body .special-date').val();
            var desc = $('.add-special-modal-body .special-desc').val();
            var price = parseFloat($('.add-special-modal-body .special-price').val());
            var valid = true;

            if(!name || !date || !desc || !price){
                valid = false;
                $('.add-special-modal-body .displayAlert').show(100);
            }else{
                $('.add-special-modal-body .displayAlert').hide(100);
            }

            if(price < 0){
                valid = false;
                $('.add-special-modal-body .displayNumericAlert').show(100);
            }else{
                $('.add-special-modal-body .displayNumericAlert').hide(100);
            }

            if(valid == true){
                addSpecial(parameterObject);

                //Reset form.
                $('#add_special_form').trigger("reset");
            }
        });
    });

    $('#addSpecialModal').on('hidden.bs.modal', function(e){
        $('#add_special_form').trigger("reset");
        $('.add-special-modal-body .item-information').html('');
    });

    $('#deleteSpecialModal').on('show.bs.modal', function(e){
        var id = $(e.relatedTarget).data('id');

        $('.delete-special-modal-body .item-information').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        //Show details of item to be deleted to verify to the user which one they've selected to delete.
        $.ajax({
            method: "post",
            url: parameterObject.ajaxFunctionsPath+'?action=displaySpecialByIDNonTable&id='+id,
            success: function(r){
                $('.delete-special-modal-body .item-information').html(r);
                $("#cDeleteForm").submit(function(e){
                    e.preventDefault();
                    //Delete and get rid of item.
                    deleteSpecial(parameterObject, id);

                    //Hide modal after 1 second.
                    setTimeout(function () {
                        $('#deleteSpecialModal').modal('toggle');
                    }, 1000);
                });
            }
        });
    });
    
    $('#specialDetailModal').on('show.bs.modal', function(e){
        var invoker = $(e.relatedTarget).data('id');

        //Set the loading image while ajax renders
        $('.special-details-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'special_details.php',
            data: { special_id: invoker },
            success: function(r){
                $('.special-details-modal-body').html(r);
            }
        });
    });

    $('#uploadSpecialModal').on('show.bs.modal', function(e){
        //Hide edit modal until this modal is done.
        $('#editSpecialModal').modal('hide');

        //Get ID from form. (Hidden field)
        if($('input[name="special_id"]').val()){
            var id = $('input[name="special_id"]').val();
        }

        //Set the loading image while ajax renders
        $('.upload-special-modal-body').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

        $.ajax({
            type: 'post',
            url: parameterObject.ModalBodyPath+'upload_special.php',
            data: { special_id:  id },
            success: function (r) {
                $('.upload-special-modal-body').html(r);

                $("#upload_special_form").submit(function(e) {
                    e.preventDefault();

                    //Set the loading image while ajax renders
                    $('.upload-special-modal-body .loading').addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

                    //This function posts with ajax to update the new image. (Or insert one)
                    uploadSpecialImage(parameterObject);
                });
            }
        });
    });

    //Search posting to refresh table portion of the page.
    $('#specialSearchButton').click(function(e){
        e.preventDefault();
        var search = $("#specialSearch").val();

        //If search is set, make an ajax call and refresh the table.
        if(search){
            $('.panel-body .special-table').addClass('text-center').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

            $.ajax({
                type: 'post',
                url: parameterObject.ajaxFunctionsPath+'?action=display_special_table&search='+search,
                success: function(r){
                    $('.panel-body .special-table').removeClass('text-center').html(r);
                }
            });
        }
    });

    $('#specialSearch').autocomplete({});

    $('#specialSearch').keyup(function(){
        var search = $('#specialSearch').val();

        //Using jQuery-UI Autocomplete here and returning a json-encoded array from our PHP script.
        //The source is what array are we displaying in the dropdown as the user types.
        //Select is what we are doing when the user selects an item out of the drop down.
        $("#specialSearch").autocomplete({
            source: parameterObject.ajaxFunctionsPath+"?action=autocomplete_special_search&search="+search,
            select: function(event, ui){
                //We get the value from the label in the array. This link for reference: http://api.jqueryui.com/autocomplete/#event-select
                doSpecialSearch(ui.item.label, parameterObject);
            }
        });

        if(!search) {
            setTimeout(function () {
                displayDefaultSpecialTable(parameterObject);
            }, 500);
        }
        //OLD (pre-auto)
        /*if(search.length > 0) {
            doSpecialSearch(search, parameterObject);
        }else{
            setTimeout(function(){
                displayDefaultSpecialTable(parameterObject);
            }, 500);
        }*/
    });

    $('#resetSpecial').click(function(e){
        $('#specialSearch').val("");
        displayDefaultSpecialTable(parameterObject);
    });

    /*
     -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /*
    Misc Functions
    */

    //If reset tag is clicked, show default table.
    $('#resetInventory').click(function(e){
        $('.panel-body .food-table-pages').html('');
        //Reset search bar.
        $("#search").val("");
        displayDefaultTable(parameterObject);
    });

    //If show pages is clicked, show default table with page numbers.
    $('.panel-heading .show-pages').click(function(e){
        $('#search').val('');
        $('.panel-body .food-table').html('');
        //Update food table to reflect paging.
        $('.panel-body .food-table').load(parameterObject.ajaxFunctionsPath+'?action=display_food_table&page=1');

        //Display pages (it's separate because we can't load the page row into the table.
        displayLoad($('.panel-body .food-table-pages'), parameterObject, true);

        $('.panel-body .food-table-pages').load(parameterObject.ajaxFunctionsPath+"?action=display_food_table_pages&page=1");
    });

    //This solution is called "event delegation" it allows us to post with pages and keep the selectors alive.
    //REFERENCE: http://stackoverflow.com/questions/20246299/does-ajax-loaded-content-get-a-document-ready
    $('.panel-body').on('click', '.food-table-pages a', function(){
        var page = $(this).data('id');

        $.post(parameterObject.ajaxFunctionsPath+'?action=display_food_table_pages&page='+page, function(r){
            $('.panel-body .food-table-pages').html(r);
        });

        displayLoad($('.panel-body .food-table'), parameterObject, true);

        $.post(parameterObject.ajaxFunctionsPath+'?action=display_food_table&page='+page, function(r){
            $('.panel-body .food-table').removeClass('text-center').html(r);
        });

    });

    //For redirecting to Categories
    $('.categories').click(function(e){
        $('.food-panel').hide(300);
        $('.special-panel').hide(300);
        $('.category-panel').show(300);
    });

    //For redirecting to Specials
    $('.specials').click(function(e){
        $('.food-panel').hide(300);
        $('.special-panel').show(300);
        $('.category-panel').hide(300);
    });

    //For defaulting back to inventory
    $('.food').click(function(e){
        $('.food-panel').show(300);
        $('.special-panel').hide(300);
        $('.category-panel').hide(300);
    });

    //Counts textareas and provides feedback.
    countTextArea();

    //If modals are closed, hide errors.
    $(".modal").on("hidden.bs.modal", ".modal", function(){
        $(".passwordAlert").hide();
    });

    //Dynamic function clears the form of which the reset button is attached to.
    $(".clear-form-button").click(function(){
        $(this).closest('form')[0].reset();
        //Hide alerts on reset.
        $(".passwordAlert").hide();
    });

    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    */
});

function ajax_modal(type, url, data, modal_class){
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(results){
            $('.' + modal_class).html(results);
        }
    });
}

/*
All functions take in a parameter object, just in case we have to make changes in the future, it will be quick and in one spot
Instead of all over the place
*/
function register(parameterObject){
    //Get all form data.
    var formData = $("#registerForm").serialize();

    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    displayLoad($('.register-modal-body'), parameterObject);

    ajax_modal("post", parameterObject.ajaxFunctionsPath+"?action=register", formData, "register-modal-body");

    //Hide modal after 2 seconds.
    setTimeout(function(){
        location.reload();
    }, 2000);
}

function login(parameterObject){
    //Get all form data.
    var formData = $("#loginForm").serialize();

    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    displayLoad($('.login-modal-body'), parameterObject);

    ajax_modal("post", parameterObject.ajaxFunctionsPath+"?action=login", formData, "login-modal-body");

    //Hide modal after 2 seconds.
    setTimeout(function(){
        location.reload();
    }, 2000);
}

function logout(parameterObject){
    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    displayLoad($('.logout-modal-body'), parameterObject);

    $.ajax({
       type: "GET",
        url: parameterObject.ajaxFunctionsPath+"?action=logout",
        success: function(m){
            $(".logout-modal-body").html("<h3>You are now logged out.</h3>");
        }
    });

    //Hide modal after 2 seconds.
    setTimeout(function(){
        location.reload();
    }, 2000);
}

/*
Item Crud
*/

function editItem(parameterObject){
    //Get all form data.
    var formData = $("#edit_food_form").serialize();
    //Get ID from form.
    var id = $('input[name="food_id"]').val();

    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    displayLoad($(".edit-food-modal-body"), parameterObject, false);

    //Make ajax call to update the current item.
    //In the callback function "complete", we are calling another script, passing the id along dynamically, and reloading the results instead of a page refresh.
    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=updateFood&id="+id,
        data: formData,
        success: function(results){
            $('.edit-food-modal-body').html(results);
        },
        //On complete, update info dynamically. (Updating a tr by ID)
        complete: function(){
            $.get(parameterObject.ajaxFunctionsPath+'?action=displayByID&id='+id, formData)
                .done(function(data){
                    $("#id" + id).html(data);

                    //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                    $('#id' + id).animate({
                        backgroundColor: "#87CEFA"
                    });
                    //Animate back to white with a 1 second timer.
                    $('#id' + id).animate({
                        backgroundColor: "white"
                    }, 1000);

                    //Hide modal.
                    $('#editFoodModal').modal('toggle');
                });
        }
    });
}

function addItem(parameterObject){
    //Get all form data.
    var formData = $("#add_food_form").serialize();

    $('.add-food-modal-body .addFoodFormDiv').hide();
    displayLoad($('.add-food-modal-body .item-information'), parameterObject, false);

    //Make ajax call to update the current item.
    //In the callback function "complete", we are calling another script, passing the id along dynamically, and reloading the results instead of a page refresh.
    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=addFood",
        data: formData,
        success: function(r){
            //Assign last inserted id returned from php script (echoed) into our parameter object.
            parameterObject.lastInsertID = r;

            $(".add-food-modal-body .item-information").html("<h3 class='loading-added'>Item added.</h3>");
        },
        //On complete, update info dynamically. (adding a tr with new ID)
        complete: function(r){
            $.get(parameterObject.ajaxFunctionsPath+'?action=displayByID&id='+parameterObject.lastInsertID)
                .done(function(data){

                    $('#addFoodModal').modal('toggle');

                    //Hide all fields & errors.
                    $('.add-food-modal-body .loading-added').hide();
                    $('.add-food-modal-body .displayDateAlert').hide();
                    $('.add-food-modal-body .displayPriceAlert').hide();
                    $('.add-food-modal-body .displayAlert').hide();

                    //In the jquery selector, we are specifying to append to the last tr, much like a CSS psuedo selector.
                    $('.food-table tr:last').after("<tr id='id"+parameterObject.lastInsertID+"'>" + data + "</tr>");

                    //This is used to scroll down to the newly added element.
                    $('html, body').animate({
                        scrollTop: $('#id' + parameterObject.lastInsertID).offset().top
                    });

                    //This is to animate and show the user which item they just added.
                    //Used http://codepen.io/anon/pen/LyiFg for reference.

                    //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                    $('#id' + parameterObject.lastInsertID).animate({
                        backgroundColor: "#87CEFA"
                    });
                    //Animate back to white with a 1 second timer.
                    $('#id' + parameterObject.lastInsertID).animate({
                        backgroundColor: "white"
                    }, 1000)
                });
        }
    });
}

function deleteItem(parameterObject){
    var id = parameterObject.foodID;

    displayLoad($('.delete-modal-body .item-information'), parameterObject, false);

    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=delete&id="+id,
        data: {food_id: id},
        success: function(results){
            $('.delete-modal-body .item-information').html(results);
            //This removes the item in an animated way.
            //Using fadeout method to slowly make it "hide", then calling a callback function to actually remove this element from the DOM.
            $('#id' + id).fadeOut("slow", function(){
                $(this).remove();
            });
        }
    });
}

function uploadImage(parameterObject){
    //Used this page for help & reference for this function (May need updating for older browser functionality)
    //http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload (Last solution)
    var form = $('#upload_form')[0];
    var formData = new FormData(form);
    formData.append('image', $('input[type=file]')[0].files[0]);

    //Get ID from form.
    var id = $('input[name="food_id"]').val();

    $.ajax({
        type: 'POST',
        url: parameterObject.ajaxFunctionsPath+'?action=upload&id='+id,
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        success: function (r) {
            $('.upload-modal-body').html(r);
        },
        //On complete, update image reference on main page and edit page
        complete: function(){
            //Updating entire tr on home page.
            $.get(parameterObject.ajaxFunctionsPath+'?action=displayByID&id='+id, function(data){
                $("#id" + id).html(data);
            });

            //Updating image by id on edit modal.
            $.get(parameterObject.ajaxFunctionsPath+'?action=displayUploadedImage&id='+id, function(data){
               $('#edit-food-image' + id).html(data);
            });

            //Toggle modals.
            $('#uploadModal').modal('toggle');
            $('#editFoodModal').modal('toggle');
        }
    });
}

//Display all records.
function displayDefaultTable(parameterObject){
    displayLoad($('.panel-body .food-table'), parameterObject);

    $.ajax({
        type: 'post',
        url: parameterObject.ajaxFunctionsPath+'?action=display_food_table',
        success: function(r){
            $('.panel-body .food-table').removeClass('text-center').html(r);
        }
    });
}

/*
 -------------------------------------------------------------------------------------------------------------------------------------------------------
 */

/*
Category Crud
 */

//Display all records.
function displayDefaultCategoryTable(parameterObject){
    displayLoad($('.panel-body .category-table'), parameterObject);

    $.ajax({
        type: 'post',
        url: parameterObject.ajaxFunctionsPath+'?action=display_category_table',
        success: function(r){
            $('.panel-body .category-table').removeClass('text-center').html(r);
        }
    });
}

function addCategory(parameterObject){
    var formData = $("#add_category_form").serialize();

    $(".add-category-modal-body .loading").html("<img class='img-rounded loading' src='"+parameterObject.loadingGifPath+"'/>");

    $.ajax({
        type: 'post',
        url: parameterObject.ajaxFunctionsPath+"?action=addCategory",
        data: formData,
        success: function(r){
            if(r == "Taken"){
                $(".add-category-modal-body .loading").html("<h3>Name already taken; try a different one.</h3>");
            }else{
                $(".add-category-modal-body .loading").html("<h3>Name added.</h3>");

                parameterObject.lastInsertID = r;
                $.get(parameterObject.ajaxFunctionsPath+'?action=displayByIDCategory&id='+parameterObject.lastInsertID)
                    .done(function(data){

                        $('#addCategoryModal').modal('toggle');

                        //In the jquery selector, we are specifying to append to the last tr, much like a CSS psuedo selector.
                        $('.category-table tr:last').after("<tr id='cid"+parameterObject.lastInsertID+"'>" + data + "</tr>");

                        //This is used to scroll down to the newly added element.
                        $('html, body').animate({
                            scrollTop: $('#cid' + parameterObject.lastInsertID).offset().top
                        });

                        //This is to animate and show the user which item they just added.
                        //Used http://codepen.io/anon/pen/LyiFg for reference.

                        //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                        $('#cid' + parameterObject.lastInsertID).animate({
                            backgroundColor: "#87CEFA"
                        });
                        //Animate back to white with a 1 second timer.
                        $('#cid' + parameterObject.lastInsertID).animate({
                            backgroundColor: "white"
                        }, 1000)
                    });
            }
        }
    });
}

function deleteCategory(parameterObject, id){
    $('.delete-category-modal-body .item-information').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=deleteCategory&id="+id,
        data: {type_id: id},
        success: function(results){
            $('.delete-category-modal-body .item-information').html(results);
            //This removes the item in an animated way.
            //Using fadeout method to slowly make it "hide", then calling a callback function to actually remove this element from the DOM.
            $('#cid' + id).fadeOut("slow", function(){
                $(this).remove();
            });
        },
        complete: function(){
            $('#deleteCategoryModal').modal('toggle');
        }
    });
}

function editCategory(parameterObject){
    var formData = $("#edit_category_form").serialize();

    //Get ID from form. (hidden)
    var id = $('input[name="type_id"]').val();

    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    $(".edit-category-modal-body").addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

    //Make ajax call to update the current item.
    //In the callback function "complete", we are calling another script, passing the id along dynamically, and reloading the results instead of a page refresh.
    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=updateCategory&id="+id,
        data: formData,
        success: function(results){
            $('.edit-category-modal-body').html(results);
        },
        //On complete, update info dynamically. (Updating a tr by ID)
        complete: function(){
            $.get(parameterObject.ajaxFunctionsPath+'?action=displayByIDCategory&id='+id, formData)
                .done(function(data){
                    $("#cid" + id).html(data);

                    //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                    $('#cid' + id).animate({
                        backgroundColor: "#87CEFA"
                    });
                    //Animate back to white with a 1 second timer.
                    $('#cid' + id).animate({
                        backgroundColor: "white"
                    }, 1000);

                    //Hide modal.
                    $('#editCategoryModal').modal('toggle');
                });
        }
    });
}

/*
 -------------------------------------------------------------------------------------------------------------------------------------------------------
 */

/*
Specials Crud
 */

//Display all records.
function displayDefaultSpecialTable(parameterObject){
    displayLoad($('.panel-body .special-table'), parameterObject);

    $.ajax({
        type: 'post',
        url: parameterObject.ajaxFunctionsPath+'?action=display_special_table',
        success: function(r){
            $('.panel-body .special-table').removeClass('text-center').html(r);
        }
    });
}

function addSpecial(parameterObject){
    //Get all form data.
    var formData = $("#add_special_form").serialize();

    $('.add-special-modal-body .addSpecialFormDiv').hide();
    $(".add-special-modal-body .item-information").html("<img class='img-rounded loading' src='"+parameterObject.loadingGifPath+"'/>");

    //Make ajax call to update the current item.
    //In the callback function "complete", we are calling another script, passing the id along dynamically, and reloading the results instead of a page refresh.
    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=addSpecial",
        data: formData,
        success: function(r){
            //Assign last inserted id returned from php script (echoed) into our parameter object.
            parameterObject.lastInsertID = r;


            $(".add-special-modal-body .item-information").html("<h3 class='loading-added'>Special added.</h3>");
        },
        //On complete, update info dynamically. (adding a tr with new ID)
        complete: function(){
            $.get(parameterObject.ajaxFunctionsPath+'?action=displaySpecialByID&id='+parameterObject.lastInsertID)
                .done(function(data){

                    $('#addSpecialModal').modal('toggle');

                    //Hide all fields & errors.
                    $('.add-special-modal-body .displayDateAlert').hide();
                    $('.add-special-modal-body .displayNumericAlert').hide();
                    $('.add-special-modal-body .displayAlert').hide();

                    //In the jquery selector, we are specifying to append to the last tr, much like a CSS psuedo selector.
                    $('.special-table tr:last').after("<tr id='sid"+parameterObject.lastInsertID+"'>" + data + "</tr>");

                    //This is used to scroll down to the newly added element.
                    $('html, body').animate({
                        scrollTop: $('#sid' + parameterObject.lastInsertID).offset().top
                    });

                    //This is to animate and show the user which item they just added.
                    //Used http://codepen.io/anon/pen/LyiFg for reference.

                    //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                    $('#sid' + parameterObject.lastInsertID).animate({
                        backgroundColor: "#87CEFA"
                    });
                    //Animate back to white with a 1 second timer.
                    $('#sid' + parameterObject.lastInsertID).animate({
                        backgroundColor: "white"
                    }, 1000)
                });
        }
    });
}

function deleteSpecial(parameterObject, id){
    $('.delete-special-modal-body .item-information').html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=deleteSpecial&id="+id,
        data: {food_id: id},
        success: function(results){
            $('.delete-special-modal-body .item-information').html(results);
            //This removes the item in an animated way.
            //Using fadeout method to slowly make it "hide", then calling a callback function to actually remove this element from the DOM.
            $('#sid' + id).fadeOut("slow", function(){
                $(this).remove();
            });
        }
    });
}

function editSpecial(parameterObject){
    //Get all form data.
    var formData = $("#edit_special_form").serialize();
    //Get ID from form.
    var id = $('input[name="special_id"]').val();

    //Show loading gif (pulling from a parameter object we are pulling in.
    //Doing it this way so we can make changes in one place in the future, instead of all over the place.
    $(".edit-special-modal-body").addClass("text-center").html("<img class='img-rounded' src='"+parameterObject.loadingGifPath+"'/>");

    //Make ajax call to update the current item.
    //In the callback function "complete", we are calling another script, passing the id along dynamically, and reloading the results instead of a page refresh.
    $.ajax({
        type: "POST",
        url: parameterObject.ajaxFunctionsPath+"?action=updateSpecial&id="+id,
        data: formData,
        success: function(results){
            $('.edit-special-modal-body').html(results);
        },
        //On complete, update info dynamically. (Updating a tr by ID)
        complete: function(){
            $.get(parameterObject.ajaxFunctionsPath+'?action=displaySpecialByID&id='+id, formData)
                .done(function(data){
                    $("#sid" + id).html(data);

                    //Change color to a lightblue to indicate newly-added item. (Tried using .css and changing background-color that way; didn't work as intended
                    $('#sid' + id).animate({
                        backgroundColor: "#87CEFA"
                    });
                    //Animate back to white with a 1 second timer.
                    $('#sid' + id).animate({
                        backgroundColor: "white"
                    }, 1000);

                    //Hide modal.
                    $('#editSpecialModal').modal('toggle');
                });
        }
    });
}

function uploadSpecialImage(parameterObject){
    //Used this page for help & reference for this function (May need updating for older browser functionality)
    //http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload (Last solution)
    var form = $('#upload_special_form')[0];
    var formData = new FormData(form);
    formData.append('image', $('input[type=file]')[0].files[0]);

    //Get ID from form.
    var id = $('input[name="special_id"]').val();

    $.ajax({
        type: 'POST',
        url: parameterObject.ajaxFunctionsPath+'?action=upload&id='+id+"&upload_type=special",
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        success: function (r) {
            $('.upload-special-modal-body').html(r);
        },
        //On complete, update image reference on main page and edit page
        complete: function(){
            //Updating entire tr on home page.
            $.get(parameterObject.ajaxFunctionsPath+'?action=displaySpecialByID&id='+id, function(data){
                $("#sid" + id).html(data);
            });

            //Updating image by id on edit modal.
            $.get(parameterObject.ajaxFunctionsPath+'?action=displaySpecialUploadedImage&id='+id, function(data){
                $('#edit-special-image' + id).html(data);
            });

            //Toggle modals.
            $('#uploadSpecialModal').modal('toggle');
            $('#editSpecialModal').modal('toggle');
        }
    });
}

/*
 -------------------------------------------------------------------------------------------------------------------------------------------------------
 */

/*
//Misc Functions
 */

//Helper method to resolve displaying of Images and formatting
function displayLoad(path, parameterObject, showText){
    if(showText) {
        path.addClass('text-center').html("<img class='img-rounded' src='" + parameterObject.loadingGifPath + "'/>").append("<h3>Getting data..</h3>");
    }else{
        path.addClass('text-center').html("<img class='img-rounded' src='" + parameterObject.loadingGifPath + "'/>");
    }
}

//To limit food description from going over the max allowed in database.
function countTextArea() {
    var maxLength = 250;
    $('textarea').keyup(function () {
        var length = $(this).val().length;
        length = maxLength - length;
        $(".remainingCount").text("Remaining characters: " + length);

        //Display a little warning message if they've gone over the limit.
        if (length == 0) {
            $(".remainingCount").addClass("red").append("<br />No more room for characters.");
        } else {
            $(".remainingCount").removeClass("red");
        }
    });
}

//For delays when user is typing in a search, so we don't make a request to the server every single time they type a letter.
//Reference: http://stackoverflow.com/questions/7849221/ajax-delay-for-search-on-typing-in-form-field

var delayTimer;
function doSearch(search, parameterObject) {
    displayLoad($('.panel-body .food-table'), parameterObject);

    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        $.ajax({
            type: 'post',
            url: parameterObject.ajaxFunctionsPath+'?action=display_food_table_search&search='+search,
            success: function(r){
                $('.panel-body .food-table').removeClass('text-center').html(r);
            }
        });
    }, 650); //However long the delay should be in ms.
}

function doCategorySearch(search, parameterObject) {
    displayLoad($('.panel-body .category-table'), parameterObject);

    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        $.ajax({
            type: 'post',
            url: parameterObject.ajaxFunctionsPath+'?action=display_category_table&search='+search,
            success: function(r){
                $('.panel-body .category-table').removeClass('text-center').html(r);
            }
        });
    }, 650); //However long the delay should be in ms.
}

function doSpecialSearch(search, parameterObject) {
    displayLoad($('.panel-body .special-table'), parameterObject);

    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        $.ajax({
            type: 'post',
            url: parameterObject.ajaxFunctionsPath + '?action=display_special_table&search=' + search,
            success: function (r) {
                $('.panel-body .special-table').removeClass('text-center').html(r);
            }
        });
    }, 650); //However long the delay should be in ms.
}
/*
 -------------------------------------------------------------------------------------------------------------------------------------------------------
*/

