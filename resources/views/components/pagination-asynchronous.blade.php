@props(
    ['data']
)

<div class="container d-flex mt-5 justify-content-between">
    <div class="me-4">
        <span>Exibindo</span>
        <span id="pg-from"></span>
        <span>para</span>
        <span id="pg-to"></span>
        <span>de</span>
        <span id="pg-total"></span>
        <span>registros.</span>
    </div>
    <div class="d-flex justify-items-center justify-content-between">
        <div class="d-flex justify-content-between flex-fill">
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link" id="previous-page">Anterior</button>
                </li>


                <li class="page-item">
                    <button class="page-link" id="next-page"
                       rel="next">Próximo</button>
                </li>
            </ul>
        </div>
    </div>
</div>

<script></script>
