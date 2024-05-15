@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/pages/users.js') }}"></script>

@endsection

@section('conteudo')
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
                    <th class="order-by" id="id" scope="col">ID</th>
                    <th class="order-by" id="name" scope="col">Nome</th>
                    <th class="order-by" id="phone_number" scope="col">Telefone</th>
                    <th class="order-by" id="level" scope="col">Nível de acesso</th>
                    <th class="order-by" id="email" scope="col">Email</th>
                    <th class="order-by" id="created_at" scope="col">Data Criação</th>
                    <th scope="col">Ações</th>
                </tr>
                </thead>
                <tbody>
                <!-- Os dados dos usuários serão inseridos aqui dinamicamente -->
                </tbody>
            </table>
        </div>
        <div class="container">
            <x-pagination-asynchronous/>
        </div>
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
@endsection

