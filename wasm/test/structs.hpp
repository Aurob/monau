#pragma once
#include <string>
#include <vector>

using namespace std;

struct Vector2 {
    int x,y;
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
        tileGX = globalX / 16;
    }
    void setPosY(float y) {
        globalY = y;
        tileGY = globalY / 16;
    }
    void setPosZ(float z) {
        globalZ = z;
    }
};

struct TempPosition {
    Position temp;
    bool resetPosition;
};

struct Shape {
    Vector3f size{10, 10, 10};
    Vector3f size_tiles;
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
    float global_point;
    float tile_point;
    float screen_point;
    bool interacting;
};

struct Player {};

struct Item {
    float size;
};

struct Color {
    int r;
    int g;
    int b;
    int a{255};
};

struct Colliding{
    bool colliding_with;
    vector<Vector2f> overlaps;
};
struct Collidable {
    Vector2f hitbox;
    bool colliding;
    vector<bool> colliding_with;
};

struct Interior {
    bool enter_on_collision;
    bool enter_on_interact;
};

struct Inside {
    bool interior;
};

struct Entry {
    bool A;
    bool B;
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

struct TestComponent {
    int test1;
    bool test2{true};
    std::string test3{"test3"};
};