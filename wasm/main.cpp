#include <emscripten.h>
#include <SDL2/SDL.h>

using namespace std;

extern const int WIDTH, HEIGHT;
extern float deltaTime;

const int WIDTH = 1024;
const int HEIGHT = 1024;

int GameState = 0;

float deltaTime = 0;
int lastTime = 0;
int frameTime = 0;

SDL_FRect rect{(WIDTH/2) - 12, (HEIGHT/2) - 12, 25, 25};

struct context
{
    SDL_Event event;
    int iteration;
    SDL_Renderer *renderer;
};

void mainloop(void *arg);
void EventHandler(int, SDL_Event *);
void animations(context *ctx);

int main(int argc, char *argv[])
{

    printf("Loading Life...\n");
    seed = time(NULL);

    // Initialize the Game object
    SDL_Init(SDL_INIT_VIDEO);

    context ctx;
    GameState = -1;

    SDL_Renderer *renderer;
    SDL_Window *window;

    SDL_CreateWindowAndRenderer(WIDTH, HEIGHT, 0, &window, &renderer);
    
    // Allows opacity
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);

    ctx.iteration = 0;
    ctx.renderer = renderer;

    // SDL_SetRenderDrawColor(renderer, 100, 100, 100, 255);
    // SDL_RenderClear(renderer);

    emscripten_set_main_loop_arg(mainloop, &ctx, 0, 1);
    emscripten_set_main_loop_timing(EM_TIMING_RAF, 1);

    SDL_DestroyRenderer(ctx.renderer);
    SDL_DestroyWindow(window);

    SDL_Quit();

    return EXIT_SUCCESS;
}

void mainloop(void *arg)
{

    frameTime = SDL_GetTicks();
    deltaTime = static_cast<float>(frameTime - lastTime) / 500.0f;
    lastTime = frameTime;
    context *ctx = static_cast<context *>(arg);
    
    while (SDL_PollEvent(&ctx->event))
    {
        EventHandler(0, &ctx->event);
    }

    animations(ctx);

    ctx->iteration++;
}

void EventHandler(int type, SDL_Event *event)
{
    switch (event->type)
    {
    case SDL_QUIT:
        GameState = 1;
        break;
    case SDL_KEYDOWN:
        switch (event->key.keysym.sym)
        {
        case SDLK_ESCAPE:
            SDL_Event quit_event;
            quit_event.type = SDL_QUIT;
            SDL_PushEvent(&quit_event);
            break;
        }
        break;
    }
    // CTRL + L -> Print Gamestate
    if (event->key.keysym.sym == SDLK_l && SDL_GetModState() & KMOD_CTRL)
    {
        printf("Gamestate: %d\n", GameState);
    }
}

void animations(context *ctx)
{
    

    SDL_SetRenderDrawColor(ctx->renderer, 255, 255, 255, 255);
    SDL_RenderFillRectF(ctx->renderer, &rect);
    SDL_RenderPresent(ctx->renderer);

    rect.x = sin(ctx->iteration * 0.01) * 100 + (WIDTH/2) - 12;
    rect.y = cos(ctx->iteration * 0.01) * 100 + (HEIGHT/2) - 12;

}
