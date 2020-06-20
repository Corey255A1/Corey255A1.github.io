function formatMs(ms){
    var seconds = Math.round(ms/1000);
    var hours = Math.floor(seconds/3600);
    seconds = seconds - hours*3600;
    var minutes = Math.floor(seconds/60);
    seconds = seconds - minutes*60;
    return  ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) ;
}

function TableEntry(){
    this._tableElem = document.createElement("div");
    this._tableElem.classList.add("table");
    this._nameElem = this.MakeNewCell("tName");
    this._tableElem.appendChild(this._nameElem);
    this._dateElem = this.MakeNewCell("tDate");
    this._tableElem.appendChild(this._dateElem);
    this._checkoutElem = this.MakeNewCell("tCheckInOut");
    this._tableElem.appendChild(this._checkoutElem);
    this._checkinElem = this.MakeNewCell("tCheckInOut");
    this._tableElem.appendChild(this._checkinElem);
    this._elapsedElem = this.MakeNewCell("tElapsed");
    this._tableElem.appendChild(this._elapsedElem);
    this._countElem = this.MakeNewCell("tCount");
    this._tableElem.appendChild(this._countElem);
    
    this._name = "";
    this._checkout = 0;
    this._checkin = 0;
    this._elapsed = 0;
    this._count = 0;
}
TableEntry.prototype.MakeNewCell = function(type){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add(type);
    return cell;
}

TableEntry.prototype.setName = function(val){
    this._nameElem.textContent = val;
    this._name = val;
}
TableEntry.prototype.setCheckOut = function(val){
    const date = (new Date(val));
    this._dateElem.textContent = date.toLocaleDateString();
    this._checkoutElem.textContent = date.toLocaleTimeString();
    this._checkout = val;
}
TableEntry.prototype.setCheckIn = function(val){
    this._checkinElem.textContent  = (new Date(val)).toLocaleTimeString();
    this._checkin = val;
}
TableEntry.prototype.setElapsed = function(val){
    this._elapsedElem.textContent = formatMs(val);
    this._elapsed = val;
}
TableEntry.prototype.setCount = function(val){
    this._countElem.textContent = val;
    this._count = val;
}

function CheckInTracker(config){
    this._textcontents = config.stuff !== undefined ? config.stuff : "";
    this._checkedout = false;
    this._checkoutTime = new Date();
    this._checkinElem = config.checkinElem !== undefined ? config.checkinElem : "";
    this._checkoutElem = config.checkoutElem !== undefined ? config.checkoutElem : "";
    this._checkoutTimeElem = config.checkoutTimeElem !== undefined ? config.checkoutTimeElem : "";
    this._checkoutElapsedElem = config.checkoutElapsedElem !== undefined ? config.checkoutElapsedElem : "";
    this._checkoutTimeElem.textContent = "Welcome";
    this._checkoutElapsedElem.innerHTML = '&nbsp;';
    this._checkoutTableElem = config.checkoutTableElem !== undefined ? config.checkoutTableElem : "";
    this._currentCheckoutRow = undefined;
}

CheckInTracker.prototype.MakeNewRow = function(){
    const table = new TableEntry();
    this._checkoutTableElem.insertBefore(table._tableElem,this._checkoutTableElem.childNodes[0]);
    return table;
}

CheckInTracker.prototype.Save = function(href){
    var dat = JSON.stringify({checkin:"img.jpeg",checkout:"img2.jpeg"});
    var blob = new Blob([dat],{type:"text/plain"});
    href.href = window.URL.createObjectURL(blob);    
    href.target = '_blank';
    href.download = 'testOutput.txt';
}

CheckInTracker.prototype.CheckOut = function(){
    if(!this._checkedout){
        this._checkedout = true;
        this._checkoutTime = new Date();
        this._checkoutElem.classList.add('invisible');
        this._checkinElem.classList.remove('invisible');
        this._checkoutTimeElem.textContent = "Check out at " + this._checkoutTime.toLocaleTimeString();       
        this._currentCheckoutRow = this.MakeNewRow();
        this._currentCheckoutRow.setName("Jackson");
        this._currentCheckoutRow.setCheckOut(this._checkoutTime.getTime());
        this.Update(this._checkoutTime);
    }
}
CheckInTracker.prototype.CheckIn = function(){
    if(this._checkedout){
        this._currentCheckoutRow.setCheckIn((new Date()).getTime());
        this._checkedout = false;
        this._checkoutTime = 0;
        this._checkoutElem.classList.remove('invisible');
        this._checkinElem.classList.add('invisible');
        this._checkoutTimeElem.textContent = "Welcome Back";
        this._checkoutElapsedElem.innerHTML = '&nbsp;';
    }
}

CheckInTracker.prototype.Update = function(date){
    if(this._checkedout){
        const deltaMs = date-this._checkoutTime;
        this._checkoutElapsedElem.textContent = "Elapsed: " + formatMs(deltaMs);
        this._currentCheckoutRow.setElapsed(deltaMs);
    }    
}

const file_input = document.getElementById('file_input');
const download_anchor = document.getElementById('download_anchor');
const checkin = document.getElementById('checkin');
const checkout = document.getElementById('checkout');
const checkout_time = document.getElementById('checkout_time');
const checkout_elapsed = document.getElementById('checkout_elapsed');
const current_time = document.getElementById('current_time');
current_time.textContent = (new Date()).toLocaleString();
const checkout_table = document.getElementById('checkout_table');
var current_tracker = new CheckInTracker({
    checkinElem:checkin,
    checkoutElem:checkout,
    checkoutTimeElem:checkout_time,
    checkoutElapsedElem:checkout_elapsed,
    checkoutTableElem:checkout_table
});

function LoadFile(file){
    return new Promise(function(resolve, reject){
        var freader = new FileReader();
        freader.onload = function(e){
            resolve(new CheckInTracker(e.target.result,checkin,checkout));
        }
        freader.onerror = function(e){
            reject(e);
        }
        freader.readAsText(file);
    });
}

checkout.addEventListener('click',function(){
    current_tracker.CheckOut();
});
checkin.addEventListener('click',function(){
    current_tracker.CheckIn();
});

document.getElementById('load').addEventListener('click', function(){
    file_input.click();
});
file_input.addEventListener('change', function(e){
    LoadFile(e.target.files[0]).then(function(tracker){
        current_tracker = tracker;
    });
});

document.getElementById('save').addEventListener('click',function(){
    if(current_tracker !== undefined){
        current_tracker.Save(download_anchor);
        download_anchor.click();
    }
});

function TimeFormat(date){
    return date.get
}

setInterval(function(){
    const date = new Date();
    current_time.textContent = date.toLocaleString();
    current_tracker.Update(date);
},1000);

// var test = 0;
// setInterval(function(){
//     const date = new Date(test);
//     current_time.textContent = date.toLocaleTimeString();
//     current_tracker.Update(date);
//     test+=1000;
// },10);