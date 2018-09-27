
document.getElementById("solveBtn").onclick = function(){
  for(var n in ThePoints) ThePoints[n].Node.Reset();
  for(var l in TheLines) TheLines[l].Highlight = false;
 document.getElementById("message").innerText = "";
 StartPoint.Node.PathDistance = 0;    
 var CurrentNode = StartPoint.Node;
 while(CurrentNode!=EndPoint.Node && !CurrentNode.Visited)
 {
     for(var cidx in CurrentNode.Connections)
     {
         var connection = CurrentNode.Connections[cidx];
         var neighbor = connection.GetOtherNode(CurrentNode);
         var k = CurrentNode.PathDistance + connection.Distance;
         if(k<neighbor.PathDistance)
         {
             neighbor.PreviousNode = CurrentNode;
             neighbor.PathDistance = k;
         }
     }
     CurrentNode.Visited = true;
     ThePoints.sort(function(a,b)
     {
        if(a.Node.Visited && !b.Node.Visited) return 1;
        else if(b.Node.Visited && !a.Node.Visited) return -1;
        else return a.Node.PathDistance - b.Node.PathDistance;
     });
     
     CurrentNode = ThePoints[0].Node;
 }
 if(CurrentNode.PreviousNode == null)
 {
     document.getElementById("message").innerText = "No Connection to End";
     return;
 }
 
 var PrevNode = CurrentNode;
 while(PrevNode != StartPoint.Node)
 {
     //PrevNode.Highlight = true;
     console.log(PrevNode.Name + "-" +
       (PrevNode.PathDistance - PrevNode.PreviousNode.PathDistance) + "-" +
       PrevNode.PreviousNode.Name);
     var g = GetLine(PrevNode,PrevNode.PreviousNode);
     g.Highlight = true;
     
     PrevNode = PrevNode.PreviousNode;
 }
 console.log(PrevNode.Name);
 
 
}