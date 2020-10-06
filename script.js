const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const ideasList = document.getElementById('ideas-list');
const workingList = document.getElementById('working-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let ideasListArray = [];
let workingListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('ideasItems')) {
    ideasListArray = JSON.parse(localStorage.ideasItems);
    workingListArray = JSON.parse(localStorage.workingItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    ideasListArray = ['Release the course', 'Sit back and relax'];
    workingListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [ideasListArray, workingListArray, completeListArray, onHoldListArray];
  const arrayNames = ['ideas', 'working', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// filter arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null )
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  // listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.addEventListener('dragstart', drag);
  // listEl.addEventListener('doubleclick', () => e.contentEditable = true);
  listEl.contentEditable = true;
   //change it to addEL double click

  listEl.id = index;
  // add class instead id!!!
  listEl.addEventListener('focusout', () => updateItem(index, column));
  columnEl.appendChild(listEl);
}

function editItem(e) {
  e.contentEditable = true;
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // ideas Column
  ideasList.textContent = '';
  ideasListArray.forEach((ideasItem, index) => {
    createItemEl(ideasList, 0, ideasItem, index);
  });
  ideasListArray = filterArray(ideasListArray);
  // working Column
  workingList.textContent = '';
  workingListArray.forEach((workingItem, index) => {
    createItemEl(workingList, 1, workingItem, index);
  });
  workingListArray = filterArray(workingListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update item or delete, update array
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
  
}

// add to column and reset input
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  updateDOM();
  addItems[column].textContent = '';
}

// show add item box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// hide add item box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  if (addItems[column].textContent) {
    addToColumn(column);
  }
}

// allow arrays reflect drag and drop
function rebuildArrays() {
  ideasListArray = Array.from(ideasList.children).map(item => item.textContent);
  workingListArray = Array.from(workingList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);
  updateDOM();
}

// when start dragging item
function drag(e) {
  draggedItem = e.target; 
  dragging = true;
}

//allow item to drop
function allowDrop(e) {
  e.preventDefault();
}
//dropping item 
function drop(e) {
  e.preventDefault();
  // remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

// when item enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

listColumns.forEach((item, index) => {
  item.addEventListener('dragover', allowDrop);
  item.addEventListener('drop', drop);
  item.addEventListener('dragenter', () => dragEnter(index));
});
addItems.forEach(item => item.contentEditable = true);
addBtns.forEach((item, index) => item.addEventListener('click', () => showInputBox(index)));
saveItemBtns.forEach((item, index) => item.addEventListener('click', () => hideInputBox(index)));

getSavedColumns();
updateSavedColumns();
updateDOM();