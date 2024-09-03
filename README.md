Claro, a continuación te dejo el README.md actualizado con el enlace a la demostración en YouTube:


# FinanceMaster

**FinanceMaster** es una aplicación web diseñada para ayudar a los usuarios a gestionar sus finanzas personales o las de pequeños negocios. La aplicación permite a los usuarios registrar, monitorear y analizar sus ingresos y gastos, establecer presupuestos y metas financieras, y recibir recomendaciones personalizadas basadas en su situación financiera.

## Funcionalidades Principales

1. **Registro de Usuarios:**
   - Creación y gestión de cuentas de usuario.
   - Autenticación y autorización mediante JWT.
   
2. **Gestión de Gastos e Ingresos:**
   - Registro, edición y eliminación de transacciones de ingresos y gastos.
   - Clasificación de transacciones por categorías predefinidas o personalizadas.

3. **Presupuesto y Metas:**
   - Establecimiento de presupuestos mensuales por categorías.
   - Definición de metas de ahorro y seguimiento del progreso.

4. **Reportes y Análisis:**
   - Generación de gráficos y reportes sobre el flujo de caja.
   - Análisis de patrones de gasto e ingresos.

5. **Proyecciones Financieras:**
   - Proyecciones trimestrales, semestrales y anuales basadas en datos históricos y tendencias actuales.
   - Análisis predictivo para la toma de decisiones financieras.

6. **Banco de Recomendaciones:**
   - Recomendaciones personalizadas basadas en la situación actual del presupuesto.
   - Consejos para ahorrar, reducir gastos y optimizar ingresos.

7. **Notificaciones y Alertas:**
   - Alertas sobre el estado del presupuesto y recordatorios de fechas de vencimiento de pagos y metas de ahorro.

8. **Exportación de Datos:**
   - Exportación de datos en formatos CSV y PDF para análisis externo.

## Requerimientos del Sistema

- **Frontend:** Angular
- **Backend:** Node.js, Express
- **Base de Datos:** MySQL o MariaDB
- **Autenticación:** JWT (JSON Web Tokens)

## Estructura de la Base de Datos

**Usuarios:**
- `id`: Identificador único del usuario (INT, PK, AUTO_INCREMENT)
- `nombre_usuario`: Nombre de usuario (VARCHAR)
- `correo_electronico`: Correo electrónico del usuario (VARCHAR)
- `contraseña`: Contraseña del usuario (VARCHAR)
- `fecha_registro`: Fecha de registro del usuario (TIMESTAMP)

**Transacciones:**
- `id`: Identificador único de la transacción (INT, PK, AUTO_INCREMENT)
- `usuario_id`: Referencia al usuario que realizó la transacción (INT, FK)
- `tipo`: Tipo de transacción (ENUM: 'Ingreso', 'Gasto')
- `categoria`: Categoría de la transacción (VARCHAR)
- `monto`: Monto de la transacción (DECIMAL)
- `fecha`: Fecha de la transacción (TIMESTAMP)

**Presupuestos:**
- `id`: Identificador único del presupuesto (INT, PK, AUTO_INCREMENT)
- `usuario_id`: Referencia al usuario que creó el presupuesto (INT, FK)
- `categoria`: Categoría del presupuesto (VARCHAR)
- `monto`: Monto asignado al presupuesto (DECIMAL)
- `mes`: Mes del presupuesto (INT)
- `año`: Año del presupuesto (INT)

**Metas de Ahorro:**
- `id`: Identificador único de la meta (INT, PK, AUTO_INCREMENT)
- `usuario_id`: Referencia al usuario que creó la meta (INT, FK)
- `descripcion`: Descripción de la meta de ahorro (TEXT)
- `monto_objetivo`: Monto objetivo para la meta (DECIMAL)
- `monto_acumulado`: Monto acumulado hacia la meta (DECIMAL)
- `fecha_objetivo`: Fecha límite para alcanzar la meta (TIMESTAMP)

## Instalación y Configuración

Para desplegar FinanceMaster localmente, sigue estos pasos:

1. **Clonar el Repositorio:**

   git clone https://github.com/diegoaberrio/financemaster.git


2. **Navegar al Directorio del Proyecto:**
 
   cd financemaster
  

3. **Instalar las Dependencias:**
  
   npm install
  

4. **Configurar la Base de Datos:**
   - Configura la conexión a la base de datos en el archivo `config/database.js`.
   - Ejecuta las migraciones para crear las tablas necesarias:
     
     npm run migrate
     

5. **Iniciar el Servidor:**
   
   npm start
   ```

6. **Acceder a la Aplicación:**
   - Abre tu navegador y accede a `http://localhost:3000` para comenzar a usar FinanceMaster.

## Demo en YouTube

Para ver una demostración de FinanceMaster en acción, visita [este video en YouTube](https://www.youtube.com/watch?v=XLChbaDBNhY).

## Mi Sitio Web Personal

Puedes explorar más sobre mi trabajo y otros proyectos en mi [página web personal](https://diegoincode-dc1cd734cb90.herokuapp.com/).

## Contacto

- **Correo electrónico:** diegoaberrio@hotmail.com
- **LinkedIn:** [Diego Alonso Berrío Gómez](https://www.linkedin.com/in/diego-alonso-berrío-gómez)
- **GitHub:** [Diego Aberrio](https://github.com/diegoaberrio)

