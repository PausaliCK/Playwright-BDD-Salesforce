Feature: Salesforce lead conversion flow

  @salesforceLeadConversion
  Scenario: Create a lead, update its status, and convert it
    Given I login to Salesforce using the provided credentials
    And I open the App Launcher and select Sales
    And I open the Leads tab
    And I create a new lead with faker-generated required data
    Then I validate the lead status is "Open - Not Contacted"
    And I click Mark Status as Complete
    And I validate the lead status is "Working - Contacted"
    And I click Mark Status as Complete
    And I validate the lead status is "Closed - Not Converted"
    And I click Mark Status as Complete
    And I expand the account section and validate the account name
    And I expand the contact and opportunity sections and validate the names
    And I convert the lead
    Then I validate the "Lead has been converted" confirmation
    And I validate the account, contact, and opportunity names in the conversion summary
    And I click Go to Leads

  @salesforceAccountCreation
  Scenario: Create an account with faker data and validate the saved details
    Given I login to Salesforce using the provided credentials
    And I open the App Launcher and select Sales
    And I open the Accounts tab
    And I create a new account with faker-generated details
    Then I click the Details tab
    And I validate the account details are saved correctly
    And I scroll down and validate the account description
    And I click the Accounts tab again


