describe('schedule board TimeZone', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', err => {
      console.log(`uncaught exeption${err.message}`);
      return false;
    });

    cy.fixture('user').then(user => {
      cy.login(user.user2.userName, user.user2.password);
    });

    cy.fixture('record.json').then(record => {
      cy.visit(`main.aspx?` +
        `appid=${record.appId}` +
        `&pagetype=entityrecord` +
        `&etn=${record.entityName}` +
        `&id=${record.recordId}`);
    });

    cy.switchToJulyMonth();
  });

  it('central america timezone tests', () => {

    cy.get('.booking-row').first().trigger('mouseover');
    cy.get('.react-tooltip-lite').should('exist');

    cy.fixture('data').then(data => {
      cy.get('.react-tooltip-lite').children().children().eq(0).invoke('text')
        .should('eq', data.booking2.name);
      cy.get('.react-tooltip-lite').children().children().eq(1).invoke('text')
        .should('eq', data.booking2.startDate);
      cy.get('.react-tooltip-lite').children().children().eq(2).invoke('text')
        .should('eq', data.booking2.endDate);
    });
  });
});
