const hourSelector = document.querySelector(".hourSelector");
const minuteSelector = document.querySelector(".minuteSelector");
const currentTime = document.getElementById("currentTime");
const endTime = document.getElementById("endTime");
const elapsedTime = document.getElementById("elapsedTime");
const startstop = document.getElementById("startstop");
const timelist = document.getElementById("timelist");

//Setup The Combo Boxes
for(let h=0; h<=24; h++)
{
    let he = document.createElement("option");
    he.value = h;
    he.textContent = h+"h";
    hourSelector.appendChild(he);
}

for(let m=0; m<60; m+=15)
{
    let me = document.createElement("option");
    me.value = m;
    me.textContent = m+"m";
    minuteSelector.appendChild(me);
}

class TimeLogger{
    constructor(listelm){
        this.running = false;
        this.entries = [];
        this.listelm = listelm;
    }

    createEntry(starting){
        let d = new Date();
        return {
            time:d.getTime(),
            date:d,    
            start:starting
        }
    }
    toggleRunning(){
        let entry = this.createEntry(this.running);
        if(this.listelm !== undefined){
            let li = document.createElement("li");
            if(!this.running){
                li.textContent = "Started: ";
                li.classList.add("start");
            }
            else{
                li.textContent = "Stopped: ";
                li.classList.add("stop");
            }
            li.textContent += entry.date.toLocaleTimeString();
            this.listelm.appendChild(li);
        }
        this.entries.push(entry);
        this.running = !this.running;
    }

    calculateRunningTime(){
        let len = this.entries.length;
        let total = 0;
        for(let i=0;i<len;i+=2){
            if(i+1 < len){
                total += (this.entries[i+1].time-this.entries[i].time);
            }
        }
        if(this.running){
            total += (Date.now() - this.entries[len-1].time);
        }
        return total;
    }
    elapsedTimeString(){
        let time = this.calculateRunningTime();
        time /= 1000; //seconds;
        let h = Math.floor(time / 3600);
        time = time - h*3600;
        let m = Math.floor(time  / 60);
        let s = Math.round(time - m*60);


        return (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);

    }
}
const timeLogger = new TimeLogger(timelist);
function startStopClick(){
    timeLogger.toggleRunning();
    if(timeLogger.running){
        startstop.textContent = "Stop";
        startstop.classList.remove("start");
        startstop.classList.add("stop");
    }
    else{
        startstop.textContent = "Start";
        startstop.classList.remove("stop");
        startstop.classList.add("start");
    }
    console.log(timeLogger.calculateRunningTime());
}
startstop.addEventListener("click", startStopClick);


function ticker(){
    let date = (new Date());
    let future = new Date();
    let offset = (hourSelector.value * 3600 * 1000) + (minuteSelector.value * 60 * 1000);
    offset = offset - timeLogger.calculateRunningTime();
    future.setTime(date.getTime() + offset);

    elapsedTime.textContent = timeLogger.elapsedTimeString();
    currentTime.textContent = date.toLocaleTimeString();
    endTime.textContent = future.toLocaleTimeString();
}
ticker();
window.setInterval(ticker, 1000);