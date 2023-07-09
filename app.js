//Storage Controller
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items = [];
      //Check if any items in LS
      if (localStorage.getItem("items") === null) {
        console.log("ABC");
        items = [];
        //Push new Iten
        items.push(item);
        //Set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        //Get what is already in LS
        items = JSON.parse(localStorage.getItem("items"));

        //Push new Item
        items.push(item);

        //Reset LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Strucutre / State
  const data = {
    // items: [
    //   // { id: 0, name: "Dinner", calories: 600 },
    //   // { id: 1, name: "Breakfast", calories: 250 },
    //   // { id: 2, name: "Lunch", calories: 400 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Calories to Number
      calories = parseInt(calories);

      //Create new Item
      newItem = new Item(ID, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      //Get Ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      //Get Index
      const index = ids.indexOf(id);

      //Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      //Loop through items and cals
      data.items.forEach(function (item) {
        total += item.calories;
      });

      //Set Total Cal in data structure
      data.totalCalories = total;

      //Return Total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

//UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  // Public Methods
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>`;
      });

      //Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      //Show the List
      document.querySelector(UISelectors.itemList).style.display = "block";
      //Create li element
      const li = document.createElement("li");
      //Add Class
      li.className = "collection-item";
      //Add ID
      li.id = `item-${item.id}`;
      //Inner HTML
      li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      //Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn Node List to Array
      listItems = Array.from(listItems);

      console.log(item.name, item.calories);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          console.log(item.name, item.calories);
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //Load Event Handlers
  const loadEventListeners = function () {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Disable Submit on Enter
    document.addEventListener("keypress", function (e) {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit Icon Click Event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //Update the Item Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    //Delete Item Event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    //Back Button Event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    //Clear Items Event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  //Add Item Submit
  const itemAddSubmit = function (e) {
    //Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // console.log(input);
    e.preventDefault();

    //Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      //Add Item
      // console.log(input.calories);
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI List
      UICtrl.addListItem(newItem);

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in LocalStorage
      StorageCtrl.storeItem(newItem);

      //Clear Fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };
  //Click Edit Item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //Get List Item id(item-0 ,item-1)
      const listID = e.target.parentNode.parentNode.id;

      //Break into an Array
      const listIdArr = listID.split("-");

      //Get the actual id
      const id = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add Item to Form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  //Update Item Submit
  const itemUpdateSubmit = function (e) {
    //Get Item Input
    const input = UICtrl.getItemInput();

    //Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  //Delete button event
  const itemDeleteSubmit = function (e) {
    //Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from Data Struture
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  //Clear Items Event
  const clearAllItemsClick = function () {
    //Delete all Items from data structure
    ItemCtrl.clearAllItems();

    //Clear from Local Storage
    StorageCtrl.clearItemsFromStorage();

    //Hide UL
    UICtrl.hideList();
  };
  // Public Methods
  return {
    init: function () {
      //Clear Edit State / Set Initial State
      UICtrl.clearEditState();

      //Fetch Items from Data Structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with Items
        UICtrl.populateItemList(items);
      }

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
