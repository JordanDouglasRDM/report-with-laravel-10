document.addEventListener('DOMContentLoaded', function () {
    const loadingModal = window.loading();
    getAllUser();
    perPage();
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
                    <td><a class="edit-button btn btn-outline-warning btn-sm" data-user-id="${user.id}">Editar</a></td>
                `;
            tableBody.appendChild(tr);
        });
    }
    function perPage() {
        const dropDownItems = document.querySelectorAll('.dropdown-item');
        dropDownItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                getAllUser({per_page: item.innerText})
            });
        });
    }
});

