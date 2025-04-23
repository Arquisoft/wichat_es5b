Feature: Updating the user data

Scenario: Authenticated user updates their data
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update username
  And I fill in the form with new username "newusername"
  And I click on Save Changes
  Then I should see a success message  

Scenario: Authenticated user tries to update their data with empty username
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update username
  And I fill in the form with empty username
  And I click on Save Changes
  Then I should see an error message

Scenario: Authenticated user tries to update their data with existing username
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  And Another user with username "existingusername" and password "ValidPassword123"
  When I log in and I click on Update username
  And I fill in the form with existingusername
  And I click on Save Changes
  Then I should see an error message

Scenario: Authenticated user tries to update their password with valid data
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update password
  And I fill in the form with new password "NewValidPassword123"
  And I click on Save Changes
  Then I should see a success message

Scenario: Authenticated user tries to update their password with wrong actual password
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update password
  And I fill in the form with wrong actual password
  And I click on Save Changes
  Then I should see an error message

Scenario: Authenticated user tries to update their password with not valid new password
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update password
  And I fill in the form with not valid new password
  And I click on Save Changes
  Then I should see an error message

Scenario: Authenticated user tries to update their password with different new password and confirmation
  Given A registered user with username "aswuser2" and password "ValidPassword123"
  When I log in and I click on Update password
  And I fill in the form with different new password and confirmation
  And I click on Save Changes
  Then I should see an error message