@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/main/helpers.js') }}"></script>
    <script src="{{ asset('js/pages/requesters.js') }}"></script>

@endsection

@section('conteudo')
    <div class="container mt-lg-5">
        <div class="mb-3 d-flex responsive-header-around">
            <x-add-button id="new-requester" />
            <x-input-search-filter :switch="false"/>
            <x-input-clear-filters route="user.index"/>
        </div>
        <div class="table-wrapper mb-1 bg-body-tertiary rounded-4">
            <table id="requesters-table" class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th class="bg-info-subtle responsive-remove-column" id="id" scope="col">
                        <div class="content order-by">
                            ID
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="name" scope="col">
                        <div class="content order-by">
                            Nome
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="department" scope="col">
                        <div class="content order-by">
                            Departamento
                        </div>
                    </th>
                    <th class="bg-info-subtle responsive-remove-column" id="reports_count" scope="col">
                        <div class="content order-by">
                            QTD Relatórios
                        </div>
                    </th>
                    <th class="bg-info-subtle responsive-remove-column" id="created_at" scope="col">
                        <div class="content order-by">
                            Data Criação
                        </div>
                    </th>
                    <th class="bg-info-subtle" scope="col">Ações</th>
                </tr>
                </thead>
                <tbody class="text-center">

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
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Funcionário</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="delete-button-requester">Excluir</button>

                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form-new" class="btn btn-success">Adicionar</button>
                    <button type="button" id="submit-form" class="btn btn-success">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>
@endsection

