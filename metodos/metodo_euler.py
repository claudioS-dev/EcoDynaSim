import numpy as np
def metodo_euler_mejorado(func, x_inicial, y_inicial, x_final, paso):
    """    
    Parámetros:
    - func: la función derivada f(x, y).
    - x_inicial: el valor inicial de x.
    - y_inicial: el valor inicial de y.
    - x_final: el valor final de x.
    - paso: el tamaño del paso para la integración.
    
    Retorna:
    - x_valores: un array de los valores de x.
    - y_aprox: un array de los valores aproximados de y.
    """
    num_pasos = int((x_final - x_inicial) / paso) + 1
    x_valores = np.linspace(x_inicial, x_final, num_pasos)
    y_aprox = [y_inicial]
    
    for i in range(num_pasos - 1):
        derivada_actual = func(x_valores[i], y_aprox[i])
        y_predicho = y_aprox[i] + derivada_actual * paso
        derivada_final = func(x_valores[i] + paso, y_predicho)
        derivada_promedio = (derivada_actual + derivada_final) / 2
        siguiente_y = y_aprox[i] + derivada_promedio * paso
        y_aprox.append(siguiente_y)
    
    return x_valores, y_aprox