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
});