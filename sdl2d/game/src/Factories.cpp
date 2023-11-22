#include "../includes/Factories.hpp"

Factories::Factories()
{
}

entt::entity Factories::createActor(int type)
{
    entt::entity actor = registry.create();
    Position actor_position{
        .globalX = utils.frand() * 100 - 50,
        .globalY = utils.frand() * 100 - 50
        };
    TempPosition temp_position{actor_position};
    Shape actor_shape{.size = {10, 0, 10}};

    registry.emplace<FocusPoint>(actor, FocusPoint{.global_point = {0, 0}, .tile_point = {0, 0}, .screen_point = {0, 0}});
    registry.emplace<Shape>(actor, actor_shape);
    registry.emplace<Collidable>(actor);
    registry.emplace<Position>(actor, actor_position);
    registry.emplace<TempPosition>(actor, temp_position);
    registry.emplace<Actor>(actor);
    registry.emplace<Visible>(actor);
    registry.emplace<Movement>(actor, Movement{.speed = 10});

    if (type != 1)
        registry.emplace<Player>(actor);

    GeneralInfo actor_info{.name = "Default Actor", .description = "Default Actor"};
    registry.emplace<GeneralInfo>(actor, actor_info);

    return actor;
}

entt::entity Factories::createItem()
{
    auto item = registry.create();
    float w = 100;
    float h = 100;

    Shape shape{{w, 0, h}};
    Color color = {static_cast<Uint8>(rand() % 255), static_cast<Uint8>(rand() % 255), static_cast<Uint8>(rand() % 255), 255};

    registry.emplace<Color>(item, color);
    registry.emplace<Shape>(item, shape);

    // cast entity id to int
    int item_id = static_cast<int>(item);
    Item _item{10};
    // TODO: check for ID collisions
    registry.emplace<Item>(item, _item);

    GeneralInfo item_info{.name = "Default Item", .description = "Default Item"};
    registry.emplace<GeneralInfo>(item, item_info);

    return item;
}

void Factories::buildWorld()
{
    // Create the world
    world = registry.create();

    // // Create the main player
    player = createActor(0);
    Position &playerPosition = registry.get<Position>(player);
    // playerPosition.globalX = 0;
    // playerPosition.tileGX = playerPosition.globalX / DEFAULT_TILESIZE;
    // playerPosition.globalY = 0;
    // playerPosition.tileGY = playerPosition.globalY / DEFAULT_TILESIZE;
    playerPosition.setPosX(100);
    playerPosition.setPosY(250);

    Movement &playerMovement = registry.get<Movement>(player);
    playerMovement.speed = 160.0f;
    playerMovement.max_speed = 171.0f;
    playerMovement.mass = 10.0f;
    playerMovement.friction = .95f;

    // // Buildings
    // for(int i = 0; i < 15; i++) {
    //     auto item = createItem();
    //     Position position{
    //         .globalX = 100.53f + rand() % 15000,
    //         .globalY = -523.21f + rand() % 15000
    //     };
    //     position.tileGX = position.globalX / DEFAULT_TILESIZE;
    //     position.tileGY = position.globalY / DEFAULT_TILESIZE;

    //     registry.emplace<Position>(item, position);
    //     registry.emplace<Collidable>(item);
    
    //     Shape &itemShape = registry.get<Shape>(item);
    //     float floors = 2;
    //     itemShape.size.x = DEFAULT_TILESIZE * 5;
    //     itemShape.size.z = DEFAULT_TILESIZE * ((rand() % 4) + 1);
    //     itemShape.size.y = itemShape.size.z;

    //     Color &itemColor = registry.get<Color>(item);
    //     itemColor.r = rand() % 255;
    //     itemColor.g = rand() % 255;
    //     itemColor.b = rand() % 255;

    //     Interior interior{.enter_on_collision = true};
    //     registry.emplace<Interior>(item, interior);

    //     auto entry = registry.create();
    //     Position entryPosition;
    //     entryPosition.globalX = position.globalX + (itemShape.size.x / 2) - 5;
    //     entryPosition.globalY = position.globalY + (itemShape.size.z);
    //     entryPosition.tileGX = entryPosition.globalX / DEFAULT_TILESIZE;
    //     entryPosition.tileGY = entryPosition.globalY / DEFAULT_TILESIZE;
    //     registry.emplace<Position>(entry, entryPosition);
    //     registry.emplace<Shape>(entry, Shape{.size = {10, 0, 2}});
    //     registry.emplace<Collidable>(entry);
    //     registry.emplace<Visible>(entry);
    //     registry.emplace<Entry>(entry, Entry{.A = entt::null, .B = item});
    // }

    // // Create a bunch of items
    // for (int i = 0; i < 10; i++)
    // {
    //     auto item = createItem();
    //     Position position{
    //         .globalX = static_cast<float>(rand() % 500 - 250),
    //         .globalY = static_cast<float>(rand() % 500 - 250)
    //     };
    //     position.tileGX = position.globalX / DEFAULT_TILESIZE;
    //     position.tileGY = position.globalY / DEFAULT_TILESIZE;
    
    //     registry.emplace<Position>(item, position);
    //     registry.emplace<Collidable>(item);

    //     Shape &itemShape = registry.get<Shape>(item);
    //     itemShape.size.x = rand() % 100 + 10;
    //     itemShape.size.z = itemShape.size.x / (rand() % 2 + 1);
    //     itemShape.size.y = itemShape.size.z;

    //     // add Movement
    //     Movement movement;
    //     movement.speed = 100.0f;
    //     movement.max_speed = 101.0f;
    //     movement.mass = static_cast<float>(rand() % 1000 + 10);
    //     movement.friction = .5 + (rand() % 50) / 100.0f;
        
    //     registry.emplace<Movement>(item, movement);
    //     registry.emplace<Moveable>(item);

    //     registry.emplace<Clickable>(item);
    //     registry.emplace<Hoverable>(item);
        
    // }

    // // Create a list of conveyer belt properties
    // std::vector<std::tuple<Position, Shape, ConveyerBelt>> conveyerBeltProps = {
    //     {Position{.globalX = 0, .globalY = 0}, Shape{.size = {40, 0, 10}}, 
    //         ConveyerBelt{.direction = {1, 0}, .speed = 125.0f, .active = true}},

    //     {Position{.globalX = 10, .globalY = 40}, Shape{.size = {40, 0, 10}}, 
    //         ConveyerBelt{.direction = {-1, 0}, .speed = 125.0f, .active = true}},

    //     {Position{.globalX = 0, .globalY = 10}, Shape{.size = {10, 0, 40}}, 
    //         ConveyerBelt{.direction = {0, -1}, .speed = 125.0f, .active = true}},

    //     {Position{.globalX = 40, .globalY = 10}, Shape{.size = {10, 0, 30}}, 
    //         ConveyerBelt{.direction = {0, 1}, .speed = 125.0f, .active = true}},

    //     // Duplicate but 50 units to the right
    //     {Position{.globalX = 40, .globalY = -40}, Shape{.size = {40, 0, 10}}, 
    //         ConveyerBelt{.direction = {1, 0}, .speed = 125.0f, .active = true}},
        
    //     {Position{.globalX = 50, .globalY = 0}, Shape{.size = {40, 0, 10}},
    //         ConveyerBelt{.direction = {-1, 0}, .speed = 125.0f, .active = true}},

    //     {Position{.globalX = 40, .globalY = -40}, Shape{.size = {10, 0, 40}},
    //         ConveyerBelt{.direction = {0, -1}, .speed = 125.0f, .active = true}},
        
    //     {Position{.globalX = 80, .globalY = -40}, Shape{.size = {10, 0, 40}},
    //         ConveyerBelt{.direction = {0, 1}, .speed = 125.0f, .active = true}},
            
    //     {Position{.globalX = -600, .globalY = -600}, Shape{.size = {400, 0, 20}},
    //         ConveyerBelt{.direction = {0, 1}, .speed = 1525.0f, .active = true}},
    //     {Position{.globalX = -600, .globalY = -600}, Shape{.size = {20, 0, 400}},
    //         ConveyerBelt{.direction = {1, 0}, .speed = 1525.0f, .active = true}},
    //     {Position{.globalX = -200, .globalY = -600}, Shape{.size = {20, 0, 400}},
    //         ConveyerBelt{.direction = {-1, 0}, .speed = 1525.0f, .active = true}},
    //     {Position{.globalX = -600, .globalY = -200}, Shape{.size = {400, 0, 20}},
    //         ConveyerBelt{.direction = {0, -1}, .speed = 1525.0f, .active = true}},
    // };

    // // Loop through the list to create each conveyer belt
    // for (const auto& [const_position, shape, conveyerBelt] : conveyerBeltProps) {
    //     auto belt = registry.create();
    //     Position position = const_position;
    //     position.tileGX = position.globalX / DEFAULT_TILESIZE;
    //     position.tileGY = position.globalY / DEFAULT_TILESIZE;

    //     registry.emplace<Position>(belt, position);
    //     registry.emplace<Shape>(belt, shape);
    //     registry.emplace<Collidable>(belt);
    //     registry.emplace<ConveyerBelt>(belt, conveyerBelt);
    //     registry.emplace<Color>(belt);
    // }



}