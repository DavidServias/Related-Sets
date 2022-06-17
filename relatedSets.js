import * as display from '/display.js';

//TODO:
// 4. add some color


const start = function() {
    display.createCheckBoxes();
    display.reset();
    // add event listeners
    document.getElementById('reset').addEventListener('click', display.reset);
    document.getElementById('getSets').addEventListener('click', getPitchClassSet);

}


class SetFunctions {
    // input = starting pitch. 
  // nuHalfSteps = number of half steps to add
  // convert to mod 12. If result is greater than 11, subract
  // 12 until result is between 0 and 11.
  addMod12(input, numHalfSteps) {
    let result;
    result = input + numHalfSteps;
    while(result > 11) {
      result = result - 12;
    }
    return result;
  }

  // original set = array of pitch set (assumed already in normal form)
  // numHalfSteps is the number applied to each pitch class
  transposeSet(originalSet, numHalfSteps) {
    let result = [...originalSet]; 
    for(let i = 0; i < result.length; i++) {
      result[i] = this.addMod12(result[i], numHalfSteps);
    }
    return result;
  } 


  //returns the inversion of originalSet in normal order.
  invertSet(originalSet) {
    let result = [...originalSet];
    let invertedVal;
    for(let i = 0; i < result.length; i++) {
      invertedVal = result[i];
      invertedVal = 0 - invertedVal;
      if(invertedVal < 0) {
        invertedVal = invertedVal + 12;
      }
      result[i] = invertedVal;
    }
    // put into normal form
    result = this.toNormalForm(result);
    return result;
  }


  //converts set to normal Form.
  // TODO: it seems to handle ties correctly, but I'm not exactly sure
  // why.
  toNormalForm(originalSet) {
    // sort from smallest to largest.
    originalSet = originalSet.sort(function(a, b){return a-b});

    // this array will store the intervals from largest to smallest.
    let mostCompactSet = originalSet.slice();
    let testSet = originalSet.slice();
    let firstPitchClass;

    //Get first rotation and save to testSet
    firstPitchClass = testSet.shift();
    testSet.push(firstPitchClass);

    for(let i = 0; i < originalSet.length; i++) {    
      if ( this.isMoreCompact(testSet, mostCompactSet ) === 'true' ) {
        mostCompactSet = testSet.splice(0, testSet.length, ...testSet);
      };

      //Get next rotation and save to testSet
      firstPitchClass = testSet.shift();
      testSet.push(firstPitchClass);
    };
    return mostCompactSet;
  }

  toPrimeForm(pitchClassSet) {
    let primeForm;

    //put in normal form  
    let originalSet = this.toNormalForm(pitchClassSet);

    //invert set
    let invertedSet = this.invertSet(pitchClassSet);
    
    //compare originalSet with inverted.
    if (this.isMoreCompact(invertedSet, originalSet) === 'true') {
        //if inverted is more compact transpose inverted to zero, and assign
        // result to primeForm.
        primeForm = this.transposeSet(invertedSet, 12 - invertedSet[0] );
    } 
    else {
        primeForm = this.transposeSet(originalSet, 12 - originalSet[0] );
    }
    
    return primeForm;
  }

  // Finds the intervals in a pitch set from outside in, 
  // for calculating normal form.
  //  [0,4,7] would produce [7, 4].
  getIntervals(setToProcess) {
    let intervals = [];
    let interval; 
    let iterator = setToProcess.length-1;
    while (iterator > 0) {
      interval = (setToProcess[iterator] - setToProcess[0]);

      // if negative, change to mod 12.
      while(interval < 0) {
        interval += 12;
      }
      intervals.push(interval);
      iterator = iterator -1;
    } 
    return intervals;
  }


  // returns true intervalSetA is more compact than intervalSetB.
  // else returns false.
  isMoreCompact(setA, setB) {
      let index = 0;
      let intervalSetA = this.getIntervals(setA);
      let intervalSetB = this.getIntervals(setB);

      while(index < intervalSetA.length) {
        //console.log("comparing " + intervalSetA[index] + 'to' + intervalSetB[index] );
        // if first set wins:
        if(parseInt(intervalSetA[index]) < parseInt(intervalSetB[index]) ) {
          return 'true';
        // else if second set wins:
        } 
        else if (parseInt(intervalSetA[index]) > parseInt(intervalSetB[index]) ){
          return 'false';
        }
        index = index + 1;
      };
      // if no winner found, return tie
      return 'tie';  
  }


  // returns all of the transpostions of a given set as an array
  // of arrays.
  getTranspositions(pitchClassSet) {
    let transpositions = [];
    let newSet = [];
    for (let i = 0; i < 12; i++) {
      newSet = this.transposeSet(pitchClassSet, i);
      transpositions.push(newSet);
    }
    return transpositions;
  }


  // returns the inversion at all of its transpositions
  // as an array of arrays.
  getInversions(pitchClassSet) {
    let inversions = [];
    let newSet = [];
    newSet = this.invertSet(pitchClassSet);
    inversions.push(newSet);
    for (let i = 1; i < 12; i+=1) {
      inversions.push(this.transposeSet(newSet, i));
    }
    return inversions;
  }

};


class RelatedSets extends SetFunctions{
  constructor(originalSet) {
    super();
    this.originalSet = originalSet;
    this.normalForm = this.toNormalForm(originalSet);
    this.transpositions = this.getTranspositions(this.normalForm);
    this.inversions = this.getInversions(originalSet);
  }
  getT(numHalfSteps) {
    return this.transpositions[numHalfSteps];
  }
  getI(numHalfSteps = 0) {
    return this.inversions[numHalfSteps];
  }
  getPrimeForm() {
      let primeForm = this.toPrimeForm(this.originalSet);
      let primeFormString = "(";
      for (let i = 0; i < primeForm.length; i++) {
        if(primeForm[i] < 10) {
          primeFormString += primeForm[i].toString();
        } else if (primeForm[i] === 10) {
          primeFormString += 'T';
        } else if (primeForm[i] === 11) {
          primeFormString += 'E';
        }
      }
      primeFormString += ')';
      return primeFormString;
  }
  getNormalForm() {
    return this.toNormalForm(this.originalSet);
  }
  
}


// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(parseInt(checkboxes[i]['value']) );
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

// Call as
const getPitchClassSet = function() {
  let pitchClassSet = getCheckedBoxes("pc");
  if (pitchClassSet === null) {
    console.log('empty set');
    return;
  }
  let pcSet = document.getElementById('pc-set');
  pcSet.innerHTML = 'Normal Form: ' ;
  
  let trn = document.getElementById('transpositions');
  let inv = document.getElementById('inversions');
  // trn.innerHTML = "Transpositions: ";
  // inv.innerHTML = "Inversions: ";
 
  
  let relatedSets = new RelatedSets(pitchClassSet);
  
  let htmlString;
  
  let transposition;
  let inversion;
  let normalForm = relatedSets.getNormalForm();
  pcSet.innerHTML += ' [' + normalForm + '] ' ;
  
  // clear old results from transpositions and inversions
  document.getElementById('transpositions').innerHTML = '<p class="heading">Transpositions:</p>';
  document.getElementById('inversions').innerHTML = '<p class="heading">Inversions:</p>';
  for (let i = 0; i<12; i++) {
    transposition = relatedSets.getT(i);
    inversion = relatedSets.getI(i);
    
    // add next transposition to the display
    htmlString ='<p>T' + i;
    htmlString += '<span';
    if(transposition[0] === 0) {
       htmlString += ' style="color:blue"'; 
    }
    htmlString += '>: ['+ transposition +'] </span>';
    htmlString += '</p>';
    trn.innerHTML += htmlString;
    
    // add the next inversion to the display
    htmlString ='<p>T' + i + 'I';
    htmlString += '<span';
    if(inversion[0] === 0) {
       htmlString += ' style="color:blue"'; 
    }
    htmlString += '>: ['+ inversion +'] </span>';
    htmlString += '</p>';
    inv.innerHTML += htmlString;
  };
  
  let pf = document.getElementById('prime-form');
  pf.innerHTML = "PrimeForm: ";
  pf.innerHTML += relatedSets.getPrimeForm();
    
}
  
start();