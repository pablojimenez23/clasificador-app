import { useState } from "react";
import "./App.css";

const nombresClases = {
  'battery':     'Esto es una bateria',
  'biological':  'Esto es un residuo biologico',
  'brown-glass': 'Esto es vidrio cafe',
  'cardboard':   'Esto es carton',
  'clothes':     'Esto es ropa',
  'green-glass': 'Esto es vidrio verde',
  'metal':       'Esto es metal',
  'paper':       'Esto es papel',
  'plastic':     'Esto es plastico',
  'shoes':       'Esto es calzado',
  'trash':       'Esto es basura',
  'unknown':     'No se pudo identificar el residuo',
  'white-glass': 'Esto es vidrio blanco'
};

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [imagen, setImagen]       = useState(null);
  const [preview, setPreview]     = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando]   = useState(false);
  const [error, setError]         = useState(null);

  const manejarImagen = (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    setImagen(archivo);
    setPreview(URL.createObjectURL(archivo));
    setResultado(null);
    setError(null);
  };

  const clasificar = async () => {
    if (!imagen) return;
    setCargando(true);
    setError(null);

    const formulario = new FormData();
    formulario.append("imagen", imagen);

    try {
      const respuesta = await fetch(`${API_URL}/clasificar`, {
        method: "POST",
        body: formulario,
      });
      const datos = await respuesta.json();
      setResultado(datos);
    } catch (err) {
      setError("No se pudo conectar con la API. Verifica que este corriendo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor">
      <div className="tarjeta">
        <h1 className="titulo">Clasificador de Residuos</h1>
        <p className="subtitulo">Sube una imagen y la IA identificara el tipo de residuo</p>

        <div className="zona-subida">
          <input
            type="file"
            accept="image/*"
            onChange={manejarImagen}
            id="input-imagen"
            className="input-oculto"
          />
          <label htmlFor="input-imagen" className="etiqueta-subida">
            {preview ? "Cambiar imagen" : "Seleccionar imagen"}
          </label>
        </div>

        {preview && (
          <div className="preview-contenedor">
            <img src={preview} alt="Preview" className="preview-imagen" />
          </div>
        )}

        {preview && (
          <button
            className="boton-clasificar"
            onClick={clasificar}
            disabled={cargando}
          >
            {cargando ? "Clasificando..." : "Clasificar"}
          </button>
        )}

        {error && <p className="error">{error}</p>}

        {resultado && (
          <div className="resultado">
            <div className="clasificacion-principal">
              <span className="valor">
                {nombresClases[resultado.clasificacion.toLowerCase()]}
              </span>
            </div>
            <div className="confianza">
              <span className="etiqueta">Confianza</span>
              <span className="valor">{resultado.confianza}%</span>
            </div>
            <div className="top3">
              <span className="etiqueta">Top 3</span>
              {resultado.top3.map((item, index) => (
                <div key={index} className="top3-item">
                  <span className="top3-clase">
                    {nombresClases[item.clase.toLowerCase()] || item.clase}
                  </span>
                  <div className="barra-contenedor">
                    <div
                      className="barra"
                      style={{ width: `${item.probabilidad}%` }}
                    />
                  </div>
                  <span className="top3-prob">{item.probabilidad}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;