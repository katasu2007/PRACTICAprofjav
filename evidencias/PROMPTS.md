PROMPT 1 — ARRANQUE (Bloque 1):Creá el archivo src/logica.ts con las reglas de NÁHUAT DIARIO, según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias:
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números juntos arriba, cada uno con un comentario que diga su unidad (ejemplo: MAX_INTENTOS = 6, LONGITUD_PALABRA = 5).
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y false si no se pudo hacer.
- Si hace falta azar (como seleccionar la palabra del día Náhuat), usá un generador con semilla y exportalo, para que la misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS ESPECÍFICAS DE NÁHUAT DIARIO:
- Contiene un diccionario de palabras Náhuat (de 5 letras) junto con su significado/traducción en español y un dato cultural o lingüístico.
- Al adivinar, debe evaluar el intento letra por letra devolviendo los estados: 'correcta' (verde), 'presente' (amarillo) o 'ausente' (gris).
- Al acertar la palabra o perder, el estado incluye la traducción en español de la palabra Náhuat acertada y la información cultural relevante.

REGLAS DE TRABAJO:
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha no decía nada.

FICHA COMPLETA DEL PROYECTO:
- Nombre del proyecto: NÁHUAT DIARIO (Ruinas Ancestrales)
- En una frase: Juego de adivinar la palabra diaria en Náhuat para revitalizar y aprender la lengua.
- Para quién es: Estudiantes y personas interesadas en aprender sobre la cultura y el idioma Náhuat en El Salvador.
- Qué logra: Enseña vocabulario Náhuat mediante la mecánica de adivinar palabras de 5 letras.
- Tres verbos: 1. Proponer (intentar palabra) 2. Evaluar (comprobar letras) 3. Aprender (ver significado y cultura).
- Termina bien si: El usuario adivina la palabra Náhuat en 6 intentos o menos.
- Termina mal si: Se agotan los 6 intentos sin adivinar la palabra.
- Qué se ve en pantalla: Rejilla de 6x5 intentos, teclado en pantalla, panel contextual de traducción Náhuat/Español y estética de ruinas/piedra arqueológica.
- Controles: Teclado físico y teclado táctil en pantalla (apto para celular).
- Colores y significado:
  * Verde Jade / Turquesa Ancestral (#2e7d32): Letra correcta en la posición correcta / Victoria.
  * Amarillo Oro / Ámbar Solar (#f57f17): Letra presente pero en posición incorrecta.
  * Gris Piedra / Basalto (#424242): Letra no presente / Tecla no usada.
  * Terracota / Barro Arcilla (#8d6e63): Bordes de casillas y elementos de fondo de ruinas.
  * Fondo Oscuro Noche Maya/Pipil (#12100d): Fondo general que resalta las estructuras de piedra.
- Criterio de aceptación: Abro el juego, veo el tablero con estética de ruinas de piedra, ingreso una palabra Náhuat de 5 letras, las casillas cambian de color revelando aciertos, adivino la palabra antes del sexto intento y la pantalla me muestra la felicitación con la traducción en español y su significado cultural.
- Lo que no va: Sin audio ni música de fondo, sin compras internas, sin librerías de gráficos 3D complejas, sin animaciones pesadas.

PROMPT 2 — PRUEBAS (Bloque 2):Escribí pruebas con Vitest para src/logica.ts, en test/logica.test.ts.

Como mínimo cinco, y tienen que cubrir:
1. Que el estado inicial se arme bien (intento 1 de 6, palabra objetivo Náhuat elegida correctamente).
2. Cada acción del usuario: comprobar qué ocurre cuando se envía un intento válido de 5 letras y qué devuelve si el intento no es válido (ej. palabra de tamaño incorrecto).
3. Que no se pueda ingresar un intento cuando el juego ya terminó (ganado o perdido).
4. La condición de «termina bien» (adivinar la palabra Náhuat) y la de «termina mal» (fallar los 6 intentos).
5. UNA PRUEBA QUE RECORRA UN USO COMPLETO de principio a fin, donde el jugador ingresa intentos hasta adivinar la palabra Náhuat objetivo y se valida que el juego finaliza en estado de victoria revelando el significado en español.

Los nombres de las pruebas en español y en forma de frase.
No modifiques src/logica.ts. Al terminar corré npm test y pegame el resultado.
