#pragma once
#include <stdio.h>
#include <math.h>
#include <unordered_map>
#include <map>
#include <array>
#include <vector>
#include <algorithm>

#include "components.hpp"
#include "Input.hpp"
#include "Systems.hpp"
#include "WorldGen.hpp"

extern const int WIDTH, HEIGHT, DEFAULT_TILESIZE;
extern int tileSize;
extern float deltaTime;
extern Input input;
extern entt::registry registry;
extern entt::entity player;
extern Systems systems;
extern WorldGen WorldGenerator;

extern int GameState;

class View {
    public:
        View();
        float xOffset, yOffset;
        int bounds[4][2];
        float xmod, ymod;
        bool force_update{true};
        void updateView();
        void updateVisibleEntities();
};
