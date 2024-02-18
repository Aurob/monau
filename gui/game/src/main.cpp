#include <emscripten.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL_ttf.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <vector>
#include <map>
#include <SDL_thread.h>
#include <string>
#include "../includes/structs.hpp"
#include "../includes/imgui/imgui.h"
#include "../includes/imgui/imgui_impl_sdl.h"
#include "../includes/imgui/imgui_impl_sdlrenderer.h"

using namespace std;

extern int WIDTH;
extern int HEIGHT;
int WIDTH = 1024;
int HEIGHT = 768;

SDL_Surface *surface;
SDL_Texture *texture;
TTF_Font *font;
SDL_Rect rect;
context ctx;

int mouse_x = 0;
int mouse_y = 0;
bool mouse_down = false;
void mainloop(void *arg);
void SDLCALL EventHandler(void *userdata, SDL_Event *event);
void text(string text, int x, int y, int size, SDL_Color color);

int main(int argc, char *argv[])
{
    printf("Hello, world!\n");
    srand(time(NULL));

    // Initialize the Game object
    SDL_Init(SDL_INIT_VIDEO);
    TTF_Init();
    font = TTF_OpenFont("game/assets/fonts/OpenDyslexic-Regular.otf", 16);
    if (!font)
    {
        printf("TTF_OpenFont: %s\n", TTF_GetError());
        // handle error
    }

    SDL_Window *window;
    SDL_Renderer *renderer;

    SDL_CreateWindowAndRenderer(WIDTH, HEIGHT, 0, &window, &renderer);

    // Allows opacity
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
    ctx.renderer = renderer;

    // Setup Dear ImGui context
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO &io = ImGui::GetIO();
    (void)io;
    // io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;     // Enable Keyboard Controls
    // io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;      // Enable Gamepad Controls

    // Setup Dear ImGui style
    ImGui::StyleColorsDark();
    // ImGui::StyleColorsLight();

    // Setup Platform/Renderer backends
    ImGui_ImplSDL2_InitForSDLRenderer(window, renderer);
    ImGui_ImplSDLRenderer_Init(renderer);

    emscripten_set_main_loop_arg(mainloop, &ctx, -1, 1);

    ImGui_ImplSDLRenderer_Shutdown();
    ImGui_ImplSDL2_Shutdown();
    ImGui::DestroyContext();

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return EXIT_SUCCESS;
}

void mainloop(void *arg)
{

    context *ctx = static_cast<context *>(arg);
    SDL_Renderer *renderer = ctx->renderer;

    // Clear the screen
    SDL_SetRenderDrawColor(renderer, 10, 0, 0, 255);
    while (SDL_PollEvent(&ctx->event))
    {
        ImGui_ImplSDL2_ProcessEvent(&ctx->event);
        EventHandler(0, &ctx->event);
    }

    // printf("Last Draggging Position in Window: %d\n", last_dragging_position_in_window);
    // Start the Dear ImGui frame
    ImGui_ImplSDLRenderer_NewFrame();
    ImGui_ImplSDL2_NewFrame();
    ImGui::NewFrame();
    ImGui::Begin("Hello, world!");
    ImGui::End();

    ImGui::SetNextWindowPos(ImVec2(WIDTH / 2, HEIGHT / 2), ImGuiCond_FirstUseEver);
    ImGui::Begin("Item Info", NULL, SDL_WINDOW_ALWAYS_ON_TOP | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoSavedSettings);
    ImGui::Text("HELLO");

    static int selected_fish = -1;
    const char* names[] = { "Bream", "Haddock", "Mackerel", "Pollock", "Tilefish" };
    // Simple selection popup (if you want to show the current selection inside the Button itself,
    // you may want to build a string using the "###" operator to preserve a constant ID with a variable label)

    if (ImGui::BeginPopup("my_select_popup"))
    {
        // ImGui::SeparatorText("Aquarium");
        for (int i = 0; i < IM_ARRAYSIZE(names); i++)
            if (ImGui::Selectable(names[i]))
                selected_fish = i;
        ImGui::EndPopup();
    }
    ImGui::End();

    ImGui::Render();
    ImGui_ImplSDLRenderer_RenderDrawData(ImGui::GetDrawData());
    SDL_RenderPresent(renderer);
    ctx->iteration++;
}

void SDLCALL EventHandler(void *userdata, SDL_Event *event)
{
    switch (event->type)
    {
    case SDL_MOUSEBUTTONDOWN:
        mouse_down = true;
        break;

    case SDL_MOUSEBUTTONUP:
        mouse_down = false;
        break;

    case SDL_MOUSEMOTION:
        // store the mouse position
        mouse_x = event->motion.x;
        mouse_y = event->motion.y;
        break;

    case SDL_KEYUP:
        break;

    case SDL_KEYDOWN:

        // event->key.keysym.sym
        break;

    case SDL_MOUSEWHEEL:

        // event->wheel.y
        break;
    default:
        break;
    }
}
