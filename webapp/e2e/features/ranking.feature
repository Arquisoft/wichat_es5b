Feature: Viewing game ranking

Scenario: Unauthenticated user views the ranking
  Given An unauthenticated user
  When I try to access the game ranking page
  Then I should see the ranking of the game

Scenario: Unauthenticated user views the ranking on the Add User page
  Given An unauthenticated user
  When I go to the register page and I try to access the game ranking page
  Then I should see the ranking of the game

Scenario: Authenticated user views the ranking from welcome page
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I click on Ranking
  Then I should see the ranking of the game

Scenario: Authenticated user views the ranking from game page
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I click to start game and I click on Ranking
  Then I should see the ranking of the game

Scenario: Authenticated user views the ranking from game page right in the middle of the games
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I click to start game and I answer 3 questions and I click on Ranking
  Then I should see the ranking of the game

Scenario: Authenticated user views the ranking from end game page
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I click to start game and I answer all questions and I click on Ranking
  Then I should see the ranking of the game