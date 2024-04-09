import pygame
import random
import sys

class SimulacionConRabbits:
    def __init__(self):
        pygame.init()
        self.screen_width, self.screen_height = 1024, 768
        self.bg_color = (255, 255, 255)
        self.font_color = (0, 0, 0)
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption('Simulación de Conejos')
        self.font = pygame.font.SysFont(None, 24)
        self.background_image = self.cargar_imagen('img/background.png', self.screen_width, self.screen_height)
        self.rabbit_image = self.cargar_imagen('img/evee.png', 60, 60)
        self.shiny_rabbit_image = self.cargar_imagen('img/eveeShiny.png', 60, 60)
        self.rabbit_margin = 10  # Margen para evitar que los conejos aparezcan en el borde
        self.rabbits = []
        self.clock = pygame.time.Clock()
        self.running = True

    def cargar_imagen(self, path, width, height):
        image = pygame.image.load(path)
        return pygame.transform.scale(image, (width, height))

    def add_rabbits(self, quantity):
        for _ in range(quantity):
            # Asegura que los conejos se generen dentro del margen establecido
            x = random.randrange(self.rabbit_margin, self.screen_width - self.rabbit_margin - 60)  # 60 es el ancho del conejo
            y = random.randrange(self.rabbit_margin, self.screen_height - self.rabbit_margin - 60)  # 60 es el alto del conejo
            image = self.shiny_rabbit_image if random.random() < 0.1 else self.rabbit_image
            self.rabbits.append((image.get_rect(topleft=(x, y)), image))
    def move_rabbits(self):
        for rabbit_rect, _ in self.rabbits:
            # Mueve el conejo dentro de los límites de la pantalla, considerando el margen
            rabbit_rect.x += random.randint(-1, 1)
            rabbit_rect.y += random.randint(-1, 1)
            rabbit_rect.x = max(self.rabbit_margin, min(self.screen_width - self.rabbit_margin - 60, rabbit_rect.x))
            rabbit_rect.y = max(self.rabbit_margin, min(self.screen_height - self.rabbit_margin - 60, rabbit_rect.y))

    def display_text(self, text, x, y):
        text_surface = self.font.render(text, True, self.font_color)
        self.screen.blit(text_surface, (x, y))

    def run(self, rabbits_time, quantity_rabbits):
        start_ticks = pygame.time.get_ticks()
        index = 0
        
        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
            
            seconds = (pygame.time.get_ticks() - start_ticks) / 1000
            if index < len(rabbits_time) and seconds >= rabbits_time[index]:
                self.add_rabbits(quantity_rabbits[index] - len(self.rabbits))
                index += 1
            
            self.screen.fill(self.bg_color)
            self.screen.blit(self.background_image, (0, 0))
            self.move_rabbits()
            for rabbit_rect, rabbit_image in self.rabbits:
                self.screen.blit(rabbit_image, rabbit_rect)
            
            self.display_text(f"Tiempo: {int(seconds)} m", 10, 10)
            self.display_text(f"Conejos: {len(self.rabbits)}", 10, 30)
            pygame.display.flip()
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()
