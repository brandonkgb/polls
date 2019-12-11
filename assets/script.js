$(function() {
    $names = ['option A', 'option B', 'option C'];
    initializeOptions($names);
    $questions = getAllQuestions();

    setTimeout(function() {
        if ($questions != null) {
            $questions.forEach(function(question, i) {
                console.log(question);
                $("#questionBody").append(
                    "<div id=question" + i + " class='question'>" + question + "</div>"
                );

                $names.forEach(function(name) {
                    $("#question" + i).append(
                        "<input type='radio'" + " name=test" +  "value=" + name + " class='voteOption'>" + name + "</input>"
                    );
                });
            });
        }

    }, 500);
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
    var tempQuestions = new Array();

    questionsRef.get().then(function(questionSet) {
        questionSet.docs.map(doc => {
            if (doc.data() != null) {
                tempQuestions.push(doc.data().name)
            } else {
                console.log("No question data...");
            }
        });
    });

    return tempQuestions;
}
