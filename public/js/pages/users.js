document.addEventListener('DOMContentLoaded', function () {

    const loadingModal = window.loading();
    const modalUser = new bootstrap.Modal(document.getElementById('modal-user'));

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
    perPage();
    getAllUser();

    function perPage() {
        const dropDownItems = document.querySelectorAll('.dropdown-item');
        dropDownItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                getAllUser({per_page: item.innerText});
            });
        });
    }

    async function getAllUser(request = {}) {
        try {
            loadingModal.show();
            const response = await axios.get('/user/get', {
                params: request
            });
            const users = response.data.data.data;
            mountTableUsers(users);

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    function mountTableUsers(users) {
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
                <td><a class="edit-button btn btn-outline-warning btn-sm" id="${user.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        prepareEventClickOpenModal(); // Chame aqui para definir os eventos de clique nos botões de edição
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

    async function mountModalUserSelected(userId) {
        const user = await getUserById(userId);
        if (!user) {
            return;
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

    function prepareEventClickSubmitFormChanges(userId) {
        document.getElementById('submit-form').addEventListener('click', async (event) => {
            event.preventDefault();
            const user = getDataUserChanged();
            await updateUserById(user, userId);
        });
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

            await getAllUser();

            toast.fire({
                icon: "success",
                title: "Dados atualizados com sucesso!",
                text: response.data.message,
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
            const title = error.response.data.message;
            const errorMessage = error.response.data.error;
            const errorCode = error.response.status;

            await toast.fire({
                icon: "error",
                title: title,
                html: `<p>Erro: ${errorMessage}<br>Código: ${errorCode}</p>`
            });
            return null;
        }
    }
});
