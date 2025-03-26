Feature: Logging in a user

Scenario: The user logs in successfully with valid credentials
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser" and I fill the password field with "validpassword" and I press submit
  Then I should be redirected to the dashboard and a welcome message "Welcome, existinguser!" should be displayed

Scenario: The user logs in with an incorrect password
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser" and I fill the password field with "invalidpassword" and I press submit
  Then A validation message "Error: Invalid credentials" should be displayed

Scenario: The user logs in with an incorrect username
  Given A user with username "existinguser" and password "validpassword" is registered
  When I fill the username field with "nonexistentuser" and I fill the password field with "validpassword" and I press submit
  Then A validation message "Error: Invalid credentials" should be displayed

Scenario: The user logs in with both incorrect username and password
  Given A user with username "existinguser" and password "validpassword" is registered
  When I fill the username field with "nonexistentuser" and I fill the password field with "wrongpassword" and I press submit
  Then A validation message "Error: Invalid credentials" should be displayed

Scenario: The user submits the form without filling the password field
  Given A registered user with username "existinguser" and password "validpassword"
  When I fill the username field with "existinguser" and I leave the password field empty and I press submit
  Then A validation message "Error: Username and password are required" should be displayed

Scenario: The user submits the form without filling the username field
  Given A registered user with username "existinguser" and password "validpassword"
  When I leave the username field empty and I fill the password field with "validpassword" and I press submit
  Then A validation message "Error: Username and password are required" should be displayed

Scenario: The user submits the form without filling username and password
  Given A registered user with username "existinguser" and password "validpassword"
  When I leave both the username and password fields empty and I press submit
  Then A validation message "Error: Username and password are required" should be displayed
