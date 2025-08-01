<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Par o Impar</title>
        <link rel="stylesheet" href="assets/output.css">
        <style>
            .idioma-bar {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                padding: 1rem 2rem 0 0;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2000;
            }
            .idioma-select {
                background: #f3f4f6;
                color: #222;
                border-radius: 8px;
                padding: 0.4rem 1.2rem;
                font-size: 1.1rem;
                font-weight: 500;
                border: 1px solid #d1d5db;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                outline: none;
                transition: border 0.2s;
            }
            .idioma-select:focus {
                border: 1.5px solid #2563eb;
            }
        </style>
    </head>
    <body class="bg-dark flex flex-col items-center justify-center min-h-screen text-white font-sans">
        <div class="idioma-bar">
            <select id="idioma-select" class="idioma-select">
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇬🇧 English</option>
            </select>
        </div>
        <header class="w-full text-center py-3">
            <h1 class="text-5xl font-bold" id="titulo-inicio">Juega <span class="text-primary">Par</span> o <span class="text-secondary">Impar</span></h1>
        </header>

        <main id="game-description" class="max-w-4xl text-center p-5">
            <div class="flex flex-col md:flex-row items-center gap-8">
                <img src="img/2.jpg" alt="Una imagen de par e impar" class="w-full md:w-1/2 rounded-lg shadow-lg">
                <article class="md:w-1/2">
                     <p class="text-xl mb-6" id="descripcion-inicio">
                         ¿Tienes instinto para los números? ¿Eres capaz de anticipar el resultado en un abrir
                        y cerrar de ojos? ¡Entonces Par o Impar es tu desafío perfecto! Un juego rápido,
                        adictivo y lleno de emoción te espera. Demuestra tu agilidad mental, reta a
                        tus contrincantes y conviértete en el maestro del par y el impar.
                        ¡No esperes más, la diversión te está llamando!
                     </p>
                     <div class="botones-container" style="display: flex; flex-direction: row; justify-content: center; gap: 20px;">
                         <form action="juego.php">
                             <button type="submit" id="btn-jugar" class="bg-blue-400 hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider">
                                JUGAR
                            </button>
                         </form>
                         <form action="ranking.php"> 
                             <button type="submit" id="btn-Ranking" class="bg-blue-400 hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider">
                                Ranking
                            </button>
                         </form>
                         <form action="ayuda.html">
                             <button type="submit" id="btn-ayuda" class="bg-blue-400 hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider">
                                Reglas
                            </button>
                         </form>
                     </div>
                </article>
            </div>
        </main>

        <script>
            const traducciones = {
                es: {
                    titulo: 'Juega <span class="text-primary">Par</span> o <span class="text-secondary">Impar</span>',
                    descripcion: '¿Tienes instinto para los números? ¿Eres capaz de anticipar el resultado en un abrir y cerrar de ojos? ¡Entonces Par o Impar es tu desafío perfecto! Un juego rápido, adictivo y lleno de emoción te espera. Demuestra tu agilidad mental, reta a tus contrincantes y conviértete en el maestro del par y el impar. ¡No esperes más, la diversión te está llamando!',
                    jugar: 'JUGAR'
                },
                en: {
                    titulo: 'Play <span class="text-primary">Even</span> or <span class="text-secondary">Odd</span>',
                    descripcion: 'Do you have a knack for numbers? Can you anticipate the result in the blink of an eye? Then Even or Odd is your perfect challenge! A fast, addictive, and exciting game awaits you. Show your mental agility, challenge your opponents, and become the master of even and odd. Don\'t wait any longer, fun is calling you!',
                    jugar: 'PLAY'
                }
            };

            function aplicarTraduccion(idioma) {
                document.getElementById('titulo-inicio').innerHTML = traducciones[idioma].titulo;
                document.getElementById('descripcion-inicio').textContent = traducciones[idioma].descripcion;
                document.getElementById('btn-jugar').textContent = traducciones[idioma].jugar;
            }

            document.getElementById('idioma-select').addEventListener('change', function() {
                const idioma = this.value;
                localStorage.setItem('idioma', idioma);
                aplicarTraduccion(idioma);
            });

            window.addEventListener('DOMContentLoaded', () => {
                const idioma = localStorage.getItem('idioma') || 'es';
                document.getElementById('idioma-select').value = idioma;
                aplicarTraduccion(idioma);
            });

            function redirigirAlJuego() {
                window.location.href = "juego.php";
            }
            function redirigirAlRanking() {
                window.location.href = "modulos/Listaranking.php";
            }
        </script>
    </body>
</html>