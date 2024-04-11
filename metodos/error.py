import numpy as np
import matplotlib.pyplot as plt
from metodo_taylor import metodo_taylor
from metodo_euler import metodo_euler_mejorado

r = 0.15  # Tasa de crecimiento
K = 200  # Capacidad de carga

modelo_logistico = lambda t, P_0: K / (1 + ((K - P_0) / P_0) * np.exp(-r * t)) # Función integrada por métodos tradicionales.
derivada = lambda t, P: r * P * (1 - P / K)  # Ecuación diferencial

# Parámetros para la solución
x_inicial = 0
y_inicial = 2
x_final = 120
paso = 0.1

x_valores_taylor, y_aprox_taylor = metodo_taylor(derivada, x_inicial, y_inicial, x_final, paso)
x_valores_euler, y_aprox_euler = metodo_euler_mejorado(derivada, x_inicial, y_inicial, x_final, paso)

x_valores_exactos = np.arange(x_inicial, x_final + paso, paso)
y_exactos = np.array([modelo_logistico(x, y_inicial) for x in x_valores_exactos])


# Cálculo de errores absolutos
error_abs_taylor = np.abs(y_exactos - y_aprox_taylor)
error_abs_euler = np.abs(y_exactos - y_aprox_euler)

error_medio_abs_taylor = np.mean(error_abs_taylor)
error_medio_abs_euler = np.mean(error_abs_euler)

# Gráfica de las tres curvas
plt.figure(figsize=(12, 8))
plt.plot(x_valores_exactos, y_exactos, label="Modelo Logístico", color="black", linestyle="--")
plt.plot(x_valores_taylor, y_aprox_taylor, label=f"Aprox. Taylor (Error medio: {error_medio_abs_taylor})", color="blue", linestyle="-")
plt.plot(x_valores_euler, y_aprox_euler, label=f"Aprox. Euler Mejorado (Error medio: {error_medio_abs_euler})", color="red", linestyle=":")
plt.title("Comparación de Métodos de Aproximación con Errores Medios Absolutos")
plt.xlabel("Tiempo")
plt.ylabel("Población")
plt.legend()
plt.grid(True)

plt.show()
print(error_medio_abs_euler > error_medio_abs_taylor)