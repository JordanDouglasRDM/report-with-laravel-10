document.addEventListener('DOMContentLoaded', function () {

    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';

    const loadingModal = window.loading();
    const modalDepartment = new bootstrap.Modal(document.getElementById('modal-department'));
    const modalDepartmentNew = new bootstrap.Modal(document.getElementById('modal-department-new'));
    const filterImg = document.createElement('img');
    const newButton = document.getElementById('new-department');
    const newButtonSubmit = document.getElementById('submit-form-new');
    const deleteButton = document.getElementById('delete-button');

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
                const departmentId = deleteButton.dataset.departmentId;
                destroy(departmentId);
            }
        });


    })

    newButtonSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        const department = getDataDepartmentChanged()
        store(department)
    })
    newButton.addEventListener('click', function (event) {
        event.preventDefault();
        modalDepartmentNew.show();
        mountModalDepartmentNew();

    })

    getAll();
    clearFilters();
    searchData();
    orderData();

    async function destroy(id) {
        try {
            loadingModal.show();

            const response = await axios.delete('/department/' + id);
            const departments = response.data.data;
            toast.fire({
                icon: "success",
                title: "Departamento excluido com sucesso!",
                text: response.data.message,
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
            const departments = response.data.data;

            if (departments.length < 1) {
                throw new Error('Nenhum registro encontrado');
            }

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
        const ths = document.querySelectorAll('.order-by');
        ths.forEach((th) => {
            th.classList.remove('d-flex', 'justify-content-between');
        });
        ths.forEach((th) => {
            th.addEventListener('click', () => {
                ths.forEach((th) => {
                    th.classList.remove('d-flex', 'justify-content-between');
                });
                if (orderBy === th.id) {
                    if (orderDirection === 'asc') {
                        orderDirection = 'desc';
                        filterImg.classList.remove('align-self-end');
                        filterImg.classList.add('align-self-baseline');
                        filterImg.src = '/assets/img/filter-down.svg';

                    } else {
                        orderDirection = 'asc';
                        filterImg.classList.add('align-self-end');
                        filterImg.classList.remove('align-self-baseline');
                        filterImg.src = '/assets/img/filter-up.svg';
                    }
                } else {
                    orderBy = th.id;
                    filterImg.classList.remove('align-self-end');
                    filterImg.classList.add('align-self-baseline');
                    filterImg.src = '/assets/img/filter-down.svg';
                }
                th.classList.add('d-flex', 'justify-content-between')
                th.appendChild(filterImg);
                getAll({
                    order_by: orderBy,
                    order_direction: orderDirection
                });
            });
        })
    }


    function searchData() {
        const searchButton = document.getElementById('form-search_button');
        const searchInput = document.getElementById('form-search_input');

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
            event.preventDefault();
            filters = '';
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
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.requesters_count}</td>
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
                const departmentId = a.id;
                await mountModalDepartmentSelected(departmentId);
            });
        });
    }

    async function store(request = {}) {
        try {
            loadingModal.show();

            const response = await axios.post('/department', request);
            const departments = response.data.data;
            toast.fire({
                icon: "success",
                title: "Departamento criado com sucesso!",
                text: response.data.message,
                timer: 2500
            });
            modalDepartmentNew.hide()
            getAll();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    function mountModalDepartmentNew() {
        const modalBody = document.querySelector('.new-department-modal-body');
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

    function mountModalDepartment(data = {}) {
        const modalBody = document.querySelector('.modal-body');
        deleteButton.setAttribute('data-department-id', data.id);

        if (data.requesters_count > 0) {
            deleteButton.classList.add('disabled')
        } else {
            deleteButton.classList.remove('disabled')
        }
        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" class="form-control bg-body rounded" name="name" id="name"
                           placeholder="Digite seu nome"
                           value="${data.name ?? ''}"
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
        mountModalDepartment(department)
        modalDepartment.show();
        prepareEventClickSubmitFormChanges(departmentId);
    }

    async function prepareEventClickSubmitFormChanges(departmentId) {
        const submitButton = document.getElementById('submit-form');
        const newSubmitHandler = async (event) => {
            event.preventDefault();
            const data = getDataDepartmentChanged();
            await updateById(data, departmentId);
        };

        // Remove os ouvintes de evento anteriores
        submitButton.replaceWith(submitButton.cloneNode(true));
        document.getElementById('submit-form').addEventListener('click', newSubmitHandler);
    }

    function getDataDepartmentChanged() {
        const name = document.querySelector('input#name').value;
        return {
            name: name,
        };
    }

    async function updateById(request, id) {
        try {
            const response = await axios.put('department/' + id, request);
            modalDepartment.hide();
            await getAll();

            toast.fire({
                icon: "success",
                title: "Dados atualizados com sucesso!",
                text: response.data.message,
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
