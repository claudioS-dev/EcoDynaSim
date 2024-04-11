import numpy as np
import matplotlib.pyplot as plt
from metodo_taylor import metodo_taylor

r = 0.15  # Tasa de crecimiento
K = 200  # Capacidad de carga
derivada = lambda t, P: r * P * (1 - P / K)  # Ecuación diferencial

# Valores iniciales y configuración
x_inicial = 0
y_inicial = 2
x_final = 120
paso = 0.1

# Llamada al método de Taylor de segundo orden
x_valores, y_aprox = metodo_taylor(derivada, x_inicial, y_inicial, x_final, paso)

# Graficando la solución aproximada
plt.plot(x_valores, y_aprox, 'b', label='Aproximación Método de Taylor de 2º Orden')
plt.legend()
plt.xlabel('Tiempo')
plt.ylabel('Población')
plt.title('Aproximación por el Método de Taylor de 2º Orden')
plt.grid(True)
plt.show()