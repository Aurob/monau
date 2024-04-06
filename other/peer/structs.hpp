#pragma once

struct context
{
    SDL_Event event;
    int iteration;
    SDL_Renderer *renderer;
};

struct player 
{
    int id;
    SDL_Point position;
    SDL_Color color;
    int width;
    int height;
};