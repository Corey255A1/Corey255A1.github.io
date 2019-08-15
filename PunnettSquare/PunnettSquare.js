function inputchanged(e)
{
    var val1 = document.getElementById("p01").value;
    var val2 = document.getElementById("p02").value;

    var val3 = document.getElementById("p10").value;
    var val4 = document.getElementById("p20").value;

    var cells = [];
    cells.push([val1,val3].sort().join(""));
    cells.push([val2,val3].sort().join(""));
    cells.push([val1,val4].sort().join(""));
    cells.push([val2,val4].sort().join(""));

    document.getElementById("A").innerText = cells[0];
    document.getElementById("B").innerText = cells[1];

    document.getElementById("C").innerText = cells[2];
    document.getElementById("D").innerText = cells[3];

    if(val1!=="" && val2!=="" && val3!=="" && val4!=="")
    {
        var map = {}
        for(c in cells)
        {
            if(cells[c] in map)
            {
                map[cells[c]]+=25;
            }
            else
            {
                map[cells[c]] = 25;
            }
        }
        var probs = ""
        for(k in map)
        {
            probs += k+"=" + map[k] + "% ";
        }
        document.getElementById("probs").innerText = probs;
    }
    else
    {
        document.getElementById("probs").innerText = ""
    }
}