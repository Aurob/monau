#pragma once
#include <emscripten.h>
#include "json.hpp"
#include <map>
#include <vector>
#include <functional>
#include <iostream>
#include <sstream>
#include "structs.hpp"

using namespace std;

extern int width, height;
extern int GameState;
extern std::vector<bool> cells;
extern int cellSize;
extern int cellCount;
extern int cellCountX;

extern vector<player> players;

void _js__kvdata_i(int k, int v)
{
    // Send an integer to JS
    EM_ASM_({
        Module.setkv($0, $1);
    }, k, v);
}

void _js__kvdata_f(int k, float v)
{
    // Send a float to JS
    EM_ASM_({
        Module.setkv($0, $1);
    }, k, v);
}


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

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void load_json(char *str)
    {
        nlohmann::json js_json = str_to_json(str);
        printf("js_json: %s\n", js_json.dump().c_str());

        // If "peer" is in the JSON, then it's a peer message
        if (js_json.find("peer") != js_json.end())
        {
            printf("peer: %s\n", js_json["peer"].dump().c_str());
            // If "peer" is "join", then it's a join message
            if (js_json["peer"] == "join")
            {

                printf("Addding peer\n");
                // Add the player to the players vector
                player p;
                p.id = js_json["id"];
                p.position.x = js_json["x"];
                p.position.y = js_json["y"];
                p.color.r = js_json["r"];
                p.color.g = js_json["g"];
                p.color.b = js_json["b"];
                p.color.a = js_json["a"];
                p.width = js_json["width"];
                p.height = js_json["height"];
                players.push_back(p);
            }
            // If "peer" is "leave", then it's a leave message
            else if (js_json["peer"] == "leave")
            {
                printf("Removing peer\n");
                // Remove the player from the players vector
                int id = js_json["id"];
                for (int i = 0; i < players.size(); i++)
                {
                    if (players[i].id == id)
                    {
                        players.erase(players.begin() + i);
                        break;
                    }
                }
            }
            // If "peer" is "update", then it's an update message
            else if (js_json["peer"] == "update")
            {
                // Update the player in the players vector
                int id = js_json["id"];
                for (int i = 0; i < players.size(); i++)
                {
                    if (players[i].id == id)
                    {
                        players[i].position.x = js_json["x"];
                        players[i].position.y = js_json["y"];
                        players[i].color.r = js_json["r"];
                        players[i].color.g = js_json["g"];
                        players[i].color.b = js_json["b"];
                        players[i].color.a = js_json["a"];
                        players[i].width = js_json["width"];
                        players[i].height = js_json["height"];
                        break;
                    }
                }
            }
        }
        
    }
}
