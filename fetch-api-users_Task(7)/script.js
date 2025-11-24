let allUsers = [];
let selectedUserId = null;

const usersContainer = document.getElementById('users');
const messageContainer = document.getElementById('message');
const reloadButton = document.getElementById('reloadButton');
const sortDropdown = document.getElementById('sortDropdown');

function showLoading() {
    messageContainer.innerHTML = '<span class="loading">Loading...</span>';
}

function showError(msg) {
    messageContainer.innerHTML = `<div class="error">${msg}</div><button id="retryButton">Retry</button>`;
    document.getElementById('retryButton').onclick = fetchUsers;
}

function renderUsers(users) {
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const userCard = document.createElement('article');
        userCard.className = 'user-card';
        userCard.tabIndex = 0;
        if (user.id === selectedUserId) {
            userCard.classList.add('active');
        }
        userCard.setAttribute("aria-label", `User ${user.name}`);
        userCard.onclick = () => {
            selectedUserId = user.id;
            renderUsers(users);
        };
        userCard.innerHTML = `
            <header><strong>Name:</strong> ${user.name}</header>
            <div><strong>Email:</strong> ${user.email}</div>
            <div><strong>Address:</strong>
                ${user.address.street}, ${user.address.suite}, ${user.address.city} - ${user.address.zipcode}
            </div>
        `;
        usersContainer.appendChild(userCard);
    });
}

function fetchUsers() {
    showLoading();
    usersContainer.innerHTML = '';
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user data. Please try again.');
            return response.json();
        })
        .then(users => {
            messageContainer.innerHTML = '';
            allUsers = users;
            selectedUserId = null;
            sortAndRenderUsers(sortDropdown.value);
        })
        .catch(error => {
            showError(error.message);
        });
}

function sortAndRenderUsers(criteria) {
    let sortedUsers = [...allUsers];
    if (criteria === "name") {
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "city") {
        sortedUsers.sort((a, b) => a.address.city.localeCompare(b.address.city));
    }
    renderUsers(sortedUsers);
}

reloadButton.addEventListener('click', fetchUsers);

sortDropdown.addEventListener('change', (e) => {
    sortAndRenderUsers(e.target.value);
});

// Initial fetch when page loads
window.onload = fetchUsers;
