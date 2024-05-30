@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{ asset('js/main/helpers.js') }}"></script>
    <script src="{{ asset('js/pages/users.js') }}"></script>

@endsection

@section('conteudo')
    <div class="container-fluid mt-lg-5" style="width: 90%">
        <div class="mb-3 d-flex justify-content-around">
            <x-input-perpage route="user.index"/>
            <x-input-search-filter :switch="false"/>
            <x-input-clear-filters route="user.index"/>
        </div>
        <div class="table-wrapper mb-1 bg-body-tertiary rounded-4">
            <table id="users-table" class="table table-bordered table-hover">
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
                    <th class="bg-info-subtle" id="phone_number" scope="col">
                        <div class="content order-by">
                            Telefone
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="level" scope="col">
                        <div class="content order-by">
                            Nível de acesso
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="email" scope="col">
                        <div class="content order-by">
                            Email
                        </div>
                    </th>
                    <th class="bg-info-subtle" id="" scope="col">
                            Departamentos/Funcionários
                    </th>
                    <th class="bg-info-subtle" id="reports_count" scope="col">
                        <div class="content order-by">
                            QTD Relatórios
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

