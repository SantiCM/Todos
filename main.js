// == Get DOM elements ============================================================
const taskDescInput = document.querySelector('#todo-input')
const addTaskButton = document.querySelector('#add-todo')
const tasksContainer = document.querySelector('#list-todo')
const completeAllTasksButton = document.querySelector('#complete-all-tasks')
const deleteAllTasksButton = document.querySelector('#clear-tasks')
const listContainer = document.querySelector(".list-container")
const listActionContainer = document.querySelector(".list-container__actions") 

// == Global variable =============================================================
let tasksList = []

// == Functions ===================================================================
// -- Event Listener Handlers -----------------------------------------------------
const handleAddTask = () => {
  const taskValue = getInputValue(taskDescInput)
  addTask(taskValue)
  renderTasks()
  resetInputValue(taskDescInput)
}

// -- Utils -----------------------------------------------------------------------
const clearNodeChilds = (node) => {
  node.innerHTML = ''
}

const resetInputValue = (inputNode) => {
  inputNode.value = ''
}

const getInputValue = (inputNode) => inputNode.value

const generateRandomId = () => String(Math.random() * 1000000)

// -- Task - based ----------------------------------------------------------------
const addTask = (description, isCompleted = false) => {
  tasksList.push({ id: generateRandomId(), description, isCompleted })
  saveTasksIntoStorage(tasksList)
}

const toggleCompleteTask = (taskId) => {
  const task = tasksList.find((taskList) => taskList.id === taskId)
  task.isCompleted = !task.isCompleted
  saveTasksIntoStorage(tasksList)
}

const completeAllTasks = () => {
    tasksList.forEach(task => {
      task.isCompleted = true
    })
    saveTasksIntoStorage(tasksList)
}

const deleteTask = (taskId) => {
  const taskIndex = tasksList.findIndex((taskList) => taskList.id === taskId)
  tasksList.splice(taskIndex, 1)
  saveTasksIntoStorage(tasksList)
}

const clearTasks = () => {
    tasksList = []
    saveTasksIntoStorage(tasksList)
}

const isTaskCompleted = (task) => task.isCompleted

// -- DOM manipulation ------------------------------------------------------------
const renderTasks = () => {
  clearNodeChilds(tasksContainer)
  tasksList.forEach(generateTaskElements)

  if(tasksList.length === 0) {
    listContainer.setAttribute("style", "display: none");
  } else {
    listContainer.setAttribute("style", "display: flex")
  }
}

const generateTaskElements = (task) => {
  const listItemElement = generateListItemElement()
  const spanElement = generateSpanElement(task)
  const completeTaskButtonElement = generateCompleteTaskButtonElement(task)
  const deleteTaskButtonElement = generateDeleteTaskButtonElement(task)
  listItemElement.append(completeTaskButtonElement, spanElement, deleteTaskButtonElement)
  tasksContainer.appendChild(listItemElement)
}

const generateListItemElement = () => {
  const listItemElement = document.createElement('li')
  return listItemElement
}

const generateSpanElement = (task) => {
  const spanElement = document.createElement('span')
  spanElement.textContent = task.description
  spanElement.style = `text-decoration:${isTaskCompleted(task) ? 'line-through' : 'none'};`
  return spanElement
}

const generateCompleteTaskButtonElement = (task) => {
  const completeTaskButtonElement = document.createElement('button')
  completeTaskButtonElement.setAttribute('data-index', task.id)
  completeTaskButtonElement.setAttribute('class', `button btn${isTaskCompleted(task) ? '' : '-outline'}-primary`)
 // completeTaskButtonElement.textContent = isTaskCompleted(task) ? '🔴' : '⚪️'
 completeTaskButtonElement.innerHTML = isTaskCompleted(task) ? "&#x2713" : ""
  addEventListenerToButton(completeTaskButtonElement, 'complete')
  return completeTaskButtonElement
}

const generateDeleteTaskButtonElement = (task) => {
  const deleteTaskButtonElement = document.createElement('button')
  // deleteTaskButtonElement.textContent = '🗑'
  deleteTaskButtonElement.innerHTML = "&#x2715;"
  deleteTaskButtonElement.setAttribute('data-index', task.id)
  deleteTaskButtonElement.setAttribute("class", "button btn-danger")
  addEventListenerToButton(deleteTaskButtonElement, 'delete')
  return deleteTaskButtonElement
}

// -- Event Listeners -------------------------------------------------------------

// Event Listener to get the tasks from local storage
// when the DOM content is loaded (i.e. page is ready)
document.addEventListener('DOMContentLoaded', () => {
  const tasks = getTasksFromStorage()
  if (/*tasks === null*/ !tasks) {
    saveTasksIntoStorage(tasksList/*default: []*/)
  } else {
    tasksList = tasks
    renderTasks()
  }
})

// event listener to add task when button is clicked
addTaskButton.addEventListener('click', () => {
  handleAddTask()
})

// event listener to add task when Enter key is press
taskDescInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleAddTask()
})

// event listener to complete all tasks when button is clicked
completeAllTasksButton.addEventListener('click', () => {
    completeAllTasks()
    renderTasks()
})
  
deleteAllTasksButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de eliminar TODAS las tareas?')) {
      clearTasks()
      renderTasks()
    }
})
  
const addEventListenerToButton = (button, action) => {
  button.addEventListener('click', (event) => {
    const taskId = event.target.getAttribute('data-index')
    if (action === 'complete') toggleCompleteTask(taskId)
      if (action === 'delete')
        if (confirm('¿Estás seguro de eliminar esta tarea?')) deleteTask(taskId)
    renderTasks()
  })
}

// -- Local Storage ---------------------------------------------------------------
const tasksStorageKey = 'tasks'

const getTasksFromStorage = () => JSON.parse(localStorage.getItem(tasksStorageKey))

const saveTasksIntoStorage = (tasks/*array*/) => {
  localStorage.setItem(tasksStorageKey, JSON.stringify(tasks))
}