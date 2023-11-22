#include <emscripten.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <map>
#include <functional>
#include "../includes/entt.hpp"
#include "../includes/components.hpp"
#include "../includes/View.hpp"
#include "../includes/Input.hpp"
#include "../includes/Render.hpp"
#include "../includes/Factories.hpp"
#include "../includes/Systems.hpp"
#include "../includes/Utils.hpp"
#include "../includes/JSUtils.hpp"
#include "../includes/WorldGen.hpp"

using namespace std;

extern const int WIDTH, HEIGHT, DEFAULT_TILESIZE;
extern int tileSize;
extern float deltaTime;
extern entt::registry registry;

const int WIDTH = 1024;
const int HEIGHT = 1024;
int tileSize = 32;
const int MINTSIZE = 2;
const int MAXTSIZE = 1024;
const int DEFAULT_TILESIZE = tileSize;
entt::registry registry;
entt::entity player;
entt::entity world;
extern View view;
extern Input input;
extern Systems systems;
extern Utils utils;
extern WorldGen WorldGenerator;

extern int GameState;
// -1 = loading
// 0 = main menu
// 1 = game
// 2 = pause menu
// 3 = game over
// 4 = restarting
int GameState = 0;

Render renderer;
View view;
Input input;
Factories factories;
Systems systems;
Utils utils;
WorldGen WorldGenerator;

float deltaTime = 0;
int lastTime = 0;
int frameTime = 0;
int seed = 0;

struct context
{
    SDL_Event event;
    int iteration;
};

SDL_Rect tex_rect;
SDL_Rect screen_rect;


void mainloop(void *arg);

int main(int argc, char *argv[])
{

    printf("Loading Barebones engine\n");
    seed = time(NULL);

    // Initialize the Game object
    SDL_Init(SDL_INIT_VIDEO);

    context ctx;
    GameState = -1;

    // Load Entities
    factories.buildWorld();
    

    emscripten_set_main_loop_arg(mainloop, &ctx, 0, 1);
    emscripten_set_main_loop_timing(EM_TIMING_RAF, 1);

    SDL_DestroyRenderer(renderer.renderer);
    SDL_DestroyWindow(renderer.window);

    IMG_Quit();
    SDL_Quit();

    return EXIT_SUCCESS;
}

void mainloop(void *arg)
{

    frameTime = SDL_GetTicks();
    deltaTime = static_cast<float>(frameTime - lastTime) / 1000.0f;
    lastTime = frameTime;
    context *ctx = static_cast<context *>(arg);
    
    SDL_SetRenderDrawColor(renderer.renderer, 0, 0, 0, 255);
    SDL_RenderClear(renderer.renderer);

    while (SDL_PollEvent(&ctx->event))
    {
        input.EventHandler(0, &ctx->event);
    }

    input.update();
    

    systems.updateMovement();
    systems.updateCollisions();
    
    view.updateView();
    view.updateVisibleEntities();

    
    FocusPoint &playerFocusPoint = registry.get<FocusPoint>(player);
    playerFocusPoint.tile_point.x = ((playerFocusPoint.screen_point.x + view.xOffset) / tileSize + view.bounds[0][0]);
    playerFocusPoint.tile_point.y = ((playerFocusPoint.screen_point.y + view.yOffset) / tileSize + view.bounds[0][1]);


    auto visible_clickable = registry.view<Position, Shape, Visible>(entt::exclude<Player>);
    for (auto entity : visible_clickable)
    {
        auto &position = visible_clickable.get<Position>(entity);
        auto &shape = visible_clickable.get<Shape>(entity);
        // printf("Checking entity %d\n", entity);

        // If Hoverable or Clickable
        if (registry.all_of<Hoverable>(entity) || registry.all_of<Clickable>(entity)) {
            if (utils.pointInRect(playerFocusPoint.screen_point, position.screenX, position.screenY, shape.scaled_size.x, shape.scaled_size.z))
            {
                if (registry.all_of<Clickable>(entity) && (input.leftclick || input.rightclick)) 
                {
                    registry.emplace_or_replace<Clicked>(entity);
                    
                }

                if (registry.all_of<Hoverable>(entity))
                {
                    registry.emplace_or_replace<Hovered>(entity);
                }
            }
            else {
                if (registry.all_of<Hovered>(entity))
                {
                    registry.remove<Hovered>(entity);
                }
                if (registry.all_of<Clicked>(entity))
                {
                    registry.remove<Clicked>(entity);
                }
            }
        }
    }

    // // Mobile movement
    // if (input.rightclick || input.ismobile && input.leftclick)
    // {
    //     // simulate keypresses to move the player to the mouse click
    //     if(playerFocusPoint.tile_point.x != playerPosition.tileGX || playerFocusPoint.tile_point.y != playerPosition.tileGY)
    //     {
    //         if(playerFocusPoint.tile_point.x > playerPosition.tileGX)
    //         {
    //             input.keyStates[SDL_SCANCODE_D] = true;
    //         }
    //         if(playerFocusPoint.tile_point.x < playerPosition.tileGX)
    //         {
    //             input.keyStates[SDL_SCANCODE_A] = true;
    //         }
    //         if(playerFocusPoint.tile_point.y > playerPosition.tileGY)
    //         {
    //             input.keyStates[SDL_SCANCODE_S] = true;
    //         }
    //         if(playerFocusPoint.tile_point.y < playerPosition.tileGY)
    //         {
    //             input.keyStates[SDL_SCANCODE_W] = true;
    //         }
    //     }
    // }

    renderer.renderView();
    renderer.renderVisiblePositionEntities();
    renderer.renderCrosshair();
    
    SDL_RenderPresent(renderer.renderer);

    // Update the JS UI
    auto playerPosition = registry.get<Position>(player);
    // _js__kvdata_f(1, roundf(playerPosition.globalX * 100) / 100);
    // _js__kvdata_f(2, roundf(playerPosition.globalY * 100) / 100);
    // _js__kvdata_i(3, playerPosition.tileGX);
    // _js__kvdata_i(4, playerPosition.tileGY);
    // _js__reui();

    input.ismobile = _js__ismobile();
    // if(input.slowmo) 
    // SDL_Delay(200);

    ctx->iteration++;
}
