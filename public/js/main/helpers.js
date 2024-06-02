function dateNowFormated() {
    let options = {timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'};
    let date = new Date().toLocaleDateString('pt-BR', options);
    let [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

// adiciona imagens de filtros em cada th
function addImagesFilters() {
    const divOrderBy = document.querySelectorAll('.order-by');
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

    return divOrderBy;
}

//-------------------------------------------------------------------------------------

//paginação das tabelas
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

function mountButtonsNavigate(previousPage, nextPage, paginate) {
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

function mountShower(paginate) {
    const from = document.getElementById('pg-from');
    const to = document.getElementById('pg-to');
    const total = document.getElementById('pg-total');

    from.innerText = paginate.from;
    to.innerText = paginate.to;
    total.innerText = paginate.total;
}


async function getQtyPending() {
    try {
        const response = await axios.get('/report/gty/pending/get');
        return response.data.data.qty_pending;

    } catch (error) {
        console.error('houve um erro ao recuperar a quantidade de relatórios pendentes', error)
        return 0;
    }

}
async function updateQtyPending() {
    const qtyPending = document.querySelector('.qty-pending');
    const qty = await getQtyPending();
    if (qty > 999) {
        qtyPending.textContent = '999+';
    } else {
        qtyPending.textContent = qty;
    }
}

window.onload = updateQtyPending;
