Feature: Sample Automated test for https://staging.cirms.ph

  Background: 
      Given user is in login page
      When inputs username and password
      And clicks the login button
      And sees the Select Branch modal
      And selects "6 - testing" branch
      And clicks the Login button

  Scenario: User can login
    # When inputs username and password
    # And clicks the login button
    # And sees the Select Branch modal
    # And selects "6 - testing" branch
    # And clicks the Login button
    Then user should see the dashboard

  Scenario: User can visit the Reason page -- pass
    And user is in the dashboard
    And visits the Reason page
    Then user should be in the Reason page

  Scenario: User can choose '<category>' for edit express filter -- pass
    And user is in the dashboard
    And visits the Reason page
    And clicks the Edit Express Filter icon button
    And sees Edit Express Filter modal
    And selects '<category>' for filter
    And clicks the Save button
    Then user should see filter label and textfield

    Examples:
      | category |
      | Code     |
      | Name     |
      | Remarks  |

  Scenario: User can filter by '<category>' -- pass
    And user is in the dashboard
    And visits the Reason page
    And clicks the Edit Express Filter icon button
    And sees Edit Express Filter modal
    And selects '<category>' for filter
    And clicks the Save button
    And inputs '<value>' in filter textfield
    And clicks the Search button
    Then user should see list of '<category>' containing '<value>'

    Examples:
      | category | value    |
      | Code     | 1        |
      | Name     | test     |
      | Remarks  | remarks  |

  Scenario: User can sort by '<category>' in '<order>'
    And user is in the dashboard
    And visits the Reason page
    And clears existing filter
    And selects '<category>' for sorting option
    And selects '<order>' for sorting order
    Then user should see result sorted by '<category>' in '<order>'

    Examples:
      | category | order      |
      | Code     | Ascending  |
      | Name     | Ascending  |
      | Remarks  | Ascending  |
      | Code     | Descending |
      | Name     | Descending |
      | Remarks  | Descending |

  Scenario: User can add new inputs / item
    And user is in the dashboard
    And visits the Reason page
    And adds '100', 'New Name', 'New Remarks' as new inputs
    And clicks the update icon button
    Then user should see the item has been added

  Scenario: User can delete an item
    And user is in the dashboard
    And visits the Reason page
    And user clicks the delete icon button of the newly added values
    And user sees the Delete Data modal
    And clicks the OK button
    Then user should see the item has been deleted

  Scenario: User can edit limit of rows displayed per page
    And user is in the dashboard
    And visits the Reason page
    And edits pagination limit to '5'
    Then user should see a maximum '5' values in the current page