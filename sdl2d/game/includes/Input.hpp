#pragma once
#include <SDL_scancode.h>
#include <SDL_timer.h>
#include <SDL2/SDL.h>
#include "entt.hpp"
#include "components.hpp"
#include "string"
#include <map>
#include <stdio.h>
#include <chrono>

extern float deltaTime;
extern const int WIDTH, HEIGHT, DEFAULT_TILESIZE;
extern const int MINTSIZE, MAXTSIZE;
extern int tileSize;
extern float deltaTime;
extern entt::registry registry;
extern entt::entity player;

class Input {
    public:
        Input();
        int mouse[2];
        bool mousedown;
        bool leftclick;
        bool rightclick;
        bool middleclick;
        bool resetPosition;
        bool ismobile;
        bool isMoving;
        bool slowmo;
        bool deltaScaling{true};
        bool zoomIn, zoomOut;
        float speedMod;
        int clickTime;
        int zoomWait;
        std::map<SDL_Scancode, bool> keyStates;
        std::map<SDL_Scancode, std::chrono::milliseconds::rep> keyStateTimes;

        void update();
        void SDLCALL EventHandler(void*, SDL_Event*);
        void SDLCALL TouchHandler(void*, SDL_TouchFingerEvent*);

};

