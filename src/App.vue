<template lang="pug">
  v-app
    v-content
      v-container
        v-layout( row wrap )
          v-flex( md4 offset-md4 ) 
            v-text-field( label="Name" v-model="name" ) 
            v-text-field( label="Surname" v-model="surname" )
            v-text-field( label="Birthdate" mask="####/##/##" hint="YYYY/MM/DD" v-model="birthdate" )
            v-text-field( label="Email Address" v-model="email" )
            v-text-field( label="Phone Number" v-model="phoneNumber" hint="format: 0761004567" )            
            v-text-field( counter="145" multi-line label="Bio" hint="Just a short description of you :)" v-model="bio" ) 
            v-select.mt-2.mb-2( chips label="List some of your hobbies (hit tab after entering a hobby)" v-model="hobbies" clearable tags solo )
              template( slot="selection" slot-scope="data" )
                v-chip( :selected="data.selected" @input="remove(data.item)" close )
                  strong {{ data.item }}
            v-select( :items="socialPlatforms" v-select="platformsSelected" multiple label="Social Media" hint="which social media platforms do you use?" persistent-hint )
            //- img( :src="qrcode_url" )
            v-btn.mt-5( color="primary" @click="submit" ) Submit
            v-dialog( v-model="showQrcode" max-width="300" )
              v-card
                v-card-title QR Code
                v-card-text
                  img( :src="qrcode_url" )
            v-snackbar( v-model="showSnack" timeout=3000 top left )
              span Generating QR Code              
              v-progress-circular( indeterminate color="green" )
</template>

<script>
  export default {
    data: () => ({
      name: "",
      surname: "",
      birthdate: "",
      hobbies: [],
      bio: "",
      email: "",
      platformsSelected: [],
      socialPlatforms: [
        "WhatsApp",
        "Facebook",
        "Instagram",
        "Linkedin"
      ],
      phoneNumber: "",
      qrcode_url: "",
      showQrcode: false,
      showSnack: false,
      url: ""
    }),
    methods: {
      remove(index) {
        this.hobbies.splice(this.hobbies.indexOf(item), 1)
        this.hobbies = [...this.hobbies]
      },
      submit() {
        this.showSnack = true;
        this.$http.post("http://172.20.0.13:3000/generate",{
          user: {
            name: this.name,
            surname: this.surname,
            hobbies: this.hobbies,
            bio: this.bio,
            email: this.email,
            platformsSelected: this.platformsSelected,
            phoneNumber: this.phoneNumber
          }
        }).then(res => {
          let { id } = res.data;
          this.qrcode_url = this.qrcode(id);
          this.url = `http://qrcode.nanoapp.io/get_profile/id?=${id}`
        })
      },
      qrcode(data) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://qrcode.nanoapp.io/get_profile/?id=${data}`
      }
    },
    watch: {
      "showSnack": function(n,o) {
        if(!n) {
          this.showQrcode = true;
        }
      }
    }
  }
</script>
