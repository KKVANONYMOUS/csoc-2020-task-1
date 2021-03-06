function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err) {
                displayErrorToast('An account using same email or username is already created');
            }
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
     const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    if (localStorage.getItem('token')){
        window.location.href='/';
        }
    if (username ==='' || password ==='')
    { displayErrorToast('Please fill the required fields');
      return ;
    }
    else {
        displayInfoToast("Please wait...");
    	const loginData={
     "username":username,
     "password":password
      }
      $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: loginData,
            success: function(data, status, xhr) {
                displaySuccessToast('Login successfull');
                localStorage.setItem('token', data.token);
                window.location.href = '/';
                
            },
            error: function(xhr, status, err) {
                displayErrorToast('Some error occured');
          }
          })
    
      }
    
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     var taskInput= document.getElementById('addTask').value.trim();
    
    if(taskInput === ''){
        displayErrorToast('Please add some task!');
        
    }
    else if(taskInput !=' '){
        const taskData = {
            "title":taskInput
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            data: taskData,
            success: function(data, status, xhr){
                displaySuccessToast('New task added!');
                getTasks();
            },
            error: function(xhr, status, err){
                displayErrorToast('Some error occured, please try again');
            }
        })
    }
    document.getElementById('addTask').value=' ';
}

function editTask(id) {
    var title=document.getElementById('task-'+id).innerText;
    document.getElementById('task-' + id).classList.toggle('hideme');
    document.getElementById('task-actions-' + id).classList.toggle('hideme');
    document.getElementById('input-button-' + id).classList.toggle('hideme');
    document.getElementById('input-button-'+id).setAttribute('placeholder',title);
    document.getElementById('done-button-' + id).classList.toggle('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
     $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE' ,
        success: function(data, status, xhr) {
            displaySuccessToast('Task deleted successfully');
            document.getElementById('li-'+id).remove();
            
            
        },
        error: function(xhr, status, err){
            displayErrorToast('Some error occured!')
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const updatedTask = document.getElementById('input-button-' + id ).value.trim();
    if(updatedTask === ''){
            displayErrorToast('Please give valid input!');
            return ;
    }
    else{
        updatedData = {
            "title": updatedTask
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'PUT',
            data:updatedData,
            success: function(data, status, xhr) {
                displaySuccessToast('Task updated successfully');
                document.getElementById('task-'+id).innerHTML=updatedTask;
                editTask(id);
                
                
            },
            error: function(xhr, status, err){
                displayErrorToast('Some error occured!')
                
            }
        })
    }
}
