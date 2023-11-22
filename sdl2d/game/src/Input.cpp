#include "../includes/Input.hpp"

Input::Input()
{
    // //printf("Input constructor
    SDL_ShowCursor(0);
}

void Input::update()
{

    rightclick = SDL_GetMouseState(NULL, NULL) & SDL_BUTTON(SDL_BUTTON_RIGHT);
    leftclick = SDL_GetMouseState(NULL, NULL) & SDL_BUTTON(SDL_BUTTON_LEFT);
    mousedown = leftclick || rightclick;

    FocusPoint &playerFocusPoint = registry.get<FocusPoint>(player);
    Position &playerPosition = registry.get<Position>(player);
    Shape &playerShape = registry.get<Shape>(player);
    Movement &playerMovement = registry.get<Movement>(player);

    
    SDL_GetMouseState(&playerFocusPoint.screen_point.x, &playerFocusPoint.screen_point.y);
    
    // If holding shift go super speed
    if (keyStates[SDL_SCANCODE_LSHIFT])
    {
        speedMod = 2.5;
    }
    else
    {
        speedMod = 1;
    }

    // Alt + 1 to enable/disable slow motion
    if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_1])
    {
        slowmo = !slowmo;
        keyStates[SDL_SCANCODE_1] = false;
    }

    // //If Alt + 2 is pressed, send a test WebSocket message with _js__ws_emit(msg)
    // if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_2])
    // {
    //     _js__ws_emit("{\"test\":123}");
    //     keyStates[SDL_SCANCODE_2] = false;
    // }
    

    if (zoomOut) // && tileSize > MINTSIZE)
    {
        tileSize /= 2;
        zoomOut = false;
    }
    else if (zoomIn) // && tileSize < MAXTSIZE)
    {
        tileSize *= 2;
        zoomIn = false;
    }

    // Movement updates
    // if (keyStates[SDL_SCANCODE_W] || keyStates[SDL_SCANCODE_UP])
    // {
    //     playerMovement.acceleration.y = -1;
    // }

    // Alt L to scale up, Alt K to scale down
    if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_L])
    {
        playerShape.size.x *= 2;
        playerShape.size.y *= 2;
        playerShape.size.z *= 2;
        keyStates[SDL_SCANCODE_L] = false;
    }
    else if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_K])
    {
        playerShape.size.x /= 2;
        playerShape.size.y /= 2;
        playerShape.size.z /= 2;
        keyStates[SDL_SCANCODE_K] = false;
    }

    // Alt O to up speed, Alt I to down speed
    if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_O])
    {
        playerMovement.speed += .1;
        keyStates[SDL_SCANCODE_O] = false;
    }
    else if (keyStates[SDL_SCANCODE_LALT] && keyStates[SDL_SCANCODE_I])
    {
        playerMovement.speed -= .1;
        keyStates[SDL_SCANCODE_I] = false;
    }
  
    
}

void SDLCALL Input::TouchHandler(void *userdata, SDL_TouchFingerEvent *event)
{
    SDL_Finger *finger0, *finger1;
    float xDist, yDist, distance;
    switch (event->type)
    {
        case SDL_FINGERDOWN:
        case SDL_FINGERUP:
        case SDL_FINGERMOTION:
            // if (event->fingerId == SDL_TOUCH_MOUSEID && SDL_GetNumTouchFingers(SDL_TOUCH_MOUSEID) > 1) {
                
            //     finger0 = SDL_GetTouchFinger(SDL_TOUCH_MOUSEID, 0);
            //     finger1 = SDL_GetTouchFinger(SDL_TOUCH_MOUSEID, 1);
            //     xDist = finger0->x - finger1->x;
            //     yDist = finger0->y - finger1->y;
            //     distance = sqrt(xDist*xDist + yDist*yDist);

            //     // set zoomIn or zoomOut if the distance between the fingers has changed
            //     if (distance > 0.1) {
            //         if (distance > 0.2) {
            //             zoomIn = true;
            //             zoomOut = false;
            //         } else {
            //             zoomOut = true;
            //             zoomIn = false;
            //         }
            //     } else {
            //         zoomIn = false;
            //         zoomOut = false;
            //     }
            // }
            break;
        default:
            break;
    }
}

void SDLCALL Input::EventHandler(void *userdata, SDL_Event *event)
{
    // value = EM_ASM_INT({
    //     return document.queryInteractor('#test').value;
    // });
    
    auto now = std::chrono::system_clock::now();
    std::chrono::milliseconds::rep milliseconds;

    switch (event->type)
    {
    case SDL_MOUSEBUTTONDOWN:
        if (event->button.button == SDL_BUTTON_LEFT)
        {
            leftclick = true;
            clickTime = SDL_GetTicks();
        }
        else if (event->button.button == SDL_BUTTON_RIGHT)
        {
            rightclick = true;
        }
        else if (event->button.button == SDL_BUTTON_MIDDLE)
        {
            middleclick = true;
        }

        mousedown = true;
        break;

    case SDL_MOUSEBUTTONUP:
        if (event->button.button == SDL_BUTTON_LEFT)
        {
            leftclick = false;
            clickTime = 0;
        }
        else if (event->button.button == SDL_BUTTON_RIGHT)
        {
            rightclick = false;
        }
        else if (event->button.button == SDL_BUTTON_MIDDLE)
        {
            middleclick = false;
        }

        mousedown = false;
        break;

    case SDL_KEYUP:
        keyStates[event->key.keysym.scancode] = false;
        // keyStateTimes[event->key.keysym.scancode] = 0;
        break;

    case SDL_KEYDOWN:
        // //printf("Key pressed: %d\n", event->key.keysym.scancode);
        keyStates[event->key.keysym.scancode] = true;
        // milliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();        
        // keyStateTimes[event->key.keysym.scancode] = milliseconds;
        break;

    case SDL_MOUSEWHEEL:
        zoomOut = event->wheel.y < 0;
        zoomIn = event->wheel.y > 0; 
        break;
        
    case SDL_MOUSEMOTION:
    default:
        break;
    }
}