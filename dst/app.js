/*
 * Soyto.github.io (0.13.22)
 *     DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *         Version 2, December 2004
 * 
 * Copyright (C) 2012 Romain Lespinasse <romain.lespinasse@gmail.com>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 * 
 */
/* global moment, marked */
(function(ng, navigator, moment, marked){
  'use strict';

  ng.module('mainApp',[
    'ngRoute',
    'ngSanitize',
    'angular-loading-bar',
    'chart.js',
	  'mgcrea.ngStrap',
	  'ngAnimate'
  ]);

  ng.module('mainApp').constant('$moment', moment);
  ng.module('mainApp').constant('$marked', marked);
  ng.module('mainApp').config(['$routeProvider', configRoutes]);
  ng.module('mainApp').config(['cfpLoadingBarProvider', cfpLoadingBarFn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
  var $$IS_MOBILE =  IS_MOBILE_REGEX_1.test(navigator.userAgent) || IS_MOBILE_REGEX_2.test(navigator.userAgent.substr(0,4));

  function configRoutes($routeProvider) {

    //Index route
    var _indexRouteData = {
      'templateUrl': '/app/templates/index.html',
      'controller': 'mainApp.index.controller',
      'resolve': {
        'posts': ['$hs', function($hs){ return $hs.$instantiate('blogService').getAll(); }]
      }
    };
    $routeProvider.when('/', _indexRouteData);

    //Ranking route
    var rankingRouteData = {
      'templateUrl': '/app/templates/ranking.html',
      'controller': 'mainApp.ranking.list.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getLastFromServer($route['current']['params']['serverName']);
        }]
      }
    };
    var rankingRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getLastFromServer($route['current']['params']['serverName']);
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', $$IS_MOBILE ? rankingRouteMobileData :  rankingRouteData);

    var rankingWithDateRouteData = {
      'templateUrl': '/app/templates/ranking.html',
      'controller': 'mainApp.ranking.list.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getFromServer(
              $route['current']['params']['date'],
              $route['current']['params']['serverName']);
        }]
      }
    };
    var rankingWithDateRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getFromServer(
              $route['current']['params']['date'],
              $route['current']['params']['serverName']);
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', $$IS_MOBILE ? rankingWithDateRouteMobileData : rankingWithDateRouteData);


    var characterInfoRouteData = {
      'templateUrl': '/app/templates/characterInfo.html',
      'controller': 'mainApp.characterInfo.controller',
      'resolve': {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs.$instantiate('storedDataService').getCharacterInfo(
              $route['current']['params']['serverName'],
              $route['current']['params']['characterID']);
        }]
      }
    };
    var characterInfoMobileRouteData = {
      'templateUrl': '/app/templates/characterInfo.mobile.html',
      'controller': 'mainApp.characterInfo.mobile.controller',
      resolve: {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs.$instantiate('storedDataService').getCharacterInfo(
              $route['current']['params']['serverName'],
              $route['current']['params']['characterID']);
        }]
      }
    };
    $routeProvider.when('/character/:serverName/:characterID', $$IS_MOBILE ? characterInfoMobileRouteData :  characterInfoRouteData);
  }

  function cfpLoadingBarFn(cfpLoadingBarProvider) {
    cfpLoadingBarProvider['includeSpinner'] = false;
    cfpLoadingBarProvider['includeBar']  = true;
  }

})(angular, navigator, moment, marked);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$moment', 'storedDataService', 'helperService', 'caracterPicsService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, $moment, storedDataService, helperService, caracterPicsService, characterInfo) {

    var $q = helperService.$q;

    $scope._name = CONTROLLER_NAME;


    //Call to init Fn
    _init();

    //When search text changes...
    $scope.performGlobalSearch = function(text, searchNow){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        $scope['searchResults'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      if(searchNow) {

        $q.cancelTimeTrigger('mainApp.index.controller.search');
        $scope['searchTerm'] = text;
        $scope['searchLoading'] = true;

        return storedDataService.characterSearch(text).then(function($data){
          $scope['searchResults'] = $data;
          $scope['searchLoading'] = false;
        });
      }
      else {
        $q.timeTrigger('mainApp.index.controller.search', function () {

          $scope['searchTerm'] = text;
          $scope['searchLoading'] = true;

          return storedDataService.characterSearch(text).then(function ($data) {
            $scope['searchResults'] = $data;
            $scope['searchLoading'] = false;
          });
        }, 2000);
      }
    };


    function _init() {

      //Set page title
      helperService.$scope.setTitle([
        characterInfo.serverName,
        '->',
        characterInfo.data.characterName
      ].join(' '));

      //Set up character and server names and stats
      $scope.serverName = characterInfo.serverName;
      $scope.character = characterInfo.data;

      $scope.character.pictureURL = caracterPicsService.getCharacterPic(characterInfo);

      $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyos';
      $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
      $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

      $scope.character.names = $scope.character.names.sort(_dateSortFn);
      $scope.character.status = $scope.character.status.sort(_dateSortFn);
      $scope.character.guilds = $scope.character.guilds.sort(_dateSortFn);

      //TODO Requested by Daxking, he doesnt' want to they old name be shown
      if(characterInfo.serverName == 'Hellion' && characterInfo.characterID == 430586) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Nyle, he doesnt' want to they old name be shown
      if(characterInfo.serverName == 'Deyla' && characterInfo.characterID == 825556) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Nacka, he doesn't want to they old name be shown
      if(characterInfo.serverName == 'Urtem' && characterInfo.characterID == 1508483) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Chetitos, doesnt want to show old names
      if(characterInfo.serverName == 'Hellion' && characterInfo.characterID == 495423) {
        $scope.character.names.splice(1, $scope.character.names.length - 1);
        $scope.character.guilds.splice(1, $scope.character.guilds.length - 1);
      }

      //TODO Requested by Deyla-Kaijur doesnt want to shown old guild names
      if(characterInfo.serverName == 'Deyla' && characterInfo.characterID == 1266763) {
        $scope.character.guilds.splice(1, $scope.character.guilds.length - 1);
      }


      $scope.character.status.forEach(function(status){
        status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
      });

      //Set up chart
      //TOD for performance the best is have only 30 points
      //ATm we are only retrieving 30 last days, will eb great a system that ponderates days
      $scope.chart = {};

      $scope.chart.options = {
        pointHitDetectionRadius : 4
      };
      $scope.chart.labels = [];
      $scope.chart.series = [characterInfo.data.characterName];
      $scope.chart.data = [[]];

      ng.copy($scope.character.status)
          .sort(function(a, b){ return a.date > b.date ? 1 : -1; })
          .slice($scope.character.status.length - 30) //We only want last 30 days
          .forEach(function(status){
            $scope.chart.labels.push($moment(status.date).format('MM-DD-YYYY'));
            $scope.chart.data[0].push(status.gloryPoint);
          });


      //Data pagination
      $scope.pagination = {
        currentPage: 0,
        numElementsPerPage: 10,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      //Search...
      $scope['searchText'] = '';
      $scope['searchTerm'] = '';
      $scope['searchResults'] = null;
      $scope['searchLoading'] = false;

      _initPagination($scope.character.status, $scope.pagination);
    }

    function _dateSortFn(a, b) { return a.date > b.date ? -1 : 1; }

    //Initializes pagination
    function _initPagination(originalElements, paginationObj) {

      paginationObj.currentPage = 0;
      paginationObj.numPages = parseInt(originalElements.length / paginationObj.numElementsPerPage);
      paginationObj.numElements = originalElements.length;
      paginationObj.fullCollection = originalElements;

      if(originalElements.length % paginationObj.numElementsPerPage > 0) {
        paginationObj.numPages += 1;
      }

      if(paginationObj.numPages === 0){
        paginationObj.numPages = 1;
      }

      paginationObj.currentPageElements = paginationObj.fullCollection.slice(0, paginationObj.numElementsPerPage);

      //Wich are the pageNumbers that we hold
      paginationObj.pageNumbers = Array.apply(null, {length: paginationObj.numPages}).map(function(current, idx){ return idx + 1; }, Number);
    }

    //Fn for pagination Objects that will go to next page
    function _paginationObject_next() {
      var $this = this;

      //If we are on last page
      if($this.currentPage + 1 >= $this.numPages) {
        return; //Dont do nothin
      }

      $this.currentPage += 1;

      var idx = $this.currentPage * $this.numElementsPerPage;

      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Fn for pagination objects that will go to previous page
    function _paginationObject_previous() {
      var $this = this;

      if($this.currentPage === 0) {
        return; //If we are on first page, dont do nothing
      }

      $this.currentPage -= 1;

      var idx = $this.currentPage * $this.numElementsPerPage;
      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Go to an specific page
    function _paginationObject_goTo(numPage) {
      var $this = this;

      if(numPage > 0 && numPage <= $this.numPages) {
        $this.currentPage = numPage - 1;
        var idx = $this.currentPage * $this.numElementsPerPage;
        $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
      }

    }

  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$moment', 'storedDataService', 'helperService', 'caracterPicsService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, $moment, storedDataService, helperService, caracterPicsService, characterInfo) {

    var $q = helperService.$q;

    $scope._name = CONTROLLER_NAME;

    //Call to init Fn
    _init();

    //When search text changes...
    $scope.performGlobalSearch = function(text, searchNow){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        $scope['searchResults'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      if(searchNow) {

        $q.cancelTimeTrigger('mainApp.index.controller.search');
        $scope['searchTerm'] = text;
        $scope['searchLoading'] = true;

        return storedDataService.characterSearch(text).then(function($data){
          $scope['searchResults'] = $data;
          $scope['searchLoading'] = false;
        });
      }
      else {
        $q.timeTrigger('mainApp.index.controller.search', function () {

          $scope['searchTerm'] = text;
          $scope['searchLoading'] = true;

          return storedDataService.characterSearch(text).then(function ($data) {
            $scope['searchResults'] = $data;
            $scope['searchLoading'] = false;
          });
        }, 2000);
      }
    };


    function _init() {

      //Set page title
      helperService.$scope.setTitle([
        characterInfo.serverName,
        '->',
        characterInfo.data.characterName
      ].join(' '));

      //Set up character and server names and stats
      $scope.serverName = characterInfo.serverName;
      $scope.character = characterInfo.data;

      $scope.character.pictureURL = caracterPicsService.getCharacterPic(characterInfo);

      $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyos';
      $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
      $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

      $scope.character.names = $scope.character.names.sort(_dateSortFn);
      $scope.character.status = $scope.character.status.sort(_dateSortFn);
      $scope.character.guilds = $scope.character.guilds.sort(_dateSortFn);

      //TODO Requested by Daxking, he doesnt' want to they old name be shown
      if(characterInfo.serverName == 'Hellion' && characterInfo.characterID == 430586) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Nyle, he doesnt' want to they old name be shown
      if(characterInfo.serverName == 'Deyla' && characterInfo.characterID == 825556) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Nacka, he doesn't want to they old name be shown
      if(characterInfo.serverName == 'Urtem' && characterInfo.characterID == 1508483) {
        $scope.character.names.splice(1, 1);
      }

      //TODO Requested by Chetitos, doesnt want to show old names
      if(characterInfo.serverName == 'Hellion' && characterInfo.characterID == 495423) {
        $scope.character.names.splice(1, $scope.character.names.length - 1);
        $scope.character.guilds.splice(1, $scope.character.guilds.length - 1);
      }

      //TODO Requested by Deyla-Kaijur doesnt want to shown old guild names
      if(characterInfo.serverName == 'Deyla' && characterInfo.characterID == 1266763) {
        $scope.character.guilds.splice(1, $scope.character.guilds.length - 1);
      }

      $scope.character.status.forEach(function(status){
        status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
      });

      //Data pagination
      $scope.pagination = {
        currentPage: 0,
        numElementsPerPage: 10,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      //Search...
      $scope['searchText'] = '';
      $scope['searchTerm'] = '';
      $scope['searchResults'] = null;
      $scope['searchLoading'] = false;

      _initPagination($scope.character.status, $scope.pagination);
    }

    function _dateSortFn(a, b) { return a.date > b.date ? -1 : 1; }

    //Initializes pagination
    function _initPagination(originalElements, paginationObj) {

      paginationObj.currentPage = 0;
      paginationObj.numPages = parseInt(originalElements.length / paginationObj.numElementsPerPage);
      paginationObj.numElements = originalElements.length;
      paginationObj.fullCollection = originalElements;

      if(originalElements.length % paginationObj.numElementsPerPage > 0) {
        paginationObj.numPages += 1;
      }

      if(paginationObj.numPages === 0){
        paginationObj.numPages = 1;
      }

      paginationObj.currentPageElements = paginationObj.fullCollection.slice(0, paginationObj.numElementsPerPage);

      //Wich are the pageNumbers that we hold
      paginationObj.pageNumbers = Array.apply(null, {length: paginationObj.numPages}).map(function(current, idx){ return idx + 1; }, Number);
    }

    //Fn for pagination Objects that will go to next page
    function _paginationObject_next() {
      var $this = this;

      //If we are on last page
      if($this.currentPage + 1 >= $this.numPages) {
        return; //Dont do nothin
      }

      $this.currentPage += 1;

      var idx = $this.currentPage * $this.numElementsPerPage;

      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Fn for pagination objects that will go to previous page
    function _paginationObject_previous() {
      var $this = this;

      if($this.currentPage === 0) {
        return; //If we are on first page, dont do nothing
      }

      $this.currentPage -= 1;

      var idx = $this.currentPage * $this.numElementsPerPage;
      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Go to an specific page
    function _paginationObject_goTo(numPage) {
      var $this = this;

      if(numPage > 0 && numPage <= $this.numPages) {
        $this.currentPage = numPage - 1;
        var idx = $this.currentPage * $this.numElementsPerPage;
        $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
      }

    }

  }
})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', 'posts', _fn]);


  function _fn($sc, $hs, posts) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');

    $sc._name = CONTROLLER_NAME;

    $sc.servers = storedDataService.serversList;
    $sc.lastServerUpdateData = storedDataService.getLastServerData();
    $sc.posts = posts.select(function(post){
      post.htmlContent = $marked(post.content);
      return post;
    });

    $sc['searchText'] = '';
    $sc['searchTerm'] = '';
    $sc['searchResults'] = null;
    $sc['searchLoading'] = false;

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        $sc['searchResults'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function(){

        $sc['searchTerm'] = text;
        $sc['searchLoading'] = true;

        return storedDataService.characterSearch(text).then(function($data){
          $sc['searchResults'] = $data;
          $sc['searchLoading'] = false;
        });
      }, 2000);

    };

    //When user press clear on search text
    $sc.clear_searchText = function() {
      $sc['searchText'] = '';
      $sc['searchResults'] = null;
      $q.cancelTimeTrigger('mainApp.index.controller.search');
    };

    $hs.$scope.setTitle('Soyto.github.io');
    $hs.$scope.setNav('home');
  }
})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serversData', 'groupID', listController
  ]);

  function listController($log, $scope, $location, $timeout, helperService, storedDataService, serversData, groupID) {

    $scope._name = CONTROLLER_NAME;
    var textSearch_timeoutPromise = null;

    //Call to init Fn
    _init();

    //Change server or date Fn
    $scope.goTo = function(serverMerge) {
      //Same data and server, don't do nothing
      if(serverMerge.id == groupID) {
        return;
      }

      $location.path('/merge/' + serverMerge.id);
    };

    //Initialization Fn
    function _init() {

      var serverNames = serversData.select(function(itm){ return itm.server.name; }).join(' + ');

      //Title and navigation
      helperService.$scope.setTitle(serverNames);
      helperService.$scope.setNav('ranking.merges.list');

      //Store data on scope...
      $scope.serverData = {
        data: {
          elyos: [],
          asmodians: [],
        },
        name: serverNames,
        id: groupID
      };

      //Filters initial data
      $scope.textSearch = '';
      $scope.mergeGroups = storedDataService.mergeGroups.select(function(group, idx) {
        return {
          id: idx,
          name: group.select(function(itm){ return itm.name; }).join(' + ')
        };
      });
      $scope.currentMerge = $scope.mergeGroups.first(function(itm){ return itm.id == groupID; });
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      //Set up pagination needed data
      var basePaginationObj = {
        currentPage: 0,
        numElementsPerPage: 100,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      $scope.pagination = {};
      $scope.pagination.elyos = ng.copy(basePaginationObj);
      $scope.pagination.asmodians = ng.copy(basePaginationObj);


      var copyCharFn = function(character){ return ng.copy(character); };


      //Join servers data for the merge
      serversData.forEach(function(server) {
        $scope.serverData.data.elyos = $scope.serverData.data.elyos.concat(server.data.elyos).select(copyCharFn);
        $scope.serverData.data.asmodians = $scope.serverData.data.asmodians.concat(server.data.asmodians).select(copyCharFn);
      });

      $scope.serverData.data.elyos.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });
      $scope.serverData.data.asmodians.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });

      $scope.serverData.data.elyos.forEach(function(character, idx){
        character.oldRankingPositionChange = character.rankingPositionChange;
        character.rankingPositionChange = character.position - (idx + 1);
        character.oldPosition = character.position;
        character.position = idx + 1;

        character.oldSoldierRankID = character.soldierRankID;
        _calculateNewRank(character);
      });
      $scope.serverData.data.asmodians.forEach(function(character, idx){
        character.oldRankingPositionChange = character.rankingPositionChange;
        character.rankingPositionChange = character.position - (idx + 1);
        character.oldPosition = character.position;
        character.position = idx + 1;

        character.oldSoldierRankID = character.soldierRankID;
        _calculateNewRank(character);
      });

      _initPagination($scope.serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      _initPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch(newValue, $scope.selectedClass, $scope.selectedRank);
      });
      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch($scope.textSearch, newValue, $scope.selectedRank);
      });
      $scope.$watch('selectedRank', function(newValue){
        _performFilterAndSearch($scope.textSearch, $scope.selectedClass, newValue);
      });
    }

    //Initializes a character
    function _initCharacter(character) {
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);
      character.oldSoldierRank = storedDataService.getCharacterRank(character.oldSoldierRankID);

      return character;
    }

    //Calculates new rank
    function _calculateNewRank(character) {

      if(character.position == 1) {
        character.soldierRankID = 18;
        return;
      }

      if(character.position <= 3) {
        character.soldierRankID = 17;
        return;
      }

      if(character.position <= 10) {
        character.soldierRankID = 16;
        return;
      }

      if(character.position <= 30) {
        character.soldierRankID = 15;
        return;
      }

      if(character.position <= 100) {
        character.soldierRankID = 14;
        return;
      }

      if(character.position <= 300) {
        character.soldierRankID = 13;
        return;
      }

      if(character.position <= 500) {
        character.soldierRankID = 12;
        return;
      }

      if(character.position <= 700) {
        character.soldierRankID = 11;
        return;
      }

      if(character.position <= 999) {
        character.soldierRankID = 10;
        return;
      }

      character.soldierRankID = 9;

    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        //If not filter is provided
        if(!classToFilter && !textToSearch && !rankToFilter) {
          _initPagination($scope.serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
          _initPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
          return;
        }

        //Filter elyos data
        _initPagination($scope.serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.elyos);

        //Filter asmodian data
        _initPagination($scope.serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.asmodians);

      }, 500);

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();
          var serverName = character.serverName ? character.serverName.toLowerCase() : '';

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0 ||
            serverName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Initializes pagination
    function _initPagination(originalElements, paginationObj) {

      paginationObj.currentPage = 0;
      paginationObj.numPages = parseInt(originalElements.length / paginationObj.numElementsPerPage);
      paginationObj.numElements = originalElements.length;
      paginationObj.fullCollection = originalElements;

      if(originalElements.length % paginationObj.numElementsPerPage > 0) {
        paginationObj.numPages += 1;
      }

      if(paginationObj.numPages === 0){
        paginationObj.numPages = 1;
      }

      paginationObj.currentPageElements = paginationObj.fullCollection.slice(0, paginationObj.numElementsPerPage);

      //Wich are the pageNumbers that we hold
      paginationObj.pageNumbers = Array.apply(null, {length: paginationObj.numPages}).map(function(current, idx){ return idx + 1; }, Number);
    }

    //Fn for pagination Objects that will go to next page
    function _paginationObject_next() {
      var $this = this;

      //If we are on last page
      if($this.currentPage + 1 >= $this.numPages) {
        return; //Dont do nothin
      }

      $this.currentPage += 1;

      var idx = $this.currentPage * $this.numElementsPerPage;

      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Fn for pagination objects that will go to previous page
    function _paginationObject_previous() {
      var $this = this;

      if($this.currentPage === 0) {
        return; //If we are on first page, dont do nothing
      }

      $this.currentPage -= 1;

      var idx = $this.currentPage * $this.numElementsPerPage;
      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Go to an specific page
    function _paginationObject_goTo(numPage) {
      var $this = this;

      if(numPage > 0 && numPage <= $this.numPages) {
        $this.currentPage = numPage - 1;
        var idx = $this.currentPage * $this.numElementsPerPage;
        $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
      }

    }
  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$window', '$location', '$timeout', 'helperService',  'storedDataService', 'serversData', 'groupID', listController
  ]);

  function listController($log, $scope, $window, $location, $timeout, helperService, storedDataService, serversData, groupID) {
    $scope._name = CONTROLLER_NAME;

    $scope.filteredData = false;

    $scope.page = {};
    $scope.page.elyos = {};
    $scope.page.asmodians = {};

    _init();

    //Change server or date Fn
    $scope.goTo = function(serverMerge) {
      //Same data and server, don't do nothing
      if(serverMerge.id == groupID) {
        return;
      }

      $location.path('/merge/' + serverMerge.id);
    };

    $scope.page.elyos.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.elyos.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.elyos.numPages) {
          $scope.pagination.elyos.currentPage = value - 1;
          $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
        }

      }
    };

    $scope.page.elyos.next = function(){

      if($scope.pagination.elyos.currentPage + 1 >= $scope.pagination.elyos.numPages) { return; }

      $scope.pagination.elyos.currentPage += 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.elyos.previous = function(){

      if($scope.pagination.elyos.currentPage === 0) { return; }

      $scope.pagination.elyos.currentPage -= 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.asmodians.next = function(){

      if($scope.pagination.asmodians.currentPage + 1 >= $scope.pagination.asmodians.numPages) { return; }

      $scope.pagination.asmodians.currentPage += 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.previous = function(){

      if($scope.pagination.asmodians.currentPage === 0) { return; }

      $scope.pagination.asmodians.currentPage -= 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.asmodians.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.asmodians.numPages) {
          $scope.pagination.asmodians.currentPage = value - 1;
          $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
        }

      }
    };

    //Performs search
    $scope.search = function(){
      _performFilterAndSearch($scope.textSearch, $scope.selectedClass, $scope.selectedRank);
    };

    $scope.clear = function(){
      $scope.textSearch = '';
      $scope.selectedClass = '';
      _performFilterAndSearch('', null, null);

      $scope.textSearch = '';
      $scope.selectedClass = null;
      $scope.selectedRank = null;
    };

    function _init() {

      var serverNames = serversData.select(function(itm){ return itm.server.name; }).join(' + ');

      helperService.$scope.setTitle(serverNames);
      helperService.$scope.setNav('ranking.list');

      $scope.serverData = {
        data: {
          elyos: [],
          asmodians: [],
        },
        name: serverNames,
        id: groupID
      };
      $scope.pagination = {
        elyos: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        },
        asmodians: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        }
      };

      $scope.mergeGroups = storedDataService.mergeGroups.select(function(group, idx) {
        return {
          id: idx,
          name: group.select(function(itm){ return itm.name; }).join(' + ')
        };
      });
      $scope.currentMerge = $scope.mergeGroups.first(function(itm){ return itm.id == groupID; });
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      serversData.forEach(function(server) {
        $scope.serverData.data.elyos = $scope.serverData.data.elyos.concat(server.data.elyos);
        $scope.serverData.data.asmodians = $scope.serverData.data.asmodians.concat(server.data.asmodians);
      });

      $scope.serverData.data.elyos.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });
      $scope.serverData.data.asmodians.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });

      $scope.serverData.data.elyos.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });
      $scope.serverData.data.asmodians.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });

      $scope.elyosData = _performPagination($scope.serverData.data.elyos.select(_initCharacter) , $scope.pagination.elyos);
      $scope.asmodianData = _performPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
    }

    //Initializes a character
    function _initCharacter(character) {
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Calculates new rank
    function _calculateNewRank(character) {

      if(character.position == 1) {
        character.soldierRankID = 18;
        return;
      }

      if(character.position <= 3) {
        character.soldierRankID = 17;
        return;
      }

      if(character.position <= 10) {
        character.soldierRankID = 16;
        return;
      }

      if(character.position <= 30) {
        character.soldierRankID = 15;
        return;
      }

      if(character.position <= 100) {
        character.soldierRankID = 14;
        return;
      }

      if(character.position <= 300) {
        character.soldierRankID = 13;
        return;
      }

      if(character.position <= 500) {
        character.soldierRankID = 12;
        return;
      }

      if(character.position <= 700) {
        character.soldierRankID = 11;
        return;
      }

      if(character.position <= 999) {
        character.soldierRankID = 10;
        return;
      }

      character.soldierRankID = 9;

    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      //Reset pagination
      $scope.pagination.elyos.currentPage = 0;
      $scope.pagination.asmodians.currentPage = 0;

      var paginateElyos = function(data) {
        return _performPagination(data, $scope.pagination.elyos);
      };
      var paginateAsmodians = function(data) {
        return _performPagination(data, $scope.pagination.asmodians);
      };

      //If not filter is provided
      if(!classToFilter && !textToSearch && !rankToFilter) {
        $scope.elyosData = paginateElyos($scope.serverData.data.elyos.select(_initCharacter));
        $scope.asmodianData = paginateAsmodians($scope.serverData.data.asmodians.select(_initCharacter));
        $scope.filteredData = false;
        return;
      }

      //Filter elyos data
      $scope.elyosData = paginateElyos($scope.serverData.data.elyos.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filter asmodian data
      $scope.asmodianData = paginateAsmodians($scope.serverData.data.asmodians.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();
          var serverName = character.serverName ? character.serverName.toLowerCase() : '';

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0 ||
            serverName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        $scope.filteredData = true;
        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Performs pagination on page
    function _performPagination(elements, pagination) {

      var idx = pagination.currentPage * pagination.numElementsPerPage;

      pagination.numElements = elements.length;
      pagination.elements = elements;

      pagination.numPages = parseInt(elements.length / pagination.numElementsPerPage);

      if(elements.length % pagination.numElementsPerPage > 0) { pagination.numPages += 1; }
      if(pagination.numPages === 0){ pagination.numPages = 1; }

      var result =  elements.slice(idx, pagination.numElementsPerPage + idx);
      return result;
    }
  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($log, $scope, $location, $timeout, helperService, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;

    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    //Call to init Fn
    _init();

    //Change server or date Fn
    $scope.goTo = function(server, serverDate) {
      //Same data and server, don't do nothing
      if(server.name == serverData.serverName && serverDate == serverData.date) {
        return;
      }

      $location.path('/ranking/' + server.name + '/' + serverDate);
    };


    //Initialization Fn
    function _init() {

      //Title and navigation
      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);
      helperService.$scope.setNav('ranking.list');

      //Store data on scope...
      $scope.serverData = serverData;

      //Filters initial data
      $scope.textSearch = '';
      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      //Filters data
      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      //Set up pagination needed data
      var basePaginationObj = {
        currentPage: 0,
        numElementsPerPage: 100,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      $scope.pagination = {};
      $scope.pagination.elyos = ng.copy(basePaginationObj);
      $scope.pagination.asmodians = ng.copy(basePaginationObj);
      $scope.pagination.vs = ng.copy(basePaginationObj);


      //Generate data that will go to chart
      _generateChartData(serverData);

      //Store in a cache the versus data generated
      initialVersusData = _generateVersusData(serverData);

      //Store and paginate 3 tables
      _initPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      _initPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
      _initPagination(initialVersusData, $scope.pagination.vs);

      //Add watchers
      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch(newValue, $scope.selectedClass, $scope.selectedRank);
      });
      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch($scope.textSearch, newValue, $scope.selectedRank);
      });
      $scope.$watch('selectedRank', function(newValue){
        _performFilterAndSearch($scope.textSearch, $scope.selectedClass, newValue);
      });
    }

    //Initializes a character
    function _initCharacter(character) {
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        //If not filter is provided
        if(!classToFilter && !textToSearch && !rankToFilter) {
          $scope.elyosData = _initPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
          $scope.asmodianData = _initPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
          $scope.versusData = _initPagination(initialVersusData, $scope.pagination.vs);
          return;
        }

        //Filter elyos data
        $scope.elyosData = _initPagination(serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.elyos);

        //Filter asmodian data
        $scope.asmodianData = _initPagination(serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.asmodians);

        //Filter versus data
        $scope.versusData = _initPagination(initialVersusData.where(function(pair){
          return filterCharacter(pair.elyo, textToSearch, classToFilter, rankToFilter) ||
            filterCharacter(pair.asmodian, textToSearch, classToFilter, rankToFilter);
        }), $scope.pagination.vs);

      }, 500);

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = txt.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Will generate versus data
    function _generateVersusData(serverData) {
      var versusData = [];

      //Generate the data
      for(var i = 0; i < 1000; i++) {
        versusData.push({
          position: i + 1,
          elyo: {},
          asmodian: {},
        });
      }


      serverData.data.elyos.select(_initCharacter).forEach(function(character){
        versusData[character.position - 1].elyo = character;
      });
      serverData.data.asmodians.select(_initCharacter).forEach(function(character){
        versusData[character.position - 1].asmodian = character;
      });

      return versusData;
    }

    //Will generate values for the chart
    function _generateChartData(serverData) {

      var num_elements = 10;
      var step = 1000 / num_elements;

      $scope.chart = {};
      $scope.chart.options = {
        responsive: true,
        maintainAspectRatio: false
      };

      $scope.chart.labels = [];
      $scope.chart.series = ['Elyos', 'Asmodians'];
      $scope.chart.data = [[],[]];
      $scope.chart.colors = ['#DD66DD', '#97BBCD'];

      for(var i = 0; i <= num_elements; i++) {
        var position = 1000 - i * step;

        if(position === 0) {
          position = 1;
        }

        if(i === 0) {
          position = 999;
        }

        /* jshint-W083 */
        var elyosCharacter = serverData.data.elyos.first(function(char){ return char.position == position;});
        var asmodianCharacter = serverData.data.asmodians.first(function(char){ return char.position == position;});
        /* jshint+W083 */

        $scope.chart.labels.push(position);
        $scope.chart.data[0].push(elyosCharacter ? elyosCharacter.gloryPoint : 0);
        $scope.chart.data[1].push(asmodianCharacter ? asmodianCharacter.gloryPoint : 0);
      }
    }


    //Initializes pagination
    function _initPagination(originalElements, paginationObj) {

      paginationObj.currentPage = 0;
      paginationObj.numPages = parseInt(originalElements.length / paginationObj.numElementsPerPage);
      paginationObj.numElements = originalElements.length;
      paginationObj.fullCollection = originalElements;

      if(originalElements.length % paginationObj.numElementsPerPage > 0) {
        paginationObj.numPages += 1;
      }

      if(paginationObj.numPages === 0){
        paginationObj.numPages = 1;
      }

      paginationObj.currentPageElements = paginationObj.fullCollection.slice(0, paginationObj.numElementsPerPage);

      //Wich are the pageNumbers that we hold
      paginationObj.pageNumbers = Array.apply(null, {length: paginationObj.numPages}).map(function(current, idx){ return idx + 1; }, Number);
    }

    //Fn for pagination Objects that will go to next page
    function _paginationObject_next() {
      var $this = this;

      //If we are on last page
      if($this.currentPage + 1 >= $this.numPages) {
        return; //Dont do nothin
      }

      $this.currentPage += 1;

      var idx = $this.currentPage * $this.numElementsPerPage;

      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Fn for pagination objects that will go to previous page
    function _paginationObject_previous() {
      var $this = this;

      if($this.currentPage === 0) {
        return; //If we are on first page, dont do nothing
      }

      $this.currentPage -= 1;

      var idx = $this.currentPage * $this.numElementsPerPage;
      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Go to an specific page
    function _paginationObject_goTo(numPage) {
      var $this = this;

      if(numPage > 0 && numPage <= $this.numPages) {
        $this.currentPage = numPage - 1;
        var idx = $this.currentPage * $this.numElementsPerPage;
        $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
      }

    }
  }
})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$window', '$location', 'storedDataService', 'helperService', 'serverData', index_controller
  ]);

  function index_controller($scope, $window, $location, storedDataService, helperService, serverData) {
    $scope._name = CONTROLLER_NAME;

    $scope.filteredData = false;

    $scope.page = {};
    $scope.page.elyos = {};
    $scope.page.asmodians = {};

    _init();

    //Change server or date Fn
    $scope.goTo = function(server, serverDate) {
      //Same data and server, don't do nothing
      if(server.name == serverData.serverName && serverDate == serverData.date) {
        return;
      }

      $location.path('/ranking/' + server.name + '/' + serverDate);

    };

    $scope.page.elyos.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.elyos.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.elyos.numPages) {
          $scope.pagination.elyos.currentPage = value - 1;
          $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
        }

      }
    };

    $scope.page.elyos.next = function(){

      if($scope.pagination.elyos.currentPage + 1 >= $scope.pagination.elyos.numPages) { return; }

      $scope.pagination.elyos.currentPage += 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.elyos.previous = function(){

      if($scope.pagination.elyos.currentPage === 0) { return; }

      $scope.pagination.elyos.currentPage -= 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.asmodians.next = function(){

      if($scope.pagination.asmodians.currentPage + 1 >= $scope.pagination.asmodians.numPages) { return; }

      $scope.pagination.asmodians.currentPage += 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.previous = function(){

      if($scope.pagination.asmodians.currentPage === 0) { return; }

      $scope.pagination.asmodians.currentPage -= 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.asmodians.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.asmodians.numPages) {
          $scope.pagination.asmodians.currentPage = value - 1;
          $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
        }

      }
    };

    //Performs search
    $scope.search = function(){
      _performFilterAndSearch($scope.textSearch, $scope.selectedClass, $scope.selectedRank);
    };

    $scope.clear = function(){
      $scope.textSearch = '';
      $scope.selectedClass = '';
      _performFilterAndSearch('', null, null);

      $scope.textSearch = '';
      $scope.selectedClass = null;
      $scope.selectedRank = null;
    };

    function _init() {

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);
      helperService.$scope.setNav('ranking.list');

      $scope.pagination = {
        elyos: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        },
        asmodians: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        }
      };

      $scope.serverData = serverData;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

      $scope.textSearch = '';
      $scope.selectedClass = '';


      $scope.filters = {};
      $scope.filters.show = false;
    }

    //Initializes a character
    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      //Reset pagination
      $scope.pagination.elyos.currentPage = 0;
      $scope.pagination.asmodians.currentPage = 0;

      var paginateElyos = function(data) {
        return _performPagination(data, $scope.pagination.elyos);
      };
      var paginateAsmodians = function(data) {
        return _performPagination(data, $scope.pagination.asmodians);
      };

      //If not filter is provided
      if(!classToFilter && !textToSearch && !rankToFilter) {
        $scope.elyosData = paginateElyos(serverData.data.elyos.select(_initCharacter));
        $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.select(_initCharacter));
        $scope.filteredData = false;
        return;
      }

      //Filter elyos data
      $scope.elyosData = paginateElyos(serverData.data.elyos.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filter asmodian data
      $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        $scope.filteredData = true;
        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Performs pagination on page
    function _performPagination(elements, pagination) {

      var idx = pagination.currentPage * pagination.numElementsPerPage;

      pagination.numElements = elements.length;
      pagination.elements = elements;

      pagination.numPages = parseInt(elements.length / pagination.numElementsPerPage);

      if(elements.length % pagination.numElementsPerPage > 0) { pagination.numPages += 1; }
      if(pagination.numPages === 0){ pagination.numPages = 1; }

      var result =  elements.slice(idx, pagination.numElementsPerPage + idx);
      return result;
    }
  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,['$hs', _fn]);


  function _fn($hs) {

    var $rs = $hs.$instantiate('$rootScope');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var cfpLoadingBar = $hs.$instantiate('cfpLoadingBar');

    $rs['_name'] = CONTROLLER_NAME;


    $rs.$on('$routeChangeStart', function(){ cfpLoadingBar.start(); });

    $rs.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', {'page': $location.path() });
    });
  }

})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('blogService', [
    '$hs', _fn
  ]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $q = $hs.$q;

    var $this = this;

    var _cachedPosts = null;

    //Retrieves all posts
    $this.getAll = function() {
      if(_cachedPosts !== null) {
        return $q.resolve(_cachedPosts);
      }
      else {
        return $q.likeNormal($http({
          'url': 'data/Posts/posts.json',
          'method': 'GET'
        })).then(function($data) {

          $data = $data.sort(function(a, b) {
            return (new Date(b['date'])).getTime() - (new Date(a['date'])).getTime();
          });

          _cachedPosts = $data;
          return $data;
        });
      }
    };
  }
})(angular);


(function(ng){
  'use strict';

  ng.module('mainApp').service('caracterPicsService',[
    '$log', _fn
  ]);

  function _fn($log) {
    var $this = this;

    //Pics for some characters
    var _specialCharacterPics = [
      {'server': 'Hellion', 'id': 326346, 'pic': '//i.imgur.com/bw4UVZu.png'}, //Hellion: Krtn
      {'server': 'Hellion', 'id': 332318, 'pic': '//i.imgur.com/Sps7YGU.png'}, //Hellion: Jaskier
      {'server': 'Hellion', 'id': 332433, 'pic': '//i.imgur.com/pLeI02V.png'}, //Hellion: Adeee
      {'server': 'Hellion', 'id': 492074, 'pic': '//i.imgur.com/sUTeSYn.png'}, //Hellion: Aryska
      {'server': 'Hellion', 'id': 446570, 'pic': '//i.imgur.com/nfE7LlW.jpg'}, //Hellion: Shakku
      {'server': 'Hellion', 'id': 336415, 'pic': '//i.imgur.com/LUOMjpH.png'}, //Hellion: Blackdraco
      {'server': 'Hellion', 'id': 413977, 'pic': '//www.cotilleo.es/wp-content/uploads/2016/10/justin-bieber.jpg'}, //Hellion: Shadowfall
      {'server': 'Hellion', 'id': 987350, 'pic': '//i.imgur.com/FCwJFXM.png'}, //Hellion: Arturomal
      {'server': 'Hellion', 'id': 2213, 'pic': '//i.imgur.com/SE4ehSb.png'}, //Hellion: Symehtry
      {'server': 'Hellion', 'id': 612759, 'pic': '//i.imgur.com/QWV1493.png'}, //Hellion: OliverJv
      {'server': 'Hellion', 'id': 288297, 'pic': '//i.imgur.com/6xyFDTJ.png'}, //Hellion: Yleath
      {'server': 'Hellion', 'id': 547988, 'pic': '//i.giphy.com/9wZMlnM0R06l2.gif'}, //Hellion: Tendeeeeeee
      {'server': 'Hellion', 'id': 430842, 'pic': '//i.giphy.com/NVIowdX8ePh4Y.gif'}, //Hellion: Powatrona
      {'server': 'Hellion', 'id': 361870, 'pic': '//i.imgur.com/JO1aCCa.png'}, //Hellion: Ashuramaru
      {'server': 'Antriksha', 'id': 503001, 'pic': '//i.imgur.com/4XBIv3P.png'}, //Antriksha: Livo
      {'server': 'Antriksha', 'id': 600257, 'pic': '//i.imgur.com/qWxds5G.gif'}, //Antriksha: Lember
      {'server': 'Antriksha', 'id': 457727, 'pic': '//i.imgur.com/FTBKsLO.png'}, //Antriksha: Riborn
      {'server': 'Deyla', 'id': 1236631, 'pic': '//i.imgur.com/fSTG5mc.png'}, //Deyla: Sumie
      {'server': 'Deyla', 'id': 1266763, 'pic': '//i.imgur.com/5rU4kmQ.png'}, //Deyla: Kaijur
      {'server': 'Hellion', 'id': 121280, 'pic': '//i.imgur.com/t5bDYnw.png'}, //Hellion: Sureh
      {'server': 'Antriksha', 'id': 135676, 'pic': '//i.imgur.com/kmxiraq.png'}, //Antriksha: TheKnight...
      {'server': 'Deyla', 'id': 212749, 'pic': '//image.prntscr.com/image/990a0427afed4c32aa0f9f86eaec82f9.png'}, //Deyla: Asgarda
      {'server': 'Barus', 'id': 1026827, 'pic': '//i.hizliresim.com/GP4N96.png'}, //Barus: Ryhmee
      {'server': 'Deyla', 'id': 1071999, 'pic': '//i.imgur.com/EZCWBc7.png'}, //Deyla: Sanko
      {'server': 'Barus', 'id': 939942, 'pic': '//i.imgur.com/ROzAA5O.png'}, //Barus: Mickaya
      {'server': 'Urtem', 'id': 1844317, 'pic': '//i.imgur.com/RmIg33i.png'}, //Urtem: Rjn
      {'server': 'Loki', 'id': 797881, 'pic': '//i.imgur.com/h2MLV9F.png'}, //Loki: Lutetias
      {'server': 'Urtem', 'id': 912505, 'pic': '//i.imgur.com/7ppwteQ.png'}, //Urtem: Ciremia
      {'server': 'Hellion', 'id': 463186, 'pic': '//i.giphy.com/l3vR1MxhtLBKwvVJK.gif'}, //Hellion: Itard
      {'server': 'Antriksha', 'id': 719919, 'pic': '//oi68.tinypic.com/o9g8bp.jpg'}, //Antriksa: Kisuke
      {'server': 'Loki', 'id': 563801, 'pic': '//i.imgur.com/vKqeyLS.png'}, //Loki: Lyy
      {'server': 'Hellion', 'id': 382130, 'pic': '//i.imgur.com/udbsdPo.png'}, //Hellion: Maullido
      {'server': 'Hellion', 'id': 462866, 'pic': '//i.imgur.com/EgQ0P2u.jpg'}, //Hellion: Accelerator
      {'server': 'Hellion', 'id': 562739, 'pic': '//i.imgur.com/QMAc3zy.jpg'}, //Hellion: Ninfe
    ];

    //Sets a character pic
    $this.getCharacterPic = function($characterInfo) {

      var _coincidence = _specialCharacterPics.first(function($$character){
        return $$character['server'] == $characterInfo['serverName'] && $$character['id'] == $characterInfo['characterID'];
      });

      if(_coincidence) {
        return _coincidence['pic'];
      }
      else {
        return '//placehold.it/450X300/DD66DD/EE77EE/?text=' + $characterInfo['data']['characterName'];
      }

    };

  }

})(angular);


(function(ng){
	'use strict';

	ng.module('mainApp').service('consoleService',[
		'$window', '$q', 'helperService', 'storedDataService', consoleService
	]);


	function consoleService($window, $q, helperService, storedDataService) {

		var $this = this;
		$window.soyto = $this;


		//Expose $q
		$this.$q = $q;

		//Expose whole service
		$this.storedDataService = storedDataService;


	}
})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('helperService', ['$injector', _fn]);
  ng.module('mainApp').service('$hs', ['$injector', _fn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

  function _fn($injector) {

    var $log = $injector.get('$log');
    var $q = $injector.get('$q');
    var $rs = $injector.get('$rootScope');
    var $window = $injector.get('$window');

    var $this = this;

    //Instantiates a dependency
    $this.$instantiate = function(name) {
      return $injector.get(name);
    };

    //Sort dates
    //NOTE: Review this method
    $this.sortDates = function(dates) {

      dates = dates.sort(function(a, b) {

        var _a = a.split('-');
        var _b = b.split('-');

        _a = [
          parseInt(_a[2]),
          parseInt(_a[0]),
          parseInt(_a[1]),
        ];

        _b = [
          parseInt(_b[2]),
          parseInt(_b[0]),
          parseInt(_b[1]),
        ];


        if(_a[0] > _b[0]) { return 1; }
        if(_a[0] < _b[0]) { return -1; }

        if(_a[1] > _b[1]) { return 1; }
        if(_a[1] < _b[1]) { return -1; }

        if(_a[2] > _b[2]) { return 1; }
        if(_a[2] < _b[2]) { return -1; }


        return 0;
      });

      return dates;
    };

    $this.$scope = {
      'setTitle': function(value){ $rs.title = value; },
      'setNav': function(menu){ $rs.navMenu = menu; }
    };

    $this.navigator = {
      'isMobile': function(){
        return IS_MOBILE_REGEX_1.test($window.navigator.userAgent) || IS_MOBILE_REGEX_2.test($window.navigator.userAgent.substr(0,4));
      }
    };

    $this.$q = $injector.get('helperService.$q').$setParent($this).$q;
  }

})(angular);


(function(ng){
  'use strict';

  var DEBUG = false;

  var host = DEBUG ? '' : 'http://91.184.11.238/';

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];
    var _cacheCharacterCheatSheet = null;

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;


    var $this = this;

    //Wich servers
    $this.serversList = [
      {id : 53, name: 'Antriksha'},   //0
      {id : 49, name: 'Barus'},       //1
      {id : 52, name: 'Deyla'},       //2
      {id : 54, name: 'Hellion'},     //3
      {id : 55, name: 'Hyperion'},    //4
      {id : 50, name: 'Loki'},        //5
      {id : 37, name: 'Thor'},        //6
      {id : 40, name: 'Urtem'},       //7

      /* Olds servers distribution
       {id : 47, name: 'Alquima'},     //0
       {id : 46, name: 'Anuhart'},     //1
       {id : 39, name: 'Balder'},      //2
       {id : 49, name: 'Barus'},       //3
       {id : 45, name: 'Calindi'},     //4
       {id : 48, name: 'Curatus'},     //5
       {id : 36, name: 'Kromede'},     //6
       {id : 44, name: 'Nexus'},       //7
       {id : 34, name: 'Perento'},     //8
       {id : 31, name: 'Spatalos'},    //9
       {id : 42, name: 'Suthran'},     //10
       {id : 32, name: 'Telemachus'},  //11
       {id : 37, name: 'Thor'},        //12
       {id : 40, name: 'Urtem'},       //13
       {id : 43, name: 'Vehalla'},     //14
       {id : 51, name: 'Zubaba'},      //15
       */
    ];

    //Wich dates we have stored
    $this.storedDates = $hs.sortDates($window.storedDates);

    //Character soldier ranks
    $this.characterSoldierRankIds = [
      { id: 0, name: 'Unknown'},
      { id: 1, name: 'Unknown'},
      { id: 2, name: 'Unknown'},
      { id: 3, name: 'Unknown'},
      { id: 4, name: 'Unknown'},
      { id: 5, name: 'Unknown'},
      { id: 6, name: 'Unknown'},
      { id: 6, name: 'Unknown'},
      { id: 7, name: 'Unknown'},
      { id: 9, name: 'Unknown'},
      { id: 10, name: 'Army 1-Star Officer'},
      { id: 11, name: 'Army 2-Star Officer'},
      { id: 12, name: 'Army 3-Star Officer'},
      { id: 13, name: 'Army 4-Star Officer'},
      { id: 14, name: 'Army 5-Star Officer'},
      { id: 15, name: 'General'},
      { id: 16, name: 'Great general'},
      { id: 17, name: 'Commander'},
      { id: 18, name: 'Governor'},
    ];

    //CharacterClasses
    $this.characterClassIds = [
      {},
      { id: 1, name: 'Gladiator', icon: 'img/gladiator.jpg' },
      { id: 2, name: 'Templar', icon: 'img/templar.jpg' },
      {},
      { id: 4, name: 'Assassin', icon: 'img/assassin.jpg' },
      { id: 5, name: 'Ranger', icon: 'img/ranger.jpg' },
      {},
      { id: 7, name: 'Sorcerer', icon: 'img/sorc.jpg' },
      { id: 8, name: 'Spiritmaster' , icon: 'img/sm.jpg'},
      {},
      { id: 10, name: 'Cleric', icon: 'img/cleric.jpg' },
      { id: 11, name: 'Chanter', icon: 'img/chanter.jpg' },
      {},
      { id: 13, name: 'Aethertech', icon: 'img/gladiator.jpg' },
      { id: 14, name: 'Gunner', icon: 'img/gunner.png' },
      {},
      { id: 16, name: 'Bard', icon: 'img/barde.png' },
    ];

    //Gets wich is rank of the selected character
    $this.getCharacterRank = function(id) { return $this.characterSoldierRankIds[id]; };

    //Retrieves character classId
    $this.getCharacterClass = function(id) { return $this.characterClassIds[id]; };

    //Retrieves info from the selected server at indicated day
    $this.getFromServer = function(date, serverName) {

      //Try to retrieve cacheItem
      var _cachedItem = _cacheServerData.first(function(itm){
        return itm.serverName == serverName && itm.date == date;
      });

      //If there is some cache item
      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': host + 'data/Servers/' + date + '/' + serverName + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'date': date,
          'data': $data
        };

        //Store on cache
        _cacheServerData.push(_result);

        //return
        return _result;
      });
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(_getLastDate(), serverName);
    };

    //Retrieve character info
    $this.getCharacterInfo = function(serverName, characterID) {

      var _cachedItem = _cacheCharacterInfo.first(function(itm){ return itm.serverName == serverName && itm.characterID == characterID; });

      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'characterID': characterID,
          'data': $data
        };

        _cacheCharacterInfo.push(_result);
        return _result;
      });
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() {
      return _getLastDate();
    };

    //Looks for a character on all servers
    $this.characterSearch = function(text) {

      var _$$textToSearch = text.trim().toLowerCase();

      return _getCharacterCheatSheet().then(function($wholeData) {

        var _result = $wholeData.where(function($$character){
          return $$character['characterName'].toLowerCase().indexOf(_$$textToSearch) >= 0;
        });

        _result.sort(function(a, b){
          var _idxA = a['characterName'].toLowerCase().indexOf(_$$textToSearch);
          var _idxB = b['characterName'].toLowerCase().indexOf(_$$textToSearch);

          if(_idxA === _idxB) {
            var _aLength = a['characterName'].length;
            var _bLength = b['characterName'].length;

            if(_aLength == _bLength) {
              return a['characterName'].toLowerCase().localeCompare(b['characterName'].toLowerCase());
            }

            return _aLength - _bLength;
          }

          return _idxA - _idxB;
        });

        return _result;
      });
    };


    function _getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

    //Gets character cheatSheet
    function _getCharacterCheatSheet() {

      if(_cacheCharacterCheatSheet !== null) {
        return $q.resolve(_cacheCharacterCheatSheet);
      }

      var _url = host + '/data/Servers/Characters/charactersSheet.json';
      return $q.likeNormal($http.get(_url)).then(function($wholeData){
        _cacheCharacterCheatSheet = $wholeData;
        return $wholeData;
      });
    }

  }

})(angular);


(function(ng) {
  'use strict';

  var SERVICE_NAME = 'helperService.$q';

  var MAIN_TIME_TRIGGER = 1000;

  ng.module('mainApp').service(SERVICE_NAME, ['$injector', _fn]);

  function _fn($injector) {

    var $this = this;
    var $q = $injector.get('$q');
    var $timeout =  $injector.get('$timeout');
    var $parent = null;
    var _timeouts = {};

    //Sets wich is current parent
    $this.$setParent = function(parent) {
      $parent = parent;
      return $this;
    };

    $this.$q = $q;

    //Changes normal promises to be like $http
    $this.$q.likeHttp = function ($$q) {

      //If is a deferred
      if ($$q.promise) {
        $$q.promise.success = function (callback) {
          $$q.promise.then(callback);
          return $$q.promise;
        };
        $$q.promise.error = function (callback) {
          $$q.promise.catch(callback);
          return $$q.promise;
        };
        return $$q;
      }

      //If is a promise
      if ($$q.then) {
        var _$$q = $this.likeHttp($q.defer());

        $$q.then(_$$q.resolve);
        $$q.catch(_$$q.catch);

        return _$$q.promise;
      }
    };

    //Changes $http promises to work like normals
    $this.$q.likeNormal = function (httpPromise) {
      var $$q = $q.defer();
      httpPromise.success($$q.resolve).error($$q.reject);
      return $$q.promise;
    };

    //Executes a time trigger
    $this.$q.timeTrigger = function(name, fn, time) {

      //If not time
      if(!time) {
        time = MAIN_TIME_TRIGGER;
      }

      //Cancel previous timeout
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }

      _timeouts[name] = $timeout(fn, time);

      return _timeouts[name];
    };

    //Cancels a time trigger
    $this.$q.cancelTimeTrigger = function(name) {
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }
    };

  }
})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').directive('fbCommentPlugin', ['$window', function($window)  {
    function createHTML(href, numposts, colorscheme) {
        return '<div class="fb-comments" ' +
                       'data-href="' + href + '" ' +
                       'data-numposts="' + numposts + '" ' +
                       'data-colorsheme="' + colorscheme + '">' +
               '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var colorscheme = attrs.colorscheme || 'light';

                elem.html(createHTML(href, numposts, colorscheme));

                if($window.FB) {
                  $window.FB.XFBML.parse(elem[0]);
                }
            });
        }
    };
  }]);

})(angular);
