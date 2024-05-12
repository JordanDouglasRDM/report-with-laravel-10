<x-app-layout>
    {{--    TODO: alterar o campo level para um select ao inves de input text--}}
    <div class="container mt-3">
        <div class="mb-3 d-flex justify-content-around">
            <x-input-perpage route="user.index"/>
            <x-input-search-filter route="user.index"/>
            <x-input-clear-filters route="user.index"/>
        </div>
        <div class="table-wrapper mb-1 bg-body-tertiary">
            <table id="users-table" class="table table-striped table-hover">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Nível de acesso</th>
                    <th scope="col">Email</th>
                    <th scope="col">Ações</th>
                </tr>
                </thead>
                <tbody>
                <!-- Os dados dos usuários serão inseridos aqui dinamicamente -->
                </tbody>
            </table>
        </div>

        {{--            {{ $users->appends([--}}
        {{--                'per-page' => request('per-page'),--}}
        {{--                'filter-search' => request('filter-search')--}}
        {{--            ])->onEachSide(1)->links() }}--}}
        {{--        </div>--}}

    </div>

    <!-- Modal -->
    <div class="modal fade rounded-3" id="modal-user" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Usuários</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form" class="btn btn-success">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>

</x-app-layout>

<script type="module">

    const loadingModal = loading();


    class HandleUser {
        constructor() {
            this.toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            this.modalUser = new bootstrap.Modal(document.getElementById('modal-user'));
        }

        perPage() {
            const dropDownItems = document.querySelectorAll('.dropdown-item');
            dropDownItems.forEach((item) => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.getAll({per_page: item.innerText})
                });
            });
        }

        mountTableUsers(users) {

            const tableBody = document.querySelector('#users-table tbody');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.phone_number}</td>
                    <td>${user.level}</td>
                    <td>${user.email}</td>
                    <td><a class="edit-button btn btn-outline-warning btn-sm" data-user-id="${user.id}">Editar</a></td>
                `;
                tableBody.appendChild(tr);
            });
            this.prepareEventClickOpenModal();
        }

        prepareEventClickOpenModal() {
            document.querySelectorAll('.edit-button').forEach((a) => {
                a.addEventListener('click', event => {
                    event.preventDefault();
                    const userId = a.dataset.userId;
                    this.mountModalUserSelected(userId);
                });
            });
        }

        async mountModalUserSelected(userId) {
            const user = await this.getUserById(userId);
            if (!user) {
                return
            }

            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = '';

            modalBody.innerHTML = `
                <div class="mb-3">
                        <label for="name" class="form-label">Nome</label>
                        <input type="text" class="form-control bg-body rounded" name="name" id="name"
                               placeholder="Digite seu nome"
                               value="${user.name}"
                               autocomplete="off"
                        >
                    </div>

                    <div class="mb-3">
                        <label for="phone_number" class="form-label">Número de Telefone</label>
                        <input type="tel" class="form-control bg-body rounded" id="phone_number"
                               placeholder="Digite seu número de telefone"
                               value="${user.phone_number}"
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
                               value="${user.email}"
                               autocomplete="off"
                               disabled
                        >
                    </div>
            `;

            this.modalUser.show();
            this.defineMaskPhoneNumber();
            this.prepareEventClickSubmitFormChanges(userId);
        }

        async getUserById(id) {
            try {
                const response = await axios.get('/user/' + id);
                return response.data.data;

            } catch (error) {
                const title = error.response.data.message;
                const errorMessage = error.response.data.error;
                const errorCode = error.response.status;


                const toast = this.toast;
                await toast.fire({
                    icon: "error",
                    title: title,
                    html: `<p>Erro: ${errorMessage}<br>Código: ${errorCode}</p>`
                });
                return null;
            }
        }

        async getAll(request = {}) {
            try {
                loadingModal.show();
                const response = await axios.get('/user/get', {
                    params: request
                });
                const users = response.data.data.data;
                this.mountTableUsers(users);

            } catch (error) {
                console.error('Erro ao carregar os usuários:', error);
            } finally {
                setTimeout(() => {
                    loadingModal.hide();
                }, 300);
            }
        }

        defineMaskPhoneNumber() {
            return IMask(
                document.getElementById('phone_number'),
                {
                    mask: '(00) 00000-0000'
                }
            )

        }

        prepareEventClickSubmitFormChanges(userId) {
            document.getElementById('submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                const user = this.getDataUserChanged();
                this.updateUserById(user, userId);
            });
        }

        getDataUserChanged() {
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

        async updateUserById(request, userId) {
            const toast = this.toast;
            try {

                const response = await axios.put('user/' + userId, request)
                this.modalUser.hide();

                await this.getAll();

                toast.fire({
                    icon: "success",
                    title: "Dados atualizados com sucesso!",
                    text: response.message,
                    timer: 2500
                });

            } catch (error) {
                const message = error.response.data.message;

                const errorCode = error.response.data.status;
                let errors = error.response.data.error;

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
                            }, 4000)
                        }
                    }
                }

                await toast.fire({
                    icon: "error",
                    title: message,
                    html: errors,
                    timer: 4000
                });
            }
        }
    }

    const handleUser = new HandleUser();
    handleUser.perPage();
    window.onload = function () {
        handleUser.getAll();
    };
</script>
