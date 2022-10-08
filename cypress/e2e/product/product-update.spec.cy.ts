describe('product update test', () => {
  it('visits the root', () => {
    cy.visit('/');
  });
  it('clicks the menu button products option', () => {
    cy.get('mat-icon').click();
    cy.contains('a', 'products').click();
  });
  it('selects Test, Product', () => {
    cy.contains('TempId').click();
  });
  it('updates name', () => {
    cy.get("input[formcontrolname=name").clear();
    cy.get("input[formcontrolname=name").type('Temp string 2');
  });
  it('clicks the save button', () => {
    cy.get('button').contains('Save').click();
  });
  it('confirms update', () => {
    cy.contains('updated!');
  });
});
