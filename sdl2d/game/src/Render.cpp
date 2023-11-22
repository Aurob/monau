#include "../includes/Render.hpp"

Render::Render() : rect1{0, 0, static_cast<float>(WIDTH), static_cast<float>(HEIGHT)},
                   color{255, 0, 0, 255}
{
    SDL_CreateWindowAndRenderer(WIDTH, HEIGHT, 0, &window, &renderer);
    // Allows opacity
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
}

void Render::renderView()
{
    bool playerInside = registry.any_of<Inside>(player);
    if(playerInside) return;
    Color tile_rgb;
    FocusPoint playerFocusPoint = registry.get<FocusPoint>(player);
    Position playerPosition = registry.get<Position>(player);
    // Render each tile visible in the current view
    // //#pragma omp parallel for
    tileRect.w = tileSize;
    tileRect.h = tileSize;
    float n;
    
    //#pragma omp parallel for
    for (int x = view.bounds[0][0] - 2, ix = 0; x < view.bounds[1][0] + 2; ++x, ++ix)
    {
        for (int y = view.bounds[0][1] - 2, iy = 0; y < view.bounds[3][1] + 2; ++y, ++iy)
        {
            n = WorldGenerator.getTerrainNoiseA(x, y);
            Uint8 r, g, b;
            // Define color based on the "biome" determined by the noise value
            if (n < 0.1) {
                // Deep water
                r = 0; g = 0; b = 128 + (n * 128);
            } else if (n < 0.2) {
                // Water
                r = 0; g = 0; b = 255 + (n * 255);
            } else if (n < 0.3) {
                // Beach
                r = 240 + (n * 240); g = 230 + (n * 230); b = 140 + (n * 140);
            } else if (n < 0.5) {
                // Grassland
                r = 34 + (n * 34); g = 139 + (n * 139); b = 34 + (n * 34);
            } else if (n < 0.7) {
                // Forest
                r = 0; g = 100 + (n * 100); b = 0;
            } else if (n < 0.9) {
                // Mountain
                r = 139 + (n * 139); g = 69 + (n * 69); b = 19 + (n * 19);
            } else {
                // Snow
                r = 255; g = 250 + (n * 250); b = 250 + (n * 250);
            }
            tile_rgb = Color{r, g, b, 255};

            tileRect.x = ((x - view.bounds[0][0]) * tileSize) - view.xmod;
            tileRect.y = ((y - view.bounds[0][1]) * tileSize) - view.ymod;

            SDL_SetRenderDrawColor(renderer, tile_rgb.r, tile_rgb.g, tile_rgb.b, tile_rgb.a);
            SDL_RenderFillRectF(renderer, &tileRect);
            
            // Render the tile color based on the player cursor, their tile position, or the tile's position
            if (input.mousedown && playerFocusPoint.tile_point.x == x && playerFocusPoint.tile_point.y == y)
            {
                SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
                SDL_RenderFillRectF(renderer, &tileRect);
            }
        }
    }
    
    
}


void Render::renderEntity(entt::entity e, SDL_FRect rect1)
{
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    // Main Pass
    
    // if(registry.all_of<Colliding>(e)) {
    //     SDL_SetRenderDrawColor(renderer, 200, 0, 0, 100);
    //     SDL_RenderFillRectF(renderer, &rect1);
    // }
    // else 
    if (registry.all_of<Color>(e))
    {
        Color color = registry.get<Color>(e);
        SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 255);
    }
    
    SDL_RenderFillRectF(renderer, &rect1);
}

void Render::renderVisiblePositionEntities()
{

    // Y Sort the entities

    bool playerInside = registry.any_of<Inside>(player);
    entt::entity interior{entt::null};
    if(playerInside) {
        interior = registry.get<Inside>(player).interior;
    }

    auto rendered_entities2 = registry.view<Position, Shape, Visible>();
    
    #pragma omp parallel for
    for (const auto e : rendered_entities2)
    {

        if(!registry.any_of<Actor, Entry>(e)) continue;
        else {
            Position npcPosition = rendered_entities2.get<Position>(e);
            Shape npcShape = rendered_entities2.get<Shape>(e);
            rect1.x = npcPosition.screenX;
            rect1.y = npcPosition.screenY;
                
            rect1.w = npcShape.scaled_size.x;
            rect1.h = npcShape.scaled_size.z;

            if(registry.all_of<Entry>(e)) {
                Entry entry = registry.get<Entry>(e);
                if(entry.A != interior && entry.B != interior) continue;

                rect1.y -= npcShape.scaled_size.z;
                rect1.h += npcShape.scaled_size.z;

            }

            renderEntity(e, rect1);
        }

    }
    
    auto rendered_entities = registry.view<Position, Shape, Visible>(entt::exclude<Actor, Entry>);

    // Render the part of the entity below the shape y
    #pragma omp parallel for
    for (const auto e : rendered_entities)
    {

        Position npcPosition = rendered_entities.get<Position>(e);
        Shape npcShape = rendered_entities.get<Shape>(e);
        Color color = registry.all_of<Color>(e) ? registry.get<Color>(e) : Color{255, 255, 255, 255};

        rect1.x = npcPosition.screenX;
        rect1.y = npcPosition.screenY;
        rect1.w = npcShape.scaled_size.x;
        rect1.h = npcShape.scaled_size.z;

        // Render the main part of the building
        if(playerInside) {
            // printf("x, y, w, h: %f, %f, %f, %f\n", rect1.x, rect1.y, rect1.w, rect1.h);
            if(interior == e) {
                // SDL_SetRenderDrawColor(renderer, 255, 0, 0, 100);
                SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 100);
                SDL_RenderFillRectF(renderer, &rect1);
            }
            else continue;
        } else {
            // SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
            SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, 255);
            SDL_RenderFillRectF(renderer, &rect1);
        }

        if(registry.all_of<Interior>(e)) {
            // Render the roof of the building
            rect1.x = npcPosition.screenX;
            rect1.y = npcPosition.screenY - npcShape.scaled_size.y / 2;
            rect1.w = npcShape.scaled_size.x;
            rect1.h = npcShape.scaled_size.y / 2;

            // SDL_SetRenderDrawColor(renderer, 0, 255, 0, 255);
            SDL_SetRenderDrawColor(renderer, color.r, color.r, color.r, 255);
            SDL_RenderFillRectF(renderer, &rect1);
        }
        if(registry.all_of<Hovered>(e)) {
            SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
            SDL_RenderFillRectF(renderer, &rect1);
        }
        else if(registry.all_of<Clicked>(e)) {
            SDL_SetRenderDrawColor(renderer, 0, 255, 0, 255);
            SDL_RenderFillRectF(renderer, &rect1);
        }  
    }
}

void Render::renderCrosshair()
{

    auto foci = registry.view<FocusPoint>();

    rect1.w = 10;
    rect1.h = 10;
    tileRect.w = tileSize;
    tileRect.h = tileSize;
    for(auto e : foci){
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
        FocusPoint focusPoint = registry.get<FocusPoint>(e);
        rect1.x = focusPoint.screen_point.x;
        rect1.y = focusPoint.screen_point.y;
        SDL_RenderDrawLine(renderer, focusPoint.screen_point.x - rect1.w / 2, focusPoint.screen_point.y, focusPoint.screen_point.x + rect1.w / 2, focusPoint.screen_point.y);
        SDL_RenderDrawLine(renderer, focusPoint.screen_point.x, focusPoint.screen_point.y - rect1.h / 2, focusPoint.screen_point.x, focusPoint.screen_point.y + rect1.h / 2);
    }

    // Add dot at cente rof screen
    SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
    SDL_RenderDrawLine(renderer, WIDTH / 2 - rect1.w / 2, HEIGHT / 2, WIDTH / 2 + rect1.w / 2, HEIGHT / 2);
    SDL_RenderDrawLine(renderer, WIDTH / 2, HEIGHT / 2 - rect1.h / 2, WIDTH / 2, HEIGHT / 2 + rect1.h / 2);
    
}
