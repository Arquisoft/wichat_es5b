Feature: Registering a new user

Scenario: The user is not registered in the site
  Given An unregistered user
  When I fill the data in the form and press submit
  Then A confirmation message should be shown in the screen

Scenario: The user submits the form without filling username and password
  Given An unregistered user
  When I leave the username and password fields empty and i press submit
  Then A validation message "El campo nombre de usuario es obligatorio y no puede estar vacío" should be displayed

Scenario: The user submits the form with username empty
  Given An unregistered user
  When I leave the username field empty and I fill the password field and I press submit
  Then A validation message "El campo nombre de usuario es obligatorio y no puede estar vacío" should be displayed

Scenario: The user submits the form with password empty
  Given An unregistered user
  When I leave the password field empty and I fill the username field and I press submit
  Then A validation message "El campo contraseña es obligatorio y no puede estar vacío" should be displayed

Scenario: The user submits the form with a username already registered
  Given A user with username "existinguser" is already registered
  When I fill the username field with "existinguser" and I fill the password field and I press submit
  Then A validation message "El nombre de usuario ya está en uso" should be displayed

Scenario: The user submits the form with a password without an uppercase letter
  Given An unregistered user
  When I fill the username field with "userasw" and I fill the password field with "password1" and I press submit
  Then A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed

Scenario: The user submits the form with a password without a number
  Given An unregistered user
  When I fill the username field with "userasw" and I fill the password field with "Password" and I press submit
  Then A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed

Scenario: The user submits the form with a password shorter than 6 characters
  Given An unregistered user
  When I fill the username field with "userasw" and I fill the password field with "Pass1" and I press submit
  Then A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed