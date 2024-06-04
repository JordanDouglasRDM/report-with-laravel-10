document.addEventListener('DOMContentLoaded', function () {

    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    let departments = [];
    let paginateOut = {};

    const loadingModal = window.loading();
    const modalDepartment = new bootstrap.Modal(document.getElementById('modal-department'));
    const filterImg = document.createElement('img');
    const newButton = document.getElementById('new-department');
    const newButtonSubmit = document.getElementById('submit-form-new');
    const deleteButton = document.getElementById('delete-button');
    const searchButton = document.getElementById('form-search_button');
    const searchInput = document.getElementById('form-search_input');

    const divOrderBy = addImagesFilters();

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();

        Swal.fire({
            title: "Você tem certeza?",
            text: "Essa ação não poderá ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, entendo os riscos!"
        }).then((result) => {
            if (result.isConfirmed) {
                const departmentId = deleteButton.getAttribute('data-department-id');
                destroy(departmentId);
            }
        });

    })

    newButtonSubmit.addEventListener('click', async function (event) {
        event.preventDefault();
        try {
            newButtonSubmit.disabled = true;
            await store(getDataDepartmentChanged())
        } finally {
            setTimeout(() => {
                newButtonSubmit.disabled = false;
            }, 700);
        }
    })
    newButton.addEventListener('click', function (event) {
        event.preventDefault();
        modalDepartment.show();
        mountModalDepartment({}, 'insert');
    })

    getAll();
    clearFilters();
    searchData();
    orderData();

    async function destroy(id) {
        try {
            loadingModal.show();

            const response = await axios.delete('/department/' + id);
            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalDepartment.hide();
            getAll();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    async function getAll(request = {}) {
        try {
            loadingModal.show();

            //se eu possuo filtro definido, na nova paginação, permanece com o filtro
            if (filters !== '') {
                request = Object.assign({}, request, {filter_search: filters});
            }
            //se eu possuo order_by definido, na nova paginação, permanece com o order_by
            if (orderBy !== '') {
                request = Object.assign({}, request, {
                    order_by: orderBy
                });
            }
            const response = await axios.get('/department/get', {
                params: request
            });
            departments = response.data.data;

            if (departments.length < 1) {
                toast.fire({
                    icon: "warning",
                    title: "Nenhum registro encontrado",
                    timer: 2500
                });
                return;
            }
            paginateOut = response.data.data;
            mountTableUsers(departments);
            mountShower(departments);

        } catch (error) {

            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    function orderData() {
        divOrderBy.forEach((div) => {
            div.addEventListener('click', () => {
                document.querySelectorAll('.filter-button-icon-none').forEach((sp) => {
                    sp.classList.remove('filter-button-icon-none');
                })
                if (departments.length > 0) {
                    const th = div.closest('th');
                    div.querySelector('span').classList.add('filter-button-icon-none');
                    if (orderBy === th.id) {
                        if (orderDirection === 'asc') {
                            orderDirection = 'desc';
                            filterImg.src = '/assets/img/filter-up.svg';

                        } else {
                            orderDirection = 'asc';
                            filterImg.src = '/assets/img/filter-down.svg';
                        }
                    } else {
                        orderBy = th.id;
                        filterImg.src = '/assets/img/filter-up.svg';
                    }
                    div.appendChild(filterImg);
                    getAll({
                        order_by: orderBy,
                        order_direction: orderDirection,
                        per_page: paginateOut.per_page
                    });
                }
            });
        });
    }

    function searchData() {

        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            action();
        });
        searchInput.addEventListener('keypress', (event) => {

            if (event.key === 'Enter') {
                event.preventDefault();
                action();
            }
        });

        function action() {
            const searchInput = document.getElementById('form-search_input');
            filters = searchInput.value;
            getAll({filter_search: filters});
        }
    }

    function clearFilters() {
        const btnFilter = document.getElementById("clear-filters");
        btnFilter.addEventListener("click", (event) => {
            document.querySelectorAll('.filter-button-icon-none').forEach((sp) => {
                sp.classList.remove('filter-button-icon-none');
            })
            searchInput.value = '';
            event.preventDefault();
            filters = '';
            orderBy = '';
            filterImg.remove();
            getAll();
        });
    }

    function mountShower(data) {
        const total = document.getElementById('pg-total');
        total.innerText = data.length;
    }

    function mountTableUsers(departments) {
        const tableBody = document.querySelector('#departments-table tbody');
        tableBody.innerHTML = '';

        departments.forEach(data => {
            const tr = document.createElement('tr');
            let createdAt = new Date(data.created_at)
            createdAt = createdAt.toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td class="responsive-remove-column">${data.id}</td>
                <td class="">${data.name}</td>
                <td class="">${data.requesters_count}</td>
                <td class="responsive-remove-column">${createdAt}</td>
                <td class=""><a class="edit-button btn btn-outline-secondary btn-sm" id="${data.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        prepareEventClickOpenModal();
    }

    async function prepareEventClickOpenModal() {
        document.querySelectorAll('.edit-button').forEach((a) => {
            a.addEventListener('click', async (event) => {
                event.preventDefault();
                const departmentId = a.id;
                await mountModalDepartmentSelected(departmentId);
            });
        });
    }

    async function store(request = {}) {
        try {
            loadingModal.show();

            const response = await axios.post('/department', request);
            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalDepartment.hide()
            getAll();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    function mountModalDepartment(data = {}, action) {
        const modalBody = document.querySelector('.modal-body');
        deleteButton.setAttribute('data-department-id', data.id);


        const insertValues = action === 'insert';
        const submitFormNew = document.getElementById('submit-form-new');
        const submitForm = document.getElementById('submit-form');
        if (insertValues) {

            deleteButton.classList.add('d-none');
            submitFormNew.classList.remove('d-none');
            submitForm.classList.add('d-none');
        } else {
            submitFormNew.classList.add('d-none');
            submitForm.classList.remove('d-none');
            submitForm.setAttribute('data-department-id', data.id);
            deleteButton.classList.remove('d-none');

            if (data.requesters_count > 0) {
                deleteButton.classList.add('disabled')
            } else {
                deleteButton.classList.remove('disabled')
            }
        }

        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" class="form-control bg-body rounded" name="name" id="name"
                           placeholder="Digite o nome de um departamento"
                           value="${insertValues ? '' : data.name}"
                           autocomplete="off"
                    >
                </div>
        `;
    }

    async function mountModalDepartmentSelected(departmentId) {
        const department = await getById(departmentId);
        if (!department) {
            return;
        }
        mountModalDepartment(department, '')
        modalDepartment.show();
    }

    const submitButton = document.getElementById('submit-form');
    submitButton.addEventListener('click', async (event) =>{
        event.preventDefault();
        const departmentId = submitButton.getAttribute('data-department-id');
        try {
            submitButton.disabled = true;
            await updateById(getDataDepartmentChanged(), departmentId);

        } finally {
            setTimeout(() => {
                submitButton.disabled = false;
            }, 700)
        }
    });

    function getDataDepartmentChanged() {
        return {
            name: document.querySelector('input#name').value,
        };
    }

    async function updateById(request, id) {
        try {
            const response = await axios.put('department/' + id, request);
            modalDepartment.hide();
            await getAll();

            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });

        } catch (error) {
            window.handleErrorsResponse(error)
        }
    }

    async function getById(id) {
        try {
            const response = await axios.get('/department/' + id);
            return response.data.data;
        } catch (error) {
            const title = error.response?.data?.message || 'Erro desconhecido';
            const errorMessage = error.response?.data?.error || 'Erro desconhecido';
            const errorCode = error.response?.status || 500;

            await toast.fire({
                icon: "error",
                title: title,
                html: `<p>Erro: ${errorMessage}<br>Código: ${errorCode}</p>`
            });
            return null;
        }
    }
});
