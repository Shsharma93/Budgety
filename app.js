
var budgetController = (function () {
  var Expenses = function (id, description, value) {
    this.id = id,
      this.description = description,
      this.value = value,
      this.percent = -1
  };

  Expenses.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percent = Math.round((this.value / totalIncome) * 100);
    }

  };

  Expenses.prototype.getPercentage = function () {
    return this.percent;
  }

  var Incomes = function (id, description, value) {
    this.id = id,
      this.description = description,
      this.value = value
  };


  let calculateTotal = function (type) {
    sum = 0;
    if (data.allItems[type].length != 0) {
      data.allItems[type].forEach(function (cur) {
        sum += cur.value;
        data.totals[type] = sum;
      });
    } else {
      data.totals[type] = sum;
    }

  }

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percent: -1
  }


  return {
    addItem: function (type, description, value) {
      let newItem, ID;
      if (data.allItems[type].length <= 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }


      if (type === 'exp') {
        newItem = new Expenses(ID, description, value);
      } else if (type === 'inc') {
        newItem = new Incomes(ID, description, value);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },

    calculateBudget: function () {
      calculateTotal('exp');
      calculateTotal('inc');
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percent = Math.round((data.totals.exp * 100) / data.totals.inc);
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        percent: data.percent,
        totalExp: data.totals.exp,
        totalInc: data.totals.inc
      }
    },

    DeleteItem: function (type, id) {
      let index, ids;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculatePercentage: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      var perc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return perc;
    },

    testing: function () {
      console.log(data.totals);
    }

  }

})();


var UIController = (function () {

  let DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeValue: '.budget__income--value',
    expensesValue: '.budget__expenses--value',
    expensesPercentage: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

  var formatNumber = function (number, type) {
    var numSplit, int, dec, sign;
    number = Math.abs(number);
    number = number.toFixed(2);
    numSplit = number.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];

    type === 'exp' ? sign = '-' : sign = '+';

    return sign + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },
    getDOMStrings: function () {
      return DOMStrings;
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;

      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function () {
      document.querySelector(DOMStrings.inputValue).value = '';
      document.querySelector(DOMStrings.inputDesc).value = '';
      document.querySelector(DOMStrings.inputDesc).focus();
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputValue + ',' +
        DOMStrings.inputDesc);

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      })

      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },

    displayBudget: function (obj) {

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeValue).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesValue).textContent = formatNumber(obj.totalExp, 'exp');
      document.querySelector(DOMStrings.expensesPercentage).textContent = obj.percent + '%';
    },

    displayMonth: function () {
      let now, month, months, year;
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
      //console.log(now.getFullYear());
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    displayPercentage: function (percent) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercentLabel);

      nodeListForEach(fields, function (current, index) {
        current.textContent = percent[index] + '%';
      })

    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    }

  }

})();


var controller = (function (budgetCtrl, UICtrl) {

  let updateBudget = function () {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    let budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  }

  let updatePercent = function () {
    budgetCtrl.calculatePercentage();
    var percentages = budgetCtrl.getPercentage();
    UICtrl.displayPercentage(percentages);
    console.log(percentages);
  }

  let ctrlDeleteItem = function (event) {
    let itemID, type, ID, splitID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      budgetCtrl.DeleteItem(type, ID);
      UICtrl.deleteListItem(itemID);
      updateBudget();
    }
  }

  let ctrlAddItem = function () {

    //1. take the input from UI
    let inp = UICtrl.getInput();

    if (inp.description !== '' && !isNaN(inp.value) && inp.value > 0) {

      //2. add item to budget controller
      let newItem = budgetCtrl.addItem(inp.type, inp.description, inp.value);

      //3. update UI with income or expense item
      UICtrl.addListItem(newItem, inp.type);

      //4. Clear fields after input
      UICtrl.clearFields();

      //5. Update budget
      updateBudget();

      //6. Update Percentage
      updatePercent();

    }
  }

  let setUPEventListener = function () {
    UICtrl.displayMonth();
    let DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
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