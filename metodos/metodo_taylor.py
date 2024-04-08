import numpy as np
def metodo_taylor(derivada, df_dP, x_inicial, y_inicial, x_final, paso):
    """    
    Parámetros:
    - derivada: la función derivada f(x, y) de la EDO.
    - df_dP: derivada de f respecto a P (precalculada).
    - x_inicial, y_inicial: condiciones iniciales.
    - x_final: valor final de 'x'.
    - paso: tamaño de paso para la aproximación.
    
    Retorna:
    - x_valores: array de valores de 'x'.
    - y_valores: array de valores aproximados de 'y'.
    """
    # Número de pasos
    n_steps = int((x_final - x_inicial) / paso)
    
    # Inicializando arrays para valores de x y y
    x_valores = np.linspace(x_inicial, x_final, n_steps + 1)
    y_valores = np.zeros(n_steps + 1)
    y_valores[0] = y_inicial
    
    # Bucle para calcular y_valores
    for i in range(n_steps):
        x_n, y_n = x_valores[i], y_valores[i]
        f_val = derivada(x_n, y_n)
        df_dP_val = df_dP(y_n)
        
        # Método de Taylor de segundo orden
        y_next = y_n + paso * f_val + (paso**2 / 2) * df_dP_val * f_val
        y_valores[i + 1] = y_next
    
    return x_valores, y_valores