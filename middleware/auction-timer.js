const EventEmitter = require('events');

class Timer extends EventEmitter {
    constructor(interval) {
        super();
        this.countdownInterval = interval;
        this.countdown = interval;
        this.myInterval;
    }

    getCountdown() {
        return this.countdown;
    }

    start() {
        this.reset();
        this.myInterval = setInterval(() => {
            if (this.countdown == 0) {
                this.emit('intervalPassed');
                this.stop();
                return;
            } 
            this.countdown--;
            this.emit('secondPassed');
        }, 1000);
    }

    reset() {
        this.countdown = this.countdownInterval;
    }

    stop() {
        clearInterval(this.myInterval);
    }
} 

module.exports = Timer;