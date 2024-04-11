from metodos.metodo_euler import metodo_euler_mejorado
from simulacion.simulacion_conejos import SimulacionConRabbits
from metodos.metodo_taylor import metodo_taylor

r = 0.15  # Tasa de crecimiento
K = 200  # Capacidad de carga
derivada = lambda t, P: r * P * (1 - P / K)  # Ecuación diferencial

# Configuración inicial
x_inicial, y_inicial, x_final, paso = 0, 1, 120, 0.1

# Comentar según el método a utilizar para la simulación:
#x_valores, y_aprox = metodo_euler_mejorado(derivada, x_inicial, y_inicial, x_final, paso)
x_valores, y_aprox = metodo_taylor(derivada, x_inicial, y_inicial, x_final, paso)

#Datos para la simulación
rabbits_time = []  
quantity_rabbits = []  

#Extracción de datos
x_and_y_values = dict(zip(x_valores, y_aprox))
for i in range(61):
    rabbits_time.append(i)
    quantity_rabbits.append(round(x_and_y_values[i]))

# Iniciar simulación
simulacion = SimulacionConRabbits()
simulacion.run(rabbits_time, quantity_rabbits)
