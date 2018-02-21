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
            adresse : '',
            avatar : 'https://www.w3schools.com/w3css/img_avatar3.png',
            highlighted : false
        }
    },

    created : function() {
        // Init firebase
        firebase.initializeApp({
            apiKey: "AIzaSyC8hI-mObh6_zC4CHCsErTcfSu3msojp4o",
            authDomain: "formation-tz.firebaseapp.com",
            databaseURL: "https://formation-tz.firebaseio.com",
            projectId: "formation-tz",
            storageBucket: "gs://formation-tz.appspot.com",
            messagingSenderId: "604798803445"
        });
        this.database = firebase.database();
        this.storage = firebase.storage().ref();

        // Listeners to /members
        this.database.ref('members').on('value', snapshot => this.members = snapshot.val());
    },

    methods : {
        startCounter: function () {
            this.timer = window.setInterval(() => ++this.counter, 1000);
        },

        stopCounter: function () {
            this.counter = 0;
            if (this.timer) window.clearInterval(this.timer);
        },

        // Init or Reset form
        resetUserForm: function () {
            this.userForm = {
                guid: null,
                nom: '',
                prenom: '',
                birth: null,
                tel: null,
                email: '',
                adresse: '',
                avatar : 'https://www.w3schools.com/w3css/img_avatar3.png',
                highlighted : false
            }
        },

        addMember: function () {
            if (this.userForm.nom === '') return;
            this.database.ref('members/' + (this.userForm.guid ? this.userForm.guid : String.guid())).set(this.userForm);
            // Reset form
            this.resetUserForm();
        },

        editMember: function (guid, member) {
            this.userForm = member;
            this.userForm.guid = guid;
        },

        removeMember: function (guid) {
            // Remove database
            this.database.ref('members/' + guid).remove();
            // Remove avatar
            this.storage.child('avatar/' + guid)
                .delete()
                .catch(err => console.info(err.message));
            // Reset form
            this.resetUserForm();
        },

        //--------------------------------------------
        // Drag Droop upload
        imgDragEnter: function (event, member, guid) {
            member.highlighted = true;
            return false;
        },
         imgDragOver: function (event, member, guid) {
            event.preventDefault();
            event.stopPropagation();
            member.highlighted = true;
            return false;
        },
        imgDragLeave: function (event, member, guid) {
            event.preventDefault();
            event.stopPropagation();
            member.highlighted = false;
            return false;
        },
        imgDrop: function (event, member, guid) {
            event.preventDefault();
            event.stopPropagation();
            member.highlighted = false;
            if(! event.dataTransfer.files.length) return false;

            // Upload file
            const f = event.dataTransfer.files[0];
            // Only process image files.
            if (!f.type.match('image/jpeg') && !f.type.match('image/png')) {
                alert('The file must be an image');
                return false ;
            }
            const reader = new FileReader();
            reader.addEventListener('loadend', evt => {
                if(evt.target.result.byteLength > 150000) {
                    alert('Image too large, size must be less than 150kB');
                    return false;
                }
                this.storage.child('avatar/' + guid).put(evt.target.result, {
                    contentType: f.type,
                }).then(snapshot => {
                    if(snapshot.downloadURL) {
                        member.avatar = snapshot.downloadURL;
                        // Save member
                        this.database.ref('members/' + guid).set(member);
                    }
                });
            });
            reader.readAsArrayBuffer(f);
            return false;
        }
    }
});