import numpy as np
import matplotlib.pyplot as plt
from metodo_euler import metodo_euler_mejorado  # Importa la función del archivo separado

# Definir la derivada dP/dt
r = 0.15  # Tasa de crecimiento
K = 200  # Capacidad de carga
dP_dt = lambda t, P: r*P * (1 - P /K)  

# Valores iniciales y configuración
x_inicial = 0    # Valor inicial de 'x'
y_inicial = 2    # Valor inicial de 'y'
x_final = 120    # Valor final de 'x'
paso = 0.1       # Tamaño de paso

# Utiliza la función importada para calcular la solución aproximada
x_valores, y_aprox = metodo_euler_mejorado(dP_dt, x_inicial, y_inicial, x_final, paso)

# Grafica la solución aproximada
plt.plot(x_valores, y_aprox, 'r', label='Aproximación Método de Euler Mejorado')
plt.legend()
plt.xlabel('Tiempo')
plt.ylabel('Población')
plt.title('Aproximación por el Método de Euler Mejorado')
plt.grid(True)  # Activa la cuadrícula
plt.show()


