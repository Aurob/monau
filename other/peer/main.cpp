#include <emscripten.h>
#include <SDL2/SDL.h>
#include <unordered_map>
#include <unistd.h>
#include <vector>
#include "structs.hpp"
#include "JSUtils.hpp"

using namespace std;

extern int width, height;
extern float deltaTime;
extern int GameState;
extern vector<bool> cells;
extern int cellSize;
extern int cellCount;
extern int cellCountX;

int width = 500;
int height = 500;

int GameState = -1;

float deltaTime = 0;
int lastTime = 0;
int frameTime = 0;
int seed = 0;

extern vector<player> players;
vector<player> players;

void mainloop(void *arg);
void EventHandler(int, SDL_Event *);
void animations(context *ctx);
void renderPolygon(SDL_Renderer* renderer, const SDL_Color& color, float opacity, bool showOutlines, const std::vector<SDL_Point>& points);


int main(int argc, char *argv[])
{

    printf("Loading Life...\n");
    seed = time(NULL);
    srand(seed);
    printf("Seed: %d\n", seed);

    // Set the keyboard element
    SDL_SetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT, "#canvas");
    // Initialize the Game object
    SDL_Init(SDL_INIT_VIDEO);

    context ctx;
    GameState = -1;

    SDL_Renderer *renderer;
    SDL_Window *window;

    SDL_CreateWindowAndRenderer(width, height, 0, &window, &renderer);
    
    // Allows opacity
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);

    ctx.iteration = 0;
    ctx.renderer = renderer;

    // Add player
    player p{0, {0, 0}, {255, 0, 0, 255}, 10, 10};
    players.push_back(p);

    emscripten_set_main_loop_arg(mainloop, &ctx, 0, 1);
    emscripten_set_main_loop_timing(EM_TIMING_RAF, 1);

    SDL_DestroyRenderer(ctx.renderer);
    SDL_DestroyWindow(window);

    SDL_Quit();

    return EXIT_SUCCESS;
}

void mainloop(void *arg)
{

    context *ctx = static_cast<context *>(arg);
    
    while (SDL_PollEvent(&ctx->event))
    {
        EventHandler(0, &ctx->event);
    }

    if(GameState == -1) {
        GameState = 0;
        animations(ctx);
    }

    ctx->iteration++;
    
    usleep(50000);
}


unordered_map<SDL_Keycode, bool> keys;
void EventHandler(int type, SDL_Event *event)
{
    
    switch (event->type)
    {

    case SDL_KEYDOWN:
        switch (event->key.keysym.sym)
        {
        case SDLK_ESCAPE:
            break;
        }
        break;
    }

    // store key states
    if (event->type == SDL_KEYDOWN)
    {
        keys[event->key.keysym.sym] = true;
    }
    else if (event->type == SDL_KEYUP)
    {
        keys[event->key.keysym.sym] = false;
    }
    
    // CTRL + L -> Print Gamestate
    if (event->key.keysym.sym == SDLK_l && SDL_GetModState() & KMOD_CTRL)
    {
        printf("Gamestate: %d\n", GameState);
    }

    // Ctrl + Enter -> Set Gamestate to -1
    if (event->key.keysym.sym == SDLK_RETURN && SDL_GetModState() & KMOD_CTRL)
    {
        GameState = -1;
    }

    // Any Mouse Movement -> Set Gamestate to -1
    if (event->type == SDL_MOUSEMOTION)
    {
        GameState = -1;
    }

    // Mouse movement, update player position
    if (event->type == SDL_MOUSEMOTION)
    {
        players[0].position.x = event->motion.x;
        players[0].position.y = event->motion.y;
    }
}

void animations(context *ctx)
{

    SDL_SetRenderDrawColor(ctx->renderer, 255, 255, 255, 255);
    SDL_RenderClear(ctx->renderer);

    // Draw Players
    for (auto &p : players)
    {
        SDL_SetRenderDrawColor(ctx->renderer, p.color.r, p.color.g, p.color.b, p.color.a);
        SDL_Rect rect = {p.position.x, p.position.y, p.width, p.height};
        SDL_RenderFillRect(ctx->renderer, &rect);
    }

    SDL_RenderPresent(ctx->renderer);

}

void renderPolygon(SDL_Renderer* renderer, const SDL_Color& color, float opacity, bool showOutlines, const std::vector<SDL_Point>& points) {
    // Set the color for drawing
    SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, static_cast<Uint8>(opacity * 255));

    // Create an array of points for SDL_RenderDrawLines
    SDL_Point* sdlPoints = new SDL_Point[points.size() + 1];
    for (size_t i = 0; i < points.size(); ++i) {
        sdlPoints[i] = points[i];
    }
    // Close the polygon by connecting the last point to the first
    sdlPoints[points.size()] = points[0];

    // Draw the polygon
    SDL_RenderDrawLines(renderer, sdlPoints, points.size() + 1);

    // Clean up the points array
    delete[] sdlPoints;

    if (showOutlines) {
        // Draw outlines if requested
        // Note: Implement outline drawing if needed
    }
}
