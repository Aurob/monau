#include "../includes/View.hpp"

View::View() {}

/*
    View - updateView
    Updates the view based on the player position
*/
void View::updateView()
{
    Position playerPosition = registry.get<Position>(player);
    Shape playerShape = registry.get<Shape>(player);

    xOffset = (fmod(playerPosition.globalX, DEFAULT_TILESIZE) * tileSize) / DEFAULT_TILESIZE;
    yOffset = (fmod(playerPosition.globalY, DEFAULT_TILESIZE) * tileSize) / DEFAULT_TILESIZE;

    bounds[0][0] = (playerPosition.tileGX - ((WIDTH / tileSize) / 2));
    bounds[0][1] = (playerPosition.tileGY - ((HEIGHT / tileSize) / 2));
    bounds[1][0] = bounds[0][0] + (WIDTH / tileSize);
    bounds[1][1] = bounds[0][1];
    bounds[2][0] = bounds[0][0];
    bounds[2][1] = bounds[0][1] + (HEIGHT / tileSize);
    bounds[3][0] = bounds[1][0];
    bounds[3][1] = bounds[2][1];

    playerShape.scaled_size.x = tileSize * (playerShape.size.x / static_cast<float>(DEFAULT_TILESIZE));
    playerShape.scaled_size.y = tileSize * (playerShape.size.y / static_cast<float>(DEFAULT_TILESIZE));
    playerShape.scaled_size.z = tileSize * (playerShape.size.z / static_cast<float>(DEFAULT_TILESIZE));

    xmod = xOffset + playerShape.scaled_size.x / 2;
    ymod = yOffset + playerShape.scaled_size.z / 2;

    if (tileSize == MAXTSIZE)
    {
        xmod -= WIDTH / 2;
        ymod -= HEIGHT / 2;
    }
    TempPosition &tempPosition = registry.get<TempPosition>(player);
    Position position = registry.get<Position>(player);
    tempPosition.temp = playerPosition;
}
/*
    View - updateVisibleEntities
     Determines which entities are currenlty visible based on the view bounds
     Sets screen position for each visible entity
*/
void View::updateVisibleEntities()
{
    // Get all entities with a position and shape
    auto position_entities = registry.view<Position, Shape>();
    // #pragma omp parallel for
    for (auto entity : position_entities)
    {
        auto &shape = registry.get<Shape>(entity);

        shape.scaled_size.x = tileSize * (shape.size.x / static_cast<float>(DEFAULT_TILESIZE));
        shape.scaled_size.y = tileSize * (shape.size.y / static_cast<float>(DEFAULT_TILESIZE));
        shape.scaled_size.z = tileSize * (shape.size.z / static_cast<float>(DEFAULT_TILESIZE));

        auto &position = position_entities.get<Position>(entity);
        bool visible = registry.all_of<Visible>(entity);
        bool _visible = false;

        if(visible) registry.remove<Visible>(entity);

        if (position.tileGX >= bounds[0][0] - shape.scaled_size.x / tileSize && position.tileGX <= bounds[1][0])
        {
            if (position.tileGY - ((shape.scaled_size.z * 3) / tileSize) >= bounds[0][1] - ((shape.scaled_size.z * 4) / tileSize) && position.tileGY - ((shape.scaled_size.z * 3) / tileSize) <= bounds[2][1])
            {
                float tileGXOffset = (position.tileGX - bounds[0][0]) * tileSize;
                float tileGYOffset = (position.tileGY - bounds[0][1]) * tileSize;
                float globalXMod = fmod(position.globalX, DEFAULT_TILESIZE) / static_cast<float>(DEFAULT_TILESIZE) * tileSize;
                float globalYMod = fmod(position.globalY, DEFAULT_TILESIZE) / static_cast<float>(DEFAULT_TILESIZE) * tileSize;

                position.screenX = -xmod + tileGXOffset + globalXMod;
                position.screenY = -ymod + tileGYOffset + globalYMod;
                _visible = true;
                registry.emplace<Visible>(entity);
            }
        }

        // if(!visible && !_visible)
        //     registry.emplace<Visible>(entity);
        // else if(visible && !_visible)
        //     registry.remove<Visible>(entity);
    }

    registry.sort<Visible>([&](const entt::entity lhs, const entt::entity rhs)
                           { return lhs > rhs; });
}
