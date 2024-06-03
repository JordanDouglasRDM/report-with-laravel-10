<div class="d-flex mt-5 justify-content-between intro-paginate-group">
    <div class="d-flex per-page-responsive">
        <x-input-perpage class=""/>
        <div class="align-self-center intro-paginate-results">
            <span>Exibindo</span>
            <span id="pg-from"></span>
            <span>para</span>
            <span id="pg-to"></span>
            <span>de</span>
            <span id="pg-total"></span>
            <span>registros.</span>
        </div>
    </div>
    <div class="d-flex m-2 pagination-responsive__qty-reports">
        <button class="btn btn-sm btn-outline-light position-relative abstract-qty-reports" style="margin-left: -85px" id="pending">
            Pendente
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger qty-pending">
                -
            </span>
        </button>
        <button class="btn btn-sm btn-outline-light ms-4 position-relative abstract-qty-reports" id="in_progress">
            Em Andamento
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-black qty-in-progress">
                -
            </span>
        </button>
        <button class="btn btn-sm btn-outline-light ms-4 position-relative abstract-qty-reports" id="completed">
            Finalizado
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success qty-completed">
                -
            </span>
        </button>
    </div>
    <div class="d-flex justify-items-center justify-content-between intro-paginate-buttons">
        <div class="d-flex justify-content-between flex-fill">
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link" id="previous-page">Anterior</button>
                </li>

                <li class="page-item">
                    <button class="page-link" id="next-page"
                            rel="next">Próximo
                    </button>
                </li>
            </ul>
        </div>
    </div>
</div>

<script></script>
