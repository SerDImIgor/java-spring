
const lstTask = document.getElementById("listTask")
const addTask = document.getElementById("addTask");
const nameTask = document.getElementById("nameTask");
const dateMustDone = document.getElementById("dateMustDone");
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
    await makeRequest(`${URL_ADDRESS}/ListDo/DelTask`,'DELETE',e.target.getAttribute('data-del-button'));
    renderTask();
}

const generateElement = (element) => {
    const flagStatus = element['isDone'] ? 'Готово' : 'В процессе))';
    return `<div data-row-element="${element['id']}" class="row mt-4 d-flex justify-content-start">
    <div data-task-name="${element['id']}" class="col-3">
      ${element['task']}
    </div>
    <div data-flag-status="${element['id']}" class="col-3">
        ${flagStatus}
    </div>
    <div data-must-done="${element['id']}" class="col-3">
        ${element['mustDone']}
    </div>
    <div class="col-3">
        <div class="row">
            <div class="col">
                <button data-edit-button = "${element['id']}" class="btn btn-primary btnEdit"></button>
            </div>
            <div class="col">
                <button data-del-button = "${element['id']}" class="btn btn-primary btnDel"></button>
            </div>
        </div>
    </div>
  </div>
  <div data-flag-status-bool = "${element['id']}" style="display:none"> ${element['isDone']} </div>`
}


async function updateData(id) {
    const taskName = document.querySelector(`[data-edit-name-task = "${id}"]`).value;
    const isCheck = document.querySelector(`[data-edit-check-value = "${id}"]`).checked;
    const timeDone = document.querySelector(`[data-edit-date-must-done = "${id}"]`).value;
    const dt = {'id' : id,'task' : taskName,'isDone' : isCheck,'mustDone' : timeDone};
    const res = await makeRequest(`${URL_ADDRESS}/ListDo/EditTask`,'PUT',dt);

    if (res!==null) {
        const element = document.querySelector(`[data-edit-data-row = "${id}"]`);
        element.outerHTML = generateElement(res);

        document.querySelector(`[data-del-button = "${id}"]`).addEventListener("click",deleteTask);
        document.querySelector(`[data-edit-button = "${id}"]`).addEventListener("click",editTask)
    }
}
const createEditForm = (idRecord,taskName,flagBool,timeDone) =>{
    const element = document.querySelector(`[data-row-element = "${idRecord}"]`);
    console.log(element);
    element.outerHTML = `<div data-edit-data-row="${idRecord}" class="row mt-4 d-flex justify-content-start">
        <div class="col-3">
            <input data-edit-name-task="${idRecord}" class = "form-control" placeholder = "Enter task" type = "text" value="${taskName}" >
        </div>
        <div class="col-3">
            <input data-edit-check-value = "${idRecord}" class="form-check-input" type="checkbox" ${flagBool === true ?'checked':''}>
            <label class="form-check-label" for="flexCheckDefault">
                Готово
            </label>
        </div>
        <div class="col-3">
            <input data-edit-date-must-done = "${idRecord}" class="form-control" type = "date" value="${timeDone}" >
        </div>
        <div class="col-3">
            <button onClick="updateData(${idRecord})" class="btn btn-primary btnSave"></button>
        </div>
    </div>`    
}

function editTask(e) {
    const idData = e.target.getAttribute('data-edit-button'); 
    const taskName = document.querySelector(`[data-task-name = "${idData}"]`).innerText;
    const timeDone = document.querySelector(`[data-must-done = "${idData}"]`).innerText;
    const flagText = document.querySelector(`[data-flag-status-bool = "${idData}"]`).innerText;
    const flagBool = (flagText.trim() === 'true');
    createEditForm(idData,taskName,flagBool,timeDone);
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
            document.querySelector(`[data-del-button = "${res['id']}"]`).addEventListener("click",deleteTask);
            document.querySelector(`[data-edit-button = "${res['id']}"]`).addEventListener("click",editTask)
    
        }
        nameTask.value = '';
        dateMustDone.value = '2023-01-01';
    })
})();