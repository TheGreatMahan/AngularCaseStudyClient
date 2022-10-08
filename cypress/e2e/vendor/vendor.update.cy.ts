describe('vendor update test', () => {
    it('visits the root', () => {
      cy.visit('/');
    });
    it('clicks the menu button vendors option', () => {
      cy.get('mat-icon').click();
      cy.contains('a', 'vendors').click();
    });
    it('selects Mahan Mehdipour', () => {
      cy.contains('Mahan Mehdipour').click();
    });
    it('updates Mahan Mehdipour email', () => {
      cy.get("[type='email']").clear();
      cy.get("[type='email']").type('mm@fanshawe.com');
    });
    it('submits the update', () => {
      cy.get('form').submit();
    });
    it('confirms update', () => {
      cy.contains('updated!');
    });
  });
  