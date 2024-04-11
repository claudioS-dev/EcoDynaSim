import numpy as np
import sympy as sp

def metodo_taylor(funcion, x_inicial, y_inicial, x_final, paso):
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
    # Definir las variables simbólicas
    x, y = sp.symbols('x y')
    
    # Convertir la función dada a una expresión de SymPy
    f = sp.lambdify((x, y), funcion(x, y), 'numpy')
    
    # Calcular la derivada de f con respecto a y usando SymPy
    df_dy = sp.diff(funcion(x, y), y)
    df_dy_lambdified = sp.lambdify((x, y), df_dy, 'numpy')
    
    # Número de pasos
    n_steps = int((x_final - x_inicial) / paso)
    
    # Inicializar arrays para valores de x y y
    x_valores = np.linspace(x_inicial, x_final, n_steps + 1)
    y_valores = np.zeros(n_steps + 1)
    y_valores[0] = y_inicial
    
    # Bucle para calcular y_valores
    for i in range(n_steps):
        x_n, y_n = x_valores[i], y_valores[i]
        f_val = f(x_n, y_n)
        df_dy_val = df_dy_lambdified(x_n, y_n)
        
        # Método de Taylor de segundo orden
        y_next = y_n + paso * f_val + (paso**2 / 2) * df_dy_val * f_val
        y_valores[i + 1] = y_next
    
    return x_valores, y_valores
