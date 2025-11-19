<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registrar hábito</title>
  <link rel="stylesheet" href="styles.css">
</head>

<body>
<div class="center">
  <h2 class="subtitle-large">Registrar hábito</h2>
  <p class="subtitle">Selecciona un hábito que realizaste hoy:</p>

<!-- Select con emojis -->
<select id="habitSelect" class="input">
  <option value="">-- Selecciona un hábito --</option>
  <option value="frutas">🍎 Comí frutas</option>
  <option value="verduras">🥗 Comí verduras</option>
  <option value="agua">💧 Tomé un vaso de agua</option>
  <option value="correr">🏃‍♂️ Salí a correr</option>
  <option value="gimnasio">🏋️ Fui al gimnasio</option>
  <option value="meditacion">🧘 Medité</option>
  <option value="caminata">🚶 Hice una caminata</option>
</select>

  <!-- Botones verdes iguales -->
  <div class="btn-group" style="margin-top:20px">
    <button id="btnFoto" class="btn">📸 Tomar foto</button>
    <button id="btnGuardar" class="btn">Guardar hábito</button>
  </div>

  <!-- Botón rojo -->
  <button onclick="window.location.href='dashboard.html'" 
          class="btn btn-logout" style="margin-top:25px">
    Volver al menú
  </button>

  <br><br>
  <video id="video" width="300" autoplay style="display:none; border-radius:10px;"></video>
  <canvas id="canvas" width="300" height="250" style="display:none;"></canvas>
</div>

<script type="module" src="./habitos.js"></script>
</body>
</html>


  alert("Hábito registrado con éxito.\n(Evidencia lista para guardar).");
});
