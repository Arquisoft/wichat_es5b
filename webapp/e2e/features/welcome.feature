Feature: Welcome to the game

Scenario: Authenticated user logs into the game
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in
  Then I should see the Welcome message of the game