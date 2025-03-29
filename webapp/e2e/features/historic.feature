Feature: Viewing game history

Scenario: Unauthenticated user attempts to access game history
  Given An unauthenticated user
  When I try to access the game history page
  Then I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page