window.loading  = function () {
    const modalFind = document.getElementById('my-modal-loading');
    return new bootstrap.Modal(modalFind, {
        keyboard: false,
        backdrop: 'static'
    });
}

window.handleErrorsResponse = function (errorAxios) {
    const message = errorAxios.response.data.message;

    const errorCode = errorAxios.response.data.status;
    let errors = errorAxios.response.data.error;

    if (errorCode === 422) { //erros relacionados ao form request
        const errorObject = errorAxios.response.data.error;
        const errorArray = Object.values(errorObject);
        errors = errorArray.join('<br>');

        if (errorObject) {
            for (const key in errorObject) {
                const field = document.getElementById(key);
                if (field) {
                    field.classList.add('border-danger-subtle');
                    setTimeout(() => {
                        field.classList.remove('border-danger-subtle');
                    }, 4000)
                }
            }
        }
    }
    const toast = initializeToast()
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
