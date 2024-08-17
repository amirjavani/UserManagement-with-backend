
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
        fetch(`/Home/fetch?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                fillTable(data.data);
                renderPagination(data.currentPage, data.totalPages);
            });
    }

}



$(document).ready(function () {
    console.log('group')
})