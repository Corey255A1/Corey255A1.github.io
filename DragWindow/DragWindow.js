var TopWindow = null;

function MoveableWindow(elem)
{
    const Elem = elem;
    const Title = elem.getElementsByClassName("titlebar")[0];
    const Window = this;
    this.Width = elem.offsetWidth;
    this.Height = elem.offsetHeight;
    this.UnFocus = function(){
        Title.classList.remove("titlebar-focused");
    }
    this.LowerZ = function(){
        Elem.style.zIndex--;
    }
    function onMouseMove(e){
        e = e || window.event;
        e.preventDefault();
        Elem.style.top=(e.pageY-(Title.offsetHeight/2))+"px";
        Elem.style.left=(e.pageX-(Title.offsetWidth/2))+"px";
    }
    function onMouseUp(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = null;
        document.onmousemove = null;
    }
    
    Title.onmousedown = function(e)
    {
      e = e || window.event;
      e.preventDefault();
      Elem.style.zIndex = 100;
      if(TopWindow!=null && TopWindow != Window)
      {
          TopWindow.LowerZ();
          TopWindow.UnFocus();
      }
      TopWindow = Window;
      Title.classList.add("titlebar-focused");
      document.onmouseup = onMouseUp;
      document.onmousemove = onMouseMove;
    }
    
}

WindowList = []
var movelist = document.getElementsByClassName("moveable");
for(var w=0;w<movelist.length;++w)
{
    WindowList.push(new MoveableWindow(movelist[w]));
}

