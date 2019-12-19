$(function() {
    $names = ['optionA', 'optionB', 'optionC'];
    initializeOptions($names);

    $questionDict = getAllQuestions();

    $results = new Array();

    setTimeout(function() {
        if ($questionDict != null) {

            for (var key in $questionDict) {
                $resultsObject = new Object();
                $resultsObject["questionID"] = key;

                $("#questionBody").append(
                    `<div id=${key} class='question'> ${$questionDict[key]} </div>`
                );

                $(`#${key}`).append(
                    `<div class='selectorDiv'>
                        <select id=${key}-select> 
                            <option disabled selected value> -- Select Someone! -- </option>
                        </select>
                    </div>`
                );

                $names.forEach(function(name) {
                    $(`#${key}-select`).append(
                        `<option value= ${name} class='voteOption'> ${name} </option>`
                    );

                    $resultsObject[name] = 0;
                });

                $results.push($resultsObject);
            }
        }
    }, 2000);

    $("#submitButton").on('click', function() {
        $selectionsDict = new Object();

        $(".question").each(function(){
            $selectionsDict[this.id] = $(`#${this.id} #${this.id}-select`).val();
        });    

        $isFormValid = validateOptions($selectionsDict);
        
        if ($isFormValid) {
            submitResponses($selectionsDict);
        } else {
            alert("Please cast a vote for each question.");
        }
    });
});

function createQuestion(collectionName, documentName, content) {
    db.collection(collectionName).doc(documentName).set({
        name: content
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    }); 
}

function initializeOptions(names) {
    names.forEach(function(_name) {
        db.collection('options').doc(_name).set({
            name: _name
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        }); 
    });
}

function getAllQuestions() {
    var questionsRef = db.collection('questions');
    var tempDict = new Object();

    questionsRef.get().then(function(questionSet) {
        questionSet.docs.map(doc => {
            if (doc.data() != null) {
                tempDict[doc.id] = doc.data().name;
            } else {
                console.log("No question data...");
            }
        });
    });

    return tempDict;
}

function validateOptions(selectionsDict) {
    for (var key in selectionsDict) {
        if (selectionsDict[key] == undefined) {
            return false;
        }
    }

    return true;
}

function submitResponses(selectionsDict) {
    for (var key in selectionsDict) {
        db.collection("responses").doc().set({
            questionID: key,
            selection: selectionsDict[key]
        })
        .then(function() {
            console.log("Responses submitted.");
            $('#submitButton').attr("disabled", true);
            $('#submitButton').removeClass('enabledButton');
            $('#submitButton').addClass('disabledButton');
            $('#submitButton').html('Done. Thanks! :)')
        })
        .catch(function(error) {
            console.error("Error submitting responses: ", error);
        });
    }
}

function getResults() {
    var responsesRef = db.collection('responses');
    var tempDict = new Object();

    resetResults();

    responsesRef.get().then(function(responseSet) {
        responseSet.docs.map(doc => {
            if (doc.data() != null) {
                $results.forEach(function(resultsObject) {
                    if (doc.data().questionID == resultsObject["questionID"]) {
                        resultsObject[doc.data().selection] += 1;
                    }
                });
            } else {
                console.log("No response data...");
            }
        });
    });

    setTimeout(function(){
        console.log($results);
        finalResults = countResults($results);
        console.log(finalResults);
        printResults(finalResults);
    }, 2000);
}

function resetResults() {
    for (i = 0; i < $results.length; i++) {
        for (var key in $results[i]) {
            if (key != 'questionID') {
                $results[i][key] = 0;
            }
        } 
    }
}

function countResults(results) {
    var finalResults = new Array();

    $results.forEach(function(resultsObject) {
        highestCount = 0;
        for (var key in resultsObject) {
            if (resultsObject[key] > highestCount) {
                finalResults[resultsObject["questionID"]] = new Array();
                finalResults[resultsObject["questionID"]].push(key);
                highestCount = resultsObject[key];
            } else if (resultsObject[key] == highestCount && highestCount != 0) {
                finalResults[resultsObject["questionID"]].push(key);
            }
        }
    });

    return finalResults;
}

function printResults(results) {
    for (var questionKey in $questionDict) {
        console.log(`---${$questionDict[questionKey]}---`);

        results[questionKey].forEach(function(winner){
            console.log(winner)
        });
    }
}
