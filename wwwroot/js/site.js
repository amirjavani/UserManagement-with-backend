// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


let deleteList =[]
let users=[]
let table = null;
let currentPage = 2;
let pageSize = 5



function edit(button,ID) {
    
       
    $('.modal-error').hide();
    $('#modal h3').text('ویرایش');
    $('form')[0].reset();
    $('#modal').fadeIn();


    var firstName = $(button).closest('tr').find('td').eq(1).text();
    var lastName = $(button).closest('tr').find('td').eq(2).text();
    var phone = $(button).closest('tr').find('td').eq(3).text();
    var state = $(button).closest('tr').find('td').eq(4).text();
    var city = $(button).closest('tr').find('td').eq(5).text();
    
    
    $('#firstName-input').val(firstName);
    $('#lastName-input').val(lastName);
    $('#phone-input').val(phone);
    $('#city-input').val(city);
    $('#state-input').val(state);
    $('#id-input').val(ID);
    

    $('#modal-submit-button').off('click').click(function () {
        
        $('.modal-error').hide()
        let firstName = $('#firstName-input').val();
        let lastName = $('#lastName-input').val();
        let phone = $('#phone-input').val();
        let city = $('#city-input').val();
        let state = $('#state-input').val();
        let id = $('#id-input').val();


        var idRegex = /^[1-9][0-9]{5}$/
        var phoneRegex = /^[0-9]{11}$/
        var perRegex = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/

        let FN = false;
        let LN = false;
        let PH = false;
        let ST = false;
        let CT = false;
        let IDv = false;

        if (firstName === '' || lastName === '' || phone === '' || city === '' || state === '' || id === '') {

            $('.modal-error').eq(5).text('فیلدی نباید خالی باشد!')
            $('.modal-error').eq(5).show();
            return null;
        } if (!perRegex.test(firstName)) {
            $('.modal-error').eq(0).text('ورودی نامعتبر!')
            $('.modal-error').eq(0).show();
            FN = true;

        } if (!perRegex.test(lastName)) {
            $('.modal-error').eq(1).text('ورودی نامعتبر!')
            $('.modal-error').eq(1).show();

            LN = true;

        } if (!perRegex.test(city)) {
            $('.modal-error').eq(3).text('ورودی نامعتبر!')
            $('.modal-error').eq(3).show();

            ST = true;

        } if (!perRegex.test(state)) {
            $('.modal-error').eq(4).text('ورودی نامعتبر!')
            $('.modal-error').eq(4).show();

            CT = true;
        } if (!phoneRegex.test(phone)) {
            $('.modal-error').eq(2).text('شماره تلفن نامعتبر!')
            $('.modal-error').eq(2).show();
            PH = true;

        } if (!idRegex.test(id)) {
            $('.modal-error').eq(5).text('کد پرسنلی باید 6 رقم باشد و با صفر شروع نشود!')
            $('.modal-error').eq(5).show();
            IDv = true;

        } if (users.some(u => u.id === id && parseInt(u.id) !== ID)) {
            $('.modal-error').eq(5).text('کد پرسنلی تکراری است!!')
            $('.modal-error').eq(5).show();
            IDv = true
        }

        if (FN || LN || PH || ST || CT || IDv) {
            return null;
        }

        user = {
            "firstName": firstName,
            "lastName": lastName,
            "phone": phone,
            "city": city,
            "state": state,
            "id": id
        };
        

        fetch('/home/edit/'+ID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.status === 409) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then(data => {
                
                fetchData(currentPage);
                closeModal();
                

            })
            .catch((error) => {
                $('.modal-error').eq(5).text('کد پرسنلی تکراری است!!')
                $('.modal-error').eq(5).show();  // Show the error message
            });


    })


}
function show(button,id) {

    var firstName = $(button).closest('tr').find('td').eq(1).text();
    var lastName = $(button).closest('tr').find('td').eq(2).text();
    var phone = $(button).closest('tr').find('td').eq(3).text();
    var state = $(button).closest('tr').find('td').eq(4).text();
    var city = $(button).closest('tr').find('td').eq(5).text();

    $('#info-form').children('p').eq(0).text(firstName)
    $('#info-form').children('p').eq(1).text(lastName)
    $('#info-form').children('p').eq(2).text(phone)
    $('#info-form').children('p').eq(3).html(state+'<span></span>')
    $('#info-form p  span').text('، ' + city)
    $('#info-form').children('p').eq(4).text(id)

}
function singleDelete(id) {
    $('#delete-modal-id').text(id);
    $('#delete-modal-submit').off('click').on('click', function () {
        
        users = users.filter(function (user) {
            if ( !(id===parseInt(user.id)) ) {
                return user;
            }
        });
        rewriteTable();
    });

}

function downloadCSVfile() {

    if (users.length == 0) {
        console.log('empty table')
        return null;
    }
    let csv = '';

    csv += '\uFEFF';

    const headers = Object.keys(users[0]);
    csv += headers.join(',') + '\n';

    users.forEach(obj => {
        const values = headers.map(header => obj[header]);
        csv += values.join(',') + '\n';
    });

    console.log(csv);
    const blob = new Blob([new TextEncoder('utf-16le').encode(csv)], { type: 'text/csv;charset=utf-16le;' });
    const url = window.URL.createObjectURL(blob);
    const a = $('<a></a>').attr('href', url).attr('download', 'data.csv');

    $('body').append(a);
    a[0].click();
    a.remove(); 

    window.URL.revokeObjectURL(url); 
}

function fetchData(page) {


    fetch(`/Home/fetch?page=${page}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            fillTable(data.data);
            renderPagination(data.currentPage, data.totalPages);
        });

}

function fillTable(data) {
    
    var tbody = $('tbody');
    $('table').hide();
    tbody.empty();
    


    data.forEach(item => {
        var row = "<tr>" +
            '<td> <input type=\"checkbox\" value=\"' + item.id + '\" class=\"check-box\" onchange=\"handleCheckboxChange(this,' + item.id + ')\"></input ></td>' +
            '<td>' + item.firstName + "</td>" +
            '<td>' + item.lastName + "</td>" +
            '<td>' + item.phone + "</td>" +
            '<td>' + item.city + "</td>" +
            '<td>' + item.state + "</td>" +
            '<td>' +
                '<div id="three-button" class=\"d-flex flex-row gap-2 justify-content-center \">'+
                      '<button data-bs-toggle="modal" data-bs-target="#delete-modal" id="single-delete-button" class="text-white" onclick=\"singleDelete(' + item.id +')\"><i class=\"three-button bi bi-trash3\"></i><span ">حذف</span></button>'+
                      '<button  id="edit-button" onclick=\"edit(this,' + item.id +')\"><i class=\"three-button bi bi-pencil-square\"></i><span class="">ویرایش</span></button>'+
                      '<button data-bs-toggle="modal" data-bs-target="#show-info-modal" id="show-button" onclick=\"show(this,' + item.id +')\"><i class=\"three-button bi bi-card-text\"></i><span class="">نمایش</span></button>'+
                '</div>' +
            '</td>'+
            "</tr> ";
        tbody.append(row);
    });

    $('#spinner').hide();
    $('.table-container').css('visibility', 'visible');
    $('table').fadeIn();
    $('#three-button button span').hide();

}

function renderPagination(current, totalPages) {
   
    $('#prev').toggleClass('text-dark disabled', !(current > 1));
    $('#next').toggleClass('text-dark disabled', !(current < totalPages));


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
    currentPage = i;
    fetchData(currentPage);
}



function saveData() {

    fetch('/home/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            $('#alert').fadeIn(200);
            $('#alert').fadeOut(2000);
        })
        .catch(error => {
            console.error('There was a problem with the save operation:', error);
        });
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
function rewriteTable() {
    table.clear()

    if (users) {
        users.forEach(function (user) {
            table.row.add([
                ' <input type=\"checkbox\" value=\"' + user.id + '\" class=\"check-box\" onchange=\"handleCheckboxChange(this,' + user.id + ')\"></input >',
                user.firstName,
                user.lastName,
                user.phone,
                user.city,
                user.state,
                '<td>' +
                '<div id="three-button" class=\"d-flex flex-row gap-2 justify-content-center \">' +
                '<button data-bs-toggle="modal" data-bs-target="#delete-modal" id="single-delete-button" class="text-white" onclick=\"singleDelete(' + user.id + ')\"><i class=\"three-button bi bi-trash3\"></i><span ">حذف</span></button>' +
                '<button  id="edit-button" onclick=\"edit(' + user.id + ')\"><i class=\"three-button bi bi-pencil-square\"></i><span class="">ویرایش</span></button>' +
                '<button data-bs-toggle="modal" data-bs-target="#show-info-modal" id="show-button" onclick=\"show(' + user.id + ')\"><i class=\"three-button bi bi-card-text\"></i><span class="">نمایش</span></button>' +
                '</div>' +
                '</td>'
            ])
        })


    }
    table.draw();
}


$(document).ready(function () {

    fetchData(currentPage);

    
    $('table').on('mouseenter', '#three-button button', function () {
        $(this).find('i').stop(true, true).hide();
        $(this).find('span').stop(true, true).fadeIn();
    });

    $('table').on('mouseleave', '#three-button button', function () {
        $(this).find('span').stop(true, true).hide();
        $(this).find('i').stop(true, true).fadeIn();
    });

    
    $('#alert button').click(
        function () {
            $('#alert').fadeOut();  
        }
    );


    $('#delete-button').click(function () {

        users = users.filter(function (user) {
            if (!deleteList.includes(parseInt(user.id))) {
                return user;
            }
        });

        rewriteTable();
       
       deleteList = []
    });

    $('#modal').hide();
    $('#add-button').click(function () {
        $('#modal h3').text('افزودن');
        $('.modal-error').hide()
        $('form')[0].reset();
        $('#modal').fadeIn()

        $('#modal-submit-button').off('click').click(function () {
            $('.modal-error').hide()
            let firstName = $('#firstName-input').val();
            let lastName = $('#lastName-input').val();
            let phone = $('#phone-input').val();
            let city = $('#city-input').val();
            let state = $('#state-input').val();
            let id = $('#id-input').val();

            var idRegex = /^[1-9][0-9]{5}$/
            var phoneRegex = /^[0-9]{11}$/
            var perRegex = /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/

            let FN = false;
            let LN = false;
            let PH = false;
            let ST = false;
            let CT = false;
            let ID = false;

            if (firstName === ''|| lastName === ''||phone === ''|| city === ''|| state === ''|| id === '') {

                $('.modal-error').eq(5).text('فیلدی نباید خالی باشد!')
                $('.modal-error').eq(5).show();
                return null;
            }  if (!perRegex.test(firstName) ) {
                $('.modal-error').eq(0).text('ورودی نامعتبر!')
                $('.modal-error').eq(0).show();
                FN = true;
                 
            }if ( !perRegex.test(lastName) ) {
                $('.modal-error').eq(1).text('ورودی نامعتبر!')
                $('.modal-error').eq(1).show();
                
                LN = true;
                  
            }if ( !perRegex.test(city) ) {
                $('.modal-error').eq(3).text('ورودی نامعتبر!')
                $('.modal-error').eq(3).show();
               
                ST = true;
                
            }if ( !perRegex.test(state)) {
                $('.modal-error').eq(4).text('ورودی نامعتبر!')
                $('.modal-error').eq(4).show();
                
                CT = true;  
            }  if (!phoneRegex.test(phone)) {
                $('.modal-error').eq(2).text('شماره تلفن نامعتبر!')
                $('.modal-error').eq(2).show();
                PH = true;
                
            }  if (!idRegex.test(id)) {
                $('.modal-error').eq(5).text('کد پرسنلی باید 6 رقم باشد و با صفر شروع نشود!')
                $('.modal-error').eq(5).show();
                ID = true;
                
            }
                    
            if (FN || LN || PH || ST || CT || ID) {
                return null;
            }

            const user = {
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "city": city,
                "state": state,
                "id": id
            }

            fetch('/home/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
                .then(response => {
                    if (response.status === 409) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message) {
                        fetchData(currentPage);
                        closeModal();

                    } 
                      
                })
                .catch((error) => {
                    $('.modal-error').eq(5).text('کد پرسنلی تکراری است!!')
                    $('.modal-error').eq(5).show();  // Show the error message
                });
            

            

        });

    });


    

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