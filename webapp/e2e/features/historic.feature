Feature: Viewing game history

Scenario: Unauthenticated user attempts to access game history
  Given An unauthenticated user
  When I try to access the game history page
  Then I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page

Scenario: Authenticated user views his empty history
  Given A registered user with username "aswuser" and password "ValidPassword123"
  When I log in and I go to the history window
  Then I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas"

Scenario: Authenticated user views one entry on his history
  Given A registered user with username "aswuser" and password "ValidPassword123" and an entry on his game history
  When I log in and I go to the history window
  Then I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas" and a row with the correct data