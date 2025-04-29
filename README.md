# wichat_es5b

[![Actions Status](https://github.com/arquisoft/wichat_es5b/workflows/CI%20for%20wichat_es5b/badge.svg)](https://github.com/arquisoft/wichat_es5b/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5b&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5b)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5b&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5b)

<div align="center">
  
  ![Logo](/webapp/public/logo192.png)
  <p><a href="http://20.0.163.155:3000">Enlace a la web de Wichat</a></p>
  <p><a href="https://Arquisoft.github.io/wichat_es5b/">Enlace a la documentacion del proyecto</a></p>

</div>


Este es un proyecto base para el curso de Arquitectura de Software en 2024/2025. Es una aplicación básica compuesta por varios componentes.

- **User service**. Servicio de Express que gestiona la inserción de nuevos usuarios en el sistema.
- **Auth service**. Servicio de Express que gestiona la autenticación de los usuarios.
- **LLM service**. Servicio de Express que gestiona la comunicación con el LLM.
- **Stats service**. Servicio de Express que gestiona el historial de cada usuario y el ranking global de la aplicacion.
- **Game service**. Servicio de Express que gestiona la logica del juego y los datos de las preguntas.
- **Wikidata service**. Servicio de Express que obtiene la informacion de las preguntas de Wikidata.
- **Gateway service**. Servicio de Express expuesto al público y que sirve como proxy para los anteriores.
- **Webapp**. Aplicación web en React que utiliza el servicio de gateway para permitir el inicio de sesión y nuevas funciones de usuario.

Tanto el User service como el Auth service y el Stats service comparten una base de datos MongoDB a la que se accede mediante Mongoose.

## Miembros del grupo
|Nombre|Email|
|------|-----|
|Alberto Martinez Olivar | uo282069@uniovi.es|
|Pablo Jose Perez Diaz | uo282440@uniovi.es|
|Marcos Gonzalez Garcia | uo282587@uniovi.es|
|Celia Bobo Rodriguez Noriega | uo222898@uniovi.es|
|Javier Monte Guillem | uo283951@uniovi.es|
|Pelayo Palacios Suarez | uo274408@uniovi.es|

## Informacion acerca de Wichat
- **Modos de juego**. La web tiene dos modos de juego, uno el modo nomal y el otro conocido como bateria de sabios.
    - El modo normal consta de un numero de preguntas segun la dificultad con cuatro respuestas por pregunta de la cual solo habra una correcta.
    - El modo de bateria de sabios consta de tantas preguntas como tenga la dificultad seleccionada con dos respuestas por pregunta de las cuales solo una sera correcta, y a diferencia que el modo anterio el juego finaliza cuando fallas una pregunta.
- **Dificultades**. Hay tres distintos tipos de dificultades, corta, normal y larga.
- **Pistas**. Podras interaccionar con hasta cuatro pistas predefinidas segun el tipo de pregunta.
- **ChatBot**. Podras consultar a nuestro chatbot para que te proporcione alguna pista, incluso la imagen de la propia pregunta para que te facilite alguna pista acerca de la imagen.