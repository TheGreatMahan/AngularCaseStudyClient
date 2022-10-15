describe('product generator test', () => {
  it('visits the root', () => {
    cy.visit('/');
  });
  it('clicks the menu button products option', () => {
    cy.get('mat-icon').click();
    cy.contains('a', 'generator').click();
  });
  it('selects an vendor', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="vendorid"]').click();
    cy.contains('ABC Supply Co.').click();
  });
  it('selects an product', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="productid"]').click();
    cy.contains('iPhone 11').click();
  });
  it('selects a Qty of EOQ', () => {
    cy.wait(500);
    cy.get('mat-select[formcontrolname="qtyVal"]').click();
    cy.contains('3').click();
  });
  it('clicks the save button', () => {
    cy.get('button').contains('Add PO').click();
  });
  it('confirms report added', () => {
    cy.contains('added!');
  });
});
