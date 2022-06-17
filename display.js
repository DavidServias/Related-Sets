export function createCheckBoxes() {
    var checkBoxOuterBox = document.getElementById("checkBoxOuterBox");
    for (let i = 0; i < 12; i++) {
        // create container
        let checkBoxContainer = document.createElement("div");
        checkBoxOuterBox.append(checkBoxContainer);
        checkBoxContainer.outerHTML = '<div class="checkBoxContainer"></div';

        // create checkbox
        let checkBox = document.createElement("input");
        checkBox.setAttribute("type","checkbox" );
        checkBox.setAttribute("id", "pc" + i);
        checkBox.setAttribute("name", "pc");
        checkBox.setAttribute("value", i);
        checkBoxContainer.appendChild(checkBox);

        // create label element
        let label = document.createElement("p");
        label.setAttribute("for","pc" + i.toString() );
        label.innerHTML = i;
        checkBoxContainer.appendChild(label);

        checkBoxOuterBox.appendChild(checkBoxContainer);
    }
    
};

export function clearCheckBoxes() {
    var checkboxes = document.getElementsByName('pc');
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       checkboxes[i].checked = false;
    }
};

// sets all the checkboxes to unchecked
// clears out all of the repsonses from 
// previous calculations
export function reset() {
    clearCheckBoxes();
    clearSets();
}


export function clearSets() {
    document.getElementById('pc-set').innerHTML = '<p id="normal-form" class="heading">Normal Form: [empty]</p>';
    document.getElementById('transpositions').innerHTML = '<p class="heading">Transpositions:</p>';
    document.getElementById('inversions').innerHTML = '<p class="heading">Inversions:</p>';
    document.getElementById('prime-form').innerHTML = '<p id="prime-form" class="heading">Prime Form: </p>';
}