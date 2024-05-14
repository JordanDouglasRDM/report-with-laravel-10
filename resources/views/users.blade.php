@extends('layouts.app')

@section('scripts-before')
    <script src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/pages/users.js') }}"></script>
@endsection

@section('conteudo')
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


    <script defer type="module">
        const loadingModal = loading();

        window.onload = function () {
            getAllUser();
        };

        async function getAllUser(request = {}) {
            try {
                loadingModal.show();
                const response = await axios.get('/user/get', {
                    params: request
                });
                const users = response.data.data.data;
                mountTableUsers(users);

            } catch (error) {
                handleErrorsResponse(error);
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

    </script>
@endsection
