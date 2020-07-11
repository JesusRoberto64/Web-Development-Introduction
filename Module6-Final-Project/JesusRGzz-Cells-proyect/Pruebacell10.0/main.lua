
love.blobs = require "loveblobs"
local util = require "loveblobs.util"

local softsurface = {}
local cells = {}
local walls = {}
local pointsWall = {}

spawnWall = 1000

--joysticks = love.joystick.getJoysticks()
--joystick = joysticks[1]

isFullScreen = false

canSeeBone = false
sti = require("Simple-Tiled-Implementation-master/sti")
gameMap = sti("maps/prueba..lua")
cameraFile = require("hump-master/camera")

cam = cameraFile()
canMoveCam = false
velCam = 0--650-- mutiply *dt

function love.load()
  -- surface creat
  --love.window.setFullscreen(true)
  --love.window.setMode(540, 360)

  love.physics.setMeter(16)
  local grav = 0 --9.8*16
  world = love.physics.newWorld(0, grav, true)

  -- set WALLS ===============================================
  for i,obj in pairs(gameMap.layers["walls"].objects) do
    pointsWall = {obj.x, obj.y,    obj.x + obj.width, obj.y,
        obj.x + obj.width, obj.y + obj.height,    obj.x, obj.y + obj.height
   }
   local w = love.blobs.softsurface(world,pointsWall,35,"static")
   table.insert(walls,w)
  end

  local points = {
    0,500,   800,500,
    800,600, 0,600
  }

  local  b = love.blobs.softsurface(world, points, 64, "static")
  table.insert(softsurface,b)
 -- Cell create =============================================
  xx = 400
  yy =  30
  diameter = 50
  force = 10000
  nForce = 0 -- cancel infinite inertia on body
  isForceApply = false
  local c = love.blobs.softbody(world,xx,yy,diameter,2,4)
  c:setFriction(1)
  c:setDamping(0.1)
  c:setFrequency(1.5)

  table.insert(cells,c)

  love.graphics.setBackgroundColor(255, 255, 255)
  cam:lookAt(xx-200, yy-80)
  cam.smooth.damped(1)

end

function love.update(dt)
  gameMap:update(dt)  --map

  --if not joystick then return end

  for i=1,4 do
     world:update(dt)
  end

   local body = nil
   local _nforceSum = 1000

   isForceApply = false -- refresh force apply


  for i, v in ipairs(cells) do
    v:update(dt)
     body = v.centerBody
   --imoput movement =============================
    if love.keyboard.isDown("right") then --or joystick:isGamepadDown("dpright")then
      body:applyForce(force, 0)
      nForce = nForce + _nforceSum
      isForceApply = true
    end
    if love.keyboard.isDown("left") then --or joystick:isGamepadDown("dpleft") then
      body:applyForce(-force, 0)
      nForce = nForce + _nforceSum
      isForceApply = true
    end
    if love.keyboard.isDown("up") then -- or joystick:isGamepadDown("dpup")then
      body:applyForce(0, -force)
      nForce = nForce + _nforceSum
      isForceApply = true
    end
    if love.keyboard.isDown("down") then --or joystick:isGamepadDown("dpdown") then
      body:applyForce(0, force)
      nForce = nForce + _nforceSum
      isForceApply = true
    end
    -- set max and min vel ========================
    local velmax = 80
    local velx,vely = body:getLinearVelocity()

    if velx > velmax  then
     body:applyForce(-nForce,0) --nForce,0)
    elseif velx < -velmax then
     body:applyForce(nForce,0)
    end
    if vely > velmax  then
     body:applyForce(0,-nForce)
    elseif vely < -velmax then
     body:applyForce(0,nForce)
    end
    local limitForce = 7000
    if nForce > limitForce then nForce = limitForce end
    if nForce < -limitForce then nForce = -limitForce end

    if isForceApply == false then nForce = 0 end

    body:setLinearDamping(1.5) -- friction when force end

    if love.keyboard.isDown("f1") then
      body:setActive(false) -- dead cell
    end
    -- set camara move
    local camvel = 5
    if isFullScreen == false then
     cam:zoomTo(0.66)
  -- if joystick:isGamepadDown("a") then
    --  cam:lookAt(body:getX(), body:getY())
   --end
    cam:lookAt(body:getX(), body:getY())
    cam:move((camvel*velx)*dt, (camvel*vely)*dt)
    else
     cam:zoomTo(1.4)
     --if joystick:isGamepadDown("a") then
      cam:lookAt(body:getX(), body:getY())
     --end
     --cam:lookAt(body:getX(), body:getY())
     --cam:move((camvel*velx)*dt, (camvel*vely)*dt)
    end
    -- debuger log cell
    --if love.joystick.isGamepadDown("dpup") then print("butoon down") end
    if love.keyboard.isDown("return") then
      local x = body:getX()
      local y = body:getY()
      local xv,yv = body:getLinearVelocity()
      local inertia = body:getInertia()
      print("x:  "..x)
      print("y:  "..y)
      print("velx:  "..xv)
      print("vely:  "..yv)
      print("inertia:  "..inertia)
      print("nForce:  "..nForce)
      print("FPS:  "..love.timer.getFPS( ))
      --for i, joystick in ipairs(joysticks) do
        --  print(joystick:getName(), 10, i * 20)
      --end
    end

  end

end-- end update

function love.draw()
 cam:attach()
  local function myStencilFunction()
   local xx, yy = cam:position()
   local osX = (love.graphics.getWidth()*1.66)/2
   local osY = (love.graphics.getHeight()*1.66)/2
   love.graphics.rectangle("fill", xx - osX, yy - osY, 720*1.66, 340*1.66)
   --print(cam:position())
  end
  --clone border camara
   local xx, yy = cam:position()
   local osX = (love.graphics.getWidth()*1.46)/2
   local osY = (love.graphics.getHeight()*1.46)/2
   love.graphics.push()
   love.graphics.setColor(1, 0, 0)
   love.graphics.rectangle("line", xx - osX, yy - osY, 720*1.46 , 340*1.46)
   love.graphics.pop()

   love.graphics.setCanvas{canvas, stencil=true}
   love.graphics.stencil(myStencilFunction, "replace", 1)
   love.graphics.setStencilTest("greater", 0)

   gameMap:drawLayer(gameMap.layers["Tile Layer 1"])-- draw map

 --love.graphics.setColor(0.2, 0.4, 0.8)
-- Draw surface ==============

  for i,v in ipairs(walls) do
   love.graphics.setColor(51*i, 102, 240*i)
   for h,w in ipairs(pointsWall) do
     if w < spawnWall then
    -- print(w)
    -- v:destroy()
     v:draw(false)
     end
   end
  end

  for i,v in ipairs(softsurface) do
   love.graphics.setColor(51,102, 240)
   v:draw(false)
  end

  if canSeeBone == true then
    for i,v in ipairs(softsurface) do
     love.graphics.setColor(51, 102, 240)
     v:draw(true)
    end
  end
  -- draw cell ============
  for i,v in ipairs(cells) do
    local body = v.centerBody
    love.graphics.setColor(230, 102, 102)
  --  print(body:getX())
   v:draw("fill", false)

  end
  love.graphics.setStencilTest()
  cam:detach()


  love.graphics.setColor(0, 0, 0, 0.5)
  love.graphics.print(love.timer.getFPS( ),50,50)
  love.graphics.print("with:  "..love.graphics.getWidth(), 50, 100)
end -- end draw ====================================================

function love.keypressed(key)
  if key == "rshift" then
    if canSeeBone == true then
      canSeeBone = false
    else
      canSeeBone = true
    end
    print("tes")
  end
  if key == "lshift" then
   if isFullScreen == false then
   love.window.setFullscreen(true)
    isFullScreen = true
    print("win "..love.mouse.getX())
   else
    love.window .setFullscreen(false)
    isFullScreen = false
    print(love.mouse.getX())
   end
  end

  if key == "space" then
    spawnWall = spawnWall - 10
    print(spawnWall)
  end

end -- end key function

--function love.joystickreleased(joystick, button)
  --print("pressed button")
--end
