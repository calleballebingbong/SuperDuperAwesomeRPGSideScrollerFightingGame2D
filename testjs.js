
    const canvas_idle = document.getElementById("canvas_idle")
    canvas_idle.width = 1200
    canvas_idle.height = 550
    const ctx_idle = canvas_idle.getContext("2d")


  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;

  function updatechar(){
    ctx_idle.clearRect(0, 0, canvas_idle.width, canvas_idle.height)
      x += vx;
      y += vy;
      ctx_idle.fillRect(x, y, 50, 50)
      requestAnimationFrame(updatechar)
  }

  updatechar()
    
//Idle sprite animationer börjar här
    // Laddar idle sprite sheet för idle sprite
    const spriteSheet_idle = new Image()
    spriteSheet_idle.src = "Legacy-Fantasy - High Forest 2.3/Character/Idle/Idle-Sheet.png"

    const sprite_idleWidth = 256 / 4 
    const sprite_idleHeight = 80

    let frameIndex_idle = 0 
    const totalFrames_idle = 4

    const scale_idle = 5

    let lastTimestamp_idle = 0, 
        maxFPS_idle = 15, 
        timestep_idle = 1000 / maxFPS

    function draw(timestamo) {
        if (timestamp - lastTimestamp < timestep)
        requestAnimationFrame(draw)
        return

        lastTimestamp = timestamp

        ctx_idle.clearRect(0, 0, canvas_idle.width, canvas_idle.hight)

        ctx_idle.drawImage(
            spriteSheet_idle,
            frameIndex * spriteWidth,
            0,
            spriteHeight,
            spriteWidth,
            0,
            0,
            spriteHeight * scale / 2,
            spriteWidth * scale / 2
        )
        frameIndex = (frameIndex + 1) % totalFrames
      requestAnimationFrame(draw)
    }

    spriteSheet_idle.onload = requestAnimationFrame(draw)