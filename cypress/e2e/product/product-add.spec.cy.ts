describe('product add test', () => {
  it('visits the root', () => {
    cy.visit('/');
  });
  it('clicks the menu button products option', () => {
    cy.get('mat-icon').click();
    cy.contains('a', 'products').click();
  });
  it('clicks add icon', () => {
    cy.contains('control_point').click();
  });
  it('fills in fields', () => {
    cy.get('input[formcontrolname=id').type('TempId');

    cy.get('mat-select[formcontrolname="vendorid"]').click();
    cy.get('mat-option').contains('Mahan Mehdipour').click();


    cy.get('input[formcontrolname=name').type('Temp Product');
    cy.get('input[formcontrolname=msrp').type('99.99');
    cy.get('input[formcontrolname=costprice').type('89.99');

    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();

    cy.get('input[formcontrolname=rop').type('99');
    cy.get('input[formcontrolname=eoq').type('99');
    cy.get('input[formcontrolname=qoh').type('99');
    cy.get('input[formcontrolname=qoo').type('99');
  });
  it('clicks the save button', () => {
    cy.get('button').contains('Save').click();
    cy.wait(500);
  });
  it('confirms add', () => {
    cy.contains('updated!');
  });
});
