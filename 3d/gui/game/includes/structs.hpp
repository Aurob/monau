#pragma once

#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <vector>
#include <string>

struct context
{
    SDL_Renderer *renderer;
    SDL_Event event;
    int iteration;
};

struct Texture
{
    std::string name;
    int w;
    int h;
    SDL_Texture *tex = NULL;
};

struct xy {
    int x;
    int y;
};

struct polygon {
    std::vector<xy> vertices;
    std::vector<xy> edges;
};

struct polygonAlt {
    Sint16 *vx;
    Sint16 *vy;
    int vertices;
};