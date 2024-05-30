showTooltipSwitch();
function showTooltipSwitch (){
    const tooltipSwitch = document.getElementById('tooltip-switch');
    const tool = new bootstrap.Tooltip(tooltipSwitch);

    tooltipSwitch.addEventListener('mouseover', function (event) {
        tool.show();
    })
    tooltipSwitch.addEventListener('mouseout', function (event) {
        tool.hide();
    })
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
