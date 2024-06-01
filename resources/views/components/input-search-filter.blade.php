@props(['switch'])

<div class="intro-search-group" style="width: 35%">
    <div class="intro-search input-group">
        <input type="text" class="form-control bg-light-subtle" name="filter-search"
               id="form-search_input"
               placeholder="Digite um dado para pesquisar">
        <button class="btn btn-secondary" id="form-search_button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search"
                 viewBox="0 0 16 16">
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
        </button>
        @if($switch)
            <button class="btn btn-secondary" id="input-search-switch">
                <div class="d-flex">
                    <label class="switch"
                           id="tooltip-switch"
                           data-bs-toggle="tooltip"
                           data-bs-placement="top"
                           data-bs-title="Marque para pesquisar em todas as datas"
                    >
                        <input type="checkbox" class="all">
                        <span class="slider round"></span>
                    </label>
                </div>
            </button>
        @endif
    </div>
</div>
