Feature: Playing the game

Scenario: Authenticated user starts a game
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I click on Start Game
  Then I should see the first question of the game