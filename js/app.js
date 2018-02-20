String.guid = function() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
};

const app = new Vue({
    el: '#app',
    data: {
        title: 'Vue.js Getting Started',
        counter : 0,
        members : [],
        userForm : {
            guid: null,
            nom: '',
            prenom: '',
            birth : null,
            tel : null,
            email : '',
            adresse : ''
        }
    },

    created : function() {
        // Init firebase
        firebase.initializeApp({
            apiKey: "AIzaSyC8hI-mObh6_zC4CHCsErTcfSu3msojp4o",
            authDomain: "formation-tz.firebaseapp.com",
            databaseURL: "https://formation-tz.firebaseio.com",
            projectId: "formation-tz",
            storageBucket: "",
            messagingSenderId: "604798803445"
        });
        this.database = firebase.database();

        // Listeners to /members
        this.database.ref('members').on('value', snapshot => this.members = snapshot.val());
    },

    methods : {
        startCounter : function() {
            this.timer = window.setInterval(() => {
                ++this.counter;
            }, 1000);
        },

        stopCounter : function() {
            this.counter = 0;
            if(this.timer) window.clearInterval(this.timer);
        },

        // Init or Reset form
        resetUserForm : function() {
            this.userForm = {
                guid: null,
                nom: '',
                prenom: '',
                birth : null,
                tel : null,
                email : '',
                adresse : ''
            }
        },

        addMember : function() {
            if(this.userForm.nom === '') return;
            this.database.ref('members/' + (this.userForm.guid? this.userForm.guid : String.guid())).set(this.userForm);
            // Reset form
            this.resetUserForm();
        },

        editMember : function(guid, member) {
            this.userForm = member;
            this.userForm.guid = guid;
        },

        removeMember : function (guid) {
            this.database.ref('members/' + guid).remove();
        }
    }
});