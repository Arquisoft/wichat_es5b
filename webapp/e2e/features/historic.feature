Feature: Viewing game history

Scenario: Unauthenticated user attempts to access game history
  Given An unauthenticated user
  When I try to access the game history page
  Then I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page

Scenario: Unauthenticated user attempts to access game history from Add User page
  Given An unauthenticated user
  When I go to the register page and I try to access the game history page
  Then I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page

Scenario: Authenticated user views his empty history
  Given A registered user with username "aswuserhistory" and password "ValidPassword123"
  When I log in and I go to the history window
  Then I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas"

