const dashboardLink = document.getElementById('dashboard-link');

document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
});
dashboardLink.classList.add('active');