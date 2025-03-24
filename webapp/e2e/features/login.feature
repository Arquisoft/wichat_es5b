Feature: Logging in a user

Scenario: The user logs in successfully with valid credentials
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser"
  And I fill the password field with "validpassword"
  And I press submit
  Then I should be redirected to the dashboard
  And A welcome message "Welcome, existinguser!" should be displayed

Scenario: The user logs in with an incorrect password
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser"
  And I fill the password field with "invalidpassword"
  And I press submit
  Then A validation message "Incorrect username or password" should be displayed

Scenario: The user logs in with an incorrect username
  Given A user with username "existinguser" and password "validpassword" is registered
  When I fill the username field with "nonexistentuser"
  And I fill the password field with "validpassword"
  And I press submit
  Then A validation message "Incorrect username or password" should be displayed

Scenario: The user logs in with both incorrect username and password
  Given A user with username "existinguser" and password "validpassword" is registered
  When I fill the username field with "nonexistentuser"
  And I fill the password field with "wrongpassword"
  And I press submit
  Then A validation message "Incorrect username or password" should be displayed

Scenario: The user submits the form without filling the password field
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser"
  And I leave the password field empty
  And I press submit
  Then A validation message "Password is required" should be displayed

Scenario: The user submits the form without filling the username field
  Given A registered user with username "existinguser" and password "validpassword"
  When I leave the username field empty
  And I fill the password field with "validpassword"
  And I press submit
  Then A validation message "Username is required" should be displayed

Scenario: The user submits the form without filling username and password
  Given A registered user with username "existinguser" and password "validpassword"
  When I leave both the username and password fields empty
  And I press submit
  Then A validation message "Username and password are required" should be displayed
