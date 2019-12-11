$(function() {
    $names = ['optionA', 'optionB', 'optionC'];
    initializeOptions($names);

    $questionDict = getAllQuestions();

    setTimeout(function() {
        if ($questionDict != null) {

            for (var key in $questionDict) {
                $("#questionBody").append(
                    `<div id=${key} class='question'> ${$questionDict[key]} </div>`
                );

                $names.forEach(function(name) {
                    $("#" + key).append(
                        `<input type='radio' name=${key} value= ${name} class='voteOption'> ${name} </input>`
                    );
                });
            }   
        }
    }, 1000);

    $("#submitButton").on('click', function() {
        $selectionsDict = new Object();

        $(".question").each(function(){
            $selectionsDict[this.id] = $(`#${this.id} input[name=${this.id}]:checked`).val()
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
        })
        .catch(function(error) {
            console.error("Error submitting responses: ", error);
        });
    }
}
