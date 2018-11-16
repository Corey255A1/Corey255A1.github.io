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


function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}
var pagewidth = getWidth();
var pageheight = getHeight();
console.log("w"+pagewidth+" h"+pageheight);
const SnowFlakesDisplay = document.getElementById("snowflakes");
function Snowflake(prototype, left)
{
    this.Size = (Math.random()*30)+10;
    this.Top = -100;
    this.Left = left;
    this.Vx = ((Math.random()*3)+1);
    if(Math.random()>0.5){ this.Vx = -this.Vx; }
    this.Vy = (Math.random()*3)+1;
    this.MyFlake = prototype.cloneNode(true);
    this.MyFlake.style.display = "inline";
    this.MyFlake.style.width = this.Size + "px";
    this.MyFlake.style.height = this.Size + "px";
    this.MyFlake.style.opacity = Math.random()+.2;
    this.Update = function()
    {
        this.Top+=this.Vy;
        if(this.Top>pageheight-this.Size){ this.Top=-100; }
        this.Left+=this.Vx;
        if(this.Left>pagewidth-this.Size) 
        {
            this.Left=-10;
        }
        else if(this.Left<-10)
        {
            this.Left = pagewidth-this.Size;        
        }
        this.MyFlake.style.top = this.Top+"px";
        this.MyFlake.style.left = this.Left+"px";
    }

    SnowFlakesDisplay.appendChild(this.MyFlake);
}
const prototypeFlake = document.getElementById("prototype");

var SnowFlakesList = []
for(var x=-10; x<pagewidth; x+=5)
{
    SnowFlakesList.push(new Snowflake(prototypeFlake,x));
}
function update()
{
    for(var f in SnowFlakesList)
    {
        SnowFlakesList[f].Update();
    }
    requestAnimationFrame(update);
}
requestAnimationFrame(update);