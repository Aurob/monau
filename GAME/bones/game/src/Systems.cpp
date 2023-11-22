#include "../includes/Systems.hpp"

Systems::Systems() {}

void Systems::update() {
}

/*
    Remove any effect components from the entity
*/
void Systems::cleanEntity(entt::entity entity)
{
}


void Systems::updateCollisions()
{
    auto collidables = registry.view<Collidable, Position, Visible>();
    for (auto entity : collidables)
    {
        bool isPlayer = registry.all_of<Player>(entity);
        if(!isPlayer) continue;
        auto &collidable = registry.get<Collidable>(entity);
        auto position = registry.get<Position>(entity);
        bool isEquippedItem = registry.all_of<Equipped>(entity);
        bool colliding = false;
        entt::entity colliding_entity;
        std::string entity_collides;
        std::vector<entt::entity> _collidables;
        std::vector<Vector2> overlaps;
        for (auto _entity : collidables)
        {
            if (_entity != entity) // skip self
            {
                Vector2 overlap = utils.positionsCollide(entity, _entity);
                // If the entity is colliding with another entity
                if (overlap.x != 0 || overlap.y != 0)
                {
                    colliding_entity = _entity;
                    colliding = true;

                    _collidables.push_back(_entity);

                    if(!registry.all_of<Colliding>(_entity)) {
                        Colliding colliding{.colliding_with = entity};
                        registry.emplace<Colliding>(_entity, colliding);
                    }

                    overlaps.push_back(overlap);
                }
                else if(registry.all_of<Colliding>(_entity)) {
                    registry.remove<Colliding>(_entity);
                }
            }
        }

        if (colliding)
        {

            if(!registry.all_of<Colliding>(entity)) {
                Colliding colliding{colliding_entity, overlaps};
                registry.emplace<Colliding>(entity, colliding);
            }

            if(registry.all_of<Player>(entity)) {
                Position &playerPosition = registry.get<Position>(entity);
                TempPosition &tempPosition = registry.get<TempPosition>(entity);
                
                int overlapx = 0;
                int overlapy = 0;
                for(const auto overlap : overlaps) {
                    overlapx += overlap.x;
                    overlapy += overlap.y;
                }
                
                playerPosition.globalX += overlapx;
                playerPosition.globalY += overlapy;
                playerPosition.tileGX = (playerPosition.globalX / default_TILESIZE);
                playerPosition.tileGY = (playerPosition.globalY / default_TILESIZE);

                // tempPosition.temp = playerPosition;
            }
        }
        else {
            if (registry.all_of<Colliding>(entity)) {
        
                registry.remove<Colliding>(entity);
                input.collideDirection = "";
            
            }
        }
    }

    auto moveable_collidable_entities = registry.view<Moveable, Colliding, Position, Visible>();
    for (auto entity : moveable_collidable_entities) {
        printf("Moveable colliding\n");
        Position &position = registry.get<Position>(entity);
        Position player_position = registry.get<Position>(player);

        position.globalX += player_position.dx;//*4;
        position.globalY += player_position.dy;//*4;
        position.tileGX = (position.globalX / default_TILESIZE);
        position.tileGY = (position.globalY / default_TILESIZE);
    }
}