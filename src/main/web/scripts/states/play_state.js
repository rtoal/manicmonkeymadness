/**
 * play_state.js
 * 
 * This is the main state of the game in which the game is actually being played.
 * 
 */

$(function() {
    m3.states.PlayState = function() {
        this.level = new m3.types.Level();
        
        // The state determines what we're doing right now. It can be one of:
        //
        //   - waiting:       It's a player's turn, and we're waiting for them to launch
        //                    a projectile.
        //   - attacking:     The player has launched a projectile, and we're letting the
        //                    physics system do its work.
        //   - transitioning: After the attacking state is finished, we're transitioning
        //                    back to the other player.
        this.game_state = "waiting";
        
        // This keeps track of how long we've been in the current state.
        this.state_time = 0.0;
        
        // This determines whose turn it is. The player who starts is chosen randomly.
        this.active_player = m3.math.randomInteger(0, 1);
        
        // This is a reference to the projectile most recently launched.
        this.active_projectile = null;
        
        // If the second player is starting, we need to warp the camera to their side.
        if (this.active_player === 1) {
            m3.camera.warp(m3.config.level_width - m3.game.width, 0);
        }
    };
    
    m3.states.PlayState.prototype.keyHandlers = {
        ENTER: {
            down: function() {
                m3.camera.slideTo(m3.config.level_width - m3.game.width, 0, "smooth");
            }
        },
        
        S: {
            down: function() {
                m3.score.player_scores[1] += 5.0;
            }
        }
    };
    
    m3.states.PlayState.prototype.mouseHandlers = {
        down: function(event) {
            var state = m3.game.state;
            
            if (state.game_state === "waiting") {
                m3.launcher.prepareLaunch(event);
            }
        },
        
        up: function(event) {
            var state = m3.game.state;
            
            if (state.game_state === "waiting") {
                state.setState("attacking");
                m3.launcher.launch(event);
            }
        },
        
        move: function(event) {
            var state = m3.game.state;
            
            if (state.game_state === "waiting") {
                m3.launcher.aim(event);
            }
        }
    };
    
    /**
     * The setter for the state also resets the state timer.
     */
    m3.states.PlayState.prototype.setState = function(new_state) {
        this.game_state = new_state;
        this.state_time = 0.0;
    };
    
    /**
     * This is the update function for the waiting state.
     */
    m3.states.PlayState.prototype.updateWaiting = function() {
        // Nothing yet.
    };
    
    /**
     * This is the update function for the attacking state.
     */
    m3.states.PlayState.prototype.updateAttacking = function() {
        // For now, after the player shoots their cannon, we switch to the other player after 5 seconds.
        // Eventually we should instead have some way of detecting when the physics have "settled down",
        // like angry birds does.
        if (this.state_time >= 5.0) {
            var camera_position = (this.active_player === 0) ? m3.config.level_width - m3.game.width : 0;
            m3.camera.stopFollowing();
            m3.camera.slideTo(camera_position, 0, "smooth");
            this.active_player = (this.active_player + 1) % 2;
            this.active_projectile.destroy();
            this.active_projectile = null;
            this.setState("transitioning");
        }
    };
    
    /**
     * This is the update function for the transitioning state.
     */
    m3.states.PlayState.prototype.updateTransitioning = function() {
        // We're done transitioning when the camera is done sliding.
        if (!m3.camera.sliding) {
            this.setState("waiting");
        }
    };
    
    m3.states.PlayState.prototype.update = function() {
        this.state_time += m3.game.elapsed;
        
        // Update the state itself.
        switch (this.game_state) {
            case ("waiting"):
                this.updateWaiting(); break;
            case ("attacking"):
                this.updateAttacking(); break;
            case ("transitioning"):
                this.updateTransitioning(); break;
            default:
                m3.util.log("Play state has entered an invalid state!");
        }
        
        // Update modules.
        m3.camera.update();
        this.level.update();
        m3.world.update();
        m3.launcher.update();
        
        if (this.active_projectile) {
            this.active_projectile.update();
        }
        
        m3.ui.update();
    };
});
