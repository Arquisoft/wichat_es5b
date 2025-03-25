Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then A confirmation message should be shown in the screen

# Scenario: The user submits the form without filling username and password
#   Given An unregistered user
#   When I leave the username and password fields empty
#   And I press submit
#   Then A validation message "Username and password are required" should be displayed

# Scenario: The user submits the form with username empty
#   Given An unregistered user
#   When I leave the username field empty
#   And I fill the password field
#   And I press submit
#   Then A validation message "Username is required" should be displayed

# Scenario: The user submits the form with password empty
#   Given An unregistered user
#   When I leave the password field empty
#   And I fill the username field
#   And I press submit
#   Then A validation message "Password is required" should be displayed

# Scenario: The user submits the form with a username already registered
#   Given A user with username "existinguser" is already registered
#   When I fill the username field with "existinguser"
#   And I fill the password field
#   And I press submit
#   Then A validation message "Username is already taken" should be displayed