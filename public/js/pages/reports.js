document.addEventListener('DOMContentLoaded', function () {
    let paginateOut = {};
    let filters = '';
    let orderBy = '';
    let orderDirection = 'desc';
    let searchOutDate = false;
    let reports = [];
    const loadingModal = window.loading();
    let modalReport = new bootstrap.Modal(document.getElementById('modal-report'));

    const filterImg = document.createElement('img');
    const filterDate = document.getElementById('filter_date');
    const checkbox = document.querySelector('input[type="checkbox"].all');
    const searchButton = document.getElementById('form-search_button');
    const searchInput = document.getElementById('form-search_input');

    document.querySelector('.dropdown-toggle').classList.add('disabled');

    function showTooltipSwitch() {
        const tooltipSwitch = document.getElementById('tooltip-switch');
        const tool = new bootstrap.Tooltip(tooltipSwitch);

        tooltipSwitch.addEventListener('mouseover', function (event) {
            tool.show();
        })
        tooltipSwitch.addEventListener('mouseout', function (event) {
            tool.hide();
        })
    }

    showTooltipSwitch();

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

    const divOrderBy = addImagesFilters();

    //define data atual da requisição como now
    filterDate.value = dateNowFormated();

    //salvar novo registro
    const newButtonSubmit = document.getElementById('submit-form-new-report');
    newButtonSubmit.addEventListener('click', async function (event) {
        event.preventDefault();
        const report = getDataReportChanged();
        try {
            newButtonSubmit.classList.add('disabled');
            await store(report);

        } finally {
            setTimeout(() => {
                newButtonSubmit.classList.remove('disabled');
            }, 700);
        }
    });
    //--------------------------

    //abrir modal de novo registro
    const newButton = document.getElementById('new-report');
    newButton.addEventListener('click', async function (event) {
        event.preventDefault();
        modalReport.dispose();
        modalReport = new bootstrap.Modal(document.getElementById('modal-report'));
        mountModalReport({}, 'inserir');
        await selectFilteredRequesters();
        await modalReport.show();
    });
    //-------------------------


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

        const requesterInput = document.querySelector('input#requester_id');
        if (requesterInput.value === '') {
            requesterInput.removeAttribute('data-requester-id');
        }
        return {
            requester_id: requesterInput.getAttribute('data-requester-id'),
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

    async function selectFilteredRequesters(usage = '') {

        let requesterInput = document.getElementById('requester_id');
        const requesterList = document.getElementById('requesters_name_list');
        if (usage === 'store') {
            requesterInput = document.querySelector('.new-report#requester_id');
        }

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

    //paginate
    const previousPage = document.getElementById('previous-page');
    const nextPage = document.getElementById('next-page');

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
            mountButtonsNavigate(previousPage, nextPage, paginate);
            mountButtonsPage(paginate);

        } catch (error) {
            window.handleErrorsResponse(error);
        } finally {
            setTimeout(() => {
                loadingModal.hide();
            }, 300);
        }
    }

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
                <td class="align-content-around"><p class="status-text rounded-5 border">${report.status}</p></td>
                <td class="align-content-around">
                <div class="d-flex justify-content-around align-content-center">
                    <p class="priority-text">${report.priority}</p>
                    <div>
                        <img class="img-priority rounded-5">
                    </div>
                </div>
                </td>
                <td class="align-content-around">${createdAt}</td>
                <td class="align-content-around"><a class="edit-button btn btn-outline-secondary btn-sm" id="${report.id}">Editar</a></td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.priority-text').forEach((tx) => {
            const paiEmComum = tx.parentNode;
            const img = paiEmComum.querySelector('.img-priority');
            img.classList.remove('pulse');

            switch (tx.textContent) {
                case "high":
                    img.classList.add('pulse');
                    img.src = '/assets/img/star-high.svg';
                    break;
                case 'medium':
                    img.src = '/assets/img/star-medium.svg';
                    break;
                case 'low':
                    img.src = '/assets/img/star-low.svg';
                    break;
                case 'note':
                    img.classList.remove('rounded-5');
                    img.src = '/assets/img/note.svg';
                    break;
            }

        });

        document.querySelectorAll('.status-text').forEach((tx) => {
            tx.classList.remove('border-warning', 'text-warning');
            switch (tx.textContent) {
                case "in_progress":
                    tx.classList.add('border-warning', 'text-warning');
                    break;
                case 'completed':
                    tx.classList.add('border-success', 'text-success');
                    tx.closest('tr').querySelector('.img-priority').classList.remove('pulse');
                    break;
                case 'pending':
                    tx.classList.add('border-danger', 'text-danger');
                    break;
            }
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

    function mountModalReport(report = {}, action) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        const insertValues = action === 'inserir';

        const submitFormNewReport = document.getElementById('submit-form-new-report');
        const submitFormReport = document.getElementById('submit-form-report');
        if (insertValues) {
            deleteButton.classList.add('d-none');
            submitFormNewReport.classList.remove('d-none');
            submitFormReport.classList.add('d-none');
        } else {
            submitFormNewReport.classList.add('d-none');

            submitFormReport.classList.remove('d-none');
            submitFormReport.setAttribute('data-report-id', report.id);

            deleteButton.classList.remove('d-none');
            deleteButton.setAttribute('data-report-id', report.id);
        }

        modalBody.innerHTML = `
        <div class="mb-3">
            <label for="requester_name" class="form-label">Funcionário</label>
            <input type="text" class="form-control bg-body rounded" name="requester_name" id="requester_id"
                   placeholder="Digite seu nome"
                   data-requester-id="${insertValues ? '' : report.requester.id ?? ''}"
                   value="${insertValues ? '' : report.requester.name ?? ''}"
                   autocomplete="off"
            >
            <ul class="list-group position-absolute d-none" id="requesters_name_list">
            </ul>
        </div>
        <div class="mb-3">
            <label for="abstract" class="form-label">Resumo</label>
            <input type="tel" class="form-control bg-body rounded" id="abstract"
                   placeholder="Digite seu número de telefone"
                   value="${insertValues ? '' : report.abstract ?? ''}"
                   autocomplete="off"
            >
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Descrição</label>
            <textarea type="text" class="form-control bg-body rounded" id="description"
                   placeholder="Digite seu número de telefone"
                   autocomplete="off"
                   style="height: 140px">${insertValues ? '' : report.description ?? ''}</textarea>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Nível</label>
            <select class="form-select" id="status" autocomplete="off">
                <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pendente</option>
                <option value="completed" ${report.status === 'completed' ? 'selected' : ''}>Concluído</option>
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
    `;
    }

    async function mountModalReportSelected(reportId) {
        modalReport.dispose();
        modalReport = new bootstrap.Modal(document.getElementById('modal-report'));
        const report = await getReportById(reportId);
        if (!report) {
            return;
        }
        mountModalReport(report)
        await selectFilteredRequesters()
        modalReport.show();
    }
    const submitButton = document.getElementById('submit-form-report');
    document.getElementById('submit-form-report').addEventListener('click', async (event) => {
        event.preventDefault();
        const reportId = event.target.getAttribute('data-report-id');
        const report = getDataReportChanged();

        try {
            submitButton.disabled = true; // Desabilita o botão para evitar cliques repetidos
            await updateReportById(report, reportId);
        } finally {
            setTimeout(() => {
                submitButton.disabled = false; // Habilita o botão de volta após um curto atraso
            }, 700);
        }
    });

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
