alterTheme();
function alterTheme() {
    const switchTheme = document.querySelector(".selector-theme-toggle-button");

    // Carregar o tema salvo do Local Storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
        switchTheme.checked = (savedTheme === 'dark');
    }

    switchTheme.addEventListener('change', (e) => {
        if (switchTheme.checked) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });

    function applyTheme(theme) {
        const body = document.querySelector('body');
        const html = document.documentElement;

        // Ajuste do tema para Bootstrap
        body.setAttribute('data-bs-theme', theme);

        // Ajuste do tema para Tailwind CSS
        if (theme === 'dark') {
            html.classList.add('tw-dark');
        } else {
            html.classList.remove('tw-dark');
        }
        // Salvar o tema no Local Storage
        localStorage.setItem('theme', theme);
    }

}



const toast = initializeToast();
window.loading = function () {
    const modalFind = document.getElementById('my-modal-loading');
    return new bootstrap.Modal(modalFind, {
        keyboard: false,
        backdrop: 'static'
    });
}

window.handleErrorsResponse = function (errorAxios) {
    if (!errorAxios.response) {
        errorAxios = {
            response: {
                data: {
                    message: 'Erro interno do servidor',
                    status: 500,
                    error: errorAxios.message
                }
            }
        }
    }
    const message = errorAxios.response.data.message;

    const errorCode = errorAxios.response.data.status;
    let errors = errorAxios.response.data.error;

    if (errorCode === 422) { //erros relacionados ao form request
        const errorObject = errorAxios.response.data.error;
        const errorArray = Object.values(errorObject);
        errors = errorArray.join('<br>');

        if (errorObject) {
            for (const key in errorObject) {
                const fields = document.querySelectorAll('input#' + key);
                if (fields) {
                    fields.forEach((field) => {
                        field.classList.add('border-danger-subtle');
                        setTimeout(() => {
                            field.classList.remove('border-danger-subtle');
                        }, 4000)
                    })
                }
            }
        }
    }
    toast.fire({
        icon: "error",
        title: message,
        html: errors,
        timer: 4000
    });
}

function initializeToast() {
    return Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
}
