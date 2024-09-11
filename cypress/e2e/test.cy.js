describe('Visit POS staging site', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('can visit reason page of pos staging site', () => {
    cy.log('--- successfully visited pos staging site ---');
  });

  it('can login', () => {
    cy.get('input[name="username"]').type(`${Cypress.env('username')}`);
    cy.get('input[name="password"]').type(`${Cypress.env('password')}`);
    cy.get('input[name="login"]').click();
  });

  it('can select a branch', () => {
    cy.get('input[name="username"]').type(`${Cypress.env('username')}`);
    cy.get('input[name="password"]').type(`${Cypress.env('password')}`);
    cy.get('input[name="login"]').click();

    cy.get('.modal-container').should('be.visible');
    cy.get('.modal-body').should('be.visible');
    cy.get('input[value="Login"]').should('be.visible');

    cy.get('[class="chosen phone-number-dropdown"]').click().then(() => {
      cy.get('[class="chosen phone-number-dropdown"]').within(() => {
        cy.get('input[type="text"]').click().type(`6 - testing{enter}`);
      });
    });
  });
});