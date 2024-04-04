import numpy as np
import matplotlib.pyplot as plt

# Función que representa la ecuación diferencial de primer orden f(x, y)
def derivada(x, y):
    return 2

# Valores iniciales y configuración
x_inicial = 0    # Valor inicial de 'x'
y_inicial = 1    # Valor inicial de 'y'
x_final = 20     # Valor final de 'x'
paso = 0.1       # Tamaño de paso

# Calcula la cantidad de pasos a partir del intervalo y el tamaño de paso
num_pasos = int((x_final - x_inicial) / paso) + 1

# Generan los puntos 'x' para la aproximación
x_valores = np.linspace(x_inicial, x_final, num_pasos)

# Inicializa la lista para almacenar los valores aproximados de 'y'
y_aprox = [y_inicial]

# Aplicando el método de Euler para aproximar la solución
for i in range(num_pasos - 1):
    derivada_actual = derivada(x_valores[i], y_aprox[i])
    siguiente_y = y_aprox[i] + derivada_actual * paso
    y_aprox.append(siguiente_y)

# Grafica la solución aproximada
plt.plot(x_valores, y_aprox, 'r', label='Aproximación Método de Euler')
plt.legend()
plt.xlabel('x')
plt.ylabel('y')
plt.title('Aproximación por el Método de Euler')
plt.show()

# Imprime los valores aproximados
for x, y in zip(x_valores, y_aprox):
    print(f"x = {round(x,2)}, y ≈ {round(y,2)}")
