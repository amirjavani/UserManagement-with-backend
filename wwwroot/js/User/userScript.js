

var userChartData = []
var chartTitle;
var usersData;
var userChartShow = false;
var userBarChart;

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
    var birth = $(button).closest('tr').find('td').eq(6).text();
    var group = $(button).closest('tr').find('td').eq(7).text();


    $('#firstName-input').val(firstName);
    $('#lastName-input').val(lastName);
    $('#phone-input').val(phone);
    $('#city-input').val(city);
    $('#state-input').val(state);
    $('#user-birth-input').val(birth);
    $('#group-select').val(group);
    $('#id-input').val(ID);


    $(' #modal input').each(function () {
        if ($(this).val()) {
            // If the input has a value, move the label to the active position
            $(this).closest('div').find('label').css({
                right: '-7px',
                top: '-2px',
                fontSize: '10px',// Adjust this to your preferred active font size
            });
        }
    });

    $('#edit-submit-button').off('click').click(function () {

        $('.modal-error').hide()
        let firstName = $('#firstName-input').val();
        let lastName = $('#lastName-input').val();
        let phone = $('#phone-input').val();
        let city = $('#city-input').val();
        let state = $('#state-input').val();
        let group = $('#group-select').val();
        let birth = $('#user-birth-input').val();
        let id = $('#id-input').val();


        var idRegex = /^[1-9][0-9]{5}$/
        var phoneRegex = /^[0-9]{11}$/
        const perRegex = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی\s]+$/
        const specialRegex = /[~!@#$%^&*{}\[\]\\/]/;



        let FN = false;
        let LN = false;
        let PH = false;
        let ST = false;
        let CT = false;
        let IDv = false;

        if (firstName === '' || lastName === '' || phone === '' || city === '' || state === '' || id === '' || birth === '') {

            $('.modal-error').eq(6).text('فیلدی نباید خالی باشد')
            $('.modal-error').eq(6).show();
            return null;
        } if (group === '') {

            $('.modal-error').eq(6).text('لطفا گروه را مشخص کنید')
            $('.modal-error').eq(6).show();
            return null;
        }
        if (!perRegex.test(firstName)) {
            $('.modal-error').eq(0).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(0).show();
            FN = true;

        } if (specialRegex.test(firstName)) {
            $('.modal-error').eq(0).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(0).show();
            FN = true;

        } if (!perRegex.test(lastName)) {
            $('.modal-error').eq(1).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(1).show();

            LN = true;

        } if (specialRegex.test(lastName)) {
            $('.modal-error').eq(1).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(1).show();

            LN = true;

        } if (!perRegex.test(city)) {
            $('.modal-error').eq(4).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(4).show();

            ST = true;

        } if (specialRegex.test(city)) {
            $('.modal-error').eq(4).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(4).show();

            ST = true;

        } if (!perRegex.test(state)) {
            $('.modal-error').eq(3).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(3).show();

            CT = true;
        } if (specialRegex.test(state)) {
            $('.modal-error').eq(3).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(3).show();

            CT = true;
        } if (!phoneRegex.test(phone)) {
            $('.modal-error').eq(2).text('شماره تلفن نامعتبر.')
            $('.modal-error').eq(2).show();
            PH = true;

        } if (!idRegex.test(id)) {
            $('.modal-error').eq(5).text('کد پرسنلی باید شامل 6 رقم باشد و با صفر شروع نشود.')
            $('.modal-error').eq(5).show();
            IDv = true;

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
                "birthDay": birth,
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
                    $('.modal-error').eq(5).text('کد پرسنلی تکراری است')
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
    var birth = $(button).closest('tr').find('td').eq(6).text();
    var group = $(button).closest('tr').find('td').eq(7).text();


    $('#info-form').children('div').eq(0).html('<p>نام: </p>'+
                            '<p> نام خانوادگی: </p>'+
                            '<p>تلفن: </p>'+
                           ' <p>آدرس: </p>'+
                            '<p>گروه: </p>' +
                            '<p>کد پرسنلی: </p>' +
                            '<p>تاریخ تولد: </p>' 
                            )

    $('#info-form').children('div').eq(1).empty();

    $('#info-form').children('div').eq(1).append('<p>' + firstName + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + lastName + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + phone + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + state + '، ' + city + '</p>')
    
    $('#info-form').children('div').eq(1).append('<p>' + group + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + id + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + birth + '</p>')

    

}

function addUser() {
    $('#modal h3').text('افزودن');
    $('.modal-error').hide()
    $('#add-submit-button').show();
    $('#edit-submit-button').hide();
    $('form')[0].reset();
    $('#modal').fadeIn();

    


    $(' #modal input').each(function () {
        if (!($(this).val())) {
            // If the input has a value, move the label to the active position
            $(this).closest('div').find('label').css({
                right: '8px',
                top: '8px',
                fontSize: '16px'// Adjust this to your preferred active font size
            });
        }
    });

    $('#add-submit-button').off('click').click(function () {
        $('.modal-error').hide()
        let firstName = $('#firstName-input').val();
        let lastName = $('#lastName-input').val();
        let phone = $('#phone-input').val();
        let city = $('#city-input').val();
        let state = $('#state-input').val();
        let group = $('#group-select').val();
        let birth = $('#user-birth-input').val();
        let id = $('#id-input').val();

        var idRegex = /^[1-9][0-9]{5}$/
        var phoneRegex = /^[0-9]{11}$/
        const perRegex = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی\s]+$/
        const specialRegex = /[~!@#$%^&*{}\[\]\\/]/;


        let FN = false;
        let LN = false;
        let PH = false;
        let ST = false;
        let CT = false;
        let ID = false;

        if (firstName === '' || lastName === '' || phone === '' || city === '' || state === '' || id === '' || birth === '') {

            $('.modal-error').eq(7).text('فیلدی نباید خالی باشد.')
            $('.modal-error').eq(7).show();
            return null;
        }if (group === '') {

            $('.modal-error').eq(7).text('لطفا گروه را مشخص کنید.')
            $('.modal-error').eq(7).show();
            return null;
        }
        if (!perRegex.test(firstName)) {
            $('.modal-error').eq(0).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(0).show();
            FN = true;

        } if (specialRegex.test(firstName)) {
            $('.modal-error').eq(0).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(0).show();
            FN = true;

        } if (!perRegex.test(lastName)) {
            $('.modal-error').eq(1).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(1).show();

            LN = true;

        } if (specialRegex.test(lastName)) {
            $('.modal-error').eq(1).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(1).show();

            LN = true;

        } if (!perRegex.test(city)) {
            $('.modal-error').eq(4).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(4).show();

            ST = true;

        } if (specialRegex.test(city)) {
            $('.modal-error').eq(4).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(4).show();

            ST = true;

        } if (!perRegex.test(state)) {
            $('.modal-error').eq(3).text('فقط حروف فارسی مجاز است.')
            $('.modal-error').eq(3).show();

            CT = true;
        } if (specialRegex.test(state)) {
            $('.modal-error').eq(3).text('ورودی شامل [~!@#$%^&*{}\[\]\\/] نباید باشد.')
            $('.modal-error').eq(3).show();

            CT = true;
        } if (!phoneRegex.test(phone)) {
            $('.modal-error').eq(2).text('شماره تلفن نامعتبر.')
            $('.modal-error').eq(2).show();
            PH = true;

        } if (!idRegex.test(id)) {
            $('.modal-error').eq(5).text('کد پرسنلی باید شامل 6 رقم باشد و با صفر شروع نشود.')
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
            "birthDay": birth,
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
                $('.modal-error').eq(5).text('کد پرسنلی تکراری است')
                $('.modal-error').eq(5).show();  // Show the error message
            });




    });

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

function fetchData(page) {
    

    if (whileSreach) {
        let input = $('#search-input').val();
        fetch(`/user/search?page=${page}&pageSize=${pageSize}&input=${input}`)
            .then(response => response.json())
            .then(data => {
                
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
                fetchChartData()
                

            });
    } else {
        fetch(`/user/fetch-table?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
                fetchChartData()
                
            });
    }

}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return [`rgba(${r}, ${g}, ${b}, 0.5)`, `rgba(${r}, ${g}, ${b}, 1)`]; }

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

function initUserChart() {

    var dataSets = [];

    usersData.forEach(d => {
        const [bg, border] = getRandomColor()
        dataSets.push({
            label: d.label,
            data: [d.count],
            backgroundColor: bg,
            borderColor: border,
            borderWidth: 1
        })
    })
    


    if (userBarChart) {
        userBarChart.data.datasets = dataSets
        userBarChart.data.labels = [chartTitle]
        userBarChart.update();
    } else {
       
    }
}

function fetchChartData() {

    if (whileSreach) {
        let input = $('#search-input').val();
        fetch(`/user/get-chart-data?label=${chartTitle}&input=${input}`)
            .then(response => response.json())
            .then(data => {
                usersData =  data.data
                console.log(data.data)
                usersData = data.data
                initUserChart()
            });
    } else {
        fetch(`/user/get-chart-data?label=${chartTitle}&input=${''}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data)
                usersData = data.data
                initUserChart()
            });
    }
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
    var tbody = $('#data-table table tbody');
    $('#data-table table').hide();
    tbody.empty();
    if (data.length === 0) {
        tbody.append('<tr > <td colspan="9" class="font-IYbold">داده ای پیدا نشد!! :(</td></tr>');
    }


    data.forEach(item => {
        var row = "<tr>" +
            '<td> <input type=\"checkbox\" value=\"' + item.id + '\" class=\"check-box\" onchange=\"handleCheckboxChange(this,' + item.id + ')\"></input ></td>' +
            '<td>' + item.firstName + "</td>" +
            '<td>' + item.lastName + "</td>" +
            '<td>' + item.phone + "</td>" +
            '<td>' + item.city + "</td>" +
            '<td>' + item.state + "</td>" +
            '<td>' + item.birthDay + "</td>" +
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
    $('#data-table table').fadeIn();
    $('#three-button button span').hide();

}


function navigationDotPosition() {
    if (!userChartShow) {
        $('#navigation-dot').css('left', $('#table-button').position().left + 25)
        $('#navigation-dot').css('top', $('#table-button').position().top + 37)
    } else {
        $('#navigation-dot').css('left', $('#chart-button').position().left + 27)
        $('#navigation-dot').css('top', $('#chart-button').position().top + 37)
    }
}

function handleChartSelectChange(select) {
    chartTitle = select.value
    fetchChartData()
}

$(document).ready(function () {
    getGroups();
    chartTitle = $('#chart-select').val();

    const chr = $('#userBarChart')[0].getContext('2d');
    userBarChart = new Chart(chr, {
        type: 'bar',
        data: {
            labels: [chartTitle],
            datasets: [{}]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });



    
     
    $('#table-button').click(function () {
        userChartShow = false;
        $('#chart').hide()
        navigationDotPosition()
        $('#data-table').fadeIn()
    })
    $('#chart-button').click(function () {
        userChartShow = true;
        $('#data-table').hide()
        navigationDotPosition()
        $('#chart').fadeIn()
    })
   

    fetchData(currentPage);


    $(window).resize(function () {
        navigationDotPosition()
    });
    
    $('#chart').hide()

    $('#user-birth-input').persianDatepicker({
        initialValue: false, 
        autoClose: true,
        startDate: "1310/12/29",
        endDate: "1384/12/29",
        
        selectedDate: "1384/12/29",
        navigator: {
            scroll: {
                enabled: false
            }
        },
        format: 'YYYY/MM/DD', 
        
        onSelect: function (unix) {
            $(' #modal input').each(function () {
                if ($(this).val()) {
                    // If the input has a value, move the label to the active position
                    $(this).closest('div').find('label').css({
                        right: '-7px',
                        top: '-2px',
                        fontSize: '10px',// Adjust this to your preferred active font size
                    });
                }
            });


        },
    });


    $('input').on({
        focus: function () {
            $(this).closest('div').find('label').animate({
                right: '-7px',
                top: '-2px',
                fontSize: '10px',
            });
        },
        
        input: function () {
            $(this).closest('div').find('label').animate({
                right: '-7px',
                top: '-2px',
                fontSize: '10px',
            });
        },
        blur: function () {
            const inputElement = $(this);

            setTimeout(() => {
                if (inputElement.val()) {
                    inputElement.closest('div').find('label').animate({
                        right: '-7px',
                        top: '-2px',
                        fontSize: '10px'
                    });
                } else {
                    inputElement.closest('div').find('label').animate({
                        right: '8px',
                        top: '8px',
                        fontSize: '16px'
                    });
                }
            }, 200);
        }
            
        
    })
    navigationDotPosition()
})