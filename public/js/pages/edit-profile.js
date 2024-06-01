handleTutorials()
function handleTutorials() {
    const tutorialReportButton = document.getElementById('tutorial-reports');
    tutorialReportButton.addEventListener('click', (e) => {
        e.preventDefault();

        localStorage.setItem('introTourShown', 'false');
        window.location.href = '/report';
    })
}
