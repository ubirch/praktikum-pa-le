import VerificationConfig from '../../src/assets/Verification-comfig.json';

const { createYield } = require("typescript")

describe('app', () => {

    beforeEach(() => {
        cy.fixture('response-test-data.json').as('responseJSON');
        cy.server()
        cy.route('https://verify.prod.ubirch.com/api/upp/verify/anchor?blockchain_info=ext', '@responseJSON').as('goodRequest');
        cy.visit('/');
    })
   
    it('should display the Header and form on init', () => {
        cy.contains('Ubirch Verification');
        cy.get('#form');
    })

    it('should fill the testData correctly', () => {
        cy.get('button').should('have.length', 2)
        cy.get('#verifyButton');
        cy.get('#testButton')
        cy.get('#testButton').click();
        
        cy.get('input[id="fName"]')
         .invoke('val')
         .then(fName => expect(fName).to.equal('Mustermann'));

         cy.get('input[id="gName"]')
         .invoke('val')
         .then(gName => expect(gName).to.equal('Erika'));

         cy.get('input[id="date"]')
         .invoke('val')
         .then(birthDate => expect(birthDate).to.equal(''));

         cy.get('input[id="idNumber"]')
         .invoke('val')
         .then(idNumber => expect(idNumber).to.equal('T01000322'));

         cy.get('input[id="labId"]')
         .invoke('val')
         .then(labId => expect(labId).to.equal('3CF75K8D0L'));

         cy.get('input[id="dateTime"]')
         .invoke('val')
         .then(testDateTime => expect(testDateTime).to.equal(''));

         cy.get('input[id="testType"]')
         .invoke('val')
         .then(TestType => expect(TestType).to.equal('PCR'));
         
         cy.get('input[id="testResult"]')
         .invoke('val')
         .then(testResult => expect(testResult).to.equal('n'));
    })

    it('should should disable the verify Buttton if the form is empty', () => {
        cy.get('#verifyButton').should('be.disabled');
    });

    it('should properly load data from a query and fill the form', () => {
        cy.visit('/v?f=Mustermann&g=Erika&b=19640812&p=T01000322&i=3CF75K8D0L&d=202007011030&t=PCR&r=n&s=2fe00c151cb726bb9ed7')
        cy.get('input[id="fName"]')
         .invoke('val')
         .then(fName => expect(fName).to.equal('Mustermann'));

         cy.get('input[id="gName"]')
         .invoke('val')
         .then(gName => expect(gName).to.equal('Erika'));

         cy.get('input[id="date"]')
         .invoke('val')
         .then(birthDate => expect(birthDate).to.equal(''));

         cy.get('input[id="idNumber"]')
         .invoke('val')
         .then(idNumber => expect(idNumber).to.equal('T01000322'));

         cy.get('input[id="labId"]')
         .invoke('val')
         .then(labId => expect(labId).to.equal('3CF75K8D0L'));

         cy.get('input[id="dateTime"]')
         .invoke('val')
         .then(testDateTime => expect(testDateTime).to.equal(''));

         cy.get('input[id="testType"]')
         .invoke('val')
         .then(TestType => expect(TestType).to.equal('PCR'));
         
         cy.get('input[id="testResult"]')
         .invoke('val')
         .then(testResult => expect(testResult).to.equal('n'));
    })

    it('should display the proper results on a successfull verification', () => {
        cy.get('#testButton').click();
        cy.get('#verifyButton').click();
        cy.get('#UbirchSeal').invoke('attr', 'src').then(src => expect(src).to.equal(VerificationConfig.assets_url_prefix + VerificationConfig.seal_icon_url))
        cy.get('#SealA').invoke('attr', 'href').then(href => expect(href).to.equal(VerificationConfig.console_verify_url + encodeURIComponent('1ENYKuJyh2ab/a7ozIyEHLFdVX+ERFIKjU5GRjgTaI4=')))
        cy.get('.alert').contains('Verifikation erfolgreich');
    })

    it('should display the proper results on a failed verification', () => {
        cy.get('#testButton').click();
        cy.get('#gName').type('test');
        cy.get('#verifyButton').click();
        cy.get('#UbirchSeal').invoke('attr', 'src').then(src => expect(src).to.equal(VerificationConfig.assets_url_prefix + VerificationConfig.no_seal_icon_url))
        cy.get('#SealA').invoke('attr', 'href').then(href => expect(href).to.equal(''))
        cy.get('.alert').contains('Verifikation fehlgeschlagen');        
    })

});