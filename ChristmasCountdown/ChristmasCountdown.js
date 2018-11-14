const countdown = document.getElementById("countdown");
function TimeSpan(mil)
{
    var working = Math.floor(mil/1000);
    this.milliseconds = (mil/1000) - working;
    this.seconds = working%60;
    working = (working-this.seconds)/60
    this.minutes = working%60;
    working = (working-this.minutes)/60;
    this.hours = working%24;
    working = (working-this.hours)/24;
    this.days = working;
    this.toString = function()
    {
        return this.days + "d " + this.hours + "h " + this.minutes + "m " +
        (this.seconds + this.milliseconds).toFixed(1) + "s";
    }
    
    
}
setInterval(function timer()
{
    var date = new Date();
    var christmas = new Date(date.getFullYear(),11,25,0,0,0,0);
    var diff = christmas - date;
    var ts = new TimeSpan(diff);
    if(ts.days < 0)
    {
       christmas = new Date(date.getFullYear()+1,11,25,0,0,0,0);
       diff = christmas - date;
       ts = new TimeSpan(diff);
       countdown.innerText = ts.toString() + " until Christmas";
    }
    else if(ts.hours < 0)
    {
        countdown.innerText = "MERRY CHRISTMAS!!";
    }
    else
    {
        countdown.innerText = ts.toString() + " until Christmas";
    }
    //console.log(date.getTime());
}, 
100
);

