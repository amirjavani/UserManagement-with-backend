﻿
function userEdit(button, ID) {


    $('.modal-error').hide();
    $('#modal h3').text('ویرایش');
    $('form')[0].reset();
    $('#add-submit-button').hide();
    $('#edit-submit-button').show();
    $('#modal').fadeIn();


    var firstName = $(button).closest('tr').find('td').eq(1).text();
    var lastName = $(button).closest('tr').find('td').eq(2).text();
    var phone = $(button).closest('tr').find('td').eq(3).text();
    var state = $(button).closest('tr').find('td').eq(4).text();
    var city = $(button).closest('tr').find('td').eq(5).text();
    var group = $(button).closest('tr').find('td').eq(6).text();


    $('#firstName-input').val(firstName);
    $('#lastName-input').val(lastName);
    $('#phone-input').val(phone);
    $('#city-input').val(city);
    $('#state-input').val(state);
    $('#group-select').val(group);
    $('#id-input').val(ID);


    $('#edit-submit-button').off('click').click(function () {

        $('.modal-error').hide()
        let firstName = $('#firstName-input').val();
        let lastName = $('#lastName-input').val();
        let phone = $('#phone-input').val();
        let city = $('#city-input').val();
        let state = $('#state-input').val();
        let group = $('#group-select').val();
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
        $('#edit-submit-modal').modal('show');
        $('#edit-submit-modal-button').off('click').click(function () {
            user = {
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "city": city,
                "state": state,
                "group": group,
                "id": id
            };


            fetch('/user/edit-user/' + ID, {
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
                    $('.modal-error').eq(5).show();
                });

        });




    })


}

function showUserInfo(button, id) {

    var firstName = $(button).closest('tr').find('td').eq(1).text();
    var lastName = $(button).closest('tr').find('td').eq(2).text();
    var phone = $(button).closest('tr').find('td').eq(3).text();
    var state = $(button).closest('tr').find('td').eq(4).text();
    var city = $(button).closest('tr').find('td').eq(5).text();
    var group = $(button).closest('tr').find('td').eq(6).text();


    $('#info-form').children('div').eq(0).html('<p>نام: </p>'+
                            '<p> نام خانوادگی: </p>'+
                            '<p>تلفن: </p>'+
                           ' <p>آدرس: </p>'+
                            '<p>گروه: </p>' +
                            '<p>کد پرسنلی: </p>' 
                            )

    $('#info-form').children('div').eq(1).empty();

    $('#info-form').children('div').eq(1).append('<p>' + firstName + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + lastName + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + phone + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + state + '، ' + city + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + group + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + id + '</p>')

    

}

function downloadCSVfile() {


    fetch('/user-csv-file-download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            let users = data.data;

            if (users.length === 0) {
                console.log('empty table');
                return null;
            }

            let csv = '';
            csv += '\uFEFF';


            const headers = Object.keys(users[0]);
            csv += headers.join(',') + '\n';


            users.forEach(obj => {
                const values = headers.map(header => {

                    const value = obj[header] || '';
                    return `"${value.toString().replace(/"/g, '""')}"`;
                });
                csv += values.join(',') + '\n';
            });


            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);


            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();


            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
        });




}

function addUser() {
    $('#modal h3').text('افزودن');
    $('.modal-error').hide()
    $('#add-submit-button').show();
    $('#edit-submit-button').hide();
    $('form')[0].reset();
    $('#modal').fadeIn();



    $('#add-submit-button').off('click').click(function () {
        $('.modal-error').hide()
        let firstName = $('#firstName-input').val();
        let lastName = $('#lastName-input').val();
        let phone = $('#phone-input').val();
        let city = $('#city-input').val();
        let state = $('#state-input').val();
        let group = $('#group-select').val();
        let id = $('#id-input').val();

        var idRegex = /^[1-9][0-9]{5}$/
        var phoneRegex = /^[0-9]{11}$/
        var perRegex = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/

        let FN = false;
        let LN = false;
        let PH = false;
        let ST = false;
        let CT = false;
        let ID = false;

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
            "group": group,
            "id": id
        }

        fetch('/user/add-new-user', {
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

}

function fetchData(page) {
    

    if (whileSreach) {
        let input = $('#search-input').val();
        fetch(`/user/search?page=${page}&pageSize=${pageSize}&input=${input}`)
            .then(response => response.json())
            .then(data => {
                
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
            });
    } else {
        fetch(`/user/fetch-table?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
            });
    }

}

function singleDelete(id) {
    $('#delete-modal-id').text(id);
    $('#delete-modal-submit').off('click').on('click', function () {

        fetch('/user/single-delete/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        })
            .then(response => {
                if (response.status === 409) {
                    return response.text().then(text => { throw new Error(text); });
                }
                fetchData(currentPage);
                closeModal();
                return response.json();
            });
    });

}

function getGroups() {

    fetch(`/groups`)
        .then(response => response.json())
        .then(data => {
            
            groups = data.data;
            groups.map(g => {
                $('#group-select').append('<option value="' + g.groupName + '">' + g.groupName + '</option>')
            })

                ;
        });

}

function DeleteSelectedUsers() {


    $('#group-delete-modal').modal('show');
    $('#group-delete-modal-id').html(
        deleteList.map(e => '<span> ' + e + '</span>').join('،')
    );
    $('#group-delete-modal-submit').off('click').click(function () {


        fetch('/user/user-list-delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteList)

        })
            .then(response => {
                if (response.status === 409) {
                    return response.text().then(text => { throw new Error(text); });
                }
                fetchData(currentPage);

            });

        deleteList = []

    });



}

function fillTable(data) {
    deleteList = []
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
            '<td>' + item.group + "</td>" +
            '<td>' +
            '<div id="three-button" class=\"d-flex flex-row gap-2 justify-content-center \">' +
            '<button data-bs-toggle="modal" data-bs-target="#delete-modal" id="single-delete-button" class="text-white" onclick=\"singleDelete(' + item.id + ')\"><i class=\"three-button bi bi-trash3\"></i><span ">حذف</span></button>' +
            '<button  id="edit-button" onclick=\"userEdit(this,' + item.id + ')\"><i class=\"three-button bi bi-pencil-square\"></i><span class="">ویرایش</span></button>' +
            '<button data-bs-toggle="modal" data-bs-target="#show-info-modal" id="show-button" onclick=\"showUserInfo(this,' + item.id + ')\"><i class=\"three-button bi bi-card-text\"></i><span class="">نمایش</span></button>' +
            '</div>' +
            '</td>' +
            "</tr> ";
        tbody.append(row);
    });

    $('#spinner').hide();
    $('.table-container').css('visibility', 'visible');
    $('table').fadeIn();
    $('#three-button button span').hide();

}

$(document).ready(function () {
    getGroups();
    fetchData(currentPage);
    console.log('users')
})