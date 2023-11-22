#pragma once
#include <array>
#include <vector>
#include <string>
#include <SDL2/SDL2_gfxPrimitives.h>
#include "entt.hpp"

extern const int DEFAULT_TILESIZE;

struct Vector2 {
    int x, y;
};

struct Vector2f {
    float x, y;
};

struct Vector3f {
    float x, y, z;
};

struct Visible {
};

//
struct GeneralInfo {
    std::string name;
    std::string description;
    std::string id;
    bool uiOpen;
};

struct Position {
    float globalX, globalY, globalZ;
    int tileGX, tileGY;
    int screenX, screenY;
    int dx, dy;

    void setPosX(float x) {
        globalX = x;
        tileGX = globalX / DEFAULT_TILESIZE;
    }
    void setPosY(float y) {
        globalY = y;
        tileGY = globalY / DEFAULT_TILESIZE;
    }
};

struct TempPosition {
    Position temp;
    bool resetPosition;
};

struct Shape {
    Vector3f size{10, 10, 10};
    Vector3f scaled_size;
};

struct Movement {
    float speed{100};
    float max_speed{110};
    Vector2f velocity{0, 0};
    Vector2f acceleration{0, 0};
    float friction{1};
    float mass{1};
};

struct Moveable {};

struct Actor {
};

struct FocusPoint {
    SDL_Point global_point;
    SDL_Point tile_point;
    SDL_Point screen_point;
    bool interacting;
};

struct Player {};

struct Item {
    float size;
};

struct Color {
    Uint8 r{static_cast<Uint8>(rand() % 255)};
    Uint8 g{static_cast<Uint8>(rand() % 255)};
    Uint8 b{static_cast<Uint8>(rand() % 255)};
    Uint8 a{255};
};

struct Colliding{
    entt::entity colliding_with;
    std::vector<Vector2f> overlaps;
};
struct Collidable {
    Vector2f hitbox;
    bool colliding;
    std::vector<entt::entity> colliding_with;
};

struct Interior {
    bool enter_on_collision;
    bool enter_on_interact;
};

struct Inside {
    entt::entity interior{entt::null};
};

struct Entry {
    entt::entity A;
    entt::entity B;
};

// 
struct ConveyerBelt {
    Vector2f direction;
    float speed;
    bool active;
};

struct Clickable {};
struct Hoverable {};
struct Clicked {};
struct Hovered {};
struct Submerged {};