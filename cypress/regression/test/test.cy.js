const { Before, Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let filter_category;
let new_code, new_name, new_remarks;
let num_pages, num_rows;
const table = ['id', 'code', 'name', 'remarks', 'update', 'delete'];

Given('user is in login page', () => {
  cy.visit(`/`);
  cy.log('user is in login page');
});

When('inputs username and password', () => {
  cy.get('input[name="username"]').type(`${Cypress.env('username')}`);
  cy.get('input[name="password"]').type(`${Cypress.env('password')}`);
});

When('clicks the login button', () => {
  cy.get('input[name="login"]').click();
});

When('sees the Select Branch modal', () => {
  cy.get('.modal-container').should('be.visible');
  cy.get('.modal-body').should('be.visible');
  cy.get('input[value="Login"]').should('be.visible');
});

When('selects {string} branch', (branch) => {
  cy.get('[class="chosen phone-number-dropdown"]').click().then(() => {
    cy.get('[class="chosen phone-number-dropdown"]').within(() => {
      cy.get('input[type="text"]').click().type(`${branch}{enter}`);
    });
  });
});

When('clicks the Login button', () => {
  cy.get('input.c-btn.c-dk-green[name="auth"]').click();
});

Then('user should see the dashboard', () => {
  cy.url().should('include', '/dashboard');
});

When('user is in the dashboard', () => {
  cy.url().should('include', '/dashboard');
});

When('visits the Reason page', () => {
  cy.visit('/reason');
});

Then('user should be in the Reason page', () => {
  cy.url().should('include', '/reason');
  cy.get('.c-sub-header').should('exist').and('include.text', 'Reason');
  addFilter('Name');
});

When('clicks the Edit Express Filter icon button', () => {
  cy.get('button.control-button').eq(0).click();
});

When('sees Edit Express Filter modal', () => {
  // cy.get('h4.modal-title').should('have.text', "Edit Express Filter");
  cy.contains("Edit Express Filter");
});

When('selects {string} for filter', (category) => {
  filter_category = category;
  
  cy.get('div.clearfix.selected.multiple').find('span')
    .each(($span) => {
      cy.wrap($span).find('i.fa-close').click();
    });

  cy.get('#settings-express-filters').click().then(() => {
    cy.get('#settings-express-filters').within(() => {
      cy.get('input[type="text"]').click().type(`${category}{enter}`);
    });
  });
});

When('clicks the Save button', () => {
  cy.get('button.c-btn.c-dk-blue').eq(1).click();
});

Then('user should see filter label and textfield', () => {
  cy.get('.filter-label').should('be.visible').and('contain', filter_category);
  cy.get('.filter-type').should('be.visible');
});

When('inputs {string} in filter textfield', (value) => {
  cy.get('.filter-type').within(() => {
    cy.get('input[type="text"]').click().type(`${value}`);
  });
});

When('clicks the Search button', () => {
  cy.get('.button-container').within(() => {
    cy.get('button.c-btn.c-dk-green').click();
  });
});

Then('user should see list of {string} containing {string}', (category, value) => {
  cy.request(`/reason?page=1&per_page=10&filters%5B0%5D%5Bvalue%5D=${value}&filters%5B0%5D%5Boperator%5D=contains&filters%5B0%5D%5Bjoin%5D=and&filters%5B0%5D%5Bcolumn%5D=${category.toLowerCase()}&filters%5B0%5D%5Btype%5D=string`)
    .then(() => {
      cy.get('#table-list tbody tr.v-dataTable__tableRow')
        .not(':last-child')
        .each(($row) => {
          if (category.toLowerCase() === 'remarks') {
            cy.wrap($row).find('td.v-dataTable__tableCell--desc input').invoke('val').then((val) => {
              expect(val.toLowerCase()).to.contain(value.toLowerCase());
            });
          } else {
            cy.wrap($row).find(`td.v-dataTable__tableCell--${category.toLowerCase()} input`).invoke('val').then((val) => {
              expect(val.toLowerCase()).to.contain(value.toLowerCase());
            });
          }
      });
    });
});

When('clears existing filter', () => {
  clearFilter();
  cy.wait(300);
});

When('selects {string} for sorting option', (category) => {
  cy.get('td[width="150px"]').click().then(() => {
    cy.get('td[width="150px"]')
      .find('select')
      .select(category);
  });
});

When('selects {string} for sorting order', (order) => {
  cy.get('td[width="120px"]').click().then(() => {
    cy.get('td[width="120px"]')
      .find('select')
      .select(order);
  });
  cy.wait(1000);
});

Then('user should see result sorted by {string} in {string}', (category, order) => {
  let column = category.toLowerCase();
  column = (category === 'Remarks') ? 'desc' : category.toLowerCase();
  cy.log('column = ' + column);
  
  sortResult(column, order);

  cy.wait(250);
  if (category === 'Remarks' && order === 'Descending') {
    cy.log('do nothing, no need to clear filter');
  } else {
    addFilter(category);
  }
  cy.wait(1000);
});

When('adds {string}, {string}, {string} as new inputs', (code, name, remarks) => {
  new_code = code;
  new_name = name;
  new_remarks = remarks;
  cy.get('#table-list tbody tr').last().within(() => {
    cy.get('.v-dataTable__tableCell--code input').type('100');
    cy.get('.v-dataTable__tableCell--name input').type('New Name');
    cy.get('.v-dataTable__tableCell--desc input').type('New Remarks');
  });
});

When('clicks the update icon button', () => {
  cy.get('#table-list tbody tr').last().within(() => {
    cy.get('.v-dataTable__tableCell--action img').eq(0).click();
  });
  cy.wait(1000);
});

Then('user should see the item has been added', () => {
  verifyUpdate(true);
});

When('user clicks the delete icon button of the newly added values', () => {
  let codes, names, remarks;
  // save current list before deletion
  cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--code input`).then($inputs => {
      codes = [...$inputs].map(input => input.value);
      new_code = codes[codes.length-1]
    });

  cy.get('#table-list tbody tr.v-dataTable__tableRow')
  .not(':last-child')
  .find(`td.v-dataTable__tableCell--name input`).then($inputs => {
    names = [...$inputs].map(input => input.value);
    new_name = names[names.length-1]
  });

  cy.get('#table-list tbody tr.v-dataTable__tableRow')
  .not(':last-child')
  .find(`td.v-dataTable__tableCell--desc input`).then($inputs => {
    remarks = [...$inputs].map(input => input.value);
    new_remarks = remarks[remarks.length-1]
  });

  // delete the last row
  cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
      .find('td.v-dataTable__tableCell--action')
      .last()
      .find('button.control-button')
      .click();
  cy.wait(1000);
});

When('user sees the Delete Data modal', () => {
  cy.contains('Delete Data');
  cy.contains('Do you want to delete this data?');
});

When('clicks the OK button', () => {
  cy.get('.modal-container')
    .find('.modal-footer')
    .find('input[name="ok"]')
    .eq(0)
    .click();
});

Then('user should see the item has been deleted', () => {
  cy.wait(1500);
  verifyUpdate(false);
});

When('edits pagination limit to {string}', (limit) => {
  cy.get('div.pull-left')
    .find('table.c-tbl-layout tr td')
    .find('input.v-dataTable__rowPerPage')
    .eq(0)
    .type(`{selectall}${limit}{enter}`);
  
  cy.wait(1000);

  cy.get('div.pull-left')
    .find('table.c-tbl-layout tr td')
    .eq(2).invoke('text').then((text) => {
      num_rows = Number(text);
      cy.log('num_rows === ' + num_rows);
    })
});

Then('user should see a maximum {string} values in the current page', (limit) => {
  cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--name input`).then($inputs => {
      names = [...$inputs].map(input => input.value);
      expect(names.length).to.eq(Number(limit));
    });
  
  num_pages = Math.ceil(num_rows /  limit);
  cy.log('num_pages === ' + num_pages)

  cy.get('div.pull-right')
    .find('table.c-tbl-layout tr td')
    .eq(3).invoke('text').then((text) => {
      expect(Number(text)).to.eq(num_pages);
    })
})

function clearFilter() {
  cy.get('button.control-button').eq(0).click();
  cy.get('div.clearfix.selected.multiple').find('span')
    .each(($span) => {
      cy.wrap($span).find('i.fa-close').click();
    });
  cy.get('button.c-btn.c-dk-blue').eq(1).click();
}

function addFilter(category) {
  cy.get('button.control-button').eq(0).click();
  cy.get('#settings-express-filters').click().then(() => {
    cy.get('#settings-express-filters').within(() => {
      cy.get('input[type="text"]').click().type(`${category}{enter}`);
    });
  });
  cy.get('button.c-btn.c-dk-blue').eq(1).click();
  cy.wait(1000);
}

function sortResult(column, order) {  
  cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--${column} input`).then($inputs => {
      let items, sorted_items;
      
      if (order === 'Ascending') {
        if (column === 'code') {
          items = [...$inputs].map(input => Number(input.value));
          sorted_items = [...items].sort((a, b) => a - b);
        } else {
          items = [...$inputs].map(input => input.value);
          sorted_items = [...items].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        }
      }
      
      if (order === 'Descending') {
        if (column === 'code') {
          items = [...$inputs].map(input => Number(input.value));
          sorted_items = [...items].sort((a, b) => b - a);
        } else {
          items = [...$inputs].map(input => input.value);
          sorted_items = [...items].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
        }
      }
      
      expect(items).to.deep.equal(sorted_items);

      for(let i = 0; i < sorted_items.length; i++){
        cy.log(sorted_items[i]);
      }
    });
}

function verifyUpdate(hasAdded) {
  let codes, names, remarks;

  cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--code input`).then($inputs => {
      codes = [...$inputs].map(input => input.value);
      hasAdded ? expect(codes).to.include(new_code) : expect(codes).to.not.include(new_code); 
    });

    cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--name input`).then($inputs => {
      names = [...$inputs].map(input => input.value);
      hasAdded ? expect(names).to.include(new_name) : expect(names).to.not.include(new_name);
    });

    cy.get('#table-list tbody tr.v-dataTable__tableRow')
    .not(':last-child')
    .find(`td.v-dataTable__tableCell--desc input`).then($inputs => {
      remarks = [...$inputs].map(input => input.value);
      hasAdded ? expect(remarks).to.include(new_remarks) : expect(remarks).to.not.include(new_remarks);
    });
}