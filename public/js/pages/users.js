document.addEventListener('DOMContentLoaded', function () {

    let paginateOut = {};
    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    let users = [];
    const loadingModal = window.loading();
    const modalUser = new bootstrap.Modal(document.getElementById('modal-user'));
    const filterImg = document.createElement('img');
    const searchButton = document.getElementById('form-search_button');
    const searchInput = document.getElementById('form-search_input');
    const submitButton = document.getElementById('submit-form');

    const divOrderBy = addImagesFilters();

    //paginate
    const previousPage = document.getElementById('previous-page');
    const nextPage = document.getElementById('next-page');

    perPage();
    getAllUser();
    clearFilters();
    searchData();
    orderData();

    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('pages')) {
            event.preventDefault();
            const page = target.innerText;
            if (parseInt(page)) {
                getAllUser({page: page});
            }
        }
    });


    previousPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (canNavigate(paginateOut, 'previous')) {
            getAllUser({page: paginateOut.current_page - 1})
        }
    });

    nextPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (canNavigate(paginateOut, 'next')) {
            getAllUser({page: paginateOut.current_page + 1})
        }
    });

    function canNavigate(paginate, type) {
        if (paginate.to !== null) {
            if (type === 'previous') {
                return paginate.current_page > 1;
            } else if (type === 'next') {
                return paginate.current_page < paginate.last_page;
            }
        }
        return false;
    }

    async function getAllUser(request = {}) {
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
            const response = await axios.get('/user/get', {
                params: request
            });
            users = response.data.data.data;

            if (users.length < 1) {
                toast.fire({
                    icon: "warning",
                    title: "Nenhum registro encontrado",
                    timer: 2500
                });
                return;
            }

            const paginate = response.data.data;
            paginateOut = paginate;
            mountTableUsers(users);
            mountShower(paginate);
            mountButtonsNavigate(previousPage, nextPage, paginate);
            mountButtonsPage(paginate);

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
                if (users.length > 0) {
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
                    getAllUser({
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
            getAllUser({filter_search: filters});
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
            getAllUser();
        });
    }

    function perPage() {
        const dropDownItems = document.querySelectorAll('.dropdown-item');
        dropDownItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                getAllUser({per_page: item.innerText});
            });
        });
    }

    function mountShower(paginate) {
        const from = document.getElementById('pg-from');
        const to = document.getElementById('pg-to');
        const total = document.getElementById('pg-total');

        from.innerText = paginate.from;
        to.innerText = paginate.to;
        total.innerText = paginate.total;
    }

    function mountTableUsers(users) {
        const tableBody = document.querySelector('#users-table tbody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            let createdAt = new Date(user.created_at)
            createdAt = createdAt.toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td class="responsive-remove-column">${user.id}</td>
                <td class="">${user.name}</td>
                <td class="responsive-remove-column">${user.phone_number}</td>
                <td class="responsive-remove-column">${user.level}</td>
                <td class="responsive-remove-column">${user.email}</td>
                <td class="responsive-remove-column">${user.departments_count}/${user.requesters_count}</td>
                <td class="">${user.reports_count}</td>
                <td class="responsive-remove-column">${createdAt}</td>
                <td class=""><a class="edit-button btn btn-outline-secondary btn-sm" id="${user.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        prepareEventClickOpenModal();
    }

    async function prepareEventClickOpenModal() {
        document.querySelectorAll('.edit-button').forEach((a) => {
            a.addEventListener('click', async (event) => {
                event.preventDefault();
                const userId = a.id;
                await mountModalUserSelected(userId);
            });
        });
    }

    function mountModalUser(user = {}) {
        const modalBody = document.querySelector('.modal-body');
        submitButton.setAttribute('data-user-id', user.id);

        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" class="form-control bg-body rounded" name="name" id="name"
                           placeholder="Digite seu nome"
                           value="${user.name ?? ''}"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="phone_number" class="form-label">Número de Telefone</label>
                    <input type="tel" class="form-control bg-body rounded" id="phone_number"
                           placeholder="Digite seu número de telefone"
                           value="${user.phone_number ?? ''}"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="level" class="form-label">Nível</label>
                    <select class="form-select" id="level" autocomplete="off">
                        <option value="operator" ${user.level === 'operator' ? 'selected' : ''}>Operador</option>
                        <option value="admin" ${user.level === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control rounded disabled:opacity-25" id="email"
                           placeholder="Digite seu email"
                           value="${user.email ?? ''}"
                           autocomplete="off"
                           disabled
                    >
                </div>
        `;
    }

    async function mountModalUserSelected(userId) {
        const user = await getUserById(userId);
        if (!user) {
            return;
        }
        mountModalUser(user)
        modalUser.show();
        defineMaskPhoneNumber();
    }

    function defineMaskPhoneNumber() {
        const phoneNumber = document.querySelector('input#phone_number');
        return IMask(
            phoneNumber,
            {
                mask: '(00) 00000-0000'
            }
        );
    }

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const userId = submitButton.getAttribute('data-user-id');
        try {
            submitButton.disabled = true;
            await updateUserById(getDataUserChanged(), userId)
        } finally {
            setTimeout(() => {
                submitButton.disabled = false;
            }, 700);
        }
    });
    function getDataUserChanged() {
        return {
            name: document.querySelector("input#name").value,
            email: document.querySelector("input#email").value,
            phone_number: document.querySelector("input#phone_number").value,
            level: document.querySelector("select#level").value
        };
    }

    async function updateUserById(request, userId) {
        try {
            const response = await axios.put('user/' + userId, request);
            modalUser.hide();

            await getAllUser({page: paginateOut.current_page});

            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });

        } catch (error) {
            window.handleErrorsResponse(error);
        }
    }

    async function getUserById(id) {
        try {
            const response = await axios.get('/user/' + id);
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
