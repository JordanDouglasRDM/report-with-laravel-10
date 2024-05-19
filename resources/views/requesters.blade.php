@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/pages/requesters.js') }}"></script>

@endsection

@section('conteudo')
    <div class="container mt-3">
        <div class="mb-3 d-flex justify-content-around">
            <button class="btn btn-outline-success" id="new-requester" >Adicionar Novo</button>
            <x-input-search-filter route="user.index"/>
            <x-input-clear-filters route="user.index"/>
        </div>
        <div class="table-wrapper mb-1 bg-body-tertiary">
            <table id="requesters-table" class="table table-striped table-hover">
                <thead>
                <tr>
                    <th class="order-by" id="id" scope="col">ID</th>
                    <th class="order-by" id="name" scope="col">Nome</th>
                    <th class="order-by" id="department" scope="col">Departamento</th>
                    <th class="order-by" id="created_at" scope="col">Data Criação</th>
                    <th scope="col">Ações</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <div class="mt-4">
            <span>Exibindo</span>
            <span id="pg-total"></span>
            <span>registros.</span>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade rounded-3" id="modal-requester" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Solicitante</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="delete-button-requester">Excluir</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form" class="btn btn-success">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade rounded-3" id="modal-requester-new" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Solicitante</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body new-requester-modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form-new" class="btn btn-success">Adicionar</button>
                </div>
            </div>
        </div>
    </div>
@endsection

