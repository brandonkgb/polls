var names = ['option A', 'option B', 'option C'];
initializeOptions(names);

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
    names.forEach(_name => {
        db.collection("options").doc(_name).set({
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

