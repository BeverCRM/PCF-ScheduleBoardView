describe('schedule board', () => {
  beforeEach(() => {
    cy.fixture('user').then(user => {
      cy.login(user.userName, user.password);
    });
    cy.fixture('record.json').then(record => {
      cy.visit(`main.aspx?` +
        `appid=${record.appId}` +
        `&pagetype=entityrecord` +
        `&etn=${record.entityName}` +
        `&id=${record.recordId}`);
    });
    cy.on('uncaught:exception', err => {
      if (err.message
        .includes('Cannot read properties of undefined (reading \'addOnFocusHandler\')')) {
        return false;
      }
    });
  });

  it('navigation buttons monthly view', () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const currentMonth = new Date().getMonth();
    const currentMonthName = monthNames[currentMonth];
    const previousMonthName = monthNames[currentMonth - 1];
    const nextMonthName = monthNames[currentMonth + 1];

    cy.get('.arrow').first().click({ force: true });
    cy.get('.period').invoke('text').should('not.contain', currentMonthName);
    cy.get('.period').invoke('text').should('contain', previousMonthName);

    cy.get('.today').click({ force: true });
    cy.get('.period').invoke('text').should('contain', currentMonthName);

    cy.get('.arrow').eq(1).click({ force: true });
    cy.get('.period').invoke('text').should('contain', nextMonthName);
  });

  it('monthy view board element hover/unhover', () => {
    /* const interval = setInterval(() => {
      console.log('In SetInterval1');
      cy.get('#DialogContainer__1_popupContainer').then(element => {
        console.log(element);
        if (element[0]) {
          console.log(element[0]);
          clearInterval(interval);
          element[0].style.display = 'none';
        }
      });
    }, 1000); */
    let elementColor;

    cy.get('.booking.booking4cd07841-32a1-ed11-aad1-000d3adf7442')
      .then($el => {
        elementColor = $el.css('background-color');
        cy.get('.booking-row').first().trigger('mouseover');
        cy.get('.react-tooltip-lite').should('exist');
        cy.get('.booking.booking4cd07841-32a1-ed11-aad1-000d3adf7442.bookingid')
          .first().should('have.css', 'background-color', 'rgb(56, 48, 80)');

        cy.get('.react-tooltip-lite').children().children().eq(0).invoke('text')
          .should('eq', 'B-116 Aidan Ewing');
        cy.get('.react-tooltip-lite').children().children().eq(1).invoke('text')
          .should('eq', '2/26/2023, 4:45:55 AM');
        cy.get('.react-tooltip-lite').children().children().eq(2).invoke('text')
          .should('eq', '12/31/2023, 9:26:42 PM');

        cy.get('.booking-row').first().trigger('mouseout');
        cy.get('.booking.booking4cd07841-32a1-ed11-aad1-000d3adf7442')
          .first().should('have.css', 'background-color', elementColor);
      });
  });

  it('record open', () => {
    cy.get('.booking-row').first().click();
    cy.url().should('include', 'id=4cd07841-32a1-ed11-aad1-000d3adf7442');
  });

  it('navigation buttons daily view', () => {
    const date = new Date();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

    cy.getDateStringRepresentation(date).then(date => {
      cy.get('.button').first().click();
      cy.get('.today').click({ force: true });
      cy.get('.period').invoke('text').should('contain', date);
    });

    cy.get('.bvrBoard_expander').should('not.exist');

    cy.getDateStringRepresentation(yesterday).then(date => {
      cy.get('.arrow').first().click({ force: true });
      cy.get('.period').invoke('text').should('contain', date);
    });

    cy.getDateStringRepresentation(tomorrow).then(date => {
      cy.get('.arrow').eq(1).click({ force: true });
      cy.get('.arrow').eq(1).click({ force: true });
      cy.get('.period').invoke('text').should('contain', date);
    });

    cy.get('.bvrBoard_viewChange').click({ force: true });
    cy.get('.bvrBoard_expander').should('exist');
  });

  it('navigation buttons daily view', () => {
    let elementColor;
    cy.get('.button').first().click();
    cy.get('.booking').then($el => {
      elementColor = $el.css('background-color');
      cy.get('.booking-row').first().trigger('mouseover');
      cy.get('.booking').first().should('have.css', 'background-color', 'rgb(56, 48, 80)');

      cy.get('.react-tooltip-lite').children().children().eq(0).invoke('text')
        .should('eq', 'B-116 Aidan Ewing');
      cy.get('.react-tooltip-lite').children().children().eq(1).invoke('text')
        .should('eq', '2/26/2023, 4:45:55 AM');
      cy.get('.react-tooltip-lite').children().children().eq(2).invoke('text')
        .should('eq', '12/31/2023, 9:26:42 PM');

      cy.get('.booking-row').first().trigger('mouseout');
      cy.get('.booking').first().should('have.css', 'background-color', elementColor);
    });
  });

  it('Expander button naming', () => {
    cy.get('.arrow').first().click({ force: true });
    cy.get('.cell-content').eq(1).children('.bvrBoard_bookings')
      .children().its('length').should('eq', 5);
    cy.get('.cell-content').eq(1).children('.bvrBoard_expander')
      .children().invoke('text').should('eq', 'Daily View');

    cy.get('.cell-content').eq(2).children('.bvrBoard_bookings')
      .children().its('length').should('eq', 6);
    cy.get('.cell-content').eq(2).children('.bvrBoard_bookings')
      .children().children().filter('.isUnreal').its('length').should('eq', 1);
    cy.get('.cell-content').eq(2).children('.bvrBoard_expander')
      .children().invoke('text').should('eq', 'Show More');
  });

  it('width check', () => {
    cy.get('.arrow').first().click({ force: true });
    cy.get('.button').eq(7).click({ force: true });
    // cy.get('.booking').eq(7).should('have.css', 'width', '85.30000305175781px');
    cy.get('.bvrBoard_bookings').then(board => {
      cy.log(`${board.width()}`);
      cy.get('.booking').eq(7).then(elem => {
        cy.log(`${elem.width()}`);
        const calc1 = Math.floor((elem.width()! * 100) / board.width()!);
        expect(calc1).to.eq(12);
      });
      cy.get('.booking').eq(5).then(elem => {
        cy.log(`${elem.width()}`);
        const calc2 = Math.floor((elem.width()! * 100) / board.width()!);
        expect(calc2).to.eq(53);
      });
      cy.get('.booking').eq(2).then(elem => {
        cy.log(`${elem.width()}`);
        const calc2 = Math.round((elem.width()! * 100) / board.width()!);
        expect(calc2).to.eq(100);
      });
    });
  });

  it.only('timezone tests', () => {
    // cy.get('#personalSettingsLauncher_buttoncrm_header_global').click({ force: true });
    // cy.get('#id-81-button').click({ force: true });
    // cy.wait(5000);
    cy.visit('https://bevertest.crm4.dynamics.com/tools/personalsettings/dialogs/personalsettings.aspx?dType=1&appid=4d1a5ae4-2516-44b4-b71d-ad82c9b55301');
    cy.get('#timezone').select('(GMT+01:00) Brussels, Copenhagen, Madrid, Paris');
    cy.get('#butBegin').click();
  });
});
