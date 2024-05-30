document.addEventListener('DOMContentLoaded', function () {
    let paginateOut = {};
    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    let searchOutDate = false;
    let reports = [];
    const loadingModal = window.loading();
    const modalReport = new bootstrap.Modal(document.getElementById('modal-report'));
    const modalReportNew = new bootstrap.Modal(document.getElementById('modal-report-new'));
    const filterImg = document.createElement('img');
    const newButton = document.getElementById('new-report');
    const newButtonSubmit = document.getElementById('submit-form-new-report');
    const filterDate = document.getElementById('filter_date');
    const divOrderBy = document.querySelectorAll('.order-by');
    const checkbox = document.querySelector('input[type="checkbox"]');
    const searchButton = document.getElementById('form-search_button');
    const searchInput = document.getElementById('form-search_input');
    document.querySelector('.dropdown-toggle').classList.add('disabled');

    filterDate.value = dateNowFormated();

    divOrderBy.forEach((div) => {
        div.appendChild(createFilterIcon());
    });

    function createFilterIcon() {
        const span = document.createElement('span');
        const img = document.createElement('img');
        span.classList.add('align-self-center');
        img.src = '/assets/img/filter-button.svg';
        img.alt = 'Imagem de um filtro indicando ação de filtrar';
        span.appendChild(img);
        return span;
    }

    function dateNowFormated() {
        let options = {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'};
        let date = new Date().toLocaleDateString('pt-BR', options);
        let [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    }

    newButtonSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        const report = getDataReportChanged();
        store(report);

    })
    newButton.addEventListener('click', function (event) {
        event.preventDefault();
        modalReportNew.show();
        mountModalReportNew()
        selectFilteredRequesters();
    });
    const deleteButton = document.getElementById('delete-button-report');

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();

        Swal.fire({
            title: "Você tem certeza?",
            text: "Essa ação não poderá ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, entendo os riscos!"
        }).then((result) => {
            if (result.isConfirmed) {
                const reportId = deleteButton.dataset.reportId;
                destroy(reportId);
            }
        });


    })

    function getDataReportChanged() {
        return {
            requester_id: document.querySelector('input#requester_name_search').getAttribute('data-requester-id'),
            abstract: document.querySelector('input#abstract').value,
            description: document.querySelector('textarea#description').value,
            status: document.querySelector('select#status').value,
            priority: document.querySelector('select#priority').value,
        };
    }

    async function destroy(id) {
        try {
            loadingModal.show();

            const response = await axios.delete('/report/' + id);

            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalReport.hide();
            getAllReport();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    async function store(request) {
        try {
            loadingModal.show();

            const response = await axios.post('/report', request);
            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });
            modalReportNew.hide()
            getAllReport();

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    async function selectFilteredRequesters() {
        const requesterInput = document.getElementById('requester_name_search');
        const requesterList = document.getElementById('requesters_name_list');
        const requesters = await getAllRequester();

        // Adiciona um ouvinte de eventos para o evento 'input'
        requesterInput.addEventListener('input', function (event) {
            // Obtém o valor conforme é digitado
            const query = event.target.value.toLowerCase();

            // Filtra os requesters com base no valor do input (campo 'name')
            const filteredRequesters = requesters.filter(requester =>
                requester.name.toLowerCase().includes(query)
            ).slice(0, 5);

            // Limpa a lista anterior
            requesterList.innerHTML = '';

            // Adiciona as sugestões filtradas
            filteredRequesters.forEach(requester => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'list-group-item-hover');
                li.style.cursor = 'pointer';
                li.textContent = requester.name;
                li.id = requester.id;
                requesterList.appendChild(li);
            });
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'disabled');
            li.textContent = 'Resultados exibidos conforme pesquisa.';
            requesterList.appendChild(li)

            // Adiciona evento de clique a cada sugestão
            const lis = document.querySelectorAll('.list-group-item');
            lis.forEach(li => {
                li.addEventListener('click', function (event) {
                    requesterInput.value = event.target.textContent;
                    requesterInput.setAttribute('data-requester-id', event.target.id);
                    requesterList.innerHTML = ''; // Limpa as sugestões após selecionar
                });
            });
        });

        requesterInput.addEventListener('focusin', function () {
            requesterList.classList.remove('d-none');
        });

        requesterInput.addEventListener('focusout', function () {
            setTimeout(() => {
                requesterList.classList.add('d-none');
            }, 100); // Adiciona um pequeno atraso para permitir o clique na sugestão
        });
    }

    async function getAllRequester() {
        try {
            loadingModal.show();

            const response = await axios.get('/requester/get?order_by=name&order_direction=asc');
            const requesters = response.data.data;

            if (requesters.length < 1) {
                throw new Error('Nenhum registro encontrado');
            }

            return requesters;

        } catch (error) {

            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    //paginate
    function mountModalReportNew() {
        const modalBody = document.querySelector('.new-report-modal-body');
        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="requester_name" class="form-label">Solicitante</label>
                    <input type="text" class="form-control bg-body rounded" name="requester_id" id="requester_name_search"
                           placeholder="Pesquise por um solicitante"
                           autocomplete="off"
                    >
                    <ul class="list-group position-absolute d-none" id="requesters_name_list">
                    </ul>
                </div>
                <div class="mb-3">
                    <label for="abstract" class="form-label">Resumo</label>
                    <input type="tel" class="form-control bg-body rounded" id="abstract"
                           placeholder="Descreva brevemente o resumo"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Descrição</label>
                    <textarea type="text" class="form-control bg-body rounded" id="description"
                           placeholder="Detalhe a descrição da solicitação"
                           autocomplete="off"
                           style="height: 140px"></textarea>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Nível</label>
                    <select class="form-select" id="status" autocomplete="off">
                        <option value="pending" selected>Pendente</option>
                        <option value="completed">Concluido</option>
                        <option value="in_progress">Em Andamento</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Prioridade</label>
                    <select class="form-select" id="priority" autocomplete="off">
                        <option value="low">Baixa</option>
                        <option value="medium" selected>Média</option>
                        <option value="high">Alta</option>
                        <option value="note">Anotação</option>
                    </select>
                </div>

        `;
        selectFilteredRequesters()

    }

    const previousPage = document.getElementById('previous-page');

    const nextPage = document.getElementById('next-page');
    perPage();
    getAllReport();
    clearFilters();
    searchData();

    orderData();
    filterDate.addEventListener('change', function (event) {
        event.preventDefault();
        searchOutDate = false;
        getAllReport({filter_date: event.target.value});
    });


    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('pages')) {
            event.preventDefault();
            const page = target.innerText;
            if (parseInt(page)) {
                getAllReport({page: page});
            }
        }
    });

    previousPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (canNavigate(paginateOut, 'previous')) {
            getAllReport({page: paginateOut.current_page - 1})
        }
    });

    nextPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (canNavigate(paginateOut, 'next')) {
            getAllReport({page: paginateOut.current_page + 1})
        }
    });


    function mountButtonsPage(paginate) {
        if (paginate.to !== null) {
            const paginationContainer = document.querySelector('.pagination');
            const links = paginate.links;

            while (paginationContainer.children.length > 2) {
                paginationContainer.removeChild(paginationContainer.children[1]);
            }

            links.forEach((link, index) => {
                if (index > 0 && index < links.length - 1) {
                    const pageItem = document.createElement('li');
                    pageItem.classList.add('page-item');
                    if (link.active) {
                        pageItem.classList.add('active');
                    }

                    const pageButton = document.createElement('button');
                    pageButton.classList.add('page-link');
                    pageButton.classList.add('pages');
                    pageButton.innerText = link.label;

                    pageItem.appendChild(pageButton);
                    paginationContainer.insertBefore(pageItem, paginationContainer.children[paginationContainer.children.length - 1]);
                }
            });
        }
    }

    function mountButtonsNavigate(paginate) {
        if (paginate.current_page === 1) {
            previousPage.classList.add('disabled');
        } else {
            previousPage.classList.remove('disabled');
        }
        if (paginate.current_page === paginate.last_page) {
            nextPage.classList.add('disabled');
        } else {
            nextPage.classList.remove('disabled');
        }
    }

    function canNavigate(paginate, type) {
        if (paginate.to !== null) {
            if (type === 'previous') {
                return paginate.current_page > 1;
            } else if (type === 'next') {
                return paginate.current_page < paginate.last_page;
            }
        }
        return false;
    }

    async function getAllReport(request = {}) {
        try {
            loadingModal.show();
            //se eu possuo filtro definido, na nova paginação, permanece com o filtro
            if (filters !== '') {
                request = Object.assign({}, request, {filter_search: filters});
            }
            //se eu possuo order_by definido, na nova paginação, permanece com o order_by
            if (orderBy !== '') {
                request = Object.assign({}, request, {
                    order_by: orderBy
                });
            }
            //verifica se eu estou pesquisando e filtrando repots fora da minha data
            if (searchOutDate === true) {
                filterDate.value = '';
            }

            request = Object.assign({}, request, {
                search_out_date: searchOutDate
            });
            if (request.filter_date === undefined) {
                request = Object.assign({}, request, {filter_date: filterDate.value});
            }
            console.log(request)
            const response = await axios.get('/report/get', {
                params: request
            });
            reports = response.data.data.data;

            if (reports.length < 1) {
                toast.fire({
                    icon: "warning",
                    title: "Nenhum registro encontrado",
                    timer: 2500
                });
                return;
            }

            document.querySelector('.dropdown-toggle').classList.remove('disabled');
            const paginate = response.data.data;
            paginateOut = paginate;
            mountTableReports(reports);
            mountShower(paginate);
            mountButtonsNavigate(paginate);
            mountButtonsPage(paginate);

        } catch(error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });


    function orderData() {
        divOrderBy.forEach((div) => {
            div.addEventListener('click', () => {
                document.querySelectorAll('.filter-button-icon-none').forEach((sp) => {
                    sp.classList.remove('filter-button-icon-none');
                })
                if (reports.length > 0) {
                    const th = div.closest('th');
                    div.querySelector('span').classList.add('filter-button-icon-none');
                    if (orderBy === th.id) {
                        if (orderDirection === 'asc') {
                            orderDirection = 'desc';
                            filterImg.src = '/assets/img/filter-up.svg';

                        } else {
                            orderDirection = 'asc';
                            filterImg.src = '/assets/img/filter-down.svg';
                        }
                    } else {
                        orderBy = th.id;
                        filterImg.src = '/assets/img/filter-up.svg';
                    }
                    div.appendChild(filterImg);
                    getAllReport({
                        order_by: orderBy,
                        order_direction: orderDirection,
                        per_page: paginateOut.per_page
                    });
                }
            });
        });
    }

    function searchData() {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            action();
        });
        searchInput.addEventListener('keypress', (event) => {

            if (event.key === 'Enter') {
                event.preventDefault();
                action();
            }
        });

        function action() {
            filters = searchInput.value;
            searchOutDate = checkbox.checked;
            getAllReport({
                filter_search: filters,
                search_out_date: searchOutDate
            });
        }
    }

    function clearFilters() {
        const btnFilter = document.getElementById("clear-filters");
        btnFilter.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll('.filter-button-icon-none').forEach((sp) => {
                sp.classList.remove('filter-button-icon-none');
            })
            searchInput.value = '';
            filters = '';
            orderBy = '';
            filterImg.remove();
            searchOutDate = false;
            checkbox.checked = false;
            getAllReport();
        });
    }

    function perPage() {
        const dropDownItems = document.querySelectorAll('.dropdown-item');
        dropDownItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                getAllReport({per_page: item.innerText});
            });
        });

    }

    function mountShower(paginate) {
        const from = document.getElementById('pg-from');
        const to = document.getElementById('pg-to');
        const total = document.getElementById('pg-total');

        from.innerText = paginate.from;
        to.innerText = paginate.to;
        total.innerText = paginate.total;
    }

    function mountTableReports(reports) {
        const tableBody = document.querySelector('#reports-table tbody');
        tableBody.innerHTML = '';

        reports.forEach(report => {
            const tr = document.createElement('tr');
            let createdAt = new Date(report.created_at)
            createdAt = createdAt.toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td class="align-content-around">${report.id}</td>
                <td class="align-content-around">${report.requester.name}</td>
                <td class="align-content-around">${report.abstract}</td>
                <td class="align-content-around text-justify" style="text-align: justify">${report.description}</td>
                <td class="align-content-around">${report.status}</td>
                <td class="align-content-around">${report.priority}</td>
                <td class="align-content-around">${createdAt}</td>
                <td class="align-content-around"><a class="edit-button btn btn-outline-warning btn-sm" id="${report.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        prepareEventClickOpenModal();
    }

    async function prepareEventClickOpenModal() {
        document.querySelectorAll('.edit-button').forEach((a) => {
            a.addEventListener('click', async (event) => {
                event.preventDefault();
                const reportId = a.id;
                await mountModalReportSelected(reportId);
            });
        });
    }

    function mountModalReport(report = {}) {
        const modalBody = document.querySelector('.modal-body');
        deleteButton.setAttribute('data-report-id', report.id);
        modalBody.innerHTML = '';

        modalBody.innerHTML = `
                <div class="mb-3">
                    <label for="requester_name" class="form-label">Solicitante</label>
                    <input type="text" class="form-control bg-body rounded" name="requester_name" id="requester_name_search"
                           placeholder="Digite seu nome"
                           data-requester-id="${report.requester.id}"
                           value="${report.requester.name ?? ''}"
                           autocomplete="off"
                    >
                    <ul class="list-group position-absolute d-none" id="requesters_name_list">
                    </ul>

                </div>
                <div class="mb-3">
                    <label for="abstract" class="form-label">Resumo</label>
                    <input type="tel" class="form-control bg-body rounded" id="abstract"
                           placeholder="Digite seu número de telefone"
                           value="${report.abstract ?? ''}"
                           autocomplete="off"
                    >
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Descrição</label>
                    <textarea type="text" class="form-control bg-body rounded" id="description"
                           placeholder="Digite seu número de telefone"
                           autocomplete="off"
                           style="height: 140px">${report.description ?? ''}</textarea>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Nível</label>
                    <select class="form-select" id="status" autocomplete="off">
                        <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pendente</option>
                        <option value="completed" ${report.status === 'completed' ? 'selected' : ''}>Concluido</option>
                        <option value="in_progress" ${report.status === 'in_progress' ? 'selected' : ''}>Em Andamento</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Prioridade</label>
                    <select class="form-select" id="priority" autocomplete="off">
                        <option value="low" ${report.priority === 'low' ? 'selected' : ''}>Baixa</option>
                        <option value="medium" ${report.priority === 'medium' ? 'selected' : ''}>Média</option>
                        <option value="high" ${report.priority === 'high' ? 'selected' : ''}>Alta</option>
                        <option value="note" ${report.priority === 'note' ? 'selected' : ''}>Anotação</option>
                    </select>
                </div>
                <div>
        </div>
        `;
    }

    async function mountModalReportSelected(reportId) {
        const report = await getReportById(reportId);
        if (!report) {
            return;
        }
        mountModalReport(report)
        selectFilteredRequesters()
        modalReport.show();
        prepareEventClickSubmitFormChanges(reportId);
    }

    async function prepareEventClickSubmitFormChanges(reportId) {
        const submitButton = document.getElementById('submit-form-report');
        const newSubmitHandler = async (event) => {
            event.preventDefault();
            const report = getDataReportChanged();
            await updateReportById(report, reportId);
        };

        // Remove os ouvintes de evento anteriores
        submitButton.replaceWith(submitButton.cloneNode(true));
        document.getElementById('submit-form-report').addEventListener('click', newSubmitHandler);
    }

    async function updateReportById(request, reportId) {
        try {
            const response = await axios.put('report/' + reportId, request);
            modalReport.hide();

            await getAllReport({page: paginateOut.current_page});

            toast.fire({
                icon: "success",
                title: response.data.message,
                timer: 2500
            });

        } catch (error) {
            window.handleErrorsResponse(error);
        }
    }

    async function getReportById(id) {
        try {
            const response = await axios.get('/report/' + id);
            return response.data.data;
        } catch (error) {
            const title = error.response?.data?.message || 'Erro desconhecido';
            const errorMessage = error.response?.data?.error || 'Erro desconhecido';
            const errorCode = error.response?.status || 500;

            await toast.fire({
                icon: "error",
                title: title,
                html: `<p>Erro: ${errorMessage}<br>Código: ${errorCode}</p>`
            });
            return null;
        }
    }
})
;
