// Código para el formulario de inicio de sesión Jquery
$(document).ready(function () {
   $("#login-form").submit(function (e) {
      e.preventDefault();

      const user = $("#username").val().trim();
      const pass = $("#passwd").val().trim();

      // Simulación de usuario válido
      const usuarioValido = "admin";
      const contrasenaValida = "1234";

      if (user === usuarioValido && pass === contrasenaValida) {
         $("#mensaje").css("color", "green").text("Iniciando sesión...").fadeIn();
         setTimeout(() => {
            $("#mensaje").fadeOut();
            localStorage.setItem("usuario", user)
            localStorage.setItem("userLogged", true);
            window.location.href = "/index.html"; // Redirigir si login éxito
         }, 2000);
      } else {
         $("#mensaje").css("color", "red").text("Usuario o contraseña incorrectos.").fadeIn().delay(2500).fadeOut();
      }
   });
});