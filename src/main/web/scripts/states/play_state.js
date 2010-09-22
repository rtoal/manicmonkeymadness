/**
 * play_state.js
 * 
 * This is the main state of the game in which the game is actually
 * being played.
 * 
 */

$(function() {
    m3.states.PlayState = function() {
        this.image = {
            x: 150,
            y: 150,
            dx: 1,
            dy: 2
        };
    };
    
    m3.states.PlayState.prototype.keyHandlers = {
        ENTER: {
            down: function() {
                m3.camera.slideTo(m3.config.level_width - m3.game.width, 0);
            }
        }
    };
    
    m3.states.PlayState.prototype.mouseHandlers = {
        down: function(event) {
            m3.launcher.prepareLaunch(event);
        },
        
        up: function(event) {
            m3.launcher.launch(event);
        },
        
        move: function(event) {
        	m3.launcher.aim(event);
        }
    };
    
    m3.states.PlayState.prototype.update = function() {
        var image      = this.image,
            monkey     = new Image(),
            context    = m3.game.context,
            halfWidth  = m3.game.width / 2,
            halfHeight = m3.game.height / 2;
        	cannonOffset = {x: 56, y: 88};
                      
        
        var left = new Image(),
        up = new Image(),
        right = new Image();
        
        m3.launcher.cannonSprite.image.src = "images/sprites/cannon.png";
        left.src = 'images/sprites/monkeyleft.png';
        up.src = 'images/sprites/monkeyup.png';
        right.src = 'images/sprites/monkeyright.png';
        
        // Move the camera with the arrow keys.
        if (m3.input.keys.RIGHT) {
            m3.camera.move(m3.config.camera_scroll_speed, 0);
        }
        
        if (m3.input.keys.LEFT) {
            m3.camera.move(-m3.config.camera_scroll_speed, 0);
        }
        
        // Update the camera.
        m3.camera.update();
       
        // Draw a level background.
        var gradient = context.createLinearGradient(0, 0, m3.config.level_width, 0);
        gradient.addColorStop(0, "#000000");
        gradient.addColorStop(1, "#FFFFFF");
        context.fillStyle = gradient;
        context.fillRect(0, 0, m3.config.level_width, m3.config.level_height); 
                
        //DO NOT REMOVE YET, temporary for changing images.
//        switch(image.count%3) {
//        case 0: context.drawImage(left, image.x, image.y); break;
//        case 1: context.drawImage(up, image.x, image.y); break;
//        case 2: context.drawImage(right, image.x, image.y); break;
//        default: alert("fail"); break;
//        }        
        
        //draws the cannon at the appropriate angle
        context.save();
        context.scale(.5, .5);
        
        /* 
         * this translate and rotate ensures the rotation is around the wheel of the cannon
         * instead of the origin
         */
        context.translate(m3.launcher.cannonSprite.x + cannonOffset.x, m3.launcher.cannonSprite.y + cannonOffset.y);
        context.rotate(m3.launcher.cannonSprite.angle);
        
        context.drawImage(m3.launcher.cannonSprite.image, -56, -88);
        context.restore();
        
        context.drawImage(up, image.x, image.y);
        
        // Make it bounce.
        if (image.x + image.dx > m3.game.width || image.x + image.dx < 0 || image.x + image.dx + up.width > m3.game.width)
            image.dx = -image.dx;
        if (image.y + image.dy > m3.game.height || image.y + image.dy < 0 || image.y + image.dy + up.height > m3.game.height)
            image.dy = -image.dy;
        
        // Update location.
        image.x += image.dx;
        image.y += image.dy;
        
        // Update the physics world
        m3.world.update();
    };
    
});
