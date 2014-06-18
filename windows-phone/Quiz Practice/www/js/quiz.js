var app = {
    tags: {},

    questions: [],
    currentQuestion: null,
    currentQuestionIndex: -1,

    // Application Constructor
    initialize: function (questions) {
        app.questions = questions;
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function () {
        app.tags.content = document.getElementById("content");
        app.tags.variants = document.getElementById("variants");
        app.tags.nextButton = document.getElementById("nextQuestionButton");

        app.randomizeQuestion();
        app.UI.updateQuestion();
        app.UI.bindNextButton();
    },

    randomizeQuestion: function () {
        var questionIndex = -2;
        do {
            questionIndex = Math.floor((Math.random() * app.questions.length));
        }
        while (questionIndex == app.currentQuestionIndex);

        app.currentQuestionIndex = questionIndex;
        app.currentQuestion = app.questions[app.currentQuestionIndex];
    },

    checkAnswers: function(chosenVariant) {
        if (chosenVariant.getAttribute("data-variantid") == app.currentQuestion.goodVariant) {
            app.UI.markAsGood(chosenVariant);
        }
        else {
            app.UI.markAsBad(chosenVariant);
            app.UI.markAsGood(app.tags.variants.children[app.currentQuestion.goodVariant]);
        }
    },

    UI: {
        clearVariants: function () {
            while (app.tags.variants.firstChild) {
                app.tags.variants.removeChild(app.tags.variants.firstChild);
            }
        },

        addVariant: function (variantid) {
            var text = app.currentQuestion.variants[variantid];
            var newListElement = document.createElement("li");
            newListElement.appendChild(document.createTextNode(text));
            newListElement.setAttribute("data-variantid", variantid);
            app.tags.variants.appendChild(newListElement);
        },

        updateQuestion: function () {
            app.tags.content.innerHTML = app.currentQuestion.content;
            
            app.UI.clearVariants();

            for (var i = 0; i < app.currentQuestion.variants.length; i++) {
                app.UI.addVariant(i);
            }

            app.UI.bindVariants();
        },

        bindVariants: function () {
            for (var i = 0; i < app.currentQuestion.variants.length; i++) {
                app.tags.variants.children[i].addEventListener("click", function () {
                    app.UI.unmarkAll();
                    app.checkAnswers(this);
                }, false);
            }
        },

        markAsGood: function (variantTag) {
            variantTag.classList.add("good");
        },

        markAsBad: function (variantTag) {
            variantTag.classList.add("bad");
        },

        unmarkAll: function () {
            for (var i = 0; i < app.tags.variants.children.length; i++) {
                app.tags.variants.children[i].className = "";
            }
        },

        bindNextButton: function () {
            app.tags.nextButton.addEventListener("click", function () {
                app.randomizeQuestion();
                app.UI.updateQuestion();
            }, false);
        }
    }
};