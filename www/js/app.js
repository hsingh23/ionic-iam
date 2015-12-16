Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
var app = angular.module('starter', ['ionic','ngCordova', 'ngStorage']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller("MeditationController", function($scope, $cordovaNativeAudio, $ionicPlatform, $ionicLoading, $timeout, $localStorage) {
  $scope.$storage = $localStorage.$default({
    history: [],
    meditationLen: 0
  });

  $scope.ready = false;
  $ionicPlatform.ready(function() {
    try {
      $cordovaNativeAudio
      .preloadSimple('ting', 'ting.mp3')
      .then(function (msg) {
        $scope.ready = true;
        console.log(msg);
      }, function (error) {
        alert(error);
      });
    } catch (e) {
      console.log("no audio");
    }

  });

  var times = [
    8*60+30,
    2*60,
    10+10,15,10,
    5, 55,15,15,15,15,
    15,15,15,15,15,15,
    15,15,15,15,15,15,
    30,90,120,
    10,8,8,8,8,8,8,
    30,
    $scope.$storage.meditationLen*60,
    120,5*60,0
  ];
  var started, startTime, pos =0;
  $scope.formatDate = function(m){
    return moment(m).format("dd M/D a")
  };
  var playTingAfterTime = function(){
    if (pos < times.length){
      // play sound
      try {
        $cordovaNativeAudio.play("ting");
      } catch(e) {
        console.log("playing");
      }
      pos+=1;
      started = $timeout(playTingAfterTime,times[pos]*1000);
    } else {
      var x= {date:moment(), meditationLen:$scope.$storage.meditationLen};
      $scope.$storage.history.insert(0,x);
    }
  };
  $scope.play = function () {
    pos = 0;
    startTime = new Date();
    $timeout.cancel(started);
    playTingAfterTime();
  };
});
