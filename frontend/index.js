const baseURL = `http://127.0.0.1:8000/todo/list/`;
const todosContainer = document.getElementById('todo-list');
const inp_todo = document.getElementById('inp-todo');
const add_btn = document.getElementById("add");
const sortButton = document.getElementById('sort');
const filterButton = document.getElementById('incomplete');
const pageContainer = document.querySelector('.pagination');
const logoutButton = document.getElementById('logout');
const getAllTodo = document.getElementById('get-todo');

let sortingOrder = true;
let filterStatus = null;
let perPage = 3;
let currentPage = 1;

const access = localStorage.getItem("access") || "";
const csrfToken = "";

if (!access) {
    alert("Please login!");
    window.location.href = "login.html";
}


// const createPagination = (data) => {
//     pageContainer.innerHTML = "";

//     const prev = document.createElement('button');
//     prev.textContent = "<";
//     prev.classList.add('btn');
//     prev.disabled = !data.previous;
//     prev.addEventListener("click", () => {
//         if (data.previous) {
//             fetchTodos(data.previous);
//         }
//     });
//     pageContainer.appendChild(prev);

//     const next_button = document.createElement('button');
//     next_button.textContent = ">";
//     next_button.classList.add('btn');
//     next_button.disabled = !data.next;
//     next_button.addEventListener("click", () => {
//         if (data.next) {
//             fetchTodos(data.next);
//         }
//     });
//     pageContainer.appendChild(next_button);
// };


const createPagination = (totalTodo) => {
    let totalPage = Math.ceil(totalTodo / perPage);
    pageContainer.innerHTML = "";

    const prev = document.createElement('button');
    prev.textContent = "<";
    prev.classList.add('btn');
    prev.addEventListener("click", () => {
        currentPage === 1 ? prev.disabled : currentPage--;
        fetchTodos();
    });
    pageContainer.appendChild(prev);

    for (let i = 1; i <= totalPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('btn');
        pageButton.addEventListener("click", () => {
            currentPage = i;
            fetchTodos();
        });
        pageContainer.appendChild(pageButton);
    }

    const next_button = document.createElement('button');
    next_button.textContent = ">";
    next_button.classList.add('btn');
    next_button.addEventListener("click", () => {
        currentPage === totalPage ? next_button.disabled : currentPage++;
        fetchTodos();
    });
    pageContainer.appendChild(next_button);
};

const displayTodos = (todos) => {
    todosContainer.innerHTML = "";
    todos.forEach(element => {
        const todo = document.createElement("li");
        todo.classList.add("todo-list");

        const title = document.createElement("p");
        title.innerText = element.title;
        if (element.status) {
            title.classList.add('complete');
        }

        const subDiv = document.createElement('div');

        const editTitle = document.createElement('button');
        editTitle.textContent = "Edit Title";
        editTitle.classList.add('edit-btn');
        editTitle.addEventListener("click", () => {
            // Create a modal
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Edit Title</h2>
                    <input type="text" id="new-title" value="${element.title}">
                    <button id="save-title" class="btn">Save</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Close the modal
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener("click", () => {
                document.body.removeChild(modal);
            });

            // Save the new title
            const saveBtn = modal.querySelector('#save-title');
            saveBtn.addEventListener("click", async () => {
                const newTitle = modal.querySelector('#new-title').value;
                if (newTitle.trim()) {
                    try {
                        await fetch(`${baseURL}${element.id}/`, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${access}`,
                                "X-CSRFToken": csrfToken
                            },
                            body: JSON.stringify({ title: newTitle })
                        });
                        fetchTodos();
                    } catch (err) {
                        console.log(err);
                    } finally {
                        document.body.removeChild(modal);
                    }
                } else {
                    alert("Title cannot be empty");
                }
            });
        });

        const status = document.createElement('button');
        status.innerText = element.status ? "Done" : "To Be Done";
        status.classList.add('button-toggle');
        status.addEventListener("click", async () => {
            try {
                await fetch(`${baseURL}${element.id}/`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access}`,
                        "X-CSRFToken": csrfToken
                    },
                    body: JSON.stringify({ status: !element.status })
                });
                fetchTodos();
            } catch (err) {
                console.log(err);
            }
        });

        const delete_btn = document.createElement('button');
        delete_btn.classList.add("button-del");
        delete_btn.textContent = "Delete";
        delete_btn.addEventListener("click", async () => {
            try {
                await fetch(`${baseURL}${element.id}/`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access}`,
                        "X-CSRFToken": csrfToken
                    },
                });
                fetchTodos();
            } catch (err) {
                console.log(err);
            }
        });

        subDiv.append(editTitle, status, delete_btn);
        todo.append(title, subDiv);
        todosContainer.append(todo);
    });
};

const addTodo = async () => {
    const todo = inp_todo.value;
    try {
        await fetch(baseURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({
                title: todo,
                status: false
            })
        });
        inp_todo.value = "";
        fetchTodos();
    } catch (err) {
        console.log(err);
    }
};

add_btn.addEventListener("click", addTodo);


const logout = async () => {
    const refreshToken = localStorage.getItem("refresh") || "";
    const accessToken = localStorage.getItem("access") || "";

    if (!refreshToken || !accessToken) {
        alert("No tokens found. Please login!");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/todo/logout/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            })
        });

        if (res.status === 205) {
            alert("Logout successful!");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            window.location.href = "login.html";
        } else {
            const data = await res.json();
            alert(data.error || "Logout failed!");
        }
    } catch (err) {
        console.log(err);
    }
};

logoutButton.addEventListener("click", logout);

getAllTodo.addEventListener("click", () => {
    filterStatus = null;
    currentPage = 1
    fetchTodos();
});


sortButton.addEventListener("click", () => {
    sortingOrder = !sortingOrder;
    currentPage = 1
    fetchTodos();
});

filterButton.addEventListener("click", () => {
    if (filterStatus === null || filterStatus === true) {
        filterButton.textContent = "Show Complete Todos";
        filterStatus = false;
    } else {
        filterButton.textContent = "Show Incomplete Todos";
        filterStatus = true;
    }
    currentPage = 1
    fetchTodos();
});

const fetchTodos = async () => {
    let apiURL = `${baseURL}?page=${currentPage}`;
    
    if (sortingOrder !== null) {
        apiURL += `&ordering=${sortingOrder ? "title" : "-title"}`;
    }

    if (filterStatus !== null) {
        apiURL += `&status=${filterStatus}`;
    }

    try {
        const res = await fetch(apiURL, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`
            }
        });
        const data = await res.json();

        if (data?.detail) {
            alert(data.detail + " Please Login!");
            window.location.href = "login.html";
        } else if (data?.error) {
            alert(data.error);
        }
        displayTodos(data.results);
        createPagination(data.count);
    } catch (err) {
        console.log(err);
    }
};


// const fetchTodos = async (url = baseURL) => {
//     let apiURL = url;
    
//     if (sortingOrder !== null && url === baseURL) {
//         apiURL += `?ordering=${sortingOrder ? "title" : "-title"}`;
//     }

//     if (filterStatus !== null && url === baseURL) {
//         apiURL += `${sortingOrder !== null ? "&" : "?"}status=${filterStatus}`;
//     }

//     try {
//         const res = await fetch(apiURL, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${access}`
//             }
//         });
//         const data = await res.json();

//         if (data?.detail) {
//             alert(data.detail + " Please Login!");
//             window.location.href = "login.html";
//         } else if (data?.error) {
//             alert(data.error);
//         }
//         displayTodos(data.results);
//         createPagination(data);
//     } catch (err) {
//         console.log(err);
//     }
// };


fetchTodos();

