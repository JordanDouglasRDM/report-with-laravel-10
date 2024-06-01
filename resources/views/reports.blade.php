@extends('layouts.app')

@section('scripts')
    <script type="module" src="{{ asset('js/main/script.js') }}"></script>
    <script src="{{asset('js/main/helpers.js')}}"></script>
    <script src="{{ asset('js/pages/reports.js') }}"></script>
@endsection

@section('conteudo')
    <div class="container-fluid mt-lg-5" style="width: 90%">

            <div class="mb-3 d-flex justify-content-between">
                <x-add-button id="new-report"/>

                <x-input-search-filter :switch="true"/>
                <div class="form-group">
                    <input type="date" class="form-control" id="filter_date">
                </div>

                <x-input-clear-filters/>
            </div>

        <div class="table-wrapper mb-1 bg-body-tertiary rounded-4">
            <table id="reports-table" class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th id="id" scope="col" style="width: 75px" class="bg-info-subtle">
                        <div class="content order-by intro-icon">
                            ID
                        </div>
                    </th>
                    <th id="requester_name" scope="col" style="width: 200px" class="bg-info-subtle">
                        <div class="content order-by">
                            Funcionário
                        </div>
                    </th>
                    <th id="abstract" scope="col" style="width: 350px" class="bg-info-subtle">
                        <div class="content order-by">
                            Resumo
                        </div>
                    </th>
                    <th id="description" scope="col" class="bg-info-subtle">Descrição</th>
                    <th id="status" scope="col" class="col-sm-1 bg-info-subtle">
                        <div class="content order-by">
                            Status
                        </div>
                    </th>
                    <th id="priority" scope="col" class="col-sm-1 bg-info-subtle">
                        <div class="content order-by">
                            Prioridade
                        </div>
                    </th>
                    <th id="created_at" scope="col" class="bg-info-subtle">
                        <div class="content order-by">
                            Data
                        </div>
                    </th>
                    <th scope="col" class="bg-info-subtle">Ações</th>
                </tr>
                </thead>
                <tbody class="text-center">
                <!-- Os dados dos relatórios serão inseridos aqui dinamicamente -->
                </tbody>
            </table>
        </div>
        <x-pagination-asynchronous/>
        <div class="container">
        </div>
    </div>

    <div class="modal modal-lg fade rounded-3" id="modal-report" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="width: 800px">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Relatório</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger" id="delete-button-report">Excluir</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="submit-form-new-report" class="btn btn-success">Salvar</button>
                    <button type="button" id="submit-form-report" class="btn btn-success">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script-before-body')
    <script src="{{asset('js/intro/intro-reports.js')}}"></script>
@endsection
