#include "../includes/Systems.hpp"

Systems::Systems() {}

void Systems::updateCollisions()
{
    // First sort so that the player is checked first
    // registry.sort<Collidable>([&](const entt::entity lhs, const entt::entity rhs) {
    //     return registry.all_of<Player>(lhs) && !registry.all_of<Player>(rhs);
    // });

    std::vector<std::pair<entt::entity, entt::entity>> collisions;

    auto collidables = registry.view<Collidable, Position, Visible>();
    #pragma omp parallel for
    for (auto entity : collidables)
    {
        bool isPlayer = registry.all_of<Player>(entity);
        if (!registry.all_of<Movement>(entity))
            continue;

        bool colliding = false;
        std::vector<entt::entity> _collidables;
        std::vector<Vector2f> overlaps;

        #pragma omp parallel for
        for (auto _entity : collidables)
        {
            if (_entity == entity) continue; // skip self

            Vector2f overlap = utils.positionsCollide(entity, _entity);
            // If the entity is colliding with another entity
            if (overlap.x != 0 || overlap.y != 0)
            {
                colliding = true;

                _collidables.push_back(_entity);

                overlaps.push_back(overlap);

                // break;
            }
            // else if (registry.all_of<Colliding>(_entity))
            // {
            //     registry.remove<Colliding>(_entity);
            // }
        }

        if (colliding)
        {

            Position &entityPosition = registry.get<Position>(entity);
            Shape &entityShape = registry.get<Shape>(entity);
            bool isInside = registry.all_of<Inside>(entity);
            Movement &entityMovement = registry.get<Movement>(entity);

            float overlapx = 0;
            float overlapy = 0;
            bool skipCollide = false;
            bool movementCollide = false;
            float m1 = entityMovement.mass;
            float xv1 = entityMovement.velocity.x;
            float yv1 = entityMovement.velocity.y;

            #pragma omp parallel for
            for (auto _entity : _collidables)
            {
                if (!registry.all_of<Colliding>(entity))
                {
                    registry.emplace<Colliding>(entity);
                }

                if (isPlayer)
                {
                    if (registry.all_of<Entry>(_entity))
                    {
                        Entry entry = registry.get<Entry>(_entity);
                        if (!isInside)
                        {
                            entt::entity interiorEntity;
                            if (entry.A == entt::null)
                            {
                                interiorEntity = entry.B;
                            }
                            else
                            {
                                interiorEntity = entry.A;
                            }

                            registry.emplace<Inside>(entity, Inside{interiorEntity});
                            isInside = true;
                        }
                        return;
                    }
                    // else {
                    if (isInside)
                    {
                        if (!registry.all_of<Interior>(_entity))
                        {
                            registry.remove<Inside>(entity);
                        }
                        else
                        {
                            Inside &inside = registry.get<Inside>(entity);

                            Vector2f overlap = utils.positionsCollide(entity, inside.interior);
                            if (overlap.x > 0)
                            {
                                if (overlap.x <= entityShape.size.x)
                                {
                                    float overlapx = entityShape.size.x - overlap.x;
                                    entityPosition.setPosX(entityPosition.globalX - overlapx);
                                }
                            }
                            else if (overlap.x < 0)
                            {
                                if (overlap.x >= -entityShape.size.x)
                                {
                                    float overlapx = entityShape.size.x + overlap.x;
                                    entityPosition.setPosX(entityPosition.globalX + overlapx);
                                }
                            }

                            if (overlap.y > 0)
                            {
                                if (overlap.y <= entityShape.size.z)
                                {
                                    float overlapy = entityShape.size.z - overlap.y;
                                    entityPosition.setPosY(entityPosition.globalY - overlapy);
                                }
                            }
                            else if (overlap.y < 0)
                            {
                                if (overlap.y >= -entityShape.size.z)
                                {
                                    float overlapy = entityShape.size.z + overlap.y;
                                    entityPosition.setPosY(entityPosition.globalY + overlapy);
                                }
                            }

                            if (registry.all_of<Movement>(entity))
                            {
                                Movement &entityMovement = registry.get<Movement>(entity);
                                entityMovement.velocity.x = 0;
                                entityMovement.velocity.y = 0;
                                entityMovement.acceleration.x = 0;
                                entityMovement.acceleration.y = 0;
                            }

                            return;
                        }
                    }
                }

                if (registry.all_of<Movement>(_entity))
                {
                    Movement &_entityMovement = registry.get<Movement>(_entity);
                    if(registry.all_of<Moveable>(_entity)) {

                        movementCollide = true;

                        // calculate final velocity
                        float m2 = _entityMovement.mass;
                        float xv2 = _entityMovement.velocity.x;
                        float yv2 = _entityMovement.velocity.y;

                        float xv1f = ((m1 - m2) / (m1 + m2)) * xv1 + ((2 * m2) / (m1 + m2)) * xv2;
                        float xv2f = ((2 * m1) / (m1 + m2)) * xv1 + ((m2 - m1) / (m1 + m2)) * xv2;

                        float yv1f = ((m1 - m2) / (m1 + m2)) * yv1 + ((2 * m2) / (m1 + m2)) * yv2;
                        float yv2f = ((2 * m1) / (m1 + m2)) * yv1 + ((m2 - m1) / (m1 + m2)) * yv2;

                        entityMovement.velocity.x = xv1f;
                        entityMovement.velocity.y = yv1f;

                        _entityMovement.velocity.x = xv2f;
                        _entityMovement.velocity.y = yv2f;
                    }
                }


                if(registry.all_of<ConveyerBelt>(_entity)) {
                    ConveyerBelt &conveyorBelt = registry.get<ConveyerBelt>(_entity);
                    // Apply the colliding entities movement to the player i.e a conveyer belt
                    entityMovement.acceleration.x += conveyorBelt.direction.x * conveyorBelt.speed;
                    entityMovement.acceleration.y += conveyorBelt.direction.y * conveyorBelt.speed;
                    skipCollide = true;
                }
            }

            if(!skipCollide) {
                for (const auto overlap : overlaps)
                {
                    overlapx += overlap.x;
                    overlapy += overlap.y;
                }
                
                entityPosition.setPosX(entityPosition.globalX + overlapx);///(movementCollide ? 2 : 1));
                entityPosition.setPosY(entityPosition.globalY + overlapy);///(movementCollide ? 2 : 1));

            }
        }
        else
        {
            if (registry.all_of<Colliding>(entity))
            {
                registry.remove<Colliding>(entity);
            }
            if (registry.all_of<Inside>(entity))
            {
                registry.remove<Inside>(entity);
            }
        }
    }
}

void Systems::updateMovement()
{
    auto movement_entities = registry.view<Visible, Movement, Position, Shape>();

    for (auto entity : movement_entities)
    {

        // if (registry.all_of<Player>(entity))
        // {
        auto &movement = movement_entities.get<Movement>(entity);
        auto &position = movement_entities.get<Position>(entity);
        auto &shape = movement_entities.get<Shape>(entity);
        bool isPlayer = registry.all_of<Player>(entity);

        if (isPlayer)
        {
            if (input.keyStates[SDL_SCANCODE_W] || input.keyStates[SDL_SCANCODE_UP])
            {
                movement.acceleration.y += -movement.speed;
            }
            if (input.keyStates[SDL_SCANCODE_S] || input.keyStates[SDL_SCANCODE_DOWN])
            {
                movement.acceleration.y += movement.speed;
            }
            if (input.keyStates[SDL_SCANCODE_A] || input.keyStates[SDL_SCANCODE_LEFT])
            {
                movement.acceleration.x += -movement.speed;
            }
            if (input.keyStates[SDL_SCANCODE_D] || input.keyStates[SDL_SCANCODE_RIGHT])
            {
                movement.acceleration.x += movement.speed;
            }
            
            movement.velocity.x = movement.acceleration.x * input.speedMod * deltaTime;
            movement.velocity.y = movement.acceleration.y * input.speedMod * deltaTime;
            
            movement.acceleration.x = 0;
            movement.acceleration.y = 0;
        }
        else 
        {
            // Velocity updates
            if(movement.acceleration.x != 0 || movement.acceleration.y != 0) {
                movement.velocity.x = movement.acceleration.x * deltaTime;
                movement.velocity.y = movement.acceleration.y * deltaTime;
                
                movement.acceleration.x = 0;
                movement.acceleration.y = 0;
            }
        }

        if (movement.velocity.x != 0 || movement.velocity.y != 0)
        {
            movement.velocity.x -= movement.velocity.x * movement.friction * deltaTime;
            movement.velocity.y -= movement.velocity.y * movement.friction * deltaTime;
        }

        if (movement.max_speed > 0)
        {
            movement.velocity.x = max(-movement.max_speed, min(movement.max_speed, movement.velocity.x));
            movement.velocity.y = max(-movement.max_speed, min(movement.max_speed, movement.velocity.y));
        }

        position.setPosX(position.globalX + movement.velocity.x);
        position.setPosY(position.globalY + movement.velocity.y);

    }

}