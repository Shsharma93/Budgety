

var budgetController = (function () {
  var Expenses = function (id, desc, value) {
    this.id = id,
      this.desc = desc,
      this.value = value
  };

  var Incomes = function (id, desc, value) {
    this.id = id,
      this.desc = desc,
      this.value = value
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }


  Expenses.prototype.calculateExpense = function () {
    console.log(this.desc);
    data.allItems.exp.push(this.value);
    console.log(data.allItems.exp);
  }



  return {
    expenseFn: function (x) {
      let expense = new Expenses(x.type, x.description, x.value);
      expense.calculateExpense();
    }
  }

})();


var UIController = (function () {

  let DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },
    getDOMStrings: function () {
      return DOMStrings;
    }
  }

})();


var controller = (function (budgetCtrl, UICtrl) {

  let ctrlAddItem = function () {
    //console.log(UICtrl.getInput().type);
    let inp = UICtrl.getInput();
    //1. take the input from UI
    if (inp.type == 'exp') {
      budgetCtrl.expenseFn(inp);
    }

    //2. add item to budget controller
    //3. update UI with income or expense item
    //4. calculate the budget
    //5. update the UI
  }

  let setUPEventListener = function () {
    let DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode == 13) {
        ctrlAddItem();
      }
    });
  }

  return {
    init: function () {
      console.log('Application has started.');
      setUPEventListener();
    }
  }

})(budgetController, UIController);

controller.init();