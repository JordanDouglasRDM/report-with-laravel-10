@props(['switch'])

<div class="" style="width: 35%">
    <div class="input-group">
        <input type="text" class="form-control bg-light-subtle" name="filter-search"
               id="form-search_input"
               placeholder="Digite um dado para pesquisar">
        <button class="btn btn-secondary" id="form-search_button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
                 viewBox="0 0 16 16">
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
        </button>
        @if($switch)

            <div class="align-self-end ms-3">
                <label class="switch"
                       id="tooltip-switch"
                       data-bs-toggle="tooltip"
                       data-bs-placement="top"
                       data-bs-title="Marque para pesquisar em todas as datas"
                >
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
        @endif
    </div>
</div>
