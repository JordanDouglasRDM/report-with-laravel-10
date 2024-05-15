document.addEventListener('DOMContentLoaded', function () {

    let paginateOut = {};
    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    const loadingModal = window.loading();
    const modalUser = new bootstrap.Modal(document.getElementById('modal-user'));
    const filterImg = document.createElement('img');

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

    function mountButtonsPage(paginate) {
        if (paginate.to !== null) {
            const paginationContainer = document.querySelector('.pagination');
            const links = paginate.links;

            while (paginationContainer.children.length > 2) {
                paginationContainer.removeChild(paginationContainer.children[1]);
            }

            links.forEach((link, index) => {
                if (index > 0 && index < links.length - 1) {
                    const pageItem = document.createElement('li');
                    pageItem.classList.add('page-item');
                    if (link.active) {
                        pageItem.classList.add('active');
                    }

                    const pageButton = document.createElement('button');
                    pageButton.classList.add('page-link');
                    pageButton.classList.add('pages');
                    pageButton.innerText = link.label;

                    pageItem.appendChild(pageButton);
                    paginationContainer.insertBefore(pageItem, paginationContainer.children[paginationContainer.children.length - 1]);
                }
            });
        }
    }


    function mountButtonsNavigate(paginate) {
        if (paginate.current_page === 1) {
            previousPage.classList.add('disabled');
        } else {
            previousPage.classList.remove('disabled');
        }
        if (paginate.current_page === paginate.last_page) {
            nextPage.classList.add('disabled');
        } else {
            nextPage.classList.remove('disabled');
        }
    }

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
            const users = response.data.data.data;

            if (users.length < 1) {
                throw new Error('Nenhum registro encontrado');
            }

            const paginate = response.data.data;
            paginateOut = paginate;
            mountTableUsers(users);
            mountShower(paginate);
            mountButtonsNavigate(paginate);
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
                getAllUser({
                    order_by: orderBy,
                    order_direction: orderDirection,
                    per_page: paginateOut.per_page
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
            getAllUser({filter_search: filters});
        }
    }

    function clearFilters() {
        const btnFilter = document.getElementById("clear-filters");
        btnFilter.addEventListener("click", (event) => {
            event.preventDefault();
            filters = '';
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
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.phone_number}</td>
                <td>${user.level}</td>
                <td>${user.email}</td>
                <td>${createdAt}</td>
                <td><a class="edit-button btn btn-outline-warning btn-sm" id="${user.id}">Editar</a></td>
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
        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" class="form-control bg-body rounded" name="name" id="name"
                           placeholder="Digite seu nome"
                           value="${user.name  ?? ''}"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="phone_number" class="form-label">Número de Telefone</label>
                    <input type="tel" class="form-control bg-body rounded" id="phone_number"
                           placeholder="Digite seu número de telefone"
                           value="${user.phone_number  ?? ''}"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="level" class="form-label">Nível</label>
                    <select class="form-select" id="level" autocomplete="off">
                        <option value="operator" ${user.level  ?? '' === 'operator' ? 'selected' : ''}>Operador</option>
                        <option value="admin" ${user.level  ?? '' === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control rounded disabled:opacity-25" id="email"
                           placeholder="Digite seu email"
                           value="${user.email  ?? ''}"
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
        prepareEventClickSubmitFormChanges(userId);
    }

    function defineMaskPhoneNumber() {
        return IMask(
            document.getElementById('phone_number'),
            {
                mask: '(00) 00000-0000'
            }
        );
    }

    async function prepareEventClickSubmitFormChanges(userId) {
        const submitButton = document.getElementById('submit-form');
        const newSubmitHandler = async (event) => {
            event.preventDefault();
            const user = getDataUserChanged();
            await updateUserById(user, userId);
        };

        // Remove os ouvintes de evento anteriores
        submitButton.replaceWith(submitButton.cloneNode(true));
        document.getElementById('submit-form').addEventListener('click', newSubmitHandler);
    }

    function getDataUserChanged() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const level = document.getElementById("level").value;
        const phone_number = document.getElementById("phone_number").value;

        return {
            name: name,
            email: email,
            phone_number: phone_number,
            level: level
        };
    }

    async function updateUserById(request, userId) {
        try {
            const response = await axios.put('user/' + userId, request);
            modalUser.hide();

            await getAllUser({page: paginateOut.current_page});

            toast.fire({
                icon: "success",
                title: "Dados atualizados com sucesso!",
                text: response.data.message,
                timer: 2500
            });

        } catch (error) {
            const message = error.response?.data?.message || 'Erro desconhecido';
            const errorCode = error.response?.data?.status || 500;
            let errors = error.response?.data?.error || 'Erro desconhecido';

            if (errorCode === 422) {
                const errorObject = error.response.data.error;
                const errorArray = Object.values(errorObject);
                errors = errorArray.join('<br>');

                if (errorObject) {
                    for (const key in errorObject) {
                        const field = document.getElementById(key);
                        field.classList.add('border-danger-subtle');
                        setTimeout(() => {
                            field.classList.remove('border-danger-subtle');
                        }, 4000);
                    }
                }
            }

            toast.fire({
                icon: "error",
                title: message,
                html: errors,
                timer: 4000
            });
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
