#pragma once
#include <emscripten.h>
#include "../includes/json.hpp"
#include "../includes/components.hpp"
#include "../includes/entt.hpp"
#include <map>
#include <functional>
#include <iostream>
#include <sstream>

extern entt::registry registry;
extern entt::entity player;
extern int tileSize;

void _js__kvdata(int k, int v)
{
    // Send an integer to JS
    EM_ASM_({
        Module.setkv($0, $1);
    },
            k, v);
}

void _js__kvdata_i(int k, int v)
{
    // Send an integer to JS
    EM_ASM_({
        Module.setkv($0, $1);
    },
            k, v);
}

void _js__kvdata_f(int k, float v)
{
    // Send a float to JS
    EM_ASM_({
        Module.setkv($0, $1);
    },
            k, v);
}

void _js__reui()
{
    // Refresh the UI
    EM_ASM({
        Module.reui();
    });
}

void _js__refresh()
{
    // Refresh the UI
    EM_ASM({
        Module.refresh();
    });
}

bool _js__ismobile()
{
    // Check if the device is mobile
    return EM_ASM_INT({
        return Module.ismobile();
    });
}

void _js__ws_emit(std::string msg)
{
    EM_ASM_({
        var msg = UTF8ToString($0);
        Module.ws_emit(msg);
    },
            msg.c_str());
}

std::vector<std::string> COMPONENTS = {
    "Visible",
    "GeneralInfo",
    "Position",
    "TempPosition",
    "Shape",
    "Movement",
    "Moveable",
    "Actor",
    "FocusPoint",
    "Player",
    "Item",
    "Color",
    "Colliding",
    "Collidable",
    "Interior",
    "Inside",
    "Entry",
    "ConveyerBelt",
    "Clickable",
    "Hoverable",
    "Clicked",
    "Hovered"};

std::vector<std::string> COMMANDS = {
    "Teleport",
    "TestEntity",
    "TestWS",
    "TestWS_alt"};

nlohmann::json str_to_json(std::string str)
{
    nlohmann::json js_json;
    try
    {
        std::string trimmed_str = str;
        js_json = nlohmann::json::parse(trimmed_str);
    }
    catch (nlohmann::json::parse_error &e)
    {
        printf("JSON parse error: %s\n", e.what());
        printf("str: %s\n", str.c_str());
    }
    return js_json;
}

void process_component(std::string key, nlohmann::json value, entt::entity entity);

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void js_test(char *str)
    {
        nlohmann::json js_json = str_to_json(str);
        if (js_json.contains("Entities") && js_json["Entities"].is_array())
        {
            for (auto &_el : js_json["Entities"])
            {
                entt::entity entity;
                if (_el.is_object())
                {

                    int repeat = 0;
                    // Check if the Repeat key is present
                    if (_el.contains("Repeat") && _el["Repeat"].is_number())
                    {
                        repeat = _el["Repeat"];
                        
                    }

                    bool is_player = false;
                    // Check if the Player key is present
                    if (_el.contains("Player") && _el["Player"].is_boolean())
                    {
                        is_player = _el["Player"];
                    
                        auto playerView = registry.view<Player>();
                        for (auto playerEntity : playerView)
                        {
                            entity = playerEntity;
                        }
                    }

                    for (int i = repeat; i >= 0; i--)
                    {
                        
                        if(!is_player)
                            entity = registry.create();

                        for (auto &__el : _el.items())
                        {
                            process_component(__el.key(), __el.value(), entity);
                        }
                    }
                }
            }
        }
    }
}

void process_component(std::string key, nlohmann::json value, entt::entity entity)
{
    if (key == "Position")
    {
        registry.emplace_or_replace<Position>(entity);
    }
    else if (key == "Shape")
    {
        registry.emplace_or_replace<Shape>(entity);
    }
    else if (key == "Color")
    {
        registry.emplace_or_replace<Color>(entity);
    }
    else if (key == "Clickable")
    {
        registry.emplace_or_replace<Clickable>(entity);
    }
    else if (key == "Hoverable")
    {
        registry.emplace_or_replace<Hoverable>(entity);
    }
    else if (key == "Collidable")
    {
        registry.emplace_or_replace<Collidable>(entity);
    }
    else if (key == "Interior")
    {
        registry.emplace_or_replace<Interior>(entity);
    }
    else if (key == "Entry")
    {
        registry.emplace_or_replace<Entry>(entity);
    }
    else if (key == "ConveyerBelt")
    {
        registry.emplace_or_replace<ConveyerBelt>(entity);
    }
    else if (key == "GeneralInfo")
    {
        registry.emplace_or_replace<GeneralInfo>(entity);
    }
    else if (key == "Actor")
    {
        registry.emplace_or_replace<Actor>(entity);
    }
    else if (key == "Player")
    {
        registry.emplace_or_replace<Player>(entity);
    }
    else if (key == "Item")
    {
        registry.emplace_or_replace<Item>(entity);
    }
    else if (key == "Moveable")
    {
        registry.emplace_or_replace<Moveable>(entity);
    }
    else if (key == "Movement")
    {
        registry.emplace_or_replace<Movement>(entity);
    }

    if (value.is_object())
    {
        for (auto &___el : value.items())
        {
            std::string _key = ___el.key();
            nlohmann::json _value = ___el.value();

            if (_value != "null")
            {
                // Position
                if (key == "Position" && registry.all_of<Position>(entity))
                {
                    Position &p = registry.get<Position>(entity);

                    if (_key == "globalX") // "globalX
                    {
                        p.setPosX(_value.get<float>());
                    }
                    if (_key == "globalY") // "globalY
                    {
                        p.setPosY(_value.get<float>());
                    }
                }

                // Shape
                if (key == "Shape" && registry.all_of<Shape>(entity))
                {
                    Shape &s = registry.get<Shape>(entity);

                    if (_key == "sizeX") // "sizeX
                    {
                        s.size.x = _value.get<float>();
                    }
                    if (_key == "sizeZ") // "sizeZ
                    {
                        s.size.z = _value.get<float>();
                    }
                }

                // Movement
                if (key == "Movement" && registry.all_of<Movement>(entity))
                {
                    Movement &m = registry.get<Movement>(entity);

                    if (_key == "speed") // "speed
                    {
                        m.speed = _value.get<float>();
                    }
                    // max_speed
                    if (_key == "max_speed") // "max_speed
                    {
                        m.max_speed = _value.get<float>();
                    }
                    // friction
                    if (_key == "friction") // "friction
                    {
                        m.friction = _value.get<float>();
                    }
                    // mass
                    if (_key == "mass") // "mass
                    {
                        m.mass = _value.get<float>();
                    }

                }
            }
        }
    }
}

// extern "C"
// {
//     void js_test(std::string str)
//     {

//         //     if (std::find(COMMANDS.begin(), COMMANDS.end(), key) != COMMANDS.end())
//         //     {
//         //         printf("Valid command: %s\n", key.c_str());
//         //         if (key == "Teleport")
//         //         {
//         //             printf("Teleport tbd\n");
//         //             // if the value is a json and x or y is in it, use that
//         //             // otherwise, just let Position default
//         //             Position &p = registry.get<Position>(player);
//         //             if (value != "null")
//         //             {
//         //                 nlohmann::json pos_json = str_to_json(value);
//         //                 if (pos_json.contains("x"))
//         //                 {
//         //                     p.globalX = pos_json["x"];
//         //                     p.tileGX = p.globalX / tileSize;
//         //                 }
//         //                 if (pos_json.contains("y"))
//         //                 {
//         //                     p.globalY = pos_json["y"];
//         //                     p.tileGY = p.globalY / tileSize;
//         //                 }
//         //             }
//         //         }
//         //         else if (key == "Entities") {

//         //         }
//         //     }
//         //     else
//         //     {
//         //         printf("Invalid key: %s\n", key.c_str());
//         //     }
//         // }
//         nlohmann::json js_json = str_to_json(str);
//
//     }
// }
