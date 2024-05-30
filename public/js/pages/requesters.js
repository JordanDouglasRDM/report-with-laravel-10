document.addEventListener('DOMContentLoaded', function () {
    let paginateOut = {};
    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    let requesters = {};

    const loadingModal = window.loading();
    const modalRequester = new bootstrap.Modal(document.getElementById('modal-requester'));
    const modalRequesterNew = new bootstrap.Modal(document.getElementById('modal-requester-new'));
    const filterImg = document.createElement('img');
    const newButton = document.getElementById('new-requester');
    const newButtonSubmit = document.getElementById('submit-form-new');
    const deleteButton = document.getElementById('delete-button-requester');
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
                const requesterId = deleteButton.dataset.requesterId;
                destroy(requesterId);
            }
        });


    })

    newButtonSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        const requester = getDataRequesterChanged()
        store(requester)
    })
    newButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const departments = await getAllDepartment();
        mountModalRequester({}, departments, '.new-requester-modal-body')
        modalRequesterNew.show();
    });

    getAll();
    clearFilters();
    searchData();
    orderData();

    async function destroy(id) {
        try {
            loadingModal.show();

            const response = await axios.delete('/requester/' + id);
            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalRequester.hide();
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
            const response = await axios.get('/requester/get', {
                params: request
            });
            requesters = response.data.data;

            if (requesters.length < 1) {
                toast.fire({
                    icon: "warning",
                    title: "Nenhum registro encontrado",
                    timer: 2500
                });
                return;
            }

            paginateOut = response.data.data;
            mountTableUsers(requesters);
            mountShower(requesters);

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
                if (requesters.length > 0) {
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

    function mountTableUsers(requesters) {
        const tableBody = document.querySelector('#requesters-table tbody');
        tableBody.innerHTML = '';

        requesters.forEach(data => {
            const tr = document.createElement('tr');
            let createdAt = new Date(data.created_at)
            createdAt = createdAt.toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.department.name}</td>
                <td>${data.reports_count}</td>
                <td>${createdAt}</td>
                <td><a class="edit-button btn btn-outline-warning btn-sm" id="${data.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        prepareEventClickOpenModal();
    }

    async function prepareEventClickOpenModal() {
        document.querySelectorAll('.edit-button').forEach((a) => {
            a.addEventListener('click', async (event) => {
                event.preventDefault();
                const requesterId = a.id;
                await mountModalRequesterSelected(requesterId);
            });
        });
    }

    async function store(request = {}) {
        try {
            loadingModal.show();

            const response = await axios.post('/requester', request);
            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalRequesterNew.hide()
            getAll();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    function mountModalRequesterNew() {
        const modalBody = document.querySelector('.new-requester-modal-body');
        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" class="form-control bg-body rounded" name="name" id="name"
                           placeholder="Digite o nome do departamento"
                           autocomplete="off"
                    >
                </div>
        `;
    }

    async function mountModalRequester(requester = {}, departments = {}, selectorQuery) {
        const modalBody = document.querySelector(selectorQuery);
        if (Object.keys(requester).length) {
            deleteButton.setAttribute('data-requester-id', requester.id);
            if (requester.requesters_count > 0) {
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
                           placeholder="Digite seu nome"
                           value="${requester.name ?? ''}"
                           autocomplete="off"
                    >
                    <label for="level" class="form-label mt-4">Departamento</label>
                    <select class="form-select" id="department_id" autocomplete="off">

                    </select>
                </div>
        `;

        if (departments) {
            const select = document.getElementById('department_id');
            departments.forEach((department) => {
                const option = document.createElement('option');
                option.value = department.id;
                if (Object.keys(requester).length) {
                    if (department.name === requester.department.name) {
                        option.selected = true;
                    }
                }

                option.innerText = department.name;
                select.appendChild(option);
            })
        }
    }

    async function mountModalRequesterSelected(requesterId) {
        const requester = await getById(requesterId);
        if (!requester) {
            return;
        }
        const departments = await getAllDepartment();

        mountModalRequester(requester, departments, '.modal-body')
        modalRequester.show();
        prepareEventClickSubmitFormChanges(requesterId);
    }

    async function prepareEventClickSubmitFormChanges(requesterId) {
        const submitButton = document.getElementById('submit-form');
        const newSubmitHandler = async (event) => {
            event.preventDefault();
            const data = getDataRequesterChanged();
            await updateById(data, requesterId);
        };

        // Remove os ouvintes de evento anteriores
        submitButton.replaceWith(submitButton.cloneNode(true));
        document.getElementById('submit-form').addEventListener('click', newSubmitHandler);
    }

    function getDataRequesterChanged() {
        const name = document.querySelector('input#name').value;
        const departmentId = document.querySelector('select#department_id').value;
        return {
            name: name,
            department_id: departmentId,
        };
    }

    async function updateById(request, id) {
        try {
            const response = await axios.put('requester/' + id, request);
            modalRequester.hide();
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
            const response = await axios.get('/requester/' + id);
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

    async function getAllDepartment(request = {}) {
        try {
            loadingModal.show();

            const response = await axios.get('/department/get', {
                params: {
                    order_by: 'name',
                }
            });
            const departments = response.data.data;

            if (departments.length < 1) {
                throw new Error('Nenhum registro encontrado');
            }
            return departments;

        } catch (error) {

            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }
});
