var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {

    var config = {
      apiKey: "AIzaSyAL9f4Z8jXGL9DIGjpaOWcv4Ivwi45zoOY",
      authDomain: "we-connect-test-7b828.firebaseapp.com",
      databaseURL: "https://we-connect-test-7b828.firebaseio.com",
      projectId: "we-connect-test-7b828",
      storageBucket: "we-connect-test-7b828.appspot.com",
      messagingSenderId: "994491153025"
    };
    firebase.initializeApp(config);

    firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    });
    
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 3 });
    self.scanner.addListener('scan', function (content, image) {
      var userid = (String(content).match(/USERID:\d{0,100}/)[0].replace("USERID:",""));
      console.log(userid)
      self.insertToFirebase(userid)
      self.scans.unshift({ date: +(Date.now()),IDUser: userid});
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      console.log(name)
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    },
    insertToFirebase: function (data) {
      console.log(data)
      var millseconds = (new Date).getTime();
      var database = firebase.database();
      var ref = database.ref('eventRegister/registered/courseA/');
      var key = ref.push().key;
      var dataSet = {
        checkln: millseconds
      }

      firebase.database()
      .ref('eventRegister/registered/courseA/'+key+'/' +data)
      .set(dataSet);
      alert("Seve checkin ID:"+name+ " success")
    }
  }
});
