class CustomerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomerError';
    }
}
const lstTask = document.getElementById("list_task")
const addTask = document.getElementById("add_task");
const nameTask = document.getElementById("name_task");
const dateMustDone = document.getElementById("date_must_done");


async function getData(url) {
    const response = await fetch(url, {
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
    });
    if (!response.ok) {
        throw new CustomerError(`Server return bad response code (${response.status}) ${response.statusText} `);
    }
    return response.json();
}

async function deleteTask (e) {
    try {
        const dt = e.target.id.split('_')[2];
        const res = await postRequest('http://localhost:8080/ListDo/DelTask',dt);
    } catch(err) {
        if (err instanceof CustomerError) {
            console.log(`loadCountries : ${err.message}`);
        } else {
            console.log(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
        }
    }
    renderTask();
}
const generateElement = (element) => {
    const flagStatus = element['isDone'] ? 'Готово' : 'В процессе))';
    return `<div id="row_${element['id']}" class="row mt-4 d-flex justify-content-start">
    <div id = "task_name_${element['id']}" class="col-3">
      ${element['task']}
    </div>
    <div id = "flag_status_${element['id']}" class="col-3">
        ${flagStatus}
    </div>
    <div id="must_done_${element['id']}" class="col-3">
        ${element['mustDone']}
    </div>
    <div class="col-3">
        <div class="row">
            <div class="col">
                <button id="btn_edit_${element['id']}" class="btn btn-primary btnEdit"></button>
            </div>
            <div class="col">
                <button id="btn_del_${element['id']}" class="btn btn-primary btnDel"></button>
            </div>
        </div>
    </div>
  </div>
  <div id="flag_status_bool_${element['id']}" style="display:none"> ${element['isDone']} </div>`
}

async function updateData(id) {
    const task_name = document.getElementById(`edit_name_task_${id}`).value;
    const is_check = document.getElementById(`flex_check_default_${id}`).checked;
    const time_done = document.getElementById(`edit_date_must_done_${id}`).value;
    try {
        const dt = {'id':id,'task' : task_name,'isDone':is_check,'mustDone':time_done};
        const res = await postRequest('http://localhost:8080/ListDo/EditTask',dt);
        const element = document.getElementById(`edit_data_row_${id}`);
        element.outerHTML = generateElement(res);

        document.getElementById(`btn_del_${id}`).addEventListener("click",deleteTask);
        document.getElementById(`btn_edit_${id}`).addEventListener("click",editTask)
    } catch(err) {
        if (err instanceof CustomerError) {
            console.log(`loadCountries : ${err.message}`);
        } else {
            console.log(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
        }
    }
}

function editTask(e) {
    const id_data = e.target.id.split('_')[2];
    const element = document.getElementById(`row_${id_data}`);
    const task_name = document.getElementById(`task_name_${id_data}`).innerText;
    const time_done = document.getElementById(`must_done_${id_data}`).innerText;
    const flag_text = document.getElementById(`flag_status_bool_${id_data}`).innerText;
    const flag_bool = (flag_text.trim() === 'true');
    element.outerHTML = `<div id = "edit_data_row_${id_data}" class="row mt-4 d-flex justify-content-start">
        <div class="col-3">
            <input id = "edit_name_task_${id_data}" class = "form-control" placeholder = "Enter task" type = "text" value="${task_name}" >
        </div>
        <div class="col-3">
            <input class="form-check-input" type="checkbox" ${flag_bool === true ?'checked':''} id="flex_check_default_${id_data}">
            <label class="form-check-label" for="flexCheckDefault">
                Готово
            </label>
        </div>
        <div class="col-3">
            <input id = "edit_date_must_done_${id_data}" class="form-control" type = "date" value="${time_done}" >
        </div>
        <div class="col-3">
            <button id="save_change_task_${id_data}" onClick="updateData(${id_data})" class="btn btn-primary btnSave"></button>
        </div>
        </div>`
}


async function renderTask() {
    let countries;
    try{
        // replace yours ip
        countries = await getData('http://localhost:8080/ListDo');
        lstTask.innerHTML = '';
        countries.forEach(element => {
            lstTask.innerHTML += generateElement(element);
        });
    } catch (err) {
        if (err instanceof CustomerError) {
            console.log(`loadCountries : ${err.message}`);
        } else {
            console.log(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
        }
    }
    const deleteTaskEl = document.getElementsByClassName("btnDel");
    for (let i = 0; i < deleteTaskEl.length; i++) {
        deleteTaskEl.item(i).addEventListener("click",deleteTask)
    }
    const editTaskEl = document.getElementsByClassName("btnEdit");
    for (let i = 0; i < editTaskEl.length; i++) {
        editTaskEl.item(i).addEventListener("click",editTask)
    }
}

async function postRequest(url,dt) {
    const response = await fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(dt)
    });
    if (!response.ok) {
        throw new CustomerError(`Server return bad response code (${response.status}) ${response.statusText} `);
    }
    return response.json();
}


( async ()=>{
    renderTask();
    dateMustDone.value = '2023-01-01';
    //add new Task
    addTask.addEventListener("click",async ()=>{
        if(nameTask.value.length === 0) {
            alert('Task name is not set');
            return;
        }
        try {
            const dt = {'task' : nameTask.value,'isDone':false,'mustDone': dateMustDone.value};
            const res = await postRequest('http://localhost:8080/ListDo/AddTask',dt);
            nameTask.value = '';
            dateMustDone.value = '2023-01-01';
        } catch(err) {
            if (err instanceof CustomerError) {
                console.log(`loadCountries : ${err.message}`);
            } else {
                console.log(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
            }
        }
        renderTask();
    })
})();