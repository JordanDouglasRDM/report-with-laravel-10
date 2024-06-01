@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/main/helpers.js') }}"></script>
    <script src="{{ asset('js/pages/departments.js') }}"></script>

@endsection

@section('conteudo')
    <div class="container mt-lg-5">
        <div class="mb-3 d-flex justify-content-around">
            <button class="btn btn-outline-success" id="new-department">Adicionar Novo</button>
            <x-input-search-filter :switch="false"/>
            <x-input-clear-filters route="user.index"/>
        </div>
        <div class="table-wrapper mb-1 bg-body-tertiary">
            <table id="departments-table" class="table table-striped table-hover">

                <thead>
                <tr>
                    <th class="bg-info-subtle" id="id" scope="col">
                        <div class="content order-by">
                            ID
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="name" scope="col">
                        <div class="content order-by">
                            Nome
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="requesters_count" scope="col">
                        <div class="content order-by">
                            Funcionários
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="created_at" scope="col">
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
    <div class="modal fade rounded-3" id="modal-department" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Departamento</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="delete-button">Excluir</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form-new" class="btn btn-success">Adicionar</button>
                    <button type="button" id="submit-form" class="btn btn-success">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>
@endsection

