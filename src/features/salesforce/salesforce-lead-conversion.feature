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
