function startIntroTour() {
    introJs().setOptions({
        // tooltipClass: 'customTooltip', // Para aplicar temas personalizados
        showProgress: true,
        showBullets: true,
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        doneLabel: 'Finalizar',
        steps: [
            {
                title: 'Bem vindo!',
                intro: "Bem-vindo ao nosso site! Este é um tour para mostrar as funcionalidades principais."
            },
            {
                element: document.querySelector('#new-report'),
                title: 'Adicionar',
                intro: "Adicione um novo relatório clicando aqui."
            },
            {
                element: document.querySelector('.dropdown-toggle'),
                title: 'Por página',
                intro: "Controle quantos registros deseja exibir por página."
            },
            {
                element: document.querySelector('#filter_date'),
                title: 'Data',
                intro: "Selecione uma data para encontrar registros."
            },
            {
                element: document.querySelector('.intro-search-group'),
                title: 'Pesquisar',
                intro: "Aqui você pode realizar pesquisas de palavras chaves, códigos e quaisquer outras para encontrar seu relatório",
            },
            {
                element: document.querySelector('#tooltip-switch'),
                title: 'Pesquisar',
                intro: "Selecione para poder realizar pesquisas em todas as datas que ocorreram.",
            },
            {
                element: document.querySelector('#clear-filters'),
                title: 'Limpeza',
                intro: "Limpe os filtros aplicados",
            },
            {
                element: document.querySelector('thead'),
                title: 'Ordenar',
                intro: "Ordene os dados da maneira que preferir, basta clicar em qualquer lugar demarcado.",
            },
            {
                element: document.querySelector('.intro-paginate-group'),
                title: 'Paginação',
                intro: "Os dados são exibidos em paginação para um carregamento mais rápido.",
            },
            {
                element: document.querySelector('.intro-paginate-results'),
                title: 'Paginação',
                intro: "Veja rapidamente a quantidade de registros encontrados.",
            },
            {
                element: document.querySelector('.intro-paginate-buttons'),
                title: 'Paginação',
                intro: "Navegue entre as páginas disponíveis.",
            },
            {
                title: 'Aproveite',
                intro: "Você pode acessar este tutorial no seu perfil, procure por tutoriais.",
            }
        ]
    }).start();
}
window.onload = function() {
    if (localStorage.getItem('introTourShown') === 'false') {
        startIntroTour();
        localStorage.setItem('introTourShown', 'true');
    }
};
