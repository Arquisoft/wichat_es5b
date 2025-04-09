// i18n.js - Función para cargar archivos .properties
export const loadProperties = (lang) => {
    return fetch(`/resources/messages_${lang}.properties`) // Ruta del archivo
      .then((response) => response.text())  // Leer el archivo como texto
      .then((data) => {
        const properties = {};
        const lines = data.split("\n");
  
        // Recorrer cada línea del archivo .properties
        lines.forEach((line) => {
          if (line && !line.startsWith("#")) { // Ignorar comentarios
            const [key, value] = line.split("=").map((part) => part.trim());
            if (key && value) {
              properties[key] = value;
            }
          }
        });
  
        return properties;
      })
      .catch((error) => {
        console.error("Error cargando el archivo .properties:", error);
        return {};
      });
  };
  