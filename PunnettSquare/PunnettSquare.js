function inputchanged(e)
{
    var val1 = document.getElementById("p01").value;
    var val2 = document.getElementById("p02").value;

    var val3 = document.getElementById("p10").value;
    var val4 = document.getElementById("p20").value;

    document.getElementById("A").innerText = val1+val3
    document.getElementById("B").innerText = val2+val3

    document.getElementById("C").innerText = val1+val4
    document.getElementById("D").innerText = val2+val4
}