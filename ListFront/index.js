
const lstTask = document.getElementById("list_task")
const addTask = document.getElementById("add_task");
const nameTask = document.getElementById("name_task");
const dateMustDone = document.getElementById("date_must_done");
const URL_ADDRESS = "http://localhost:8080"

async function makeRequest(url,method,dt = null) {
    const obj = {
        method: method,
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (dt!==null) {
        obj['body'] = JSON.stringify(dt);
    }
    let response;
    try {
        response = await fetch(url,obj);
    } catch(err) {
        console.log(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
        return null;
    }
    if (!response.ok) {
        console.log(`Server return bad response code (${response.status}) ${response.statusText} `);
        return null;
    }
    return response.json();
}

async function deleteTask (e) {
    console.log('deleteTask');
    await makeRequest(`${URL_ADDRESS}/ListDo/DelTask`,'DELETE',e.target.getAttribute('del-button'));
    renderTask();
}

const generateElement = (element) => {
    const flagStatus = element['isDone'] ? 'Готово' : 'В процессе))';
    return `<div row-element="${element['id']}" class="row mt-4 d-flex justify-content-start">
    <div task-name="${element['id']}" class="col-3">
      ${element['task']}
    </div>
    <div flag-status="${element['id']}" class="col-3">
        ${flagStatus}
    </div>
    <div must-done="${element['id']}" class="col-3">
        ${element['mustDone']}
    </div>
    <div class="col-3">
        <div class="row">
            <div class="col">
                <button edit-button = "${element['id']}" class="btn btn-primary btnEdit"></button>
            </div>
            <div class="col">
                <button del-button = "${element['id']}" class="btn btn-primary btnDel"></button>
            </div>
        </div>
    </div>
  </div>
  <div flag-status-bool = "${element['id']}" style="display:none"> ${element['isDone']} </div>`
}


async function updateData(id) {
    const task_name = document.querySelector(`[edit-name-task = "${id}"]`).value;
    const is_check = document.querySelector(`[edit-check-value = "${id}"]`).checked;
    const time_done = document.querySelector(`[edit-date-must-done = "${id}"]`).value;
    const dt = {'id' : id,'task' : task_name,'isDone' : is_check,'mustDone' : time_done};
    const res = await makeRequest(`${URL_ADDRESS}/ListDo/EditTask`,'PUT',dt);

    if (res!==null) {
        const element = document.querySelector(`[edit-data-row = "${id}"]`);
        element.outerHTML = generateElement(res);

        document.querySelector(`[del-button = "${id}"]`).addEventListener("click",deleteTask);
        document.querySelector(`[edit-button = "${id}"]`).addEventListener("click",editTask)
    }
}
const createEditForm = (id_record,task_name,flag_bool,time_done) =>{
    const element = document.querySelector(`[row-element = "${id_record}"]`);
    console.log(element);
    element.outerHTML = `<div edit-data-row="${id_record}" class="row mt-4 d-flex justify-content-start">
        <div class="col-3">
            <input edit-name-task="${id_record}" class = "form-control" placeholder = "Enter task" type = "text" value="${task_name}" >
        </div>
        <div class="col-3">
            <input class="form-check-input" type="checkbox" ${flag_bool === true ?'checked':''} edit-check-value = "${id_record}">
            <label class="form-check-label" for="flexCheckDefault">
                Готово
            </label>
        </div>
        <div class="col-3">
            <input edit-date-must-done = "${id_record}" class="form-control" type = "date" value="${time_done}" >
        </div>
        <div class="col-3">
            <button onClick="updateData(${id_record})" class="btn btn-primary btnSave"></button>
        </div>
    </div>`    
}

function editTask(e) {
    const id_data = e.target.getAttribute('edit-button'); 
    const task_name = document.querySelector(`[task-name = "${id_data}"]`).innerText;
    const time_done = document.querySelector(`[must-done = "${id_data}"]`).innerText;
    const flag_text = document.querySelector(`[flag-status-bool = "${id_data}"]`).innerText;
    const flag_bool = (flag_text.trim() === 'true');
    createEditForm(id_data,task_name,flag_bool,time_done);
}

async function renderTask() {

    const task = await makeRequest(`${URL_ADDRESS}/ListDo`,'GET');
    if(task===null){
        return ;
    }
    lstTask.innerHTML = '';
    task.forEach(element => {
        lstTask.innerHTML += generateElement(element);
    });

    const deleteTaskEl = document.getElementsByClassName("btnDel");
    for (let i = 0; i < deleteTaskEl.length; i++) {
        deleteTaskEl.item(i).addEventListener("click",deleteTask)
    }
    const editTaskEl = document.getElementsByClassName("btnEdit");
    for (let i = 0; i < editTaskEl.length; i++) {
        editTaskEl.item(i).addEventListener("click",editTask)
    }
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
        const dt = {'task' : nameTask.value,'isDone':false,'mustDone': dateMustDone.value};
        const res = await makeRequest(`${URL_ADDRESS}/ListDo/AddTask`,'POST',dt);
        console.log(res);
        if(res!==null) {
            lstTask.innerHTML += generateElement(res);
            document.querySelector(`[del-button = "${res['id']}"]`).addEventListener("click",deleteTask);
            document.querySelector(`[edit-button = "${res['id']}"]`).addEventListener("click",editTask)
    
        }
        nameTask.value = '';
        dateMustDone.value = '2023-01-01';
    })
})();