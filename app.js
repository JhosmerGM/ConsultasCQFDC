// Función para cargar los datos desde un archivo JSON
async function loadData() {
    try {
        const response = await fetch('data.json'); // Cargar datos desde el archivo JSON
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON.");
        }
        const data = await response.json(); // Convertir los datos a formato JSON
        return data;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        return []; // Retorna un array vacío en caso de error
    }
}

// Función para realizar la búsqueda y verificar habilitación
async function performSearch() {
    const data = await loadData(); // Cargar los datos
    const searchType = document.getElementById('searchType').value; // Tipo de búsqueda (N° CQFP o Nombre)
    const query = document.getElementById('query').value.toLowerCase().trim(); // Texto ingresado
    const resultsDiv = document.getElementById('results'); // Div para mostrar resultados

    // Validación: Asegurarse de que se ingrese un valor para buscar
    if (query === '') {
        alert('Por favor, ingrese algo para buscar.');
        return;
    }

    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    // Filtrar resultados en base al tipo de búsqueda
    const results = data.filter(item => {
        if (searchType === "N° CQFP") {
            return item["N° CQFP"] && item["N° CQFP"].toLowerCase() === query;
        } else if (searchType === "Apellidos y Nombres") {
            return item["Apellidos y Nombres"] && item["Apellidos y Nombres"].toLowerCase().includes(query);
        }
        return false;
    });

    // Mostrar los resultados encontrados
    if (results.length > 0) {
        results.forEach(item => {
            const currentDate = new Date(); // Fecha actual
            const [year, month] = item["Periodo Final"].split('-').map(Number); // Extraer año y mes del "Periodo Final"
            const finalDate = new Date(year, month - 1); // Crear fecha del periodo final (ajustar mes)

            // Verificar si está habilitado
            const isEnabled = (finalDate.getFullYear() > currentDate.getFullYear()) ||
                              (finalDate.getFullYear() === currentDate.getFullYear() && finalDate.getMonth() >= currentDate.getMonth());

            const status = isEnabled ? "Habilitado" : "No Habilitado"; // Determinar estado

            // Crear elemento HTML para mostrar resultado
            const itemDiv = document.createElement('div');
            itemDiv.className = 'result-item';
            itemDiv.innerHTML = `
                <p><strong>Nro. Colegiatura:</strong> ${item["N° CQFP"]}</p>
                <p><strong>Apellidos y Nombres:</strong> ${item["Apellidos y Nombres"]}</p>
                <p><strong>Periodo Final:</strong> ${item["Periodo Final"]}</p>
                <p><strong>Estado:</strong> <span class="${status === "Habilitado" ? "habilitado" : "no-habilitado"}">${status}</span></p>
                <hr>
            `;
            resultsDiv.appendChild(itemDiv); // Agregar el resultado al contenedor
        });
    } else {
        resultsDiv.textContent = 'No se encontraron resultados.'; // Mostrar mensaje si no hay resultados
    }
}

// Función para limpiar el campo de búsqueda y resultados
function clearSearch() {
    document.getElementById('query').value = ''; // Limpiar campo de texto
    document.getElementById('results').innerHTML = ''; // Limpiar resultados
}

// Validación en tiempo real del campo de búsqueda
document.getElementById('query').addEventListener('input', function () {
    const searchType = document.getElementById('searchType').value; // Tipo de búsqueda seleccionado
    const value = this.value;

    if (searchType === 'N° CQFP') {
        // Permitir solo números para "N° CQFP"
        if (/\D/.test(value)) {
            alert('Solo se permiten números en la búsqueda por número de colegiatura.');
            this.value = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        }
    } else if (searchType === 'Apellidos y Nombres') {
        // Permitir solo letras y espacios para "Apellidos y Nombres"
        if (/[^a-zA-Z\s]/.test(value)) {
            alert('Solo se permite texto en la búsqueda por apellidos y nombres.');
            this.value = value.replace(/[^a-zA-Z\s]/g, ''); // Eliminar caracteres no alfabéticos
        }
    }
});

// Código para manejar el menú de navegación (si aplica)
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active'); // Mostrar/ocultar menú
        });
    }
});
