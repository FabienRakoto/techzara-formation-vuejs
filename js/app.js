String.guid = function() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
};

const app = new Vue({
    el: '#app',
    data: {
        database : null,
        title: 'Vue.js getting started',
        counter : 0,
        members : [],
        userForm : {
            nom: '',
            prenom: '',
            age : null,
            tel : null,
            email : '',
            adresse : ''
        }
    },

    created : function() {
        this.database = firebase.database();
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

        addMember : function() {
            if(this.userForm.nom === '') return;
            this.database.ref('members/' + String.guid()).set(this.userForm);
        }
    }
});