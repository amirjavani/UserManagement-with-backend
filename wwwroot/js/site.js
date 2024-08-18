// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


let deleteList =[]
let users=[]
let table = null;
let currentPage = 1;
let pageSize = 7
let whileSreach = false;
let groups = [];


function renderPagination(current, totalPages) {
   
    $('#prev').toggleClass('text-dark disabled font-IYbold', (current > 1));
    $('#next').toggleClass('text-dark disabled font-IYbold', (current < totalPages));


    $('#pages').empty()
    for (let i = 1; i <= totalPages; i++) {

        if (i == current) {
            $('#pages').append('<div class="active-button" onclick="pageButton(' + (i) + ')" >' + (i) + '</div>');
        } else {
            $('#pages').append('<div class="" onclick="pageButton(' + (i) + ')" >' + (i) + '</div>');
        }
        
    }
    
    $('#prev').off('click').on('click', function () {
        if (current > 1) {
            currentPage--;
            fetchData(currentPage);
        }
    });

    $('#next').off('click').on('click', function () {
        if (current < totalPages) {
            currentPage++;
            fetchData(currentPage);
        }
    });
}

function pageButton(i) {
    if (!(i == currentPage)){
        currentPage = i;
        fetchData(currentPage);
    }
    
}

function handleCheckboxChange(checkbox, id) {
    
    if (checkbox.checked) {
        deleteList = [...deleteList, id]

    } else {
        deleteList = deleteList.filter(function (e) { return e !== id }  )

    }
}

function closeModal() {
    $('#modal').fadeOut()
}


$(document).ready(function () {
    
    
    
    
    $('table').on('mouseenter', '#three-button button', function () {
        $(this).find('i').stop(true, true).hide();
        $(this).find('span').stop(true, true).fadeIn();
    });

    $('table').on('mouseleave', '#three-button button', function () {
        $(this).find('span').stop(true, true).hide();
        $(this).find('i').stop(true, true).fadeIn();
    });


    let timeoutId;
    $('#search-input').on('input', function () {
        if (timeoutId) {
                        clearTimeout(timeoutId);
        }
        if ($(this).val() === '') {
            whileSreach = false;
            fetchData(1);
        } else {
            
            timeoutId = setTimeout(() => {
                whileSreach = true;
                console.log(whileSreach, $(this).val())
                fetchData(1);
            }, 300);
        }


    });


    
    $('#alert button').click(
        function () {
            $('#alert').fadeOut();  
        }
    );


    $('#modal').hide();
    



    $('#close-modal-button').click(function () {
        closeModal()
    });

    $(window).click(function (event) {
        if ($(event.target).is($('#modal'))) {
            closeModal()
        }
    });


    $(window).click(function (event) {
        if (!$(event.target).is($('#alert'))) {
            $('#alert').hide()
        }
    });


    



    
    

})