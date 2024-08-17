
function fetchData(page) {
    

    if (whileSreach) {
        let input = $('#search-input').val();
        fetch(`/Home/search?page=${page}&pageSize=${pageSize}&input=${input}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
            });
    } else {
        fetch(`/group/fetch-table?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
            });
    }

}

function fillTable(data) {
    deleteList = []
    var tbody = $('tbody');
    $('table').hide();
    tbody.empty();



    data.forEach(item => {
        var row = "<tr>" +
            '<td> <input type="checkbox" value="' + item.id + '" class="check-box" onchange="handleCheckboxChange(this, \'' + item.id + '\')"></td>'+
            '<td>' + item.groupName + "</td>" +
            '<td>' + item.groupDiscription + "</td>" +
            '<td>' + item.createdDate + "</td>" +
            '<td>' +
            '<div id="three-button" class=\"d-flex flex-row gap-2 justify-content-center \">' +
            '<button data-bs-toggle="modal" data-bs-target="#delete-modal" id="single-delete-button" class="text-white" onclick=\"singleDelete(\'' + item.id + '\')\"><i class=\"three-button bi bi-trash3\"></i><span ">حذف</span></button>' +
            '<button data-bs-toggle="modal" data-bs-target="#show-info-modal" id="show-button" onclick="showGroupInfo(this, \'' + item.id + '\')"><i class="three-button bi bi-card-text"></i><span class="">نمایش</span></button>'
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


function singleDelete(id) {
    $('#delete-modal-id').text(id);
    $('#delete-modal-submit').off('click').on('click', function () {

        fetch('/group/single-delete/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        })
            .then(response => {
                if (response.status === 409) {
                    return response.text().then(text => { throw new Error(text); });
                }
                $('#delete-modal').modal('hide')
                fetchData(currentPage);
                
            });
    });

}


function showGroupInfo(button, id) {

    var groupName = $(button).closest('tr').find('td').eq(1).text();
    var groupDiscription = $(button).closest('tr').find('td').eq(2).text();
    var date = $(button).closest('tr').find('td').eq(3).text();


    $('#info-form').children('div').eq(0).html(
        '<p> نام گروه: </p>' +
        '<p>توضیحات: </p>' +
        '<p>تاریخ ایجاد: </p>' +
        '<p>کد گروه: </p>' 
    )

    $('#info-form').children('div').eq(1).empty();

    $('#info-form').children('div').eq(1).append('<p>' + groupName + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + groupDiscription + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + date + '</p>')
    $('#info-form').children('div').eq(1).append('<p>' + id + '</p>')



}


function addGroup() {
    $('.add-group-modal-body').find('input').val('');
    $('.add-group-modal-body').find('textarea').val('');
    $('.modal-error').hide()


    $('#add-group-modal-submit-button').off('click').click(function () {
        $('.modal-error').hide()
        
        let groupName = $('.add-group-modal-body').find('input').val()
        let dis = $('.add-group-modal-body').find('textarea').val()

        var perRegex = /^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی\s]+$/
        let GN = false;
        let DS = false;

        if (groupName === '' || dis === '') {
            $('.modal-error').eq(1).text('فیلدی نباید خالی باشد!')
            $('.modal-error').eq(1).show();
            return null;
        } if (!perRegex.test(groupName)) {
            $('.modal-error').eq(0).text('ورودی نامعتبر!')
            $('.modal-error').eq(0).show();
            GN = true;

        }

        if (GN || DS ) {
            return null;
        }

        const group = {
            "groupName": groupName,
            "groupDiscription": dis
        }

        fetch('/user/add-new-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
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
                    $('#add-group-modal').modal('hide');

                }

            })
            .catch((error) => {
            });


    });
}

$(document).ready(function () {
    console.log('group')
    fetchData(currentPage);

})