<div align="center">

# 🧩 **EduQuest**  
### *Explora. Aprende. Supera.*  
📚 *Plataforma Educativa Interactiva basada en retos y misiones*

**Ciclo Formativo:** Desarrollo de Aplicaciones Multiplataforma (DAM)  

**Autor:** Ramón Gavira Ferrusola

</div>

---

## 📑 Índice

1. [Introducción](#introduccion)  
2. [Funcionalidades y Tecnologias](#funcionalidades-y-tecnologias)  
3. [Guia de Instalacion](#guia-de-instalacion)  
4. [Guia de Uso](#guia-de-uso)  
5. [Documentacion Tecnica](#documentacion-tecnica)  
6. [Diseno de la Interfaz Figma](#diseno-de-la-interfaz-figma)  
7. [Conclusion](#conclusion)  
8. [Contribuciones y Agradecimientos](#contribuciones-y-agradecimientos)  
9. [Licencia](#licencia)  
10. [Contacto](#contacto)

---

## 🧭 Introducción <a id="introduccion"></a>

**EduQuest** es una aplicación web de aprendizaje diseñada especialmente para programadores principiantes o novatos.  
La plataforma permite a los usuarios aprender haciendo, a través de diferentes ejercicios generados por inteligencia artificial sobre diversos temas como Java, SQL, y otros lenguajes y tecnologías de programación.

Además de aprender, los usuarios pueden competir entre ellos mediante un sistema de ranking que clasifica a los jugadores según su nivel y experiencia acumulada (XP).  
La XP se obtiene completando niveles de diferentes dificultades: a mayor dificultad, mayor experiencia otorgada. También hay retos diarios y semanales que incentivan la participación continua y el progreso constante.

Los usuarios pueden registrarse e iniciar sesión para acceder a su perfil, donde pueden ver y modificar sus datos personales, como el nombre de usuario o la contraseña.

---

## ⚙️ Funcionalidades y Tecnologías <a id="funcionalidades-y-tecnologias"></a>

### Funcionalidades principales:
- Ejercicios y retos interactivos generados por IA para distintos temas de programación (Java, SQL, etc.)  
- Sistema de niveles y experiencia (XP) que recompensa la superación de retos según su dificultad  
- Ranking competitivo donde los usuarios pueden comparar su progreso y posición con otros jugadores  
- Retos diarios y semanales que mantienen la motivación y el aprendizaje constante  
- Registro e inicio de sesión con gestión de usuarios  
- Perfil de usuario con opción para ver y modificar datos personales (nombre de usuario, contraseña, etc.)  
- Panel de progreso para visualizar avances y estadísticas personales  

### Tecnologías utilizadas:
- **Frontend:** Vite + React (JSX/JavaScript)  
- **Backend:** Spring Boot (Java)  
- **Base de datos:** Supabase (PostgreSQL gestionado)  
- **Diseño de interfaz:** Figma  
- **Control de versiones:** Git + GitHub

---

## 🛠️ Guía de Instalación <a id="guia-de-instalacion"></a>

Sigue estos pasos para instalar y poner en funcionamiento el proyecto **EduQuest** en tu entorno local.

## 1. Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- **Git**: Para clonar el repositorio.  
- **Node.js** (versión 16 o superior): Para ejecutar el frontend.  
  Puedes descargarlo desde [https://nodejs.org/](https://nodejs.org/)  
- **Maven**: Para compilar y ejecutar el backend con Spring Boot.  
  Descárgalo e instálalo desde [https://maven.apache.org/](https://maven.apache.org/)  
- **Java JDK 11 o superior**: Requerido para Spring Boot (backend).  
- **Acceso a la base de datos Supabase**: Configura tu base de datos en Supabase y asegúrate de tener los datos de conexión (URL, usuario, contraseña) para configurar el backend.

## 2. Clonar el repositorio

Abre una terminal o consola y clona el repositorio oficial de EduQuest:

```bash
git clone https://github.com/ramadearbol/Eduquest.git
cd Eduquest
```

## 3. Configurar y ejecutar el backend

En la terminal, navega a la carpeta del backend:

```bash
cd backend
```
Asegúrate de tener configurados los parámetros de conexión a la base de datos Supabase en el archivo de configuración del backend (por ejemplo, `application.properties` o `application.yml`).

Instala las dependencias y ejecuta el backend con Maven:

```bash
mvn clean install
mvn spring-boot:run
```

Si todo va bien, el backend se iniciará en http://localhost:8080.

## Configurar y ejecutar el frontend

Abre una nueva terminal y navega a la carpeta del frontend:

```bash
cd frontend
```
Instala las dependencias necesarias con npm:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

## ✅ Verificar el funcionamiento

Una vez desplegada, la app estará disponible en:

- **Frontend local**: [http://localhost:3000](http://localhost:3000)
- **Backend local**: [http://localhost:8080](http://localhost:8080)
- **Backend en producción (Railway)**: [https://eduquest-api.up.railway.app](https://eduquest-api.up.railway.app)
- **Frontend en producción (Vercel)** [https://eduquest-api.up.railway.app](https://eduquest-mu.vercel.app/)

Deberías poder acceder a la interfaz de **EduQuest**, registrarte, iniciar sesión y comenzar a usar la plataforma.

El backend manejará las peticiones y la base de datos **Supabase** almacenará la información.

---

## 📚 Guía de Uso <a id="guia-de-uso"></a>

A continuación, se explica cómo utilizar las principales funcionalidades de **EduQuest** una vez iniciada la aplicación:

## 🔐 Registro e Inicio de Sesión

Al acceder por primera vez, puedes registrarte introduciendo:

- Nombre de usuario  
- Correo electrónico  
- Contraseña

Una vez registrado, puedes iniciar sesión con tu correo y contraseña.

## 🧭 Navegación general

En la parte izquierda de la pantalla encontrarás el menú de navegación lateral (**navbar**), desde el cual puedes acceder a todas las secciones de la aplicación:

- **Aprender**
- **Retos**
- **Ranking**
- **Perfil**
- **Cerrar sesión**

## 🎓 Sección Aprender

En esta sección se muestran diferentes **mundos temáticos**, cada uno enfocado en una tecnología (por ejemplo: Java, SQL, etc.).

#### Para comenzar un reto:

1. Haz clic en uno de los mundos.
2. Se abrirá un **pop-up** para elegir la dificultad:
   - ⭐ Fácil (1 estrella)
   - ⭐⭐ Medio (2 estrellas)
   - ⭐⭐⭐ Difícil (3 estrellas)
3. Tras seleccionar la dificultad, comenzarás un **reto compuesto por 5 preguntas interactivas**.
4. Al finalizar el reto, obtendrás **experiencia (XP)** según la dificultad elegida.

## 🏆 Sección Retos

En esta pestaña encontrarás los **Retos Diarios** y **Retos Semanales**.

- Cada reto tiene condiciones específicas (por ejemplo: completar un número de ejercicios).
- Puedes **reclamar XP** al completar los retos.
- Los retos se **reinician automáticamente** cuando termina su periodo:
  - Diarios: cada 24 horas  
  - Semanales: cada 7 días

## 📊 Sección Ranking

Muestra una **clasificación general de los jugadores**. Incluye:

- Posición
- Nombre de usuario
- Nivel
- XP acumulada

> 🔹 El ranking se ordena primero por **nivel** y luego por **XP**.

Al final de la lista, verás un resumen con tu usuario, nivel y XP.

## 👤 Sección Perfil

En esta sección puedes ver y modificar tus **datos personales**:

- Cambiar el **nombre de usuario**
- Ver el **correo electrónico**
- Cambiar la **contraseña**  
  (es necesario introducir la contraseña actual y la nueva)

## 🚪 Cerrar Sesión

En cualquier momento puedes cerrar sesión usando el botón **"Cerrar sesión"**, ubicado en la parte inferior del menú lateral.

---

## 📄 Documentación Técnica <a id="documentacion-tecnica"></a>

🔗 [Ver documentación completa](https://docs.google.com/document/d/18ApGvmYp0JX7P3j-dxGN12sSd52T4x352XwxLtdDwEY/edit?usp=sharing)

La documentación incluye:

- Diagrama de casos de uso  
- Diagrama de clases  
- Diagrama Entidad-Relación  
- Diagrama de componentes  
- Casos de prueba

---  

## 🎨 Diseño de la Interfaz (Figma) <a id="diseno-de-la-interfaz-figma"></a>

- 🔍 **Vista general del diseño (todas las pantallas)**:  
  [Ver en Figma - Modo diseño completo](https://www.figma.com/design/w9l3FmvuzWzmqM53l2T00T/Eduquest?node-id=0-1&t=vDFRVd4K881tFivr-1)

- 💻 **Modo prototipo interactivo (simulación en ordenador)**:  
  [Ver en Figma - Modo prototipo](https://www.figma.com/proto/w9l3FmvuzWzmqM53l2T00T/Eduquest?node-id=1-2&t=319nZaK3HIkacBbv-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2)

Aquí se muestra tanto el diseño general de la interfaz como la simulación interactiva de navegación, desarrollados con Figma para definir la experiencia de usuario.

---

## 🧩 Conclusión <a id="conclusion"></a>

**EduQuest** demuestra el potencial de la gamificación en la educación, combinando la motivación del juego con el aprendizaje de la programación.

### Principales logros del proyecto:

- ✅ **Aplicación completa y funcional** que combina frontend, backend y base de datos.
- 🛠️ **Consolidación de conocimientos técnicos** en tecnologías como React, Spring Boot y PostgreSQL.
- 🎯 **Enfoque en la experiencia del usuario**, desde el diseño en Figma hasta la navegación fluida.
- 📈 **Desarrollo de competencias clave**, como la planificación, la toma de decisiones técnicas y la documentación.

Este proyecto representa no solo una herramienta educativa, sino también un reto personal superado con éxito.

---

## 🤝 Contribuciones y Agradecimientos <a id="contribuciones-y-agradecimientos"></a>

A lo largo del desarrollo de **EduQuest**, he contado con la inspiración y el apoyo de diversas personas y recursos:

- 👨‍🏫 **Profesorado y tutores** del ciclo DAM, por su orientación y conocimientos.
- 👥 **Compañeros de clase y de prácticas**, por su feedback y colaboración en pruebas.
- 💻 **Herramientas de código abierto**, como React, Spring Boot, Supabase y Figma, que han sido clave para el desarrollo.

> 📌 Inspiración tomada de plataformas como **Duolingo**, **Moodle** y **Kahoot**
---

## 📜 Licencia <a id="licencia"></a>

Este proyecto está licenciado bajo los términos de la **Licencia MIT**, lo que permite su uso, modificación y distribución libre con reconocimiento al autor.

---

## 📬 Contacto <a id="contacto"></a>

- 📧 Email: rgaviraferrusola@gmail.com
- 🐙 GitHub: [@ramongavira](https://github.com/ramadearbol)  
